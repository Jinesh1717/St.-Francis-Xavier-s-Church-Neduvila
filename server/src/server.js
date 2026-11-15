require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 5000;
const seedData = require('./scripts/seed');
const Admin = require('./models/Admin');

const startServer = async () => {
  await connectDB();

  // If database is freshly initialized or empty, auto-seed default admin and sample records
  const adminCount = await Admin.countDocuments();
  if (adminCount === 0) {
    console.log('No admin found. Initializing database with default admin & church content...');
    await seedData();
  }

  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`St. Francis Xavier's Church, Neduvila - Backend Server`);
    console.log(`Server listening on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
    console.log(`API URL: http://localhost:${PORT}/api`);
    console.log(`=======================================================`);
  });
};

startServer();
