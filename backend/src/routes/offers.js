const express = require('express');
const router = express.Router();
const { Offer, Consultant, Client, Vendor, Marketer } = require('../models');

// Get all offers
router.get('/', async (req, res) => {
  try {
    const offers = await Offer.findAll({
      include: [Consultant, Client, Vendor, Marketer]
    });
    res.json(offers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one offer
router.get('/:id', async (req, res) => {
  try {
    const offer = await Offer.findByPk(req.params.id, {
      include: [Consultant, Client, Vendor, Marketer]
    });
    if (offer) {
      res.json(offer);
    } else {
      res.status(404).json({ message: 'Offer not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create offer
router.post('/', async (req, res) => {
  try {
    const offer = await Offer.create(req.body);
    const offerWithRelations = await Offer.findByPk(offer.id, {
      include: [Consultant, Client, Vendor, Marketer]
    });
    res.status(201).json(offerWithRelations);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update offer
router.put('/:id', async (req, res) => {
  try {
    const offer = await Offer.findByPk(req.params.id);
    if (offer) {
      await offer.update(req.body);
      const updatedOffer = await Offer.findByPk(offer.id, {
        include: [Consultant, Client, Vendor, Marketer]
      });
      res.json(updatedOffer);
    } else {
      res.status(404).json({ message: 'Offer not found' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete offer
router.delete('/:id', async (req, res) => {
  try {
    const offer = await Offer.findByPk(req.params.id);
    if (offer) {
      await offer.destroy();
      res.json({ message: 'Offer deleted' });
    } else {
      res.status(404).json({ message: 'Offer not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 