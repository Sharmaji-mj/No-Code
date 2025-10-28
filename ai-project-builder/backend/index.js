// backend/index.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { connectDB } = require('./src/config/database');

const authRoutes = require('./src/routes/auth');
const projectRoutes = require('./src/routes/projects');
const chatRoutes = require('./src/routes/chat.routes'); // ok to keep if used
const mejuvanteRoutes = require('./src/routes/mejuvante');
const gitRoutes = require('./src/routes/git');

const app = express();

// Trust proxy (useful behind Docker/NGINX)
app.set('trust proxy', 1);

// Connect to database
connectDB();

// --- CORS (dev-friendly) ---
const allowedOrigins = new Set([
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
]);
app.use(
  cors({
    origin: (origin, cb) => {
      // allow non-browser tools / curl (no origin)
      if (!origin || allowedOrigins.has(origin)) return cb(null, true);
      return cb(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);
app.options('*', cors());

// --- Middleware ---
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false, // preview iframes
  })
);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(morgan('dev'));

// --- Rate limiting ---
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// --- Health check ---
app.get('/api', (req, res) => {
  res.json({
    message: 'Mejuvante.One API is running!',
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// --- Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/chat', chatRoutes); // keep if you actually use /api/chat/*
app.use('/api/mejuvante', mejuvanteRoutes);
app.use('/api/git', gitRoutes);

// --- 404 handler ---
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
  });
});

// --- Global error handler (keep last) ---
app.use((err, req, res, next) => {
  console.error('❌ Global Error Handler:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    url: req.url,
    method: req.method,
    body: req.body,
    timestamp: new Date().toISOString(),
  });

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Something went wrong!',
    error:
      process.env.NODE_ENV === 'development'
        ? { message: err.message, stack: err.stack }
        : undefined,
  });
});

// --- Process-level guards to avoid crashes/reset connections ---
process.on('unhandledRejection', (reason) => {
  console.error('💥 Unhandled Rejection:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err);
});

// --- Graceful shutdown ---
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully...');
  process.exit(0);
});
process.on('SIGINT', () => {
  console.log('👋 SIGINT received, shutting down gracefully...');
  process.exit(0);
});

// --- Start server ---
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log('=================================');
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 API URL: http://localhost:${PORT}/api`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🤖 AI Model: ${process.env.OPENAI_MODEL || 'gpt-4o-mini'}`);
  console.log('=================================');
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
  } else {
    console.error('❌ Server error:', error);
  }
  process.exit(1);
});

module.exports = app;
