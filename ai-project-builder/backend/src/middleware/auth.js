// const jwt = require('jsonwebtoken');

// const auth = (req, res, next) => {
//   try {
//     const token = req.header('Authorization')?.replace('Bearer ', '');
    
//     if (!token) {
//       return res.status(401).json({ error: 'No token, authorization denied' });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (error) {
//     res.status(401).json({ error: 'Token is not valid' });
//   }
// };

// module.exports = auth;


// // backend/src/middleware/auth.js
// const jwt = require('jsonwebtoken');

// module.exports = function (req, res, next) {
//   // Get token from header
//   const token = req.header('x-auth-token');

//   // Check if not token
//   if (!token) {
//     return res.status(401).json({ message: 'No token, authorization denied' });
//   }

//   // Verify token
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
//     req.user = decoded;
//     next();
//   } catch (err) {
//     res.status(401).json({ message: 'Token is not valid' });
//   }
// };


// backend/src/middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    console.log('Auth middleware called'); // Debug log
    console.log('Request headers:', req.headers); // Debug log
    
    const authHeader = req.header('Authorization');
    console.log('Auth header:', authHeader); // Debug log
    
    if (!authHeader) {
      console.log('No Authorization header found'); // Debug log
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }
    
    const token = authHeader.replace('Bearer ', '');
    console.log('Token extracted:', token.substring(0, 20) + '...'); // Debug log
    
    if (!token) {
      console.log('No token found after Bearer'); // Debug log
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }
    
    console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Loaded' : 'Not loaded'); // Debug log
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded successfully:', decoded); // Debug log
    
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error); // Debug log
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token.' });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired.' });
    } else {
      return res.status(500).json({ error: 'Server error during authentication.' });
    }
  }
};