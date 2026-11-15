const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ error: 'Authentication required. Please log in.' });
    }

    const secret = process.env.JWT_SECRET || 'fallback_default_secret_at_least_32_characters_long!';
    const decoded = jwt.verify(token, secret);

    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      // Clear cookie if admin no longer exists
      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
      return res.status(401).json({ error: 'Session expired. Please log in again.' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Session expired. Please log in again.' });
    }
    return res.status(401).json({ error: 'Invalid authentication token.' });
  }
};

module.exports = { authenticateAdmin };

