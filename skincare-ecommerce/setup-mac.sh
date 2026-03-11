#!/bin/bash

echo ""
echo "=========================================="
echo "  Lumière Skincare — Setup Script (Mac/Linux)"
echo "=========================================="
echo ""

cd backend

echo "[1/3] Installing backend dependencies..."
npm install
if [ $? -ne 0 ]; then
  echo "ERROR: npm install failed. Make sure Node.js is installed."
  exit 1
fi

echo ""
echo "[2/3] Setting up environment file..."
if [ ! -f .env ]; then
  cp .env.example .env
  echo ".env file created from template"
else
  echo ".env file already exists, skipping"
fi

echo ""
echo "[3/3] Seeding database with sample products..."
node config/seed.js

echo ""
echo "=========================================="
echo "  Setup complete!"
echo "  Run: npm run dev"  
echo "  Then open: http://localhost:5000"
echo "=========================================="
echo ""
