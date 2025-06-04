import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Update last active timestamp
    user.lastActive = new Date();
    await user.save();

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid authentication token' });
  }
};

export const checkRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Access denied: insufficient permissions' 
      });
    }
    next();
  };
};

export const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      message: 'Access denied: admin privileges required' 
    });
  }
  next();
};

export const isMarketer = (req, res, next) => {
  if (req.user.role !== 'marketer' && req.user.role !== 'admin') {
    return res.status(403).json({ 
      message: 'Access denied: marketer privileges required' 
    });
  }
  next();
};

export const isResourceOwner = (Model) => {
  return async (req, res, next) => {
    try {
      const resource = await Model.findById(req.params.id);
      
      if (!resource) {
        return res.status(404).json({ message: 'Resource not found' });
      }

      const isOwner = resource.userId?.toString() === req.user.id || 
                     resource.marketerId?.toString() === req.user.id ||
                     resource.organizer?.toString() === req.user.id;

      if (!isOwner && req.user.role !== 'admin') {
        return res.status(403).json({ 
          message: 'Access denied: not resource owner' 
        });
      }

      req.resource = resource;
      next();
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };
}; 