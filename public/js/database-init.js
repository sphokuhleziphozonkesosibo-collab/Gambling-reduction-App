const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function initializeDatabase() {
    const connection = mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '$$Zipho@302112$$',
        database: process.env.DB_NAME || 'betaware_sa',
        multipleStatements: true
    });

    try {
        console.log('🔄 Starting SAFE database initialization...');
        
        await connection.promise().connect();
        console.log('✅ Connected to MySQL database');
        
        // Check existing tables
        const [tables] = await connection.promise().query('SHOW TABLES');
        console.log(`📊 Found ${tables.length} existing tables`);
        
        // SAFELY create users table if it doesn't exist
        await connection.promise().query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                monthly_salary DECIMAL(10,2) NOT NULL,
                betting_percentage DECIMAL(5,2) DEFAULT 10.00,
                monthly_budget DECIMAL(10,2) NOT NULL,
                current_balance DECIMAL(10,2) NOT NULL,
                preferred_language VARCHAR(10) DEFAULT 'en',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Users table checked/created');
        
        // SAFELY create expenses table if it doesn't exist
        await connection.promise().query(`
            CREATE TABLE IF NOT EXISTS expenses (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                amount DECIMAL(10,2) NOT NULL,
                betting_site VARCHAR(100) NOT NULL,
                category VARCHAR(50) DEFAULT 'General',
                notes TEXT,
                date_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        console.log('✅ Expenses table checked/created');
        
        // Check if we have any users
        const [users] = await connection.promise().query('SELECT COUNT(*) as count FROM users');
        
        if (users[0].count === 0) {
            // Only create test user if no users exist
            const hashedPassword = await bcrypt.hash('password123', 10);
            await connection.promise().query(
                `INSERT INTO users 
                (name, email, password_hash, monthly_salary, monthly_budget, current_balance, preferred_language) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                ['Test User', 'test@example.com', hashedPassword, 15000.00, 1500.00, 1500.00, 'en']
            );
            console.log('✅ Test user created (no existing users found)');
            console.log('   📧 Email: test@example.com');
            console.log('   🔑 Password: password123');
        } else {
            console.log(`✅ ${users[0].count} existing users preserved`);
            
            // Show existing users
            const [existingUsers] = await connection.promise().query('SELECT name, email FROM users LIMIT 3');
            console.log('📋 Existing users:');
            existingUsers.forEach(user => {
                console.log(`   👤 ${user.name} (${user.email})`);
            });
        }
        
        console.log('');
        console.log('🎉 SAFE DATABASE INITIALIZATION COMPLETED!');
        console.log('='.repeat(50));
        console.log('✅ Existing data preserved');
        console.log('✅ Missing tables created');
        console.log('✅ Database is ready for the app');
        console.log('='.repeat(50));
        console.log('');
        console.log('🚀 Start your app with: npm start');
        
    } catch (error) {
        console.error('❌ Database initialization failed:', error.message);
        console.log('');
        console.log('🔧 TROUBLESHOOTING:');
        console.log('1. Check if MySQL is running');
        console.log('2. Verify database credentials in .env file');
        console.log('3. Make sure database "betaware_sa" exists');
    } finally {
        if (connection) {
            connection.end();
            console.log('📊 Database connection closed');
        }
    }
}

// Run the safe initialization
initializeDatabase();