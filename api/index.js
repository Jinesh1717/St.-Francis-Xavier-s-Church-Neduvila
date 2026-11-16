const app = require('../server/src/app');
const { connectDB } = require('../server/src/config/db');
const Admin = require('../server/src/models/Admin');
const seedData = require('../server/src/scripts/seed');

let isInitialized = false;

module.exports = async (req, res) => {
  try {
    await connectDB();

    // Auto-seed on first cold start if the connected database has no admin
    if (!isInitialized) {
      try {
        const adminCount = await Admin.countDocuments();
        if (adminCount === 0) {
          console.log('[Vercel] Database empty. Running initial church data seeding...');
          await seedData();
        }
      } catch (seedErr) {
        console.warn('[Vercel] Auto-seed check warning:', seedErr.message);
      }
      isInitialized = true;
    }
  } catch (dbErr) {
    console.error('[Vercel] DB Connection Error:', dbErr.message);
    return res.status(500).json({
      error: 'Database connection failed. Please ensure MONGODB_URI is configured in your Vercel Project Environment Variables.',
      message: dbErr.message,
    });
  }

  // Ensure request URL starts with /api for Express route handlers
  if (!req.url.startsWith('/api')) {
    req.url = '/api' + req.url;
  }

  return app(req, res);
};
