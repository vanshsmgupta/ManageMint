import express from 'express';
import { body } from 'express-validator';
import { auth } from '../middleware/auth.js';
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
} from '../controllers/authController.js';

const router = express.Router();

// Validation middleware
const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('firstName').trim().notEmpty(),
  body('lastName').trim().notEmpty(),
  body('dateOfBirth').isISO8601().toDate(),
];

const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
];

const passwordValidation = [
  body('password').isLength({ min: 6 }),
];

// Routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/forgot-password', body('email').isEmail(), forgotPassword);
router.post('/reset-password', [...passwordValidation, body('token').notEmpty()], resetPassword);
router.post('/change-password', auth, passwordValidation, changePassword);

export default router; 