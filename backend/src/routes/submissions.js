const express = require('express');
const router = express.Router();
const { Submission, Consultant, Client, Vendor, POC, Marketer } = require('../models');

// Get all submissions
router.get('/', async (req, res) => {
  try {
    const submissions = await Submission.findAll({
      include: [Consultant, Client, Vendor, POC, Marketer]
    });
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one submission
router.get('/:id', async (req, res) => {
  try {
    const submission = await Submission.findByPk(req.params.id, {
      include: [Consultant, Client, Vendor, POC, Marketer]
    });
    if (submission) {
      res.json(submission);
    } else {
      res.status(404).json({ message: 'Submission not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create submission
router.post('/', async (req, res) => {
  try {
    const submission = await Submission.create(req.body);
    const submissionWithRelations = await Submission.findByPk(submission.id, {
      include: [Consultant, Client, Vendor, POC, Marketer]
    });
    res.status(201).json(submissionWithRelations);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update submission
router.put('/:id', async (req, res) => {
  try {
    const submission = await Submission.findByPk(req.params.id);
    if (submission) {
      await submission.update(req.body);
      const updatedSubmission = await Submission.findByPk(submission.id, {
        include: [Consultant, Client, Vendor, POC, Marketer]
      });
      res.json(updatedSubmission);
    } else {
      res.status(404).json({ message: 'Submission not found' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete submission
router.delete('/:id', async (req, res) => {
  try {
    const submission = await Submission.findByPk(req.params.id);
    if (submission) {
      await submission.destroy();
      res.json({ message: 'Submission deleted' });
    } else {
      res.status(404).json({ message: 'Submission not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 