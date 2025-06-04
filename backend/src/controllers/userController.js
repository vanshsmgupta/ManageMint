import User from '../models/User.js';
import { sendEmail, emailTemplates } from '../utils/emailService.js';
import crypto from 'crypto';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id, '-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const updates = req.body;
    const userId = req.params.id;

    // Ensure only admins can update role
    if (updates.role && req.user.role !== 'admin') {
      delete updates.role;
    }

    // Remove sensitive fields
    delete updates.password;
    delete updates.resetPasswordToken;
    delete updates.resetPasswordExpires;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const { email, firstName, lastName, role, dateOfBirth } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'Email already registered' 
      });
    }

    // Generate temporary password
    const tempPassword = crypto.randomBytes(4).toString('hex');

    const user = new User({
      email,
      password: tempPassword, // This will be automatically hashed by the User model
      firstName,
      lastName,
      role,
      dateOfBirth,
      joiningDate: new Date(),
    });

    await user.save();

    // Send welcome email with temporary password
    await sendEmail({
      to: email,
      subject: 'Welcome to Task Management System',
      html: `
        <h1>Welcome ${firstName}!</h1>
        <p>Your account has been created successfully.</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Temporary Password:</strong> ${tempPassword}</p>
        <p>Please change your password after your first login for security purposes.</p>
        <p>You can log in at: ${process.env.FRONTEND_URL || 'http://localhost:5173'}</p>
      `,
    });

    // Return success but don't include the password in the response
    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        tempPassword: tempPassword // Include temporary password in response
      },
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ 
      message: 'Error creating user', 
      error: error.message 
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    const userId = req.user.id;

    // Remove sensitive fields
    delete updates.password;
    delete updates.role;
    delete updates.resetPasswordToken;
    delete updates.resetPasswordExpires;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

export const getUserStats = async (req, res) => {
  try {
    const stats = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
          activeUsers: {
            $sum: {
              $cond: [
                { $gt: ['$lastActive', new Date(Date.now() - 24 * 60 * 60 * 1000)] },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    const totalUsers = stats.reduce((acc, curr) => acc + curr.count, 0);
    const activeUsers = stats.reduce((acc, curr) => acc + curr.activeUsers, 0);

    res.json({
      total: totalUsers,
      active: activeUsers,
      byRole: stats.reduce((acc, curr) => {
        acc[curr._id] = {
          total: curr.count,
          active: curr.activeUsers
        };
        return acc;
      }, {})
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user statistics', error: error.message });
  }
}; 