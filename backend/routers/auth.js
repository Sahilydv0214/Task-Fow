const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  getMe,
  updateProfile 
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public routes — koi bhi access kar sakta hai
router.post('/register', register);
router.post('/login', login);

// Protected routes — sirf logged in user
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

module.exports = router;