const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

// Registering all models so Mongoose creates collections on first write
require('../models/User');
require('../models/Captain');
require('../models/Vehicle');
require('../models/Ride');
require('../models/Booking');
require('../models/Otp');
require('../models/SupportMessage');

async function initDb() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.warn('ADMIN_EMAIL or ADMIN_PASSWORD missing — skipping admin seed');
    return;
  }

  const exists = await Admin.findOne({ email });
  if (!exists) {
    const passwordHash = await bcrypt.hash(password, 10);
    await Admin.create({ email, passwordHash });
    console.log('Admin account created');
  }

  console.log('Collections initialized successfully');
  console.log('Admin account verified');
}

module.exports = initDb;
