/**
 * Cart Routes
 * Cart is primarily managed client-side (localStorage)
 * This endpoint validates cart items server-side
 */

const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

/**
 * POST /api/cart/validate
 * Validate cart items (check stock, prices)
 */
router.post('/validate', async (req, res) => {
  try {
    const { items } = req.body;
    const validatedItems = [];
    const issues = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        issues.push(`Product "${item.name}" is no longer available.`);
        continue;
      }
      if (product.stock < item.quantity) {
        issues.push(`Only ${product.stock} units of "${product.name}" available.`);
      }
      validatedItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: Math.min(item.quantity, product.stock),
        stock: product.stock
      });
    }

    res.json({ success: true, items: validatedItems, issues });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Cart validation failed.' });
  }
});

module.exports = router;
