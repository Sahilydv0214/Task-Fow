const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  try {
    let token;

    // Token header mein hai?
    if (req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ 
        message: 'Please login first' 
      });
    }

    // Token verify karo
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // User dhundo
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      return res.status(401).json({ 
        message: 'User not found' 
      });
    }

    next();

  } catch (err) {
    res.status(401).json({ message: 'Not authorized' });
  }
};

// Role check middleware
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.memberRole)) {
      return res.status(403).json({ 
        message: 'Permission denied' 
      });
    }
    next();
  };
};