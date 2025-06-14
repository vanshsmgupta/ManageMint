const express = require('express');
const router = express.Router();
const { IP } = require('../models');

// Get all IPs
router.get('/', async (req, res) => {
  try {
    const ips = await IP.findAll();
    res.json(ips);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one IP
router.get('/:id', async (req, res) => {
  try {
    const ip = await IP.findByPk(req.params.id);
    if (ip) {
      res.json(ip);
    } else {
      res.status(404).json({ message: 'IP not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create IP
router.post('/', async (req, res) => {
  try {
    const ip = await IP.create(req.body);
    res.status(201).json(ip);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update IP
router.put('/:id', async (req, res) => {
  try {
    const ip = await IP.findByPk(req.params.id);
    if (ip) {
      await ip.update(req.body);
      res.json(ip);
    } else {
      res.status(404).json({ message: 'IP not found' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete IP
router.delete('/:id', async (req, res) => {
  try {
    const ip = await IP.findByPk(req.params.id);
    if (ip) {
      await ip.destroy();
      res.json({ message: 'IP deleted' });
    } else {
      res.status(404).json({ message: 'IP not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 