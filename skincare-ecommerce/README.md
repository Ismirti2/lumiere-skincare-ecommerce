# 🌸 Lumière Skincare — Full Stack E-Commerce

A complete, production-ready skincare e-commerce website built with HTML/CSS/JS frontend and Node.js + Express + MongoDB backend.

---

## 📁 Project Structure

```
skincare-ecommerce/
├── frontend/
│   ├── index.html          # Homepage with hero, featured products
│   ├── products.html       # Product listing with filters & search
│   ├── product-detail.html # Individual product + reviews
│   ├── cart.html           # Shopping cart
│   ├── checkout.html       # 3-step checkout flow
│   ├── login.html          # Login page
│   ├── register.html       # Registration page
│   ├── about.html          # About Us + team
│   ├── blog.html           # Skincare tips & guides
│   ├── testimonials.html   # Customer reviews
│   ├── contact.html        # Contact form
│   ├── css/
│   │   └── style.css       # Complete design system
│   └── js/
│       └── main.js         # API client, cart, auth, utilities
│
├── backend/
│   ├── server.js           # Express server entry point
│   ├── package.json
│   ├── .env.example        # Environment variables template
│   ├── config/
│   │   ├── authMiddleware.js  # JWT verification
│   │   └── seed.js            # Database seeder (12 products)
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   ├── Review.js
│   │   └── Message.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   ├── reviewController.js
│   │   └── contactController.js
│   └── routes/
│       ├── authRoutes.js
│       ├── productRoutes.js
│       ├── cartRoutes.js
│       ├── orderRoutes.js
│       ├── reviewRoutes.js
│       └── contactRoutes.js
│
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18+ → https://nodejs.org
- **MongoDB** Community → https://www.mongodb.com/try/download/community
- **VS Code** → https://code.visualstudio.com

---

### Step 1 — Install MongoDB

**Windows:**
1. Download MongoDB Community from the link above
2. Run the installer (choose "Complete" setup)
3. MongoDB will run as a Windows Service automatically

**Mac (with Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu):**
```bash
sudo apt install -y mongodb
sudo systemctl start mongodb
```

---

### Step 2 — Set Up the Backend

Open a terminal in VS Code (`Ctrl+~`) and run:

```bash
# Navigate to backend folder
cd skincare-ecommerce/backend

# Copy environment file
cp .env.example .env

# Install dependencies
npm install

# Seed the database with 12 sample products
node config/seed.js

# Start the server (with auto-reload)
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
🌸 Lumière Skincare API running on http://localhost:5000
```

---

### Step 3 — View the Website

Open your browser and go to: **http://localhost:5000**

That's it! 🎉

---

## 🌐 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/products | No | List all products (with filters) |
| GET | /api/products/:id | No | Get single product |
| GET | /api/products/featured | No | Get featured products |
| POST | /api/auth/register | No | Register new user |
| POST | /api/auth/login | No | Login user |
| GET | /api/auth/profile | Yes | Get user profile |
| POST | /api/orders | Yes | Place an order |
| GET | /api/orders/my-orders | Yes | Get user's orders |
| POST | /api/cart/validate | No | Validate cart items |
| GET | /api/reviews/:productId | No | Get product reviews |
| POST | /api/reviews | Yes | Submit a review |
| POST | /api/contact | No | Send contact message |

### Query Parameters for /api/products
- `category` — serum, moisturizer, cleanser, toner, sunscreen, mask, eye-care, set
- `bestseller=true` — filter bestsellers
- `featured=true` — filter featured
- `sort` — price-asc, price-desc, rating, newest
- `search` — text search
- `page` / `limit` — pagination

---

## 🗄️ MongoDB Collections

**Users** — name, email, password (hashed), skinType, role  
**Products** — name, description, price, image, category, skinType, stock, rating  
**Orders** — user, items, shippingAddress, totalPrice, orderStatus  
**Reviews** — product, user, rating, comment (auto-updates product avg rating)  
**Messages** — name, email, subject, message  

---

## ✨ Features

### Frontend
- 🏠 Homepage with animated hero, featured products, testimonials
- 🛍️ Product grid with live search, category filters, sorting, pagination
- 📦 Product detail with image, ingredients, how-to-use, reviews
- 🛒 Shopping cart (localStorage) with quantity controls
- 💳 3-step checkout (shipping → payment → confirm)
- 👤 Login / Register with JWT auth
- 📖 Blog with 9 skincare guides
- ⭐ Testimonials with rating breakdown
- 📬 Contact form
- 📱 Fully responsive mobile layout
- 🎨 Elegant pastel design with smooth animations

### Backend
- 🔐 JWT authentication with bcrypt password hashing
- 📦 Full product CRUD with text search
- 🛒 Cart validation against live stock
- 📋 Order processing with stock management
- ⭐ Review system (auto-updates product ratings)
- 📧 Contact form storage
- 🌱 Database seeder with 12 real products

---

## 🔧 Environment Variables (.env)

```env
MONGO_URI=mongodb://localhost:27017/skincare_ecommerce
JWT_SECRET=your_super_secret_key_here_change_this
PORT=5000
FRONTEND_URL=http://localhost:5000
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Fonts | Cormorant Garamond + DM Sans (Google Fonts) |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Dev | Nodemon |

---

## 📝 Development Tips

**Live editing frontend** — Install VS Code "Live Server" extension, right-click `frontend/index.html` → Open with Live Server (note: API calls won't work without backend)

**View MongoDB data** — Install MongoDB Compass (free GUI) and connect to `mongodb://localhost:27017`

**Add more products** — Edit `backend/config/seed.js` and run `node config/seed.js` again

**Admin features** — Set `role: 'admin'` on a user in MongoDB Compass to access admin-only routes

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

Built with 🌸 by Lumière Skincare
