import mongoose from 'mongoose';

const meetingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  meetingLink: {
    type: String
  },
  location: {
    type: String
  },
  reminders: [{
    type: Date
  }],
  attachments: [{
    name: String,
    url: String,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }]
}, {
  timestamps: true
});

// Indexes for efficient queries
meetingSchema.index({ startTime: 1 });
meetingSchema.index({ participants: 1 });
meetingSchema.index({ organizer: 1 });
meetingSchema.index({ status: 1 });

const Meeting = mongoose.model('Meeting', meetingSchema);

export default Meeting; 