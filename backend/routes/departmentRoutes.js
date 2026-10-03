const express = require('express');
const { body } = require('express-validator');
const {
  getColleges,
  createCollege,
  updateCollege,
  getDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment
} = require('../controllers/departmentController');
const { authenticate, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Validation
const collegeValidation = [
  body('name').trim().notEmpty().withMessage('College name is required').isLength({ max: 150 })
];

const departmentValidation = [
  body('college_id').isInt({ min: 1 }).withMessage('Valid college is required'),
  body('name').trim().notEmpty().withMessage('Department name is required').isLength({ max: 150 }),
  body('capacity').optional().isInt({ min: 0 }).withMessage('Capacity must be a non-negative integer'),
  body('min_total_score').optional().isFloat({ min: 0 }),
  body('min_gpa').optional().isFloat({ min: 0, max: 4 }),
  body('priority_order').optional().isInt()
];

// Public / Student accessible (read-only)
router.get('/colleges', getColleges);
router.get('/', getDepartments);
router.get('/:id', getDepartment);

// Admin only
router.post('/colleges', authenticate, isAdmin, collegeValidation, createCollege);
router.put('/colleges/:id', authenticate, isAdmin, updateCollege);

router.post('/', authenticate, isAdmin, departmentValidation, createDepartment);
router.put('/:id', authenticate, isAdmin, departmentValidation, updateDepartment);
router.delete('/:id', authenticate, isAdmin, deleteDepartment);

module.exports = router;
