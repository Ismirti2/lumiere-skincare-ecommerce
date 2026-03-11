/**
 * Review Controller
 * Product reviews and ratings
 */

const Review = require('../models/Review');

/**
 * GET /api/reviews/:productId
 * Get all reviews for a product
 */
const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch reviews.' });
  }
};

/**
 * POST /api/reviews
 * Submit a product review (protected)
 */
const createReview = async (req, res) => {
  try {
    const { productId, rating, title, comment, skinType } = req.body;

    // Check for existing review
    const existing = await Review.findOne({ product: productId, user: req.user._id });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this product.' });
    }

    const review = await Review.create({
      product: productId,
      user: req.user._id,
      userName: req.user.name,
      rating,
      title,
      comment,
      skinType: skinType || req.user.skinType
    });

    res.status(201).json({ success: true, message: 'Review submitted!', review });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Failed to submit review.' });
  }
};

/**
 * DELETE /api/reviews/:id
 * Delete a review (owner or admin)
 */
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }
    await review.deleteOne();
    res.json({ success: true, message: 'Review deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete review.' });
  }
};

module.exports = { getProductReviews, createReview, deleteReview };
