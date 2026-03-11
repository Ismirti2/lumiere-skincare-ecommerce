/**
 * Lumière Skincare - Express Server
 * Main entry point for the backend API
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));

// ─── Database Connection ──────────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/skincare_ecommerce')
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/products',  require('./routes/productRoutes'));
app.use('/api/auth',      require('./routes/authRoutes'));
app.use('/api/cart',      require('./routes/cartRoutes'));
app.use('/api/orders',    require('./routes/orderRoutes'));
app.use('/api/reviews',   require('./routes/reviewRoutes'));
app.use('/api/contact',   require('./routes/contactRoutes'));

// ─── Catch-all: serve frontend HTML pages ────────────────────────────────────
// For routes like /products, /about etc (without .html), serve matching file
app.get('/:page', (req, res, next) => {
  const page = req.params.page;
  // Skip API routes and files with extensions
  if (page.includes('.') || page.startsWith('api')) return next();
  const htmlFile = path.join(__dirname, '../frontend', `${page}.html`);
  if (require('fs').existsSync(htmlFile)) {
    return res.sendFile(htmlFile);
  }
  next();
});

// Fallback to index
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// ─── Error Handler ────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🌸 Lumière Skincare API running on http://localhost:${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
});
