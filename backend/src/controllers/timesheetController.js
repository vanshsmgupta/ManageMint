import Timesheet from '../models/Timesheet.js';
import { sendEmail, emailTemplates } from '../utils/emailService.js';

export const createTimesheet = async (req, res) => {
  try {
    const { startDate, endDate, hours, submissionType, notes } = req.body;
    
    const timesheet = new Timesheet({
      userId: req.user.id,
      startDate,
      endDate,
      hours,
      submissionType,
      notes,
    });

    await timesheet.save();

    res.status(201).json(timesheet);
  } catch (error) {
    res.status(500).json({ message: 'Error creating timesheet', error: error.message });
  }
};

export const getTimesheets = async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    const query = { userId: req.user.id };

    if (status) {
      query.status = status;
    }

    if (startDate || endDate) {
      query.startDate = {};
      if (startDate) query.startDate.$gte = new Date(startDate);
      if (endDate) query.startDate.$lte = new Date(endDate);
    }

    const timesheets = await Timesheet.find(query)
      .sort({ startDate: -1 })
      .populate('userId', 'firstName lastName email');

    res.json(timesheets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching timesheets', error: error.message });
  }
};

export const getTimesheetById = async (req, res) => {
  try {
    const timesheet = await Timesheet.findById(req.params.id)
      .populate('userId', 'firstName lastName email')
      .populate('reviewedBy', 'firstName lastName email');

    if (!timesheet) {
      return res.status(404).json({ message: 'Timesheet not found' });
    }

    // Check if user has permission to view this timesheet
    if (timesheet.userId._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(timesheet);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching timesheet', error: error.message });
  }
};

export const updateTimesheet = async (req, res) => {
  try {
    const { hours, notes } = req.body;
    const timesheet = await Timesheet.findById(req.params.id);

    if (!timesheet) {
      return res.status(404).json({ message: 'Timesheet not found' });
    }

    if (timesheet.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (timesheet.status !== 'pending') {
      return res.status(400).json({ message: 'Cannot update approved or rejected timesheet' });
    }

    timesheet.hours = hours || timesheet.hours;
    timesheet.notes = notes || timesheet.notes;
    await timesheet.save();

    res.json(timesheet);
  } catch (error) {
    res.status(500).json({ message: 'Error updating timesheet', error: error.message });
  }
};

export const reviewTimesheet = async (req, res) => {
  try {
    const { status, reviewNotes } = req.body;
    const timesheet = await Timesheet.findById(req.params.id)
      .populate('userId', 'email firstName lastName');

    if (!timesheet) {
      return res.status(404).json({ message: 'Timesheet not found' });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    timesheet.status = status;
    timesheet.reviewNotes = reviewNotes;
    timesheet.reviewedBy = req.user.id;
    timesheet.reviewDate = new Date();

    await timesheet.save();

    // Send email notification
    await sendEmail({
      to: timesheet.userId.email,
      ...emailTemplates.timesheetStatus(timesheet, status),
    });

    res.json(timesheet);
  } catch (error) {
    res.status(500).json({ message: 'Error reviewing timesheet', error: error.message });
  }
};

export const getTimesheetStats = async (req, res) => {
  try {
    const stats = await Timesheet.aggregate([
      {
        $match: {
          userId: req.user.id,
          createdAt: {
            $gte: new Date(new Date().setDate(new Date().getDate() - 30)) // Last 30 days
          }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalHours: { $sum: '$hours' }
        }
      }
    ]);

    const formattedStats = stats.reduce((acc, curr) => {
      acc[curr._id] = {
        count: curr.count,
        totalHours: curr.totalHours
      };
      return acc;
    }, {});

    res.json(formattedStats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching timesheet statistics', error: error.message });
  }
}; 