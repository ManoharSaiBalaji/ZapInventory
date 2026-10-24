const mongoose = require('mongoose');

// Connect to MongoDB Atlas using the URI from environment variables
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host} — database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1); // Exit process on connection failure
  }
};

module.exports = connectDB;

