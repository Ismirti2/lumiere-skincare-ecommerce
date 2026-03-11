/**
 * Auth Routes
 * POST /api/auth/register  - Register user
 * POST /api/auth/login     - Login user
 * GET  /api/auth/profile   - Get profile (protected)
 * PUT  /api/auth/profile   - Update profile (protected)
 */

const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile } = require('../controllers/authController');
const { protect } = require('../config/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

module.exports = router;
