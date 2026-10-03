/**
 * One-time script to create an admin user.
 * Usage: node scripts/createAdmin.js
 * Default credentials:
 *   Student ID: ADMIN001
 *   Email:      admin@university.edu
 *   Password:   Admin@123
 */

const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

async function createAdmin() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'department_selection'
  });

  const student_id = 'ADMIN001';
  const email = 'admin@university.edu';
  const password = 'Admin@123';
  const first_name = 'System';
  const last_name = 'Administrator';

  try {
    // Check if already exists
    const [existing] = await pool.execute(
      'SELECT id FROM users WHERE student_id = ? OR email = ?',
      [student_id, email]
    );

    if (existing.length > 0) {
      console.log('Admin user already exists.');
      process.exit(0);
    }

    const hash = await bcrypt.hash(password, 10);

    const [result] = await pool.execute(
      `INSERT INTO users (student_id, email, password_hash, role) VALUES (?, ?, ?, 'admin')`,
      [student_id, email, hash]
    );

    const userId = result.insertId;

    await pool.execute(
      `INSERT INTO student_profiles (user_id, first_name, last_name, gender)
       VALUES (?, ?, ?, 'Other')`,
      [userId, first_name, last_name]
    );

    console.log('✅ Admin created successfully!');
    console.log('   Student ID :', student_id);
    console.log('   Email      :', email);
    console.log('   Password   :', password);
    console.log('   Login at   : http://localhost:5173/login');
  } catch (err) {
    console.error('Error creating admin:', err.message);
  } finally {
    await pool.end();
  }
}

createAdmin();
