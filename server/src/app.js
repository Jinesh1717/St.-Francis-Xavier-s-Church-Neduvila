const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const morgan = require('morgan');
const path = require('path');

const { apiLimiter } = require('./middleware/rateLimiter');
const { setCsrfToken, verifyCsrfToken } = require('./middleware/security');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const eventRoutes = require('./routes/eventRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const noticeRoutes = require('./routes/noticeRoutes');
const settingRoutes = require('./routes/settingRoutes');
const prayerRoutes = require('./routes/prayerRoutes');
const timingRoutes = require('./routes/timingRoutes');

const app = express();

// Disable x-powered-by
app.disable('x-powered-by');

// Trust proxy for rate limiting if behind a reverse proxy (Render, Railway, etc.)
app.set('trust proxy', 1);

// Helmet with strict Content Security Policy
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'https://res.cloudinary.com', 'https://*.cloudinary.com', 'https://images.unsplash.com', 'blob:'],
        frameSrc: ["'self'", 'https://www.google.com', 'https://maps.google.com'],
        connectSrc: ["'self'", process.env.FRONTEND_URL || 'http://localhost:5173'],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS configuration: strictly restricted to frontend origin with credentials
const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or same-origin server-to-server) in dev
      if (!origin || origin === allowedOrigin) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked for origin: ${origin}`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token', 'X-XSRF-Token'],
  })
);

// Logging with morgan (excluding sensitive payload bodies)
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
}

// Body parsing with limits
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));
app.use(cookieParser());

// NoSQL injection prevention
app.use(mongoSanitize({ replaceWith: '_' }));

// HTTP parameter pollution protection
app.use(hpp());

// Serve local fallback uploads statically if Cloudinary is not active
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Attach CSRF cookie to responses & check CSRF for mutating requests
app.use(setCsrfToken);
app.use('/api', verifyCsrfToken);

// Apply global rate limiter to all /api routes
app.use('/api', apiLimiter);

// Endpoint to fetch/refresh CSRF token
app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: res.locals.csrfToken });
});

// API Routes
app.use('/api/admin', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/prayers', prayerRoutes);
app.use('/api/timings', timingRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    church: "St. Francis Xavier's Church, Neduvila",
  });
});

// 404 handler for unmatched /api routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Centralized error handler
app.use(errorHandler);

module.exports = app;

