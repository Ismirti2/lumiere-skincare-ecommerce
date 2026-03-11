/**
 * Contact Routes
 */

const express = require('express');
const router = express.Router();
const { submitMessage, getAllMessages } = require('../controllers/contactController');
const { protect, adminOnly } = require('../config/authMiddleware');

router.post('/', submitMessage);
router.get('/admin/all', protect, adminOnly, getAllMessages);

module.exports = router;
