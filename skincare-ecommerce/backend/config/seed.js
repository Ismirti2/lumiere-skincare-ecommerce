/**
 * Database Seed File
 * Populates the database with sample products and data
 * Run: node config/seed.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });

const Product = require('../models/Product');

const sampleProducts = [
  {
    name: 'Radiance Vitamin C Serum',
    shortDescription: 'Brightening serum with 15% Vitamin C complex',
    description: 'Our award-winning Vitamin C serum delivers a potent 15% Vitamin C complex that visibly brightens skin tone, fades dark spots, and boosts collagen production. Formulated with ferulic acid and vitamin E for maximum antioxidant protection.',
    price: 48.00,
    originalPrice: 65.00,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80',
    category: 'serum',
    skinType: ['all'],
    featured: true,
    bestseller: true,
    stock: 150,
    ingredients: ['15% Vitamin C (L-Ascorbic Acid)', 'Ferulic Acid', 'Vitamin E', 'Hyaluronic Acid', 'Niacinamide'],
    howToUse: 'Apply 3-4 drops to cleansed face in the morning. Follow with moisturizer and SPF.',
    rating: 4.8,
    reviewCount: 234,
    tags: ['brightening', 'anti-aging', 'vitamin-c', 'bestseller']
  },
  {
    name: 'Hydra-Burst Moisturizer',
    shortDescription: 'Deep hydration for all skin types',
    description: 'A luxurious, lightweight gel-cream that delivers 72-hour hydration. Infused with hyaluronic acid, ceramides, and plant-based squalane to restore the skin barrier and lock in moisture without clogging pores.',
    price: 42.00,
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&q=80',
    category: 'moisturizer',
    skinType: ['all', 'dry', 'combination'],
    featured: true,
    bestseller: true,
    stock: 200,
    ingredients: ['Hyaluronic Acid', 'Ceramides', 'Squalane', 'Peptides', 'Aloe Vera'],
    howToUse: 'Apply morning and evening to clean skin. Gently massage in upward circular motions.',
    rating: 4.9,
    reviewCount: 412,
    tags: ['hydrating', 'moisturizer', 'bestseller', 'all-skin-types']
  },
  {
    name: 'Gentle Foam Cleanser',
    shortDescription: 'pH-balanced cleansing without stripping',
    description: 'A sulfate-free, pH-balanced foam cleanser that removes makeup, dirt, and excess oil while maintaining your skin\'s natural moisture barrier. Enriched with green tea extract and centella asiatica for added skin benefits.',
    price: 28.00,
    image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&q=80',
    category: 'cleanser',
    skinType: ['sensitive', 'normal', 'combination', 'dry'],
    featured: false,
    bestseller: true,
    stock: 300,
    ingredients: ['Green Tea Extract', 'Centella Asiatica', 'Glycerin', 'Allantoin', 'Panthenol'],
    howToUse: 'Wet face, apply a small amount, massage gently, rinse with lukewarm water. Use morning and evening.',
    rating: 4.7,
    reviewCount: 198,
    tags: ['cleanser', 'gentle', 'sensitive-skin', 'sulfate-free']
  },
  {
    name: 'SPF 50 Daily Sunscreen',
    shortDescription: 'Invisible mineral + chemical UV protection',
    description: 'A weightless, non-greasy sunscreen with broad-spectrum SPF 50 PA++++. Our hybrid mineral-chemical formula blends seamlessly into skin, leaving no white cast. Enriched with niacinamide for brightening and antioxidants for environmental protection.',
    price: 35.00,
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&q=80',
    category: 'sunscreen',
    skinType: ['all'],
    featured: true,
    bestseller: false,
    stock: 180,
    ingredients: ['Zinc Oxide', 'Octinoxate', 'Niacinamide', 'Vitamin E', 'Green Tea Extract'],
    howToUse: 'Apply as the last step of your morning routine. Reapply every 2 hours when outdoors.',
    rating: 4.6,
    reviewCount: 156,
    tags: ['sunscreen', 'spf50', 'daily', 'no-white-cast']
  },
  {
    name: 'Retinol Night Renewal Cream',
    shortDescription: 'Encapsulated retinol for gentle anti-aging',
    description: 'Our signature night cream features encapsulated retinol (0.3%) for a gentle yet effective anti-aging experience. Paired with bakuchiol, peptides, and nourishing oils to minimize irritation while maximizing results. Wake up to visibly smoother, firmer skin.',
    price: 58.00,
    originalPrice: 75.00,
    image: 'https://images.unsplash.com/photo-1601371535879-0955b0b27e73?w=600&q=80',
    category: 'moisturizer',
    skinType: ['normal', 'oily', 'combination'],
    featured: true,
    bestseller: false,
    stock: 120,
    ingredients: ['Encapsulated Retinol 0.3%', 'Bakuchiol', 'Peptides', 'Rosehip Oil', 'Squalane'],
    howToUse: 'Apply a pea-sized amount to clean, dry face at night. Start 2-3x per week, build up gradually.',
    rating: 4.7,
    reviewCount: 89,
    tags: ['retinol', 'anti-aging', 'night-cream', 'firming']
  },
  {
    name: 'Rose Petal Toner',
    shortDescription: 'Hydrating floral toner with BHA',
    description: 'A delicate rose-infused toner with 1% BHA (salicylic acid) to gently exfoliate, minimize pores, and prep skin for better absorption of serums. Rose water and hyaluronic acid provide immediate hydration and a dewy glow.',
    price: 32.00,
    image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&q=80',
    category: 'toner',
    skinType: ['oily', 'combination', 'normal'],
    featured: false,
    bestseller: true,
    stock: 250,
    ingredients: ['Rose Water', '1% Salicylic Acid', 'Hyaluronic Acid', 'Centella Asiatica', 'Glycerin'],
    howToUse: 'After cleansing, apply to a cotton pad or directly to face. Pat gently, do not rinse.',
    rating: 4.8,
    reviewCount: 267,
    tags: ['toner', 'rose', 'bha', 'pore-minimizing']
  },
  {
    name: 'Kaolin Clay Purifying Mask',
    shortDescription: 'Deep-cleansing mask for congested skin',
    description: 'Our weekly deep-cleanse mask combines kaolin and bentonite clay with activated charcoal to draw out impurities, absorb excess oil, and refine pores. Tea tree and neem extracts provide antibacterial benefits, while aloe vera soothes.',
    price: 38.00,
    image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=600&q=80',
    category: 'mask',
    skinType: ['oily', 'combination'],
    featured: false,
    bestseller: false,
    stock: 140,
    ingredients: ['Kaolin Clay', 'Bentonite Clay', 'Activated Charcoal', 'Tea Tree Oil', 'Aloe Vera'],
    howToUse: 'Apply a thin layer to clean skin. Leave on for 10-15 minutes. Rinse thoroughly. Use 1-2x per week.',
    rating: 4.5,
    reviewCount: 78,
    tags: ['mask', 'clay', 'pore-cleansing', 'oily-skin']
  },
  {
    name: 'Peptide Eye Cream',
    shortDescription: 'Targets dark circles, puffiness & fine lines',
    description: 'A concentrated eye treatment with five types of peptides to firm, smooth, and brighten the delicate eye area. Caffeine reduces puffiness and dark circles, while ceramides strengthen the skin barrier. Cooling metal applicator included.',
    price: 52.00,
    image: 'https://images.unsplash.com/photo-1643185540226-29f4b38a4bb1?w=600&q=80',
    category: 'eye-care',
    skinType: ['all'],
    featured: true,
    bestseller: false,
    stock: 90,
    ingredients: ['5 Peptide Complex', 'Caffeine', 'Ceramides', 'Vitamin K', 'Hyaluronic Acid'],
    howToUse: 'Gently pat a small amount around the eye area morning and evening using ring finger.',
    rating: 4.6,
    reviewCount: 112,
    tags: ['eye-cream', 'peptides', 'dark-circles', 'anti-aging']
  },
  {
    name: 'Niacinamide 10% Pore Serum',
    shortDescription: 'Minimizes pores & controls oil production',
    description: 'A targeted serum with 10% niacinamide (vitamin B3) to visibly minimize enlarged pores, regulate sebum production, and improve skin texture. Zinc PCA controls breakouts while zinc helps reduce inflammation. Lightweight, water-gel formula.',
    price: 36.00,
    image: 'https://images.unsplash.com/photo-1631390285554-0bb3c5d7d5a1?w=600&q=80',
    category: 'serum',
    skinType: ['oily', 'combination'],
    featured: false,
    bestseller: true,
    stock: 200,
    ingredients: ['10% Niacinamide', 'Zinc PCA', 'Hyaluronic Acid', 'Panthenol', 'Glycerin'],
    howToUse: 'Apply a few drops to clean skin before moisturizer, morning and/or evening.',
    rating: 4.9,
    reviewCount: 345,
    tags: ['niacinamide', 'pore-minimizing', 'oily-skin', 'bestseller']
  },
  {
    name: 'Complete Glow Starter Kit',
    shortDescription: 'The perfect beginner skincare routine set',
    description: 'Everything you need to start your glow journey. This curated 4-piece set includes our bestselling Gentle Foam Cleanser, Rose Petal Toner, Hydra-Burst Moisturizer, and SPF 50 Daily Sunscreen — all in travel-friendly sizes.',
    price: 75.00,
    originalPrice: 99.00,
    image: 'https://images.unsplash.com/photo-1586495777744-4e6232bf2b12?w=600&q=80',
    category: 'set',
    skinType: ['all'],
    featured: true,
    bestseller: true,
    stock: 60,
    ingredients: [],
    howToUse: 'Use cleanser, toner, moisturizer in morning and evening. Apply sunscreen every morning.',
    rating: 4.9,
    reviewCount: 189,
    tags: ['set', 'starter-kit', 'gift', 'bestseller', 'value']
  },
  {
    name: 'AHA/BHA Exfoliating Toner',
    shortDescription: 'Chemical exfoliant for smooth, radiant skin',
    description: 'A gentle yet effective chemical exfoliant with 5% AHA and 2% BHA to slough away dead skin cells, unclog pores, and reveal brighter, smoother skin. Formulated with calming witch hazel and aloe vera for a balanced formula.',
    price: 40.00,
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&q=80',
    category: 'exfoliator',
    skinType: ['normal', 'oily', 'combination'],
    featured: false,
    bestseller: false,
    stock: 110,
    ingredients: ['5% Glycolic Acid (AHA)', '2% Salicylic Acid (BHA)', 'Witch Hazel', 'Aloe Vera', 'Glycerin'],
    howToUse: 'Apply to clean skin with a cotton pad, 2-3x per week in the evening. Do not rinse. Always follow with SPF in the morning.',
    rating: 4.7,
    reviewCount: 134,
    tags: ['exfoliator', 'aha', 'bha', 'texture-smoothing']
  },
  {
    name: 'Bakuchiol Facial Oil',
    shortDescription: 'Plant-based retinol alternative in a luxe oil',
    description: 'A sumptuous facial oil featuring bakuchiol — the natural, gentle alternative to retinol — combined with rosehip, marula, and jojoba oils. Clinically shown to reduce fine lines and improve elasticity without irritation. Perfect for sensitive and dry skin types.',
    price: 55.00,
    image: 'https://images.unsplash.com/photo-1570194065650-d99fb4b8ccb0?w=600&q=80',
    category: 'oil',
    skinType: ['dry', 'sensitive', 'normal'],
    featured: false,
    bestseller: false,
    stock: 85,
    ingredients: ['Bakuchiol', 'Rosehip Oil', 'Marula Oil', 'Jojoba Oil', 'Vitamin E'],
    howToUse: 'Press 3-4 drops into skin as the last step of evening routine. Can be mixed into moisturizer.',
    rating: 4.8,
    reviewCount: 67,
    tags: ['facial-oil', 'bakuchiol', 'anti-aging', 'sensitive-skin', 'dry-skin']
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/skincare_ecommerce');
    console.log('✅ Connected to MongoDB');

    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    const products = await Product.insertMany(sampleProducts);
    console.log(`🌸 Seeded ${products.length} products successfully`);

    mongoose.disconnect();
    console.log('✅ Done! Database disconnected.');
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seed();
