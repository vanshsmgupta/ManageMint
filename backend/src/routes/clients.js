const express = require('express');
const router = express.Router();
const { Client, POC } = require('../models');

// Get all clients
router.get('/', async (req, res) => {
  try {
    const clients = await Client.findAll({
      include: [POC]
    });
    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one client
router.get('/:id', async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id, {
      include: [POC]
    });
    if (client) {
      res.json(client);
    } else {
      res.status(404).json({ message: 'Client not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create client
router.post('/', async (req, res) => {
  try {
    const client = await Client.create(req.body);
    if (req.body.pocs) {
      await Promise.all(
        req.body.pocs.map(poc => POC.create({ ...poc, clientId: client.id }))
      );
    }
    const clientWithPOCs = await Client.findByPk(client.id, {
      include: [POC]
    });
    res.status(201).json(clientWithPOCs);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update client
router.put('/:id', async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (client) {
      await client.update(req.body);
      const updatedClient = await Client.findByPk(client.id, {
        include: [POC]
      });
      res.json(updatedClient);
    } else {
      res.status(404).json({ message: 'Client not found' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete client
router.delete('/:id', async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (client) {
      await client.destroy();
      res.json({ message: 'Client deleted' });
    } else {
      res.status(404).json({ message: 'Client not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 