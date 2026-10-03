const express = require('express');
const { body } = require('express-validator');
const {
  getSettings,
  updateSettings,
  getEligibleDepartments,
  getMyChoices,
  submitChoices,
  getMyResult,
  runAssignment,
  getAllResults
} = require('../controllers/selectionController');
const { authenticate, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Public / shared
router.get('/settings', getSettings);

// Student routes
router.get('/eligible', authenticate, getEligibleDepartments);
router.get('/my-choices', authenticate, getMyChoices);
router.post('/choices', authenticate, [
  body('choices').isArray({ min: 1 }).withMessage('Choices must be an array')
], submitChoices);
router.get('/my-result', authenticate, getMyResult);

// Admin routes
router.put('/settings', authenticate, isAdmin, updateSettings);
router.post('/run-assignment', authenticate, isAdmin, runAssignment);
router.get('/results', authenticate, isAdmin, getAllResults);

module.exports = router;
