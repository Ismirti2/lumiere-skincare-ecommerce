/**
 * Product Controller
 * CRUD operations for skincare products
 */

const Product = require('../models/Product');

/**
 * GET /api/products
 * Get all products with optional filtering
 */
const getProducts = async (req, res) => {
  try {
    const { category, skinType, featured, bestseller, search, sort, minPrice, maxPrice, page = 1, limit = 12 } = req.query;

    const query = {};

    // Filters
    if (category) query.category = category;
    if (skinType) query.skinType = { $in: [skinType, 'all'] };
    if (featured === 'true') query.featured = true;
    if (bestseller === 'true') query.bestseller = true;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) {
      query.$text = { $search: search };
    }

    // Sorting
    let sortOption = { createdAt: -1 };
    if (sort === 'price-asc')   sortOption = { price: 1 };
    if (sort === 'price-desc')  sortOption = { price: -1 };
    if (sort === 'rating')      sortOption = { rating: -1 };
    if (sort === 'bestseller')  sortOption = { bestseller: -1, rating: -1 };
    if (sort === 'newest')      sortOption = { createdAt: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(query);
    const products = await Product.find(query).sort(sortOption).skip(skip).limit(Number(limit));

    res.json({
      success: true,
      products,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        limit: Number(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch products.' });
  }
};

/**
 * GET /api/products/:id
 * Get single product by ID
 */
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch product.' });
  }
};

/**
 * POST /api/products
 * Create a new product (admin only)
 */
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, message: 'Product created!', product });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Failed to create product.' });
  }
};

/**
 * PUT /api/products/:id
 * Update a product (admin only)
 */
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }
    res.json({ success: true, message: 'Product updated!', product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update product.' });
  }
};

/**
 * DELETE /api/products/:id
 * Delete a product (admin only)
 */
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }
    res.json({ success: true, message: 'Product deleted!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete product.' });
  }
};

/**
 * GET /api/products/featured
 * Get featured products
 */
const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ featured: true }).limit(6);
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch featured products.' });
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct, getFeaturedProducts };
