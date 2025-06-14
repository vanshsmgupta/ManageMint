const express = require('express');
const router = express.Router();
const { Marketer } = require('../models');

// Get all marketers
router.get('/', async (req, res) => {
  try {
    const marketers = await Marketer.findAll();
    res.json(marketers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one marketer
router.get('/:id', async (req, res) => {
  try {
    const marketer = await Marketer.findByPk(req.params.id);
    if (marketer) {
      res.json(marketer);
    } else {
      res.status(404).json({ message: 'Marketer not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create marketer
router.post('/', async (req, res) => {
  try {
    const marketer = await Marketer.create(req.body);
    res.status(201).json(marketer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update marketer
router.put('/:id', async (req, res) => {
  try {
    const marketer = await Marketer.findByPk(req.params.id);
    if (marketer) {
      await marketer.update(req.body);
      res.json(marketer);
    } else {
      res.status(404).json({ message: 'Marketer not found' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete marketer
router.delete('/:id', async (req, res) => {
  try {
    const marketer = await Marketer.findByPk(req.params.id);
    if (marketer) {
      await marketer.destroy();
      res.json({ message: 'Marketer deleted' });
    } else {
      res.status(404).json({ message: 'Marketer not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 