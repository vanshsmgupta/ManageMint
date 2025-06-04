import express from 'express';
import { body, query } from 'express-validator';
import { auth, isAdmin } from '../middleware/auth.js';
import {
  createTimesheet,
  getTimesheets,
  getTimesheetById,
  updateTimesheet,
  reviewTimesheet,
  getTimesheetStats,
} from '../controllers/timesheetController.js';

const router = express.Router();

// Validation middleware
const timesheetValidation = [
  body('startDate').isISO8601().toDate(),
  body('endDate').isISO8601().toDate(),
  body('hours').isFloat({ min: 0 }),
  body('submissionType').isIn(['weekly', 'biweekly', 'monthly']),
  body('notes').optional().trim(),
];

const reviewValidation = [
  body('status').isIn(['approved', 'rejected']),
  body('reviewNotes').optional().trim(),
];

const queryValidation = [
  query('status').optional().isIn(['pending', 'approved', 'rejected']),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
];

// Routes
router.post('/', auth, timesheetValidation, createTimesheet);
router.get('/', auth, queryValidation, getTimesheets);
router.get('/stats', auth, getTimesheetStats);
router.get('/:id', auth, getTimesheetById);
router.patch('/:id', auth, timesheetValidation, updateTimesheet);
router.patch('/:id/review', auth, isAdmin, reviewValidation, reviewTimesheet);

export default router; 