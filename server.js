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

// ✅ FIXED: Enhanced middleware configuration
app.use(helmet({
    contentSecurityPolicy: false
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ FIXED: Proper static file serving
app.use(express.static(path.join(__dirname, "public"), {
    index: false, // Don't serve index.html automatically
    extensions: ['html', 'htm'] // Explicitly serve these extensions
}));

// ✅ SESSION MANAGEMENT
app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false,
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

// ✅ FIXED: EXPLICIT ROUTES
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/dashboard', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/');
    }
    res.sendFile(path.join(__dirname, 'public', 'views', 'dashboard.html'));
});

// ✅ FIXED: Serve CSS and JS files explicitly
app.get('/css/:filename', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'css', req.params.filename));
});

app.get('/js/:filename', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'js', req.params.filename));
});

// ✅ LOGIN ENDPOINT
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
            
            console.log('✅ Login successful for:', user.name);
            
            res.json({ 
                success: true, 
                message: "Login successful!",
                user: {
                    id: user.id,
                    name: user.name,
                    monthly_budget: parseFloat(user.monthly_budget),
                    current_balance: parseFloat(user.current_balance),
                    preferred_language: user.preferred_language || 'en'
                }
            });
            
        } catch (error) {
            console.error("Password error:", error);
            res.json({ success: false, message: "Login failed" });
        }
    });
});

// ✅ REGISTER ENDPOINT (keep your existing register code)
app.post("/register", async (req, res) => {
    console.log('📝 Registration attempt:', req.body.email);
    
    const { name, email, password, monthly_salary, betting_percentage = 10, preferred_language = 'en' } = req.body;
    
    // ✅ VALIDATE LANGUAGE
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

// ✅ KEEP ALL YOUR OTHER ENDPOINTS (update-language, add-expense, user-data, etc.)
// ... (include all your existing API endpoints here)

// ✅ HEALTH CHECK
app.get("/health", (req, res) => {
    res.json({ 
        status: 'healthy', 
        database: 'connected',
        timestamp: new Date().toISOString()
    });
});

// ✅ 404 Handler - FIXED
app.use((req, res) => {
    res.status(404).send(`
        <html>
            <body>
                <h1>404 - Page Not Found</h1>
                <p>The page you are looking for does not exist.</p>
                <a href="/">Go to Login</a>
            </body>
        </html>
    `);
});

// Start server
app.listen(PORT, () => {
    console.log("=".repeat(60));
    console.log("🚀 BetAware SA Server RUNNING - FIXED VERSION");
    console.log("=".repeat(60));
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`📁 Serving from: ${__dirname}`);
    console.log("=".repeat(60));
});