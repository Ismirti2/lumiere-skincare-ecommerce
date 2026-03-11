/**
 * Product Model
 * Skincare product catalog with full details
 */

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required']
  },
  shortDescription: {
    type: String,
    maxlength: 150
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number // For showing discounts
  },
  image: {
    type: String,
    default: '/images/product-placeholder.jpg'
  },
  images: [String], // Multiple product images
  category: {
    type: String,
    enum: ['cleanser', 'toner', 'serum', 'moisturizer', 'sunscreen', 'mask', 'eye-care', 'exfoliator', 'oil', 'set'],
    required: true
  },
  skinType: [{
    type: String,
    enum: ['oily', 'dry', 'combination', 'sensitive', 'normal', 'all']
  }],
  ingredients: [String],
  howToUse: String,
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 100
  },
  featured: {
    type: Boolean,
    default: false
  },
  bestseller: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  tags: [String]
}, { timestamps: true });

// Index for search
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);
