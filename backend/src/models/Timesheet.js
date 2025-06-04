import mongoose from 'mongoose';

const timesheetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  submissionType: {
    type: String,
    enum: ['weekly', 'biweekly', 'monthly'],
    required: true
  },
  hours: {
    type: Number,
    required: true,
    min: 0
  },
  notes: {
    type: String
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewDate: {
    type: Date
  },
  reviewNotes: {
    type: String
  }
}, {
  timestamps: true
});

// Index for efficient queries
timesheetSchema.index({ userId: 1, startDate: -1 });
timesheetSchema.index({ status: 1 });

const Timesheet = mongoose.model('Timesheet', timesheetSchema);

export default Timesheet; 