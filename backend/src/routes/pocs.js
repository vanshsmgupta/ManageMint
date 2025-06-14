const express = require('express');
const router = express.Router();
const { POC, Client } = require('../models');

// Get all POCs
router.get('/', async (req, res) => {
  try {
    const pocs = await POC.findAll({
      include: [Client]
    });
    res.json(pocs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one POC
router.get('/:id', async (req, res) => {
  try {
    const poc = await POC.findByPk(req.params.id, {
      include: [Client]
    });
    if (poc) {
      res.json(poc);
    } else {
      res.status(404).json({ message: 'POC not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create POC
router.post('/', async (req, res) => {
  try {
    const poc = await POC.create(req.body);
    const pocWithClient = await POC.findByPk(poc.id, {
      include: [Client]
    });
    res.status(201).json(pocWithClient);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update POC
router.put('/:id', async (req, res) => {
  try {
    const poc = await POC.findByPk(req.params.id);
    if (poc) {
      await poc.update(req.body);
      const updatedPOC = await POC.findByPk(poc.id, {
        include: [Client]
      });
      res.json(updatedPOC);
    } else {
      res.status(404).json({ message: 'POC not found' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete POC
router.delete('/:id', async (req, res) => {
  try {
    const poc = await POC.findByPk(req.params.id);
    if (poc) {
      await poc.destroy();
      res.json({ message: 'POC deleted' });
    } else {
      res.status(404).json({ message: 'POC not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 