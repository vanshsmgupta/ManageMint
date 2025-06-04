import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      html,
    });
    return info;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};

export const emailTemplates = {
  welcomeEmail: (user) => ({
    subject: 'Welcome to Task Management System',
    html: `
      <h1>Welcome ${user.firstName}!</h1>
      <p>We're excited to have you on board. Here are some quick links to get you started:</p>
      <ul>
        <li><a href="${process.env.FRONTEND_URL}/dashboard">Dashboard</a></li>
        <li><a href="${process.env.FRONTEND_URL}/profile">Complete your profile</a></li>
      </ul>
      <p>If you have any questions, feel free to reach out to our support team.</p>
    `,
  }),

  resetPassword: (token) => ({
    subject: 'Password Reset Request',
    html: `
      <h1>Reset Your Password</h1>
      <p>You requested to reset your password. Click the link below to proceed:</p>
      <a href="${process.env.FRONTEND_URL}/reset-password?token=${token}">Reset Password</a>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  }),

  meetingInvitation: (meeting) => ({
    subject: `Meeting Invitation: ${meeting.title}`,
    html: `
      <h1>${meeting.title}</h1>
      <p><strong>When:</strong> ${meeting.startTime.toLocaleString()}</p>
      <p><strong>Duration:</strong> ${
        (meeting.endTime - meeting.startTime) / (1000 * 60)
      } minutes</p>
      ${meeting.description ? `<p>${meeting.description}</p>` : ''}
      ${
        meeting.meetingLink
          ? `<p><a href="${meeting.meetingLink}">Join Meeting</a></p>`
          : ''
      }
    `,
  }),

  newOffer: (offer) => ({
    subject: 'New Offer Available',
    html: `
      <h1>${offer.title}</h1>
      <p>${offer.description}</p>
      <p><strong>Valid until:</strong> ${offer.validUntil.toLocaleDateString()}</p>
      <a href="${process.env.FRONTEND_URL}/offers/${offer.id}">View Offer</a>
    `,
  }),

  timesheetStatus: (timesheet, status) => ({
    subject: `Timesheet ${status.charAt(0).toUpperCase() + status.slice(1)}`,
    html: `
      <h1>Timesheet Update</h1>
      <p>Your timesheet for the period ${timesheet.startDate.toLocaleDateString()} to ${timesheet.endDate.toLocaleDateString()} has been ${status}.</p>
      ${
        timesheet.reviewNotes
          ? `<p><strong>Notes:</strong> ${timesheet.reviewNotes}</p>`
          : ''
      }
      <a href="${process.env.FRONTEND_URL}/timesheets/${
      timesheet.id
    }">View Timesheet</a>
    `,
  }),
}; 