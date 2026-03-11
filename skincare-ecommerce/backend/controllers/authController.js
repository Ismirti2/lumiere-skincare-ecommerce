/**
 * Auth Controller
 * Handles user registration, login, and profile
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d'
  });
};

/**
 * POST /api/auth/register
 * Register a new user
 */
const register = async (req, res) => {
  try {
    const { name, email, password, skinType } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    // Create new user (password hashed in model pre-save)
    const user = await User.create({ name, email, password, skinType });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        skinType: user.skinType,
        role: user.role
      }
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Registration failed. Please try again.' });
  }
};

/**
 * POST /api/auth/login
 * Log in existing user
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    // Find user (include password for comparison)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Logged in successfully!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        skinType: user.skinType,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Login failed. Please try again.' });
  }
};

/**
 * GET /api/auth/profile
 * Get current user profile (protected)
 */
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch profile.' });
  }
};

/**
 * PUT /api/auth/profile
 * Update user profile (protected)
 */
const updateProfile = async (req, res) => {
  try {
    const { name, skinType } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, skinType },
      { new: true, runValidators: true }
    );
    res.json({ success: true, message: 'Profile updated!', user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update profile.' });
  }
};

module.exports = { register, login, getProfile, updateProfile };
