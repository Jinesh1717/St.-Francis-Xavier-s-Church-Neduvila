const express = require('express');
const router = express.Router();
const { login, logout, getMe } = require('../controllers/authController');
const { authenticateAdmin } = require('../middleware/auth');
const { loginLimiter } = require('../middleware/rateLimiter');
const { validate, loginSchema } = require('../middleware/validation');

// Public login endpoint with strict rate limiting & input validation
router.post('/login', loginLimiter, validate(loginSchema), login);

// Admin session logout
router.post('/logout', logout);

// Check current admin session
router.get('/me', authenticateAdmin, getMe);

module.exports = router;

