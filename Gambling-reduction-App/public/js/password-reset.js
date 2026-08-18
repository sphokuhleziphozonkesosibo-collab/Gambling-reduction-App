// password-reset.js - Professional password reset utility
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function resetUserPasswords() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '$$Zipho@302112$$',
        database: 'betaware_sa'
    });

    try {
        console.log('🔄 Starting professional password reset...');
        
        // Standard secure password for all users
        const securePassword = 'SecurePass123!';
        const hashedPassword = await bcrypt.hash(securePassword, 10);
        
        // Update all existing users
        const [result] = await connection.execute(
            'UPDATE users SET password_hash = ?',
            [hashedPassword]
        );
        
        console.log(`✅ Successfully reset passwords for ${result.affectedRows} users`);
        console.log('📋 Login credentials for all users:');
        console.log('   Password: SecurePass123!');
        console.log('');
        console.log('📧 Available user emails:');
        
        // Show available emails
        const [users] = await connection.execute('SELECT email FROM users');
        users.forEach(user => {
            console.log(`   - ${user.email}`);
        });
        
    } catch (error) {
        console.error('❌ Password reset failed:', error.message);
    } finally {
        await connection.end();
    }
}

resetUserPasswords();