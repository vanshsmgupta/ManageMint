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

  newUserWelcome: (user, tempPassword) => ({
    subject: 'Welcome to Task Management System',
    html: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #6366f1;">Welcome to Task Management System! 🎉</h1>
          <p>Hello ${user.firstName},</p>
          <p>Your account has been created by the administrator. Here are your login credentials:</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Temporary Password:</strong> ${tempPassword}</p>
          </div>

          <p><strong>Important:</strong> For security reasons, please change your password after your first login.</p>
          
          <div style="margin: 25px 0;">
            <a href="${process.env.FRONTEND_URL}/login" 
               style="background-color: #6366f1; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Login to Your Account
            </a>
          </div>

          <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
          
          <hr style="border: 1px solid #eee; margin: 20px 0;">
          
          <p style="color: #666; font-size: 12px;">
            This is an automated message, please do not reply directly to this email.
          </p>
        </div>
      </body>
      </html>
    `,
  }),

  newMarketerWelcome: (marketer, tempPassword) => ({
    subject: 'Welcome to Task Management System - Marketing Team',
    html: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #6366f1;">Welcome to Our Marketing Team! 🚀</h1>
          <p>Hello ${marketer.name},</p>
          <p>Your marketer account has been created by the administrator. Here are your login credentials:</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Email:</strong> ${marketer.email}</p>
            <p><strong>Temporary Password:</strong> ${tempPassword}</p>
            <p><strong>Specialization:</strong> ${marketer.specialization}</p>
          </div>

          <p><strong>Important:</strong> For security reasons, please change your password after your first login.</p>
          
          <div style="margin: 25px 0;">
            <a href="${process.env.FRONTEND_URL}/login" 
               style="background-color: #6366f1; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Login to Your Account
            </a>
          </div>

          <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
          
          <hr style="border: 1px solid #eee; margin: 20px 0;">
          
          <p style="color: #666; font-size: 12px;">
            This is an automated message, please do not reply directly to this email.
          </p>
        </div>
      </body>
      </html>
    `,
  }),
}; 