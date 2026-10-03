const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const pool = require('../config/db');
require('dotenv').config();

// ======================
// REGISTER STUDENT
// ======================
const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const {
    student_id,
    email,
    password,
    first_name,
    middle_name,
    last_name,
    gender,
    date_of_birth,
    phone,
    national_id,
    region,
    city,
    address,
    // Academic
    high_school_name,
    high_school_year,
    total_score,
    gpa,
    english_score,
    mathematics_score,
    science_score,
    social_score,
    category,
    stream
  } = req.body;

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Check if student_id or email already exists
    const [existing] = await connection.execute(
      'SELECT id FROM users WHERE student_id = ? OR email = ?',
      [student_id, email]
    );

    if (existing.length > 0) {
      await connection.rollback();
      return res.status(409).json({
        success: false,
        message: 'Student ID or Email already registered.'
      });
    }

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // 3. Insert into users
    const [userResult] = await connection.execute(
      `INSERT INTO users (student_id, email, password_hash, role) 
       VALUES (?, ?, ?, 'student')`,
      [student_id, email, password_hash]
    );

    const userId = userResult.insertId;

    // 4. Insert personal profile
    await connection.execute(
      `INSERT INTO student_profiles 
       (user_id, first_name, middle_name, last_name, gender, date_of_birth, phone, national_id, region, city, address)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        first_name,
        middle_name || null,
        last_name,
        gender,
        date_of_birth || null,
        phone || null,
        national_id || null,
        region || null,
        city || null,
        address || null
      ]
    );

    // 5. Insert academic info
    await connection.execute(
      `INSERT INTO student_academic 
       (user_id, high_school_name, high_school_year, total_score, gpa, 
        english_score, mathematics_score, science_score, social_score, category, stream)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        high_school_name || null,
        high_school_year || null,
        total_score || null,
        gpa || null,
        english_score || null,
        mathematics_score || null,
        science_score || null,
        social_score || null,
        category || 'Regular',
        stream || null
      ]
    );

    await connection.commit();

    // Generate JWT
    const token = jwt.sign(
      { id: userId, student_id, role: 'student' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      data: {
        user: {
          id: userId,
          student_id,
          email,
          role: 'student',
          first_name,
          last_name
        },
        token
      }
    });

  } catch (error) {
    await connection.rollback();
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    connection.release();
  }
};

// ======================
// LOGIN
// ======================
const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { student_id, password } = req.body;

  try {
    const [users] = await pool.execute(
      `SELECT u.id, u.student_id, u.email, u.password_hash, u.role, u.is_active,
              p.first_name, p.last_name
       FROM users u
       LEFT JOIN student_profiles p ON u.id = p.user_id
       WHERE u.student_id = ?`,
      [student_id]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Student ID or password.'
      });
    }

    const user = users[0];

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated. Contact administrator.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Student ID or password.'
      });
    }

    const token = jwt.sign(
      { id: user.id, student_id: user.student_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          student_id: user.student_id,
          email: user.email,
          role: user.role,
          first_name: user.first_name,
          last_name: user.last_name
        },
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login.'
    });
  }
};

// ======================
// GET CURRENT USER PROFILE
// ======================
const getProfile = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT 
          u.id, u.student_id, u.email, u.role, u.created_at,
          p.first_name, p.middle_name, p.last_name, p.gender, p.date_of_birth,
          p.phone, p.national_id, p.region, p.city, p.address,
          a.high_school_name, a.high_school_year, a.total_score, a.gpa,
          a.english_score, a.mathematics_score, a.science_score, a.social_score,
          a.category, a.stream
       FROM users u
       LEFT JOIN student_profiles p ON u.id = p.user_id
       LEFT JOIN student_academic a ON u.id = a.user_id
       WHERE u.id = ?`,
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.json({
      success: true,
      data: rows[0]
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { register, login, getProfile };
