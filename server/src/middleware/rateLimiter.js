const rateLimit = require('express-rate-limit');

// Global API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'test' ? 500 : 200, // Limit each IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests from this IP, please try again after 15 minutes.',
  },
});

// Strict rate limiter for admin login endpoint (5 attempts / 15 minutes in production)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'test' ? 100 : 5, // Allow test suite to run multiple test cases
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  message: {
    error: 'Too many login attempts from this IP. Please try again after 15 minutes.',
  },
});

module.exports = {
  apiLimiter,
  loginLimiter,
};
