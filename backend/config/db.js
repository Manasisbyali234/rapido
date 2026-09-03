const dns = require('dns');
const mongoose = require('mongoose');

// ISP DNS blocks SRV queries in Node.js — use public resolvers
dns.setServers(['8.8.8.8', '1.1.1.1']);

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI is not set in .env');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log('MongoDB connected successfully');
    console.log(`Database: ${conn.connection.name}`);
    return conn;
  } catch (err) {
    console.error('MongoDB connection failed.');
    console.error('Cause:', err.message);
    console.error('Check: Atlas Network Access IP, database user credentials, and DNS.');
    process.exit(1);
  }
}

module.exports = connectDB;
