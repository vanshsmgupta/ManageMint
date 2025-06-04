import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true
  },
  recipients: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['meeting', 'offer', 'system', 'call'],
    required: true
  },
  read: {
    type: Map,
    of: Boolean,
    default: new Map()
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  relatedResource: {
    type: {
      type: String,
      enum: ['meeting', 'offer', 'call', 'timesheet']
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'relatedResource.type'
    }
  },
  expiresAt: {
    type: Date
  },
  action: {
    type: {
      type: String,
      enum: ['view', 'approve', 'reject', 'respond']
    },
    url: String
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
notificationSchema.index({ recipients: 1 });
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ 'relatedResource.type': 1, 'relatedResource.id': 1 });

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification; 