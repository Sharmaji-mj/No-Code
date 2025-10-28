


// src/index.js
import deployRouter from "./routes/deploy.js";
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

require('dotenv').config();

const app = express();

// ---- Config ----
const PORT = parseInt(process.env.PORT || '5000', 10);
const HOST = '0.0.0.0'; // IMPORTANT for Docker

// Basic middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3001'],
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS','PATCH'],
  allowedHeaders: ['Content-Type','Authorization','X-Requested-With'],
}));
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' }, contentSecurityPolicy: false }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(morgan('dev'));
app.use("/api/deploy", deployRouter);
// Rate limit
app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
}));

// ---- Health check early (works even if other routes fail) ----
app.get('/api', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});
app.use('/api/auth', require('./routes/auth'));
// ---- Routes (mount safely; if require() fails you’ll see it) ----
try {
  const authRoutes = require('./routes/auth');
  const projectRoutes = require('./routes/projects');
  const chatRoutes = require('./routes/chat.routes');
  const mejuvanteRoutes = require('./routes/mejuvante');
  const gitRoutes = require('./routes/git');

  app.use('/api/auth', authRoutes);
  app.use('/api/projects', projectRoutes);
  app.use('/api/chat', chatRoutes);
  app.use('/api/mejuvante', mejuvanteRoutes);
  app.use('/api/git', gitRoutes);
} catch (e) {
  console.error('❌ Failed to mount routes:', e);
}

// ---- 404 ----
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found', path: req.originalUrl });
});

// ---- Global error handler ----
app.use((err, req, res, _next) => {
  console.error('❌ Global Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    url: req.url,
    method: req.method,
  });
  res.status(err.status || 500).json({ success: false, message: err.message || 'Server error' });
});

// ---- Process guards ----
process.on('unhandledRejection', (r) => console.error('UNHANDLED REJECTION:', r));
process.on('uncaughtException', (e) => {
  console.error('UNCAUGHT EXCEPTION:', e);
  process.exit(1);
});

// ---- Start server ----
app.listen(PORT, HOST, () => {
  console.log('=================================');
  console.log(`🚀 Server listening on http://${HOST}:${PORT}`);
  console.log(`📍 API URL: http://localhost:${PORT}/api`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('=================================');
});
