const mongoose = require('mongoose');
const env = require('./env');

const connectDatabase = async (mongoUri = env.mongoUri) => {
  try {
    mongoose.set('strictQuery', true);
    const connection = await mongoose.connect(mongoUri);
    console.log(`MongoDB connected: ${connection.connection.host}/${connection.connection.name}`);
    return connection;
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    throw error;
  }
};

const disconnectDatabase = async () => {
  await mongoose.disconnect();
};

module.exports = {
  connectDatabase,
  disconnectDatabase,
};
