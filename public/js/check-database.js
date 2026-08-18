const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

console.log('🔍 Checking existing database structure...');

connection.connect((err) => {
    if (err) {
        console.log('❌ Cannot connect to database:', err.message);
        console.log('');
        console.log('💡 Try running: npm run init-db');
        return;
    }

    console.log('✅ Connected to database:', process.env.DB_NAME);
    
    // Check tables
    connection.query('SHOW TABLES', (err, results) => {
        if (err) {
            console.log('Error checking tables:', err);
            return;
        }

        console.log('');
        console.log('📊 EXISTING TABLES:');
        if (results.length === 0) {
            console.log('   No tables found - database is empty');
        } else {
            results.forEach(table => {
                console.log('   ✅', table.Tables_in_betaware_sa);
            });
        }

        // Check users table specifically
        connection.query('SELECT COUNT(*) as userCount FROM users', (err, userResults) => {
            if (err) {
                console.log('❌ Users table might not exist or has issues');
            } else {
                console.log('');
                console.log(`👥 TOTAL USERS: ${userResults[0].userCount}`);
            }

            // Check if we can see some sample users
            connection.query('SELECT id, name, email, preferred_language FROM users LIMIT 5', (err, sampleUsers) => {
                if (!err && sampleUsers.length > 0) {
                    console.log('');
                    console.log('📋 SAMPLE USERS:');
                    sampleUsers.forEach(user => {
                        console.log(`   👤 ${user.name} (${user.email}) - Language: ${user.preferred_language}`);
                    });
                }

                connection.end();
                console.log('');
                console.log('='.repeat(50));
                console.log('🎯 NEXT STEPS:');
                console.log('1. If tables exist but structure is old, run: npm run init-db');
                console.log('2. If no tables exist, run: npm run init-db');
                console.log('3. If everything looks good, run: npm start');
                console.log('='.repeat(50));
            });
        });
    });
});