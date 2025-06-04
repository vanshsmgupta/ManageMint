import Offer from '../models/Offer.js';

// Get all offers for the current user
export const getOffers = async (req, res) => {
  try {
    const offers = await Offer.find({ userId: req.user.id });
    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching offers', error: error.message });
  }
};

// Get all generated offers for the current marketer
export const getGeneratedOffers = async (req, res) => {
  try {
    const offers = await Offer.find({ marketerId: req.user.id })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching generated offers', error: error.message });
  }
};

// Get a single offer by ID
export const getOfferById = async (req, res) => {
  try {
    const offer = await Offer.findOne({
      _id: req.params.id,
      $or: [{ userId: req.user.id }, { marketerId: req.user.id }]
    }).populate('userId', 'name email');
    
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }
    res.json(offer);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching offer', error: error.message });
  }
};

// Generate a new offer
export const generateOffer = async (req, res) => {
  try {
    const {
      consultantName,
      client,
      vendor,
      marketer,
      inhouseEngineer,
      technology,
      startDate,
      endDate,
      resume
    } = req.body;

    const offer = new Offer({
      consultantName,
      client,
      vendor,
      marketer,
      marketerId: req.user.id,
      inhouseEngineer,
      userId: inhouseEngineer, // The selected user's ID
      technology,
      startDate,
      endDate,
      resume,
      status: 'pending'
    });

    await offer.save();
    res.status(201).json(offer);
  } catch (error) {
    res.status(500).json({ message: 'Error generating offer', error: error.message });
  }
};

// Update an offer
export const updateOffer = async (req, res) => {
  try {
    const offer = await Offer.findOneAndUpdate(
      { 
        _id: req.params.id,
        $or: [{ userId: req.user.id }, { marketerId: req.user.id }]
      },
      req.body,
      { new: true }
    );
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }
    res.json(offer);
  } catch (error) {
    res.status(500).json({ message: 'Error updating offer', error: error.message });
  }
};

// Delete an offer
export const deleteOffer = async (req, res) => {
  try {
    const offer = await Offer.findOneAndDelete({
      _id: req.params.id,
      marketerId: req.user.id
    });
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }
    res.json({ message: 'Offer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting offer', error: error.message });
  }
};

// Accept an offer
export const acceptOffer = async (req, res) => {
  try {
    const offer = await Offer.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id, status: 'pending' },
      { status: 'ongoing' },
      { new: true }
    );
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found or not in pending state' });
    }
    res.json(offer);
  } catch (error) {
    res.status(500).json({ message: 'Error accepting offer', error: error.message });
  }
};

// Reject an offer
export const rejectOffer = async (req, res) => {
  try {
    const offer = await Offer.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id, status: 'pending' },
      { status: 'rejected' },
      { new: true }
    );
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found or not in pending state' });
    }
    res.json(offer);
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting offer', error: error.message });
  }
};

// Mark an offer as done
export const markOfferAsDone = async (req, res) => {
  try {
    const offer = await Offer.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id, status: 'ongoing' },
      { status: 'completed', endDate: new Date() },
      { new: true }
    );
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found or not in ongoing state' });
    }
    res.json(offer);
  } catch (error) {
    res.status(500).json({ message: 'Error completing offer', error: error.message });
  }
}; 