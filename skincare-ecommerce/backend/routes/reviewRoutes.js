/**
 * Review Routes
 */

const express = require('express');
const router = express.Router();
const { getProductReviews, createReview, deleteReview } = require('../controllers/reviewController');
const { protect } = require('../config/authMiddleware');

router.get('/:productId', getProductReviews);
router.post('/', protect, createReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;
