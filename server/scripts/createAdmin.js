/**
 * createAdmin.js — Run once to create the first administrator account.
 * Usage: node scripts/createAdmin.js
 *
 * Set ADMIN_EMAIL, ADMIN_PASSWORD, and ADMIN_NAME as environment variables
 * or edit the defaults below before running.
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

const ADMIN_NAME = process.env.ADMIN_NAME || 'Admin';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@zapinventory.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@1234';

async function createAdmin() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const existing = await User.findOne({ email: ADMIN_EMAIL });
  if (existing) {
    console.log(`Admin with email "${ADMIN_EMAIL}" already exists. Skipping.`);
    await mongoose.disconnect();
    return;
  }

  await User.create({
    name: ADMIN_NAME,
    email: ADMIN_EMAIL,
    passwordHash: ADMIN_PASSWORD,
    role: 'admin',
  });

  console.log(`Admin account created successfully:`);
  console.log(`  Email   : ${ADMIN_EMAIL}`);
  console.log(`  Password: ${ADMIN_PASSWORD}`);
  console.log('Change the password after your first login.');

  await mongoose.disconnect();
}

createAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});

