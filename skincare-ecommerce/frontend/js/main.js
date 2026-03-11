/**
 * Lumière Skincare — Main JavaScript
 * ====================================
 * Handles: API client, Cart (localStorage), Auth (JWT),
 *          Toast notifications, Scroll animations, Nav, UI helpers
 */

'use strict';

// ─── API Configuration ──────────────────────────────────────────────────────
const API_BASE = (window.location.port === '5500' || window.location.port === '3000')
  ? 'http://localhost:5000/api'
  : window.location.origin + '/api';

// ─── Cart ───────────────────────────────────────────────────────────────────
const Cart = {
  STORAGE_KEY: 'lumiereCart',

  get() {
    try { return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || []; }
    catch { return []; }
  },

  save(items) {
    try { localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items)); }
    catch (e) { console.warn('Cart save failed:', e); }
    this.updateBadge();
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: items }));
  },

  add(product, quantity) {
    quantity = quantity || 1;
    if (!product || !product._id) { Toast.show('Could not add product.', 'error'); return; }
    const items = this.get();
    const idx = items.findIndex(function(i) { return i.productId === String(product._id); });
    if (idx > -1) {
      items[idx].quantity = Math.min(items[idx].quantity + quantity, product.stock || 99);
    } else {
      items.push({
        productId: String(product._id),
        name: product.name,
        price: Number(product.price),
        image: product.image || '',
        quantity: Number(quantity),
        stock: product.stock || 99
      });
    }
    this.save(items);
    Toast.show(product.name + ' added to cart!', 'success');
  },

  remove(productId) {
    this.save(this.get().filter(function(i) { return i.productId !== String(productId); }));
  },

  updateQty(productId, qty) {
    const items = this.get();
    const idx = items.findIndex(function(i) { return i.productId === String(productId); });
    if (idx === -1) return;
    if (qty <= 0) { this.remove(productId); return; }
    items[idx].quantity = Math.min(qty, items[idx].stock || 99);
    this.save(items);
  },

  clear() { this.save([]); },

  total() {
    return this.get().reduce(function(sum, i) { return sum + (i.price * i.quantity); }, 0);
  },

  count() {
    return this.get().reduce(function(sum, i) { return sum + i.quantity; }, 0);
  },

  updateBadge() {
    const count = this.count();
    document.querySelectorAll('.cart-badge').forEach(function(badge) {
      badge.textContent = count > 99 ? '99+' : String(count);
      badge.classList.toggle('visible', count > 0);
    });
  }
};

// ─── Auth ───────────────────────────────────────────────────────────────────
const Auth = {
  TOKEN_KEY: 'lumiereToken',
  USER_KEY:  'lumiereUser',

  getToken() { return localStorage.getItem(this.TOKEN_KEY) || null; },

  getUser() {
    try { return JSON.parse(localStorage.getItem(this.USER_KEY)) || null; }
    catch { return null; }
  },

  isLoggedIn() {
    const token = this.getToken();
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp && Date.now() / 1000 > payload.exp) {
        this.logout(false); return false;
      }
    } catch (e) { /* token might not be decodeable, assume valid */ }
    return true;
  },

  save(token, user) {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.updateUI();
  },

  logout(redirect) {
    if (redirect === undefined) redirect = true;
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.updateUI();
    if (redirect) {
      Toast.show('Logged out successfully', 'info');
      setTimeout(function() { window.location.href = '/'; }, 900);
    }
  },

  updateUI() {
    const user = this.getUser();
    const loggedIn = !!user && this.isLoggedIn();

    document.querySelectorAll('.nav-login-link').forEach(function(el) {
      el.style.display = loggedIn ? 'none' : '';
    });
    document.querySelectorAll('.nav-logout-btn').forEach(function(el) {
      el.style.display = loggedIn ? '' : 'none';
    });
    document.querySelectorAll('.nav-user-name').forEach(function(el) {
      if (loggedIn && user) {
        el.textContent = 'Hi, ' + user.name.split(' ')[0];
        el.style.display = '';
      } else {
        el.style.display = 'none';
      }
    });

    // Show/hide My Orders nav link
    document.querySelectorAll('.nav-orders-link').forEach(function(el) {
      el.style.display = loggedIn ? '' : 'none';
    });
  }
};

// ─── API Client ─────────────────────────────────────────────────────────────
const api = {
  async request(method, path, body, requireAuth) {
    requireAuth = requireAuth || false;
    const headers = { 'Content-Type': 'application/json' };
    if (requireAuth) {
      const token = Auth.getToken();
      if (!token) throw new Error('Please log in to continue.');
      headers['Authorization'] = 'Bearer ' + token;
    }
    let res;
    try {
      const opts = { method: method, headers: headers };
      if (body) opts.body = JSON.stringify(body);
      res = await fetch(API_BASE + path, opts);
    } catch (err) {
      throw new Error('Cannot connect to server. Make sure the backend is running on port 5000.');
    }
    let data;
    try { data = await res.json(); }
    catch (e) { throw new Error('Server error (' + res.status + ')'); }
    if (!res.ok) {
      if (res.status === 401) Auth.logout(false);
      throw new Error(data.message || 'Request failed (' + res.status + ')');
    }
    return data;
  },

  get:    function(path, auth)       { return api.request('GET',    path, null, auth); },
  post:   function(path, body, auth) { return api.request('POST',   path, body, auth); },
  put:    function(path, body, auth) { return api.request('PUT',    path, body, auth); },
  delete: function(path, auth)       { return api.request('DELETE', path, null, auth); },

  // Products
  getProducts:  function(params) { return api.get('/products?' + new URLSearchParams(params || {})); },
  getProduct:   function(id)     { return api.get('/products/' + id); },
  getFeatured:  function()       { return api.get('/products?featured=true&limit=6'); },

  // Auth
  register:      function(data) { return api.post('/auth/register', data); },
  login:         function(data) { return api.post('/auth/login', data); },
  getProfile:    function()     { return api.get('/auth/profile', true); },
  updateProfile: function(data) { return api.put('/auth/profile', data, true); },

  // Orders
  placeOrder:  function(data) { return api.post('/orders', data, true); },
  getMyOrders: function()     { return api.get('/orders/my-orders', true); },
  getOrder:    function(id)   { return api.get('/orders/' + id, true); },

  // Reviews
  getReviews:   function(productId) { return api.get('/reviews/' + productId); },
  submitReview: function(data)      { return api.post('/reviews', data, true); },
  deleteReview: function(id)        { return api.delete('/reviews/' + id, true); },

  // Cart
  validateCart: function(items) { return api.post('/cart/validate', { items: items }); },

  // Contact
  contact: function(data) { return api.post('/contact', data); }
};

// ─── Toast Notifications ────────────────────────────────────────────────────
const Toast = {
  container: null,

  init() {
    this.container = document.querySelector('.toast-container');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    }
  },

  show(message, type, duration) {
    type = type || 'info';
    duration = duration || 4000;
    if (!this.container) this.init();
    const icons = { success: '✅', error: '❌', info: '🌸', warning: '⚠️' };
    const toast = document.createElement('div');
    toast.className = 'toast ' + type;
    toast.innerHTML =
      '<span class="toast-icon">' + (icons[type] || icons.info) + '</span>' +
      '<span>' + message + '</span>' +
      '<button onclick="this.parentElement.remove()" style="background:none;border:none;cursor:pointer;color:var(--gray-400);margin-left:auto;padding:0 0 0 0.75rem;font-size:1.1rem;line-height:1">×</button>';
    this.container.appendChild(toast);
    setTimeout(function() {
      if (toast.parentElement) {
        toast.style.transition = 'opacity 0.3s, transform 0.3s';
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(40px)';
        setTimeout(function() { if (toast.parentElement) toast.remove(); }, 300);
      }
    }, duration);
  }
};

// ─── Scroll Animations ───────────────────────────────────────────────────────
function initScrollAnimations() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.fade-in').forEach(function(el) { el.classList.add('visible'); });
    return;
  }
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry, i) {
      if (entry.isIntersecting) {
        setTimeout(function() { entry.target.classList.add('visible'); }, i * 70);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.fade-in:not(.visible)').forEach(function(el) { observer.observe(el); });
}

// ─── Navbar ──────────────────────────────────────────────────────────────────
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', function() {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  // Active link
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(function(link) {
    const href = (link.getAttribute('href') || '').split('?')[0];
    if (href === currentPath || (href !== '/' && currentPath.includes(href) && href.length > 1)) {
      link.classList.add('active');
    }
  });

  // Hamburger
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function() {
      const isOpen = mobileNav.classList.toggle('open');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    mobileNav.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
    // Close on outside click
    document.addEventListener('click', function(e) {
      if (mobileNav.classList.contains('open') &&
          !mobileNav.contains(e.target) && !hamburger.contains(e.target)) {
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }
}

// ─── Accordions ─────────────────────────────────────────────────────────────
function initAccordions() {
  document.querySelectorAll('.accordion-header').forEach(function(header) {
    header.addEventListener('click', function() {
      const body = this.nextElementSibling;
      const isOpen = this.classList.contains('open');
      // Close all siblings
      const container = this.closest('div') || document;
      container.querySelectorAll('.accordion-header.open').forEach(function(h) {
        h.classList.remove('open');
        if (h.nextElementSibling) h.nextElementSibling.classList.remove('open');
      });
      // Open this one if it was closed
      if (!isOpen) {
        this.classList.add('open');
        if (body) body.classList.add('open');
      }
    });
  });
}

// ─── Product Card Builder ────────────────────────────────────────────────────
function buildProductCard(product) {
  if (!product) return '';
  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
  const soldOut = product.stock === 0;

  return '<div class="product-card fade-in" data-id="' + product._id + '">' +
    '<div class="product-card-img-wrap">' +
      '<img src="' + (product.image || 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&q=80') + '"' +
           ' alt="' + product.name + '" loading="lazy"' +
           ' onerror="this.src=\'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&q=80\'">' +
      '<div class="product-badges">' +
        (product.bestseller ? '<span class="badge badge-bestseller">Bestseller</span>' : '') +
        (discount > 0 ? '<span class="badge badge-sale">-' + discount + '%</span>' : '') +
        (soldOut ? '<span class="badge" style="background:#fee2e2;color:#dc2626">Sold Out</span>' : '') +
      '</div>' +
      '<div class="product-actions-hover">' +
        '<a href="/product-detail.html?id=' + product._id + '" class="btn btn-sm" style="flex:1;border:1px solid rgba(255,255,255,0.5);color:white;background:transparent">View Details</a>' +
        '<button class="btn btn-rose btn-sm" style="flex:1" onclick="addToCartCard(\'' + product._id + '\')" ' + (soldOut ? 'disabled' : '') + '>' +
          (soldOut ? 'Sold Out' : 'Add to Cart') +
        '</button>' +
      '</div>' +
    '</div>' +
    '<div class="product-card-body">' +
      '<div class="product-category">' + (product.category || '').replace(/-/g, ' ') + '</div>' +
      '<h3 class="product-name"><a href="/product-detail.html?id=' + product._id + '">' + product.name + '</a></h3>' +
      '<p class="product-desc">' + (product.shortDescription || product.description || '') + '</p>' +
      '<div class="product-footer">' +
        '<div class="product-price">' +
          '<span class="price-current">$' + Number(product.price).toFixed(2) + '</span>' +
          (product.originalPrice ? '<span class="price-original">$' + Number(product.originalPrice).toFixed(2) + '</span>' : '') +
        '</div>' +
        '<div class="product-rating">' +
          '<span style="color:#F59E0B">★</span>' +
          '<span>' + Number(product.rating || 0).toFixed(1) + '</span>' +
          '<span style="color:var(--gray-400)">(' + (product.reviewCount || 0) + ')</span>' +
        '</div>' +
      '</div>' +
    '</div>' +
  '</div>';
}

// Product cache for quick add-to-cart
var _productCache = {};

async function addToCartCard(productId) {
  if (_productCache[productId]) {
    Cart.add(_productCache[productId], 1);
    return;
  }
  try {
    const data = await api.getProduct(productId);
    _productCache[productId] = data.product;
    Cart.add(data.product, 1);
  } catch (err) {
    Toast.show('Could not add to cart. Please try again.', 'error');
  }
}

// ─── Skeleton Loaders ────────────────────────────────────────────────────────
function buildSkeletonCards(count) {
  count = count || 4;
  var html = '';
  for (var i = 0; i < count; i++) {
    html += '<div class="product-card" style="pointer-events:none">' +
      '<div class="skeleton" style="aspect-ratio:1;width:100%"></div>' +
      '<div class="product-card-body" style="gap:0.5rem;display:flex;flex-direction:column">' +
        '<div class="skeleton" style="height:11px;width:40%;border-radius:99px"></div>' +
        '<div class="skeleton" style="height:16px;width:85%;border-radius:4px;margin-top:4px"></div>' +
        '<div class="skeleton" style="height:11px;width:100%;border-radius:4px"></div>' +
        '<div class="skeleton" style="height:11px;width:70%;border-radius:4px"></div>' +
        '<div style="display:flex;justify-content:space-between;margin-top:0.5rem">' +
          '<div class="skeleton" style="height:20px;width:60px;border-radius:4px"></div>' +
          '<div class="skeleton" style="height:14px;width:60px;border-radius:4px"></div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }
  return html;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function renderStars(rating, max) {
  max = max || 5;
  var full  = Math.round(rating || 0);
  var empty = max - full;
  return '<span style="color:#F59E0B">' + '★'.repeat(Math.max(0, full)) + '</span>' +
         '<span style="color:var(--gray-200)">' + '★'.repeat(Math.max(0, empty)) + '</span>';
}

function formatPrice(amount) { return '$' + Number(amount).toFixed(2); }

function formatDate(ds) {
  return new Date(ds).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function handleNewsletter(inputId) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const email = input.value.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    Toast.show('Please enter a valid email address.', 'error'); return;
  }
  Toast.show('You\'re subscribed! Check your inbox for a welcome gift 🌸', 'success');
  input.value = '';
}

// ─── DOM Ready ───────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  Toast.init();
  Cart.updateBadge();
  Auth.updateUI();
  initNavbar();
  initScrollAnimations();
  initAccordions();
});
