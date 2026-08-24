require('dotenv').config();

const express = require("express");
const path = require("path");
const fs = require("fs");
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

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

        const [result] = await pool.query(
            `INSERT INTO users (name, email, password_hash, monthly_salary, betting_percentage, monthly_budget, current_balance, preferred_language) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, email, password_hash, monthly_salary, betting_percentage, monthly_budget, monthly_budget, preferred_language]
        );

        req.session.userId = result.insertId;
        res.json({
            success: true,
            user: { id: result.insertId, name, email, monthly_budget, current_balance: monthly_budget, preferred_language }
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
            }
        });
    } catch (err) {
        res.json({ success: false, message: "Login error" });
    }
});

app.post("/logout", (req, res) => req.session.destroy(() => res.json({ success: true })));

// 📊 DASHBOARD & EXPENSES API
app.get("/api/user-data/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const [users] = await pool.query("SELECT id, name, email, monthly_budget, current_balance, preferred_language FROM users WHERE id = ?", [userId]);
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
    console.log(`🚀 BetAware SA Enterprise running on http://localhost:${PORT}`);
    console.log(`🚨 Risk alert engine: ACTIVE`);
    console.log(`🛡️  Self-exclusion engine: ACTIVE`);
});