const express = require('express');
const router = express.Router();
const { Consultant, Profile } = require('../models');

// Get all consultants
router.get('/', async (req, res) => {
  try {
    const consultants = await Consultant.findAll({
      include: [Profile]
    });
    res.json(consultants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one consultant
router.get('/:id', async (req, res) => {
  try {
    const consultant = await Consultant.findByPk(req.params.id, {
      include: [Profile]
    });
    if (consultant) {
      res.json(consultant);
    } else {
      res.status(404).json({ message: 'Consultant not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create consultant
router.post('/', async (req, res) => {
  try {
    const consultant = await Consultant.create(req.body);
    if (req.body.profile) {
      await Profile.create({
        ...req.body.profile,
        consultantId: consultant.id
      });
    }
    const consultantWithProfile = await Consultant.findByPk(consultant.id, {
      include: [Profile]
    });
    res.status(201).json(consultantWithProfile);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update consultant
router.put('/:id', async (req, res) => {
  try {
    const consultant = await Consultant.findByPk(req.params.id);
    if (consultant) {
      await consultant.update(req.body);
      if (req.body.profile) {
        const profile = await Profile.findOne({ where: { consultantId: consultant.id } });
        if (profile) {
          await profile.update(req.body.profile);
        } else {
          await Profile.create({
            ...req.body.profile,
            consultantId: consultant.id
          });
        }
      }
      const updatedConsultant = await Consultant.findByPk(consultant.id, {
        include: [Profile]
      });
      res.json(updatedConsultant);
    } else {
      res.status(404).json({ message: 'Consultant not found' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete consultant
router.delete('/:id', async (req, res) => {
  try {
    const consultant = await Consultant.findByPk(req.params.id);
    if (consultant) {
      await consultant.destroy();
      res.json({ message: 'Consultant deleted' });
    } else {
      res.status(404).json({ message: 'Consultant not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 