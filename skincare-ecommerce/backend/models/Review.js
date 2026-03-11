/**
 * Review Model
 * Customer product reviews and ratings
 */

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: String, // Cached for display
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5
  },
  title: {
    type: String,
    maxlength: 100
  },
  comment: {
    type: String,
    required: [true, 'Review comment is required'],
    maxlength: 1000
  },
  skinType: String, // Reviewer's skin type for context
  verified: {
    type: Boolean,
    default: false // True if user has ordered the product
  },
  helpful: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// One review per user per product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// After saving a review, update product's average rating
reviewSchema.post('save', async function() {
  const Product = require('./Product');
  const Review = this.constructor;

  const stats = await Review.aggregate([
    { $match: { product: this.product } },
    { $group: { _id: '$product', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(this.product, {
      rating: Math.round(stats[0].avgRating * 10) / 10,
      reviewCount: stats[0].count
    });
  }
});

module.exports = mongoose.model('Review', reviewSchema);
