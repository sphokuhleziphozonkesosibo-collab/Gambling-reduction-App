require('dotenv').config();

const express = require("express");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
    secret: process.env.SESSION_SECRET || 'betaware-sa-secret-2026',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 40,
    message: { success: false, message: "Too many attempts, please try again later." }
});

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'betaware_db',
    waitForConnections: true,
    connectionLimit: 10
});

// ✉️ EMAIL SETUP
let transporter = null;
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
}

async function sendEmail(to, subject, html) {
    if (!transporter) {
        console.log(`\n📧 [EMAIL SIMULATION — no EMAIL_USER/EMAIL_PASS set]`);
        console.log(`   To: ${to}`);
        console.log(`   Subject: ${subject}`);
        console.log(`   (Set EMAIL_USER and EMAIL_PASS in .env to send real emails)\n`);
        return;
    }
    try {
        await transporter.sendMail({
            from: `"BetAware SA" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html
        });
        console.log(`✅ Email sent to ${to}: ${subject}`);
    } catch (err) {
        console.log(`❌ Failed to send email to ${to}:`, err.message);
    }
}

function emailTemplate(title, bodyHtml) {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #FBF6EE; padding: 30px; border-radius: 12px;">
        <h2 style="color: #1B2A4A; margin-bottom: 4px;">🎯 BetAware SA</h2>
        <h3 style="color: #E8863C; margin-top: 0;">${title}</h3>
        ${bodyHtml}
        <p style="font-size: 12px; color: #999; margin-top: 30px; border-top: 1px solid #eee; padding-top: 16px;">
            You're receiving this because someone used this email address on BetAware SA.
            If this wasn't you, you can safely ignore this email.
        </p>
    </div>`;
}

// ✅ RISK & BREACH ALERT ENGINE
const SARGF_HOTLINE = {
    phone: "0800 006 008",
    whatsapp: "076 675 0710"
};

function calculateRiskStatus(current_balance, monthly_budget) {
    const balance = parseFloat(current_balance);
    const budget = parseFloat(monthly_budget);
    const percentRemaining = budget > 0 ? (balance / budget) * 100 : 0;

    if (balance <= 0) {
        return {
            risk_level: 'critical_breach',
            percent_remaining: Math.max(0, Math.round(percentRemaining)),
            message: "You've reached your monthly limit. Please stop and consider reaching out for support.",
            sargf: SARGF_HOTLINE
        };
    }
    if (percentRemaining <= 20) {
        return {
            risk_level: 'warning',
            percent_remaining: Math.round(percentRemaining),
            message: "You've used 80% or more of your monthly budget. Slow down.",
            sargf: null
        };
    }
    return {
        risk_level: 'safe',
        percent_remaining: Math.round(percentRemaining),
        message: null,
        sargf: null
    };
}

// 🩺 PGSI CLINICAL SCORING
function calculatePgsiRisk(totalScore) {
    if (totalScore === 0) return 'non_problem';
    if (totalScore <= 2) return 'low_risk';
    if (totalScore <= 7) return 'moderate_risk';
    return 'problem_gambler';
}

// Universal file routing
function serveHtml(res, filename) {
    const paths = [
        path.join(__dirname, 'public', 'views', filename),
        path.join(__dirname, 'views', filename),
        path.join(__dirname, 'public', filename),
        path.join(__dirname, filename)
    ];
    for (const p of paths) {
        if (fs.existsSync(p)) return res.sendFile(p);
    }
    res.status(404).send(`<h3>${filename} not found</h3>`);
}

app.get(['/', '/login', '/login.html'], (req, res) => serveHtml(res, 'login.html'));
app.get(['/register', '/register.html'], (req, res) => serveHtml(res, 'register.html'));
app.get(['/dashboard', '/dashboard.html'], (req, res) => serveHtml(res, 'dashboard.html'));
app.get(['/pgsi-assessment', '/pgsi-assessment.html'], (req, res) => serveHtml(res, 'pgsi-assessment.html'));
app.get(['/forgot-password', '/forgot-password.html'], (req, res) => serveHtml(res, 'forgot-password.html'));
app.get(['/reset-password', '/reset-password.html'], (req, res) => serveHtml(res, 'reset-password.html'));

// 🔐 AUTH
app.post("/register", authLimiter, async (req, res) => {
    const { name, email, password, monthly_salary, betting_percentage = 10, preferred_language = 'en' } = req.body;
    if (!name || !email || !password || !monthly_salary) {
        return res.json({ success: false, message: "All fields are required" });
    }
    if (password.length < 6) {
        return res.json({ success: false, message: "Password must be at least 6 characters" });
    }

    try {
        const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
        if (existing.length > 0) return res.json({ success: false, message: "Email already registered" });

        const password_hash = await bcrypt.hash(password, 10);
        const monthly_budget = parseFloat(monthly_salary) * (parseFloat(betting_percentage) / 100);

        const verificationToken = crypto.randomBytes(32).toString('hex');
        const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

        const [result] = await pool.query(
            `INSERT INTO users (name, email, password_hash, monthly_salary, betting_percentage, monthly_budget, current_balance, preferred_language, email_verified, verification_token, verification_token_expires) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, FALSE, ?, ?)`,
            [name, email, password_hash, monthly_salary, betting_percentage, monthly_budget, monthly_budget, preferred_language, verificationToken, tokenExpires]
        );

        const verifyLink = `${BASE_URL}/verify-email?token=${verificationToken}`;
        await sendEmail(email, "Verify your BetAware SA account", emailTemplate(
            "Welcome! Please verify your email",
            `<p>Hi ${name},</p>
             <p>Thanks for creating your BetAware SA account. Please confirm this is really your email by clicking below:</p>
             <p style="margin: 24px 0;">
                <a href="${verifyLink}" style="background:#E8863C;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">Verify My Email</a>
             </p>
             <p style="font-size:13px;color:#888;">This link expires in 24 hours. You can keep using the app right away — but you'll need to verify before your next login.</p>`
        ));

        req.session.userId = result.insertId;
        res.json({
            success: true,
            user: { id: result.insertId, name, email, monthly_budget, current_balance: monthly_budget, preferred_language },
            needs_pgsi: true
        });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
});

app.post("/login", authLimiter, async (req, res) => {
    const { email, password } = req.body;
    try {
        const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
        if (users.length === 0) return res.json({ success: false, message: "Invalid email or password" });

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) return res.json({ success: false, message: "Invalid email or password" });

        if (!user.email_verified) {
            return res.json({
                success: false,
                message: "Please verify your email before logging in. Check your inbox for the verification link.",
                needs_verification: true,
                email: user.email
            });
        }

        req.session.userId = user.id;
        res.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                monthly_budget: parseFloat(user.monthly_budget),
                current_balance: parseFloat(user.current_balance),
                preferred_language: user.preferred_language || 'en'
            },
            needs_pgsi: !user.pgsi_completed_at
        });
    } catch (err) {
        res.json({ success: false, message: "Login error" });
    }
});

app.post("/logout", (req, res) => req.session.destroy(() => res.json({ success: true })));

// ✅ EMAIL VERIFICATION
app.get('/verify-email', async (req, res) => {
    const { token } = req.query;
    if (!token) return res.status(400).send('<h2>Invalid verification link.</h2>');

    try {
        const [users] = await pool.query(
            "SELECT id FROM users WHERE verification_token = ? AND verification_token_expires > NOW()",
            [token]
        );

        if (users.length === 0) {
            return res.send(`
                <div style="font-family:sans-serif;max-width:420px;margin:60px auto;text-align:center;">
                    <h2 style="color:#C24914;">Link expired or invalid</h2>
                    <p>This verification link is no longer valid. Please log in and request a new one.</p>
                    <a href="/login" style="color:#E8863C;font-weight:bold;">Go to Login</a>
                </div>
            `);
        }

        await pool.query(
            "UPDATE users SET email_verified = TRUE, verification_token = NULL, verification_token_expires = NULL WHERE id = ?",
            [users[0].id]
        );

        res.send(`
            <div style="font-family:sans-serif;max-width:420px;margin:60px auto;text-align:center;">
                <h2 style="color:#4F7965;">✅ Email verified!</h2>
                <p>Your BetAware SA account is now fully verified. You can log in anytime.</p>
                <a href="/login" style="background:#E8863C;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">Go to Login</a>
            </div>
        `);
    } catch (err) {
        res.status(500).send('<h2>Something went wrong. Please try again.</h2>');
    }
});

app.post('/api/resend-verification', authLimiter, async (req, res) => {
    const { email } = req.body;
    try {
        const [users] = await pool.query("SELECT id, name, email_verified FROM users WHERE email = ?", [email]);
        if (users.length === 0 || users[0].email_verified) {
            return res.json({ success: true, message: "If that account needs verification, a new link has been sent." });
        }

        const verificationToken = crypto.randomBytes(32).toString('hex');
        const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

        await pool.query(
            "UPDATE users SET verification_token = ?, verification_token_expires = ? WHERE id = ?",
            [verificationToken, tokenExpires, users[0].id]
        );

        const verifyLink = `${BASE_URL}/verify-email?token=${verificationToken}`;
        await sendEmail(email, "Verify your BetAware SA account", emailTemplate(
            "Verify your email",
            `<p>Hi ${users[0].name},</p>
             <p>Here's your new verification link:</p>
             <p style="margin: 24px 0;">
                <a href="${verifyLink}" style="background:#E8863C;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">Verify My Email</a>
             </p>`
        ));

        res.json({ success: true, message: "If that account needs verification, a new link has been sent." });
    } catch (err) {
        res.json({ success: false, message: "Something went wrong. Please try again." });
    }
});

// 🔑 PASSWORD RESET
app.post('/api/forgot-password', authLimiter, async (req, res) => {
    const { email } = req.body;
    const genericMessage = "If that email is registered, a password reset link has been sent.";

    try {
        const [users] = await pool.query("SELECT id, name FROM users WHERE email = ?", [email]);
        if (users.length === 0) {
            return res.json({ success: true, message: genericMessage });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const tokenExpires = new Date(Date.now() + 60 * 60 * 1000);

        await pool.query(
            "UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?",
            [resetToken, tokenExpires, users[0].id]
        );

        const resetLink = `${BASE_URL}/reset-password?token=${resetToken}`;
        await sendEmail(email, "Reset your BetAware SA password", emailTemplate(
            "Password reset requested",
            `<p>Hi ${users[0].name},</p>
             <p>Click below to set a new password. This link expires in 1 hour:</p>
             <p style="margin: 24px 0;">
                <a href="${resetLink}" style="background:#E8863C;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">Reset My Password</a>
             </p>
             <p style="font-size:13px;color:#888;">If you didn't request this, you can safely ignore this email.</p>`
        ));

        res.json({ success: true, message: genericMessage });
    } catch (err) {
        res.json({ success: true, message: genericMessage });
    }
});

app.post('/api/reset-password', authLimiter, async (req, res) => {
    const { token, newPassword } = req.body;
    if (!token || !newPassword || newPassword.length < 6) {
        return res.json({ success: false, message: "Password must be at least 6 characters." });
    }

    try {
        const [users] = await pool.query(
            "SELECT id FROM users WHERE reset_token = ? AND reset_token_expires > NOW()",
            [token]
        );
        if (users.length === 0) {
            return res.json({ success: false, message: "This reset link has expired or is invalid. Please request a new one." });
        }

        const password_hash = await bcrypt.hash(newPassword, 10);
        await pool.query(
            "UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?",
            [password_hash, users[0].id]
        );

        res.json({ success: true, message: "Password updated! You can now log in with your new password." });
    } catch (err) {
        res.json({ success: false, message: "Something went wrong. Please try again." });
    }
});

// 🩺 PGSI ASSESSMENT SUBMISSION
app.post("/api/pgsi-assessment", async (req, res) => {
    const { user_id, answers } = req.body;

    if (!user_id || !Array.isArray(answers) || answers.length !== 9) {
        return res.json({ success: false, message: "Invalid submission — all 9 questions are required." });
    }

    const validAnswers = answers.every(a => Number.isInteger(a) && a >= 0 && a <= 3);
    if (!validAnswers) {
        return res.json({ success: false, message: "Invalid answer values." });
    }

    const totalScore = answers.reduce((sum, a) => sum + a, 0);
    const riskLevel = calculatePgsiRisk(totalScore);

    try {
        await pool.query(
            "UPDATE users SET pgsi_score = ?, pgsi_risk_level = ?, pgsi_completed_at = NOW() WHERE id = ?",
            [totalScore, riskLevel, user_id]
        );

        res.json({
            success: true,
            score: totalScore,
            risk_level: riskLevel,
            sargf: (riskLevel === 'problem_gambler' || riskLevel === 'moderate_risk') ? SARGF_HOTLINE : null
        });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
});

// 📊 DASHBOARD & EXPENSES API
app.get("/api/user-data/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const [users] = await pool.query(
            "SELECT id, name, email, monthly_budget, current_balance, preferred_language, pgsi_score, pgsi_risk_level, pgsi_completed_at, email_verified FROM users WHERE id = ?",
            [userId]
        );
        if (users.length === 0) return res.json({ success: false, message: "User not found" });

        const [expenses] = await pool.query("SELECT * FROM expenses WHERE user_id = ? ORDER BY date_time DESC LIMIT 15", [userId]);

        const [platforms] = await pool.query(
            "SELECT betting_site, SUM(amount) as total_spent, COUNT(*) as bet_count FROM expenses WHERE user_id = ? GROUP BY betting_site ORDER BY total_spent DESC",
            [userId]
        );

        const risk = calculateRiskStatus(users[0].current_balance, users[0].monthly_budget);

        const [exclusions] = await pool.query(
            "SELECT * FROM self_exclusions WHERE user_id = ? ORDER BY started_at DESC LIMIT 1",
            [userId]
        );
        const activeExclusion = exclusions.length > 0 ? exclusions[0] : null;

        res.json({
            success: true,
            user: users[0],
            recent_expenses: expenses,
            platform_breakdown: platforms,
            risk_status: risk,
            self_exclusion: activeExclusion
        });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
});

app.post("/api/add-expense", async (req, res) => {
    const { user_id, amount, betting_site, category = 'General' } = req.body;
    const expenseAmount = parseFloat(amount);
    if (!user_id || isNaN(expenseAmount) || expenseAmount <= 0) {
        return res.json({ success: false, message: "Invalid amount or user" });
    }

    try {
        const [exclusions] = await pool.query(
            "SELECT * FROM self_exclusions WHERE user_id = ? AND status = 'Active' ORDER BY started_at DESC LIMIT 1",
            [user_id]
        );
        if (exclusions.length > 0) {
            return res.json({
                success: false,
                message: "You have an active self-exclusion in place. Logging new bets is disabled.",
                self_excluded: true
            });
        }

        await pool.query(
            "INSERT INTO expenses (user_id, amount, betting_site, category, date_time) VALUES (?, ?, ?, ?, NOW())",
            [user_id, expenseAmount, betting_site || 'Other', category]
        );
        await pool.query("UPDATE users SET current_balance = current_balance - ? WHERE id = ?", [expenseAmount, user_id]);

        const [rows] = await pool.query("SELECT current_balance, monthly_budget FROM users WHERE id = ?", [user_id]);
        const risk = calculateRiskStatus(rows[0].current_balance, rows[0].monthly_budget);

        res.json({
            success: true,
            message: "Expense recorded",
            new_balance: parseFloat(rows[0].current_balance),
            risk_status: risk
        });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
});

// 📱 South African Bank SMS Parser
app.post("/api/parse-sms", (req, res) => {
    const { smsText } = req.body;
    if (!smsText) return res.json({ success: false, message: "No SMS text provided" });

    const amountMatch = smsText.match(/(?:R|ZAR)\s*([\d,]+\.?\d*)/i);
    let extractedAmount = amountMatch ? parseFloat(amountMatch[1].replace(',', '')) : null;

    const lower = smsText.toLowerCase();
    let detectedSite = "Other";

    if (lower.includes("hollywood") || lower.includes("spina")) detectedSite = "Hollywood Bets";
    else if (lower.includes("betway")) detectedSite = "Betway";
    else if (lower.includes("sportingbet")) detectedSite = "Sportingbet";
    else if (lower.includes("supabets")) detectedSite = "Supabets";
    else if (lower.includes("lotto") || lower.includes("ithuba")) detectedSite = "Lotto";
    else if (lower.includes("sunbet")) detectedSite = "SunBet";

    if (extractedAmount) {
        res.json({ success: true, amount: extractedAmount, site: detectedSite });
    } else {
        res.json({ success: false, message: "Could not automatically detect amount from SMS text." });
    }
});

// 🌐 Language Update
app.post("/api/update-language", async (req, res) => {
    const { user_id, language } = req.body;
    try {
        await pool.query("UPDATE users SET preferred_language = ? WHERE id = ?", [language, user_id]);
        res.json({ success: true });
    } catch (err) {
        res.json({ success: false });
    }
});

// 🛡️ NATIONAL SELF-EXCLUSION
app.post("/api/self-exclude", async (req, res) => {
    const { user_id, period_months = 6 } = req.body;
    if (!user_id) {
        return res.json({ success: false, message: "Missing user" });
    }

    try {
        const [existing] = await pool.query(
            "SELECT id FROM self_exclusions WHERE user_id = ? AND status IN ('Requested', 'Active')",
            [user_id]
        );
        if (existing.length > 0) {
            return res.json({ success: false, message: "You already have an active self-exclusion request." });
        }

        const [result] = await pool.query(
            "INSERT INTO self_exclusions (user_id, status, period_months, started_at) VALUES (?, 'Active', ?, NOW())",
            [user_id, period_months]
        );

        res.json({
            success: true,
            message: "Self-exclusion activated. Quick-add betting buttons are now disabled.",
            exclusion_id: result.insertId,
            sargf: SARGF_HOTLINE
        });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 BetAware SA Enterprise running on ${BASE_URL}`);
    console.log(`🚨 Risk alert engine: ACTIVE`);
    console.log(`🛡️  Self-exclusion engine: ACTIVE`);
    console.log(`🩺 PGSI clinical assessment engine: ACTIVE`);
    console.log(`✉️  Email engine: ${transporter ? 'ACTIVE (real emails)' : 'SIMULATION MODE (set EMAIL_USER/EMAIL_PASS in .env)'}`);
});