
// // routes/auth.js (core bits)

// const express = require('express');
// const router = express.Router();
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');

// const { User } = require('../models'); // Sequelize model

// const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
// const SALT_ROUNDS = 10;

// // POST /api/auth/register
// router.post('/register', async (req, res) => {
//   try {
//     const { name, email, password } = req.body || {};
//     if (!name || !email || !password) {
//       return res.status(400).json({ message: 'name, email, password are required' });
//     }

//     const existing = await User.findOne({ where: { email } });
//     if (existing) return res.status(409).json({ message: 'Email already registered' });

//     const hash = await bcrypt.hash(password, SALT_ROUNDS);
//     const user = await User.create({ name, email, password: hash });

//     const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
//     return res.json({
//       token,
//       user: { id: user.id, name: user.name, email: user.email },
//     });
//   } catch (e) {
//     console.error('Register error:', e);
//     return res.status(500).json({ message: 'Registration failed' });
//   }
// });

// // POST /api/auth/login
// router.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body || {};
//     if (!email || !password) return res.status(400).json({ message: 'email and password are required' });

//     const user = await User.findOne({ where: { email } });
//     if (!user) return res.status(401).json({ message: 'Invalid email or password' });

//     const ok = await bcrypt.compare(password, user.password);
//     if (!ok) return res.status(401).json({ message: 'Invalid email or password' });

//     const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
//     return res.json({
//       token,
//       user: { id: user.id, name: user.name, email: user.email },
//     });
//   } catch (e) {
//     console.error('Login error:', e);
//     return res.status(500).json({ message: 'Login failed' });
//   }
// });

// // GET /api/auth/me
// router.get('/me', async (req, res) => {
//   try {
//     const auth = req.header('Authorization') || '';
//     const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
//     if (!token) return res.status(401).json({ message: 'No token' });

//     const decoded = jwt.verify(token, JWT_SECRET);
//     const user = await User.findByPk(decoded.userId);
//     if (!user) return res.status(404).json({ message: 'Not found' });

//     return res.json({ id: user.id, name: user.name, email: user.email });
//   } catch (e) {
//     return res.status(401).json({ message: 'Invalid token' });
//   }
// });


// module.exports = router;


// // routes/auth.js
// const express = require('express');
// const router = express.Router();
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
// const { User } = require('../models'); // Sequelize model

// const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
// const SALT_ROUNDS = 10;

// // small helpers
// const norm = (s = '') => String(s).trim();
// const normEmail = (s = '') => norm(s).toLowerCase();

// // POST /api/auth/register
// router.post('/register', async (req, res) => {
//   try {
//     let { name, email, password } = req.body || {};
//     name = norm(name);
//     email = normEmail(email);
//     password = norm(password);

//     if (!name || !email || !password) {
//       return res.status(400).json({ message: 'name, email, password are required' });
//     }

//     const existing = await User.findOne({ where: { email } });
//     if (existing) return res.status(409).json({ message: 'Email already registered' });

//     const hash = await bcrypt.hash(password, SALT_ROUNDS);
//     const user = await User.create({ name, email, password: hash });

//     const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
//     return res.json({
//       token,
//       user: { id: user.id, name: user.name, email: user.email },
//     });
//   } catch (e) {
//     console.error('Register error:', e);
//     return res.status(500).json({ message: 'Registration failed' });
//   }
// });

// // POST /api/auth/login
// router.post('/login', async (req, res) => {
//   try {
//     let { email, password } = req.body || {};
//     email = normEmail(email);
//     password = norm(password);

//     if (!email || !password) {
//       return res.status(400).json({ message: 'email and password are required' });
//     }

//     const user = await User.findOne({ where: { email } });

//     // timing-safe behavior even if user not found
//     const fakeHash = '$2a$10$abcdefghijklmnopqrstuvABCDEFrw8fQp8iKfP0KfP0KfP0KfP0KfP0K'; // 60 chars
//     const hashToCheck = user?.password || fakeHash;

//     // temporary debug (remove once confirmed)
//     console.log('[auth/login] email=', email, 'found=', !!user, 'hashlen=', (hashToCheck || '').length);

//     const ok = await bcrypt.compare(password, hashToCheck);
//     console.log('[auth/login] compare=', ok);

//     if (!user || !ok) {
//       return res.status(401).json({ message: 'Invalid email or password' });
//     }

//     const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
//     return res.json({
//       token,
//       user: { id: user.id, name: user.name, email: user.email },
//     });
//   } catch (e) {
//     console.error('Login error:', e);
//     return res.status(500).json({ message: 'Login failed' });
//   }
// });

// // GET /api/auth/me
// router.get('/me', async (req, res) => {
//   try {
//     const auth = req.header('Authorization') || '';
//     const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
//     if (!token) return res.status(401).json({ message: 'No token' });

//     const decoded = jwt.verify(token, JWT_SECRET);
//     const user = await User.findByPk(decoded.userId);
//     if (!user) return res.status(404).json({ message: 'Not found' });

//     return res.json({ id: user.id, name: user.name, email: user.email });
//   } catch (e) {
//     return res.status(401).json({ message: 'Invalid token' });
//   }
// });

// module.exports = router;



// routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { User } = require('../models'); // Sequelize model

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

// helpers
const norm = (s = '') => String(s).trim();
const normEmail = (s = '') => norm(s).toLowerCase();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    let { name, email, password } = req.body || {};
    name = norm(name);
    email = normEmail(email);
    password = norm(password);

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email, password are required' });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    // ⚠️ Do NOT hash here — model hooks will hash
    const user = await User.create({ name, email, password });

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (e) {
    console.error('Register error:', e);
    return res.status(500).json({ message: 'Registration failed' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    let { email, password } = req.body || {};
    email = normEmail(email);
    password = norm(password);

    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }

    const user = await User.findOne({ where: { email } });
    // Uniform response timing: if no user, still do a compare-like wait using model method semantics
    if (!user) {
      // small delay for timing similarity
      await new Promise(r => setTimeout(r, 50));
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const ok = await user.validatePassword(password);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (e) {
    console.error('Login error:', e);
    return res.status(500).json({ message: 'Login failed' });
  }
});

// GET /api/auth/me
router.get('/me', async (req, res) => {
  try {
    const auth = req.header('Authorization') || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'No token' });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.userId);
    if (!user) return res.status(404).json({ message: 'Not found' });

    return res.json({ id: user.id, name: user.name, email: user.email });
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;
