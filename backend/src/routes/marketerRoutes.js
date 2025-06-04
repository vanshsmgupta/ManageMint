import express from 'express';
import { body } from 'express-validator';
import { auth } from '../middleware/auth.js';
import {
  createMarketer,
  getAllMarketers,
  getMarketerById,
  updateMarketer,
  deleteMarketer
} from '../controllers/marketerController.js';

const router = express.Router();

// Validation middleware
const marketerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('name').trim().notEmpty(),
  body('specialization').trim().notEmpty()
];

// Routes
router.post('/', auth, marketerValidation, createMarketer);
router.get('/', auth, getAllMarketers);
router.get('/:id', auth, getMarketerById);
router.put('/:id', auth, marketerValidation, updateMarketer);
router.delete('/:id', auth, deleteMarketer);

export default router; 