const express = require('express');
const router = express.Router();
const { Assessment, Consultant, Client } = require('../models');

// Get all assessments
router.get('/', async (req, res) => {
  try {
    const assessments = await Assessment.findAll({
      include: [Consultant, Client]
    });
    res.json(assessments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one assessment
router.get('/:id', async (req, res) => {
  try {
    const assessment = await Assessment.findByPk(req.params.id, {
      include: [Consultant, Client]
    });
    if (assessment) {
      res.json(assessment);
    } else {
      res.status(404).json({ message: 'Assessment not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create assessment
router.post('/', async (req, res) => {
  try {
    const assessment = await Assessment.create(req.body);
    const assessmentWithRelations = await Assessment.findByPk(assessment.id, {
      include: [Consultant, Client]
    });
    res.status(201).json(assessmentWithRelations);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update assessment
router.put('/:id', async (req, res) => {
  try {
    const assessment = await Assessment.findByPk(req.params.id);
    if (assessment) {
      await assessment.update(req.body);
      const updatedAssessment = await Assessment.findByPk(assessment.id, {
        include: [Consultant, Client]
      });
      res.json(updatedAssessment);
    } else {
      res.status(404).json({ message: 'Assessment not found' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete assessment
router.delete('/:id', async (req, res) => {
  try {
    const assessment = await Assessment.findByPk(req.params.id);
    if (assessment) {
      await assessment.destroy();
      res.json({ message: 'Assessment deleted' });
    } else {
      res.status(404).json({ message: 'Assessment not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 