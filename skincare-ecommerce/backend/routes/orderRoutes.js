/**
 * Order Routes
 */

const express = require('express');
const router = express.Router();
const { placeOrder, getUserOrders, getOrderById, getAllOrders } = require('../controllers/orderController');
const { protect, adminOnly } = require('../config/authMiddleware');

router.post('/', protect, placeOrder);
router.get('/my-orders', protect, getUserOrders);
router.get('/admin/all', protect, adminOnly, getAllOrders);
router.get('/:id', protect, getOrderById);

module.exports = router;
