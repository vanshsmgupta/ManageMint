import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema({
  consultantName: {
    type: String,
    required: true,
    trim: true
  },
  client: {
    type: String,
    required: true,
    trim: true
  },
  vendor: {
    type: String,
    required: true,
    trim: true
  },
  marketer: {
    type: String,
    required: true,
    trim: true
  },
  marketerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  inhouseEngineer: {
    type: String,
    required: true,
    trim: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  technology: {
    type: String,
    required: true,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  resume: {
    type: String,
    required: true,
    trim: true
  },
  timesheet: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'ongoing', 'completed'],
    default: 'pending'
  },
  validUntil: {
    type: Date,
    required: true
  },
  terms: {
    type: String,
    required: true
  },
  value: {
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  attachments: [{
    name: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  responseDate: {
    type: Date
  },
  responseNotes: {
    type: String
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
offerSchema.index({ marketerId: 1 });
offerSchema.index({ userId: 1 });
offerSchema.index({ status: 1 });
offerSchema.index({ startDate: 1 });
offerSchema.index({ client: 1 });
offerSchema.index({ technology: 1 });
offerSchema.index({ validUntil: 1 });

const Offer = mongoose.model('Offer', offerSchema);

export default Offer; 