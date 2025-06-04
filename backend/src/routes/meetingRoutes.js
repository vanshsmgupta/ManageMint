import express from 'express';
import { body, query } from 'express-validator';
import { auth } from '../middleware/auth.js';
import {
  createMeeting,
  getMeetings,
  getMeetingById,
  updateMeeting,
  deleteMeeting,
  getMeetingStats,
} from '../controllers/meetingController.js';

const router = express.Router();

// Validation middleware
const meetingValidation = [
  body('title').trim().notEmpty(),
  body('description').optional().trim(),
  body('startTime').isISO8601().toDate(),
  body('endTime').isISO8601().toDate(),
  body('participants').isArray(),
  body('participants.*').isMongoId(),
  body('meetingLink').optional().isURL(),
  body('location').optional().trim(),
  body('reminders').optional().isArray(),
  body('reminders.*').isISO8601().toDate(),
];

const queryValidation = [
  query('status').optional().isIn(['scheduled', 'completed', 'cancelled']),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
];

// Routes
router.post('/', auth, meetingValidation, createMeeting);
router.get('/', auth, queryValidation, getMeetings);
router.get('/stats', auth, getMeetingStats);
router.get('/:id', auth, getMeetingById);
router.patch('/:id', auth, meetingValidation, updateMeeting);
router.delete('/:id', auth, deleteMeeting);

export default router; 