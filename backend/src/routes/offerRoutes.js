import express from 'express';
import { body } from 'express-validator';
import { auth } from '../middleware/auth.js';
import {
  generateOffer,
  getOffers,
  getGeneratedOffers,
  getOfferById,
  updateOffer,
  deleteOffer,
  acceptOffer,
  rejectOffer,
  markOfferAsDone
} from '../controllers/offerController.js';

const router = express.Router();

// Validation middleware
const offerValidation = [
  body('consultantName').trim().notEmpty(),
  body('client').trim().notEmpty(),
  body('vendor').trim().notEmpty(),
  body('marketer').trim().notEmpty(),
  body('inhouseEngineer').trim().notEmpty(),
  body('technology').trim().notEmpty(),
  body('startDate').isISO8601().toDate(),
  body('endDate').optional().isISO8601().toDate(),
  body('resume').trim().isURL(),
];

// Routes for users
router.get('/', auth, getOffers);
router.get('/:id', auth, getOfferById);

// Routes for marketers
router.post('/generate', auth, offerValidation, generateOffer);
router.get('/generated', auth, getGeneratedOffers);
router.put('/:id', auth, offerValidation, updateOffer);
router.delete('/:id', auth, deleteOffer);

// Status change routes
router.post('/:id/accept', auth, acceptOffer);
router.post('/:id/reject', auth, rejectOffer);
router.post('/:id/complete', auth, markOfferAsDone);

export default router; 