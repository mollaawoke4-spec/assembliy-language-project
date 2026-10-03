const express = require('express');
const { body } = require('express-validator');
const { register, login, getProfile } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Validation rules for registration
const registerValidation = [
  body('student_id')
    .trim()
    .notEmpty().withMessage('Student ID is required')
    .isLength({ min: 3, max: 50 }).withMessage('Student ID must be 3-50 characters'),
  
  body('email')
    .trim()
    .isEmail().withMessage('Valid email is required')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  
  body('first_name')
    .trim()
    .notEmpty().withMessage('First name is required')
    .isLength({ max: 100 }),
  
  body('last_name')
    .trim()
    .notEmpty().withMessage('Last name is required')
    .isLength({ max: 100 }),
  
  body('gender')
    .isIn(['Male', 'Female', 'Other']).withMessage('Gender must be Male, Female or Other'),
  
  body('phone')
    .optional({ checkFalsy: true })
    .isMobilePhone().withMessage('Invalid phone number'),
  
  body('total_score')
    .optional({ checkFalsy: true })
    .isFloat({ min: 0 }).withMessage('Total score must be a positive number'),
  
  body('gpa')
    .optional({ checkFalsy: true })
    .isFloat({ min: 0, max: 4 }).withMessage('GPA must be between 0 and 4')
];

// Validation for login
const loginValidation = [
  body('student_id').trim().notEmpty().withMessage('Student ID is required'),
  body('password').notEmpty().withMessage('Password is required')
];

// Routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/profile', authenticate, getProfile);

module.exports = router;
