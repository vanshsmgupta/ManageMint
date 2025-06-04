import Marketer from '../models/Marketer.js';
import { sendEmail, emailTemplates } from '../utils/emailService.js';
import crypto from 'crypto';

export const createMarketer = async (req, res) => {
  try {
    const { email, name, specialization } = req.body;

    // Check if marketer already exists
    const existingMarketer = await Marketer.findOne({ email });
    if (existingMarketer) {
      return res.status(400).json({ 
        message: 'Email already registered' 
      });
    }

    // Generate temporary password
    const tempPassword = crypto.randomBytes(4).toString('hex');

    const marketer = new Marketer({
      email,
      password: tempPassword,
      name,
      specialization,
      status: 'active',
      clients: 0,
      joinDate: new Date(),
    });

    await marketer.save();

    // Send welcome email with temporary password using the new template
    await sendEmail({
      to: email,
      ...emailTemplates.newMarketerWelcome(marketer, tempPassword)
    });

    // Return success but don't include the password in the response
    res.status(201).json({
      message: 'Marketer created successfully',
      marketer: {
        id: marketer._id,
        email: marketer.email,
        name: marketer.name,
        specialization: marketer.specialization,
        status: marketer.status,
        tempPassword: tempPassword // Include temporary password in response
      },
    });
  } catch (error) {
    console.error('Error creating marketer:', error);
    res.status(500).json({ 
      message: 'Error creating marketer', 
      error: error.message 
    });
  }
};

export const getAllMarketers = async (req, res) => {
  try {
    const marketers = await Marketer.find({}, '-password');
    res.json(marketers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching marketers', error: error.message });
  }
};

export const getMarketerById = async (req, res) => {
  try {
    const marketer = await Marketer.findById(req.params.id, '-password');
    if (!marketer) {
      return res.status(404).json({ message: 'Marketer not found' });
    }
    res.json(marketer);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching marketer', error: error.message });
  }
};

export const updateMarketer = async (req, res) => {
  try {
    const { name, specialization, status } = req.body;
    const marketer = await Marketer.findById(req.params.id);

    if (!marketer) {
      return res.status(404).json({ message: 'Marketer not found' });
    }

    marketer.name = name || marketer.name;
    marketer.specialization = specialization || marketer.specialization;
    marketer.status = status || marketer.status;

    await marketer.save();
    res.json(marketer);
  } catch (error) {
    res.status(500).json({ message: 'Error updating marketer', error: error.message });
  }
};

export const deleteMarketer = async (req, res) => {
  try {
    const marketer = await Marketer.findByIdAndDelete(req.params.id);
    if (!marketer) {
      return res.status(404).json({ message: 'Marketer not found' });
    }
    res.json({ message: 'Marketer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting marketer', error: error.message });
  }
}; 