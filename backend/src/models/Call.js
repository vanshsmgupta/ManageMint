import mongoose from 'mongoose';

const callSchema = new mongoose.Schema({
  marketerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  scheduledFor: {
    type: Date,
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true,
    min: 1
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  notes: {
    type: String
  },
  callType: {
    type: String,
    enum: ['initial', 'follow-up', 'demo', 'support'],
    required: true
  },
  outcome: {
    type: String,
    enum: ['pending', 'successful', 'rescheduled', 'no-show'],
    default: 'pending'
  },
  recordingUrl: {
    type: String
  },
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comments: String
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
callSchema.index({ marketerId: 1, scheduledFor: 1 });
callSchema.index({ clientId: 1 });
callSchema.index({ status: 1 });
callSchema.index({ outcome: 1 });

const Call = mongoose.model('Call', callSchema);

export default Call; 