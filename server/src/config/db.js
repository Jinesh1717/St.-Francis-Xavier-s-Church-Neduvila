const mongoose = require('mongoose');

let mongoServerInstance = null;

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      return;
    }

    let uri = process.env.MONGODB_URI;

    if (!uri || uri.trim() === '' || uri === 'memory') {
      console.log('No MONGODB_URI provided in environment. Initializing in-memory MongoDB instance for development/testing...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoServerInstance = await MongoMemoryServer.create();
      uri = mongoServerInstance.getUri();
      console.log('In-memory MongoDB started at:', uri);
    }

    mongoose.set('strictQuery', true);
    await mongoose.connect(uri);
    console.log(`Connected to MongoDB successfully: ${mongoose.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongoServerInstance) {
      await mongoServerInstance.stop();
      mongoServerInstance = null;
    }
    console.log('Disconnected from MongoDB.');
  } catch (error) {
    console.error('Error disconnecting MongoDB:', error.message);
  }
};

module.exports = { connectDB, disconnectDB };
