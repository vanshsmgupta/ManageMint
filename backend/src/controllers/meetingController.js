import Meeting from '../models/Meeting.js';
import { sendEmail, emailTemplates } from '../utils/emailService.js';
import User from '../models/User.js';

export const createMeeting = async (req, res) => {
  try {
    const {
      title,
      description,
      startTime,
      endTime,
      participants,
      meetingLink,
      location,
      reminders
    } = req.body;

    const meeting = new Meeting({
      title,
      description,
      startTime,
      endTime,
      participants,
      organizer: req.user.id,
      meetingLink,
      location,
      reminders
    });

    await meeting.save();

    // Fetch participant emails
    const participantUsers = await User.find(
      { _id: { $in: participants } },
      'email firstName lastName'
    );

    // Send meeting invitations
    for (const participant of participantUsers) {
      await sendEmail({
        to: participant.email,
        ...emailTemplates.meetingInvitation(meeting),
      });
    }

    res.status(201).json(meeting);
  } catch (error) {
    res.status(500).json({ message: 'Error creating meeting', error: error.message });
  }
};

export const getMeetings = async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    const query = {
      $or: [
        { organizer: req.user.id },
        { participants: req.user.id }
      ]
    };

    if (status) {
      query.status = status;
    }

    if (startDate || endDate) {
      query.startTime = {};
      if (startDate) query.startTime.$gte = new Date(startDate);
      if (endDate) query.startTime.$lte = new Date(endDate);
    }

    const meetings = await Meeting.find(query)
      .sort({ startTime: 1 })
      .populate('organizer', 'firstName lastName email')
      .populate('participants', 'firstName lastName email');

    res.json(meetings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching meetings', error: error.message });
  }
};

export const getMeetingById = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id)
      .populate('organizer', 'firstName lastName email')
      .populate('participants', 'firstName lastName email');

    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    // Check if user has permission to view this meeting
    const isParticipant = meeting.participants.some(p => p._id.toString() === req.user.id);
    if (meeting.organizer._id.toString() !== req.user.id && !isParticipant) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(meeting);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching meeting', error: error.message });
  }
};

export const updateMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    if (meeting.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updates = req.body;
    const updatedMeeting = await Meeting.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    )
      .populate('organizer', 'firstName lastName email')
      .populate('participants', 'firstName lastName email');

    // Notify participants of changes
    const participantEmails = updatedMeeting.participants.map(p => p.email);
    for (const email of participantEmails) {
      await sendEmail({
        to: email,
        subject: 'Meeting Updated',
        html: `
          <h1>Meeting Update: ${updatedMeeting.title}</h1>
          <p>The meeting details have been updated:</p>
          <p><strong>New Start Time:</strong> ${updatedMeeting.startTime.toLocaleString()}</p>
          <p><strong>New End Time:</strong> ${updatedMeeting.endTime.toLocaleString()}</p>
          ${updatedMeeting.meetingLink ? `<p><strong>Meeting Link:</strong> ${updatedMeeting.meetingLink}</p>` : ''}
          ${updatedMeeting.location ? `<p><strong>Location:</strong> ${updatedMeeting.location}</p>` : ''}
        `,
      });
    }

    res.json(updatedMeeting);
  } catch (error) {
    res.status(500).json({ message: 'Error updating meeting', error: error.message });
  }
};

export const deleteMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id)
      .populate('participants', 'email');

    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    if (meeting.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Notify participants
    const participantEmails = meeting.participants.map(p => p.email);
    for (const email of participantEmails) {
      await sendEmail({
        to: email,
        subject: 'Meeting Cancelled',
        html: `
          <h1>Meeting Cancelled: ${meeting.title}</h1>
          <p>The meeting scheduled for ${meeting.startTime.toLocaleString()} has been cancelled.</p>
        `,
      });
    }

    await meeting.remove();
    res.json({ message: 'Meeting deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting meeting', error: error.message });
  }
};

export const getMeetingStats = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const stats = await Meeting.aggregate([
      {
        $match: {
          $or: [
            { organizer: req.user.id },
            { participants: req.user.id }
          ],
          startTime: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalDuration: {
            $sum: {
              $divide: [
                { $subtract: ['$endTime', '$startTime'] },
                60000 // Convert to minutes
              ]
            }
          }
        }
      }
    ]);

    const formattedStats = stats.reduce((acc, curr) => {
      acc[curr._id] = {
        count: curr.count,
        totalDuration: Math.round(curr.totalDuration)
      };
      return acc;
    }, {});

    res.json(formattedStats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching meeting statistics', error: error.message });
  }
}; 