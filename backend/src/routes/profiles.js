const express = require('express');
const router = express.Router();
const { Profile, Consultant } = require('../models');

// Get all profiles
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.findAll({
      include: [Consultant]
    });
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one profile
router.get('/:id', async (req, res) => {
  try {
    const profile = await Profile.findByPk(req.params.id, {
      include: [Consultant]
    });
    if (profile) {
      res.json(profile);
    } else {
      res.status(404).json({ message: 'Profile not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create profile
router.post('/', async (req, res) => {
  try {
    const profile = await Profile.create(req.body);
    const profileWithConsultant = await Profile.findByPk(profile.id, {
      include: [Consultant]
    });
    res.status(201).json(profileWithConsultant);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update profile
router.put('/:id', async (req, res) => {
  try {
    const profile = await Profile.findByPk(req.params.id);
    if (profile) {
      await profile.update(req.body);
      const updatedProfile = await Profile.findByPk(profile.id, {
        include: [Consultant]
      });
      res.json(updatedProfile);
    } else {
      res.status(404).json({ message: 'Profile not found' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete profile
router.delete('/:id', async (req, res) => {
  try {
    const profile = await Profile.findByPk(req.params.id);
    if (profile) {
      await profile.destroy();
      res.json({ message: 'Profile deleted' });
    } else {
      res.status(404).json({ message: 'Profile not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 