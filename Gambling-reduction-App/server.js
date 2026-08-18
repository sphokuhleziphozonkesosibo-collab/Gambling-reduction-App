require('dotenv').config();

const express = require("express");
const path = require("path");
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ MIDDLEWARE
app.use(helmet({
    contentSecurityPolicy: false // Disable for development
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// ✅ SESSION MANAGEMENT
app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // Set to true in production
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

// ✅ RATE LIMITING
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { success: false, message: "Too many attempts" }
});

app.use('/login', authLimiter);
app.use('/register', authLimiter);

// ✅ DATABASE CONNECTION
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER, 
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.log('❌ Database connection failed:', err.message);
        return;
    }
    console.log('✅ Connected to MySQL database');
});

// ✅ ROUTES
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/login.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/dashboard.html'));
});

// ✅ LOGIN ENDPOINT - SIMPLIFIED
app.post("/login", (req, res) => {
    console.log('🔐 Login attempt:', req.body.email);
    
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.json({ success: false, message: "Email and password required" });
    }
    
    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], async (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.json({ success: false, message: "Server error" });
        }
        
        if (results.length === 0) {
            return res.json({ success: false, message: "User not found" });
        }
        
        const user = results[0];
        
        try {
            const isPasswordValid = await bcrypt.compare(password, user.password_hash);
            
            if (!isPasswordValid) {
                return res.json({ success: false, message: "Invalid password" });
            }
            
            // Create session
            req.session.userId = user.id;
            req.session.userEmail = user.email;
            req.session.userName = user.name;
            req.session.userLanguage = user.preferred_language || 'en';
            
            console.log('✅ Login successful for:', user.name, 'Language:', user.preferred_language);
            
            res.json({ 
                success: true, 
                message: "Login successful!",
                user: {
                    id: user.id,
                    name: user.name,
                    monthly_budget: user.monthly_budget,
                    current_balance: user.current_balance,
                    preferred_language: user.preferred_language || 'en'
                }
            });
            
        } catch (error) {
            console.error("Password error:", error);
            res.json({ success: false, message: "Login failed" });
        }
    });
});

// ✅ REGISTER ENDPOINT - UPDATED WITH 11 LANGUAGES SUPPORT
app.post("/register", async (req, res) => {
    console.log('📝 Registration attempt:', req.body.email);
    
    const { name, email, password, monthly_salary, betting_percentage = 10, preferred_language = 'en' } = req.body;
    
    // ✅ VALIDATE LANGUAGE AGAINST ALL 11 OFFICIAL SA LANGUAGES
    const validLanguages = ['en', 'zu', 'af', 'xh', 'nso', 'st', 'tn', 'ts', 'ss', 've', 'nr'];
    const finalLanguage = validLanguages.includes(preferred_language) ? preferred_language : 'en';
    
    // Validation
    if (!name || !email || !password || !monthly_salary) {
        return res.json({ success: false, message: "All fields required" });
    }
    
    if (password.length < 6) {
        return res.json({ success: false, message: "Password must be 6+ characters" });
    }
    
    try {
        const password_hash = await bcrypt.hash(password, 10);
        const monthly_budget = monthly_salary * (betting_percentage / 100);
        const current_balance = monthly_budget;
        
        const sql = `INSERT INTO users (name, email, password_hash, monthly_salary, betting_percentage, monthly_budget, current_balance, preferred_language) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        
        db.query(sql, [name, email, password_hash, monthly_salary, betting_percentage, monthly_budget, current_balance, finalLanguage], 
            (err, result) => {
                if (err) {
                    console.log("Registration error:", err.message);
                    if (err.code === 'ER_DUP_ENTRY') {
                        return res.json({ success: false, message: "Email already exists" });
                    }
                    return res.json({ success: false, message: "Registration failed" });
                }
                
                console.log("✅ User registered:", name, "Language:", finalLanguage);
                
                // Auto-login after registration
                req.session.userId = result.insertId;
                req.session.userEmail = email;
                req.session.userName = name;
                req.session.userLanguage = finalLanguage;
                
                res.json({ 
                    success: true, 
                    message: "Registration successful!",
                    user: {
                        id: result.insertId,
                        name: name,
                        monthly_budget: monthly_budget,
                        current_balance: current_balance,
                        preferred_language: finalLanguage
                    }
                });
            }
        );
    } catch (error) {
        console.error("Registration error:", error);
        res.json({ success: false, message: "Registration failed" });
    }
});

// ✅ UPDATE LANGUAGE PREFERENCE - CRITICAL FOR 11 LANGUAGES
app.post("/api/update-language", (req, res) => {
    const { user_id, language } = req.body;
    
    // Validate language against all 11 official SA languages
    const validLanguages = ['en', 'zu', 'af', 'xh', 'nso', 'st', 'tn', 'ts', 'ss', 've', 'nr'];
    const finalLanguage = validLanguages.includes(language) ? language : 'en';
    
    const sql = "UPDATE users SET preferred_language = ? WHERE id = ?";
    db.query(sql, [finalLanguage, user_id], (err, result) => {
        if (err) {
            console.error("Language update error:", err);
            return res.json({ success: false, message: "Failed to update language" });
        }
        
        console.log(`✅ Language updated to ${finalLanguage} for user ${user_id}`);
        res.json({ success: true, message: "Language updated" });
    });
});

// ✅ EXPENSE MANAGEMENT SYSTEM - WITH /api PREFIX
app.post("/api/add-expense", (req, res) => {
    console.log('💰 Add expense request:', req.body);
    
    const { user_id, amount, betting_site, category = 'General', notes = '' } = req.body;
    
    if (!user_id || !amount || !betting_site) {
        return res.json({ success: false, message: "User ID, amount and betting site are required" });
    }
    
    // First get current balance
    const getBalanceSQL = "SELECT current_balance, monthly_budget FROM users WHERE id = ?";
    db.query(getBalanceSQL, [user_id], (err, results) => {
        if (err) {
            console.error("Balance check error:", err);
            return res.json({ success: false, message: "Database error" });
        }
        
        if (results.length === 0) {
            return res.json({ success: false, message: "User not found" });
        }
        
        const user = results[0];
        const currentBalance = parseFloat(user.current_balance);
        const expenseAmount = parseFloat(amount);
        
        // 🚨 CHECK IF EXPENSE EXCEEDS BALANCE
        if (expenseAmount > currentBalance) {
            const overspendAmount = expenseAmount - currentBalance;
            return res.json({ 
                success: false, 
                message: `This expense would exceed your budget by R ${overspendAmount}`,
                overspend: true
            });
        }
        
        // Calculate new balance
        const newBalance = currentBalance - expenseAmount;
        
        // Insert expense
        const insertExpenseSQL = `INSERT INTO expenses (user_id, amount, betting_site, category, notes) 
                                 VALUES (?, ?, ?, ?, ?)`;
        
        db.query(insertExpenseSQL, [user_id, expenseAmount, betting_site, category, notes], (err, expenseResult) => {
            if (err) {
                console.error("Expense insert error:", err);
                return res.json({ success: false, message: "Failed to add expense" });
            }
            
            // Update user balance
            const updateBalanceSQL = "UPDATE users SET current_balance = ? WHERE id = ?";
            db.query(updateBalanceSQL, [newBalance, user_id], (err, updateResult) => {
                if (err) {
                    console.error("Balance update error:", err);
                    return res.json({ success: false, message: "Expense added but balance update failed" });
                }
                
                console.log(`✅ Expense added: R ${expenseAmount} for user ${user_id}`);
                
                res.json({
                    success: true,
                    message: `Expense of R ${expenseAmount} added successfully!`,
                    new_balance: newBalance,
                    expense_id: expenseResult.insertId
                });
            });
        });
    });
});

// ✅ GET USER DATA (for dashboard) - WITH /api PREFIX
app.get("/api/user-data/:user_id", (req, res) => {
    const user_id = req.params.user_id;
    console.log('📊 Fetching user data for:', user_id);
    
    const userSQL = "SELECT * FROM users WHERE id = ?";
    const expensesSQL = "SELECT * FROM expenses WHERE user_id = ? ORDER BY date_time DESC LIMIT 5";
    
    db.query(userSQL, [user_id], (err, userResults) => {
        if (err) {
            console.error("User data error:", err);
            return res.json({ success: false, message: "Failed to get user data" });
        }
        
        if (userResults.length === 0) {
            return res.json({ success: false, message: "User not found" });
        }
        
        const user = userResults[0];
        console.log('👤 User data found:', { 
            id: user.id, 
            name: user.name, 
            monthly_budget: user.monthly_budget, 
            current_balance: user.current_balance 
        });
        
        // Get recent expenses
        db.query(expensesSQL, [user_id], (err, expenseResults) => {
            if (err) {
                console.error("Expenses fetch error:", err);
                // Still return user data even if expenses fail
                return res.json({
                    success: true,
                    user: user,
                    recent_expenses: []
                });
            }
            
            res.json({
                success: true,
                user: user,
                recent_expenses: expenseResults
            });
        });
    });
});

// ✅ KEEP ORIGINAL ENDPOINTS FOR BACKWARD COMPATIBILITY
app.post("/add-expense", (req, res) => {
    console.log('💰 Legacy add expense endpoint called');
    // Forward to the new API endpoint
    req.url = '/api/add-expense';
    app.handle(req, res);
});

app.get("/user-data/:user_id", (req, res) => {
    console.log('📊 Legacy user-data endpoint called');
    // Forward to the new API endpoint
    req.url = `/api/user-data/${req.params.user_id}`;
    app.handle(req, res);
});

// ✅ GET USER EXPENSES
app.get("/user-expenses/:user_id", (req, res) => {
    const user_id = req.params.user_id;
    
    const sql = "SELECT * FROM expenses WHERE user_id = ? ORDER BY date_time DESC LIMIT 10";
    db.query(sql, [user_id], (err, results) => {
        if (err) {
            console.error("Get expenses error:", err);
            return res.json({ success: false, message: "Failed to get expenses" });
        }
        
        res.json({
            success: true,
            expenses: results
        });
    });
});

// ✅ GET USER LANGUAGE PREFERENCE
app.get("/user-language/:user_id", (req, res) => {
    const user_id = req.params.user_id;
    
    const sql = "SELECT preferred_language FROM users WHERE id = ?";
    db.query(sql, [user_id], (err, results) => {
        if (err) {
            console.error("Language fetch error:", err);
            return res.json({ success: false, language: 'en' });
        }
        
        if (results.length === 0) {
            return res.json({ success: false, language: 'en' });
        }
        
        res.json({
            success: true,
            language: results[0].preferred_language || 'en'
        });
    });
});

// ✅ LOGOUT
app.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.json({ success: false, message: "Logout failed" });
        }
        res.json({ success: true, message: "Logged out" });
    });
});

// ✅ HEALTH CHECK
app.get("/health", (req, res) => {
    res.json({ status: 'healthy', database: 'connected' });
});

// ✅ DEBUG: Get all users with languages
app.get("/debug-users", (req, res) => {
    db.query('SELECT id, name, email, preferred_language, monthly_budget, current_balance FROM users', (err, results) => {
        if (err) {
            return res.json({ error: err.message });
        }
        res.json({ users: results, count: results.length });
    });
});

// Start server
app.listen(PORT, () => {
    console.log("🚀 BetAware SA Server running on http://localhost:" + PORT);
    console.log("🌍 11 Official SA Languages: ACTIVE");
    console.log("💰 API Endpoints:");
    console.log("   POST /api/add-expense");
    console.log("   GET  /api/user-data/:user_id");
    console.log("   POST /api/update-language");
    console.log("🔧 Debug: http://localhost:" + PORT + "/debug-users");
    console.log("🔧 Health: http://localhost:" + PORT + "/health");
});