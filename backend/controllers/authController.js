const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Token generate karne ka helper
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { 
    expiresIn: '30d' 
  });
};

// ✅ REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Email already exist karta hai?
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'Email already registered' 
      });
    }

    // User banao
    const user = await User.create({ name, email, password });

    // Token banao
    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan
      }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // User dhundo — password bhi chahiye
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid email or password' 
      });
    }

    // Password match karo
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        message: 'Invalid email or password' 
      });
    }

    // Token banao
    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan
      }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ GET ME — Logged in user ki info
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const { name, avatar } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, avatar },
      { new: true }
    );

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};