import express from 'express';
import { body } from 'express-validator';
import { auth, isAdmin } from '../middleware/auth.js';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateProfile,
  getUserStats,
} from '../controllers/userController.js';

const router = express.Router();

// Validation middleware
const userValidation = [
  body('email').isEmail().normalizeEmail(),
  body('firstName').trim().notEmpty(),
  body('lastName').trim().notEmpty(),
  body('role').isIn(['user', 'marketer', 'admin']),
  body('dateOfBirth').isISO8601().toDate(),
];

const updateValidation = [
  body('email').optional().isEmail().normalizeEmail(),
  body('firstName').optional().trim().notEmpty(),
  body('lastName').optional().trim().notEmpty(),
  body('phoneNumber').optional().trim(),
  body('profilePicture').optional().isURL(),
];

// Admin routes
router.get('/', auth, isAdmin, getAllUsers);
router.post('/', auth, isAdmin, userValidation, createUser);
router.get('/stats', auth, isAdmin, getUserStats);

// User routes
router.get('/profile', auth, getUserById);
router.patch('/profile', auth, updateValidation, updateProfile);

// Admin routes with ID parameter
router.get('/:id', auth, isAdmin, getUserById);
router.patch('/:id', auth, isAdmin, updateValidation, updateUser);
router.delete('/:id', auth, isAdmin, deleteUser);

export default router; 