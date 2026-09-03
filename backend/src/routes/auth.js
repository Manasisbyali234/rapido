const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Captain = require('../models/Captain');
const Otp = require('../models/Otp');
const Admin = require('../models/Admin');

const router = express.Router();

const PHONE_RE = /^[6-9]\d{9}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_VEHICLES = ['Bike', 'Auto', 'Cab Economy', 'Cab Premium'];

function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
}

function generateOtpCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

// ── OTP ──────────────────────────────────────────────────────────────────────

// POST /auth/send-otp  { phone }
router.post('/send-otp', async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: 'Phone is required' });
    if (!PHONE_RE.test(phone)) return res.status(400).json({ error: 'Invalid phone number (10 digits, starts with 6-9)' });

    const code = generateOtpCode();
    await Otp.findOneAndDelete({ phone });
    await Otp.create({ phone, code, expiresAt: new Date(Date.now() + 5 * 60 * 1000) });

    console.log(`OTP for ${phone}: ${code}`);
    res.json({ message: 'OTP sent', otp: code }); // remove `otp` in production
  } catch (err) {
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// POST /auth/verify-otp  { phone, code }
router.post('/verify-otp', async (req, res) => {
  try {
    const { phone, code } = req.body;
    if (!phone || !code) return res.status(400).json({ error: 'Phone and code are required' });
    if (!PHONE_RE.test(phone)) return res.status(400).json({ error: 'Invalid phone number' });
    if (!/^\d{6}$/.test(code)) return res.status(400).json({ error: 'OTP must be 6 digits' });

    const record = await Otp.findOne({ phone });
    if (!record || record.code !== code)
      return res.status(400).json({ error: 'Invalid or expired OTP' });

    await record.deleteOne();
    res.json({ verified: true });
  } catch (err) {
    res.status(500).json({ error: 'OTP verification failed' });
  }
});

// ── USER ─────────────────────────────────────────────────────────────────────

// POST /auth/user/register  { name, phone, email? }
router.post('/user/register', async (req, res) => {
  try {
    const { name, phone, email } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ error: 'Name is required' });
    if (!phone) return res.status(400).json({ error: 'Phone is required' });
    if (!PHONE_RE.test(phone)) return res.status(400).json({ error: 'Invalid phone number' });
    if (email && !EMAIL_RE.test(email)) return res.status(400).json({ error: 'Invalid email address' });

    if (await User.findOne({ phone }))
      return res.status(409).json({ error: 'Phone already registered. Please login.' });

    const user = await User.create({ name: name.trim(), phone, email: email?.toLowerCase(), role: 'user' });
    res.status(201).json({ token: signToken({ id: user._id, role: 'user' }), user });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// POST /auth/user/login  { phone }
router.post('/user/login', async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: 'Phone is required' });
    if (!PHONE_RE.test(phone)) return res.status(400).json({ error: 'Invalid phone number' });

    const user = await User.findOne({ phone, role: 'user' });
    if (!user) return res.status(404).json({ error: 'No account found. Please register first.' });
    if (user.status === 'blocked') return res.status(403).json({ error: 'Account blocked. Contact support.' });

    res.json({ token: signToken({ id: user._id, role: 'user' }), user });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// ── CAPTAIN ───────────────────────────────────────────────────────────────────

// POST /auth/captain/register  { name, phone, email?, vehicle, vehicleNumber, licenseNumber? }
router.post('/captain/register', async (req, res) => {
  try {
    const { name, phone, email, vehicle, vehicleNumber, licenseNumber } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ error: 'Name is required' });
    if (!phone) return res.status(400).json({ error: 'Phone is required' });
    if (!PHONE_RE.test(phone)) return res.status(400).json({ error: 'Invalid phone number' });
    if (email && !EMAIL_RE.test(email)) return res.status(400).json({ error: 'Invalid email address' });
    if (!vehicle) return res.status(400).json({ error: 'Vehicle type is required' });
    if (!VALID_VEHICLES.includes(vehicle))
      return res.status(400).json({ error: `Vehicle must be one of: ${VALID_VEHICLES.join(', ')}` });
    if (!vehicleNumber || !vehicleNumber.trim())
      return res.status(400).json({ error: 'Vehicle number is required' });

    if (await Captain.findOne({ phone }))
      return res.status(409).json({ error: 'Phone already registered. Please login.' });

    const captain = await Captain.create({
      name: name.trim(), phone, email: email?.toLowerCase(),
      vehicle, vehicleNumber: vehicleNumber.trim().toUpperCase(),
      licenseNumber: licenseNumber?.trim(), status: 'pending',
    });
    res.status(201).json({ token: signToken({ id: captain._id, role: 'captain' }), captain });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// POST /auth/captain/login  { phone }
router.post('/captain/login', async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: 'Phone is required' });
    if (!PHONE_RE.test(phone)) return res.status(400).json({ error: 'Invalid phone number' });

    const captain = await Captain.findOne({ phone });
    if (!captain) return res.status(404).json({ error: 'No captain account found. Please register.' });
    if (captain.status === 'suspended') return res.status(403).json({ error: 'Account suspended. Contact support.' });

    res.json({ token: signToken({ id: captain._id, role: 'captain' }), captain });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// ── ADMIN ─────────────────────────────────────────────────────────────────────

// POST /auth/admin/login  { email, password }
router.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

    const admin = await Admin.findOne({ email: email.trim().toLowerCase() });
    if (!admin) return res.status(401).json({ error: 'Invalid admin credentials' });

    const match = await bcrypt.compare(password, admin.passwordHash);
    if (!match) return res.status(401).json({ error: 'Invalid admin credentials' });

    res.json({ token: signToken({ id: admin._id, role: 'admin' }) });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// ── PROFILE ──────────────────────────────────────────────────────────────────
const { auth } = require('../middleware/auth');

// GET /auth/me
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// PATCH /auth/me  { name?, email? }
router.patch('/me', auth, async (req, res) => {
  try {
    const { name, email } = req.body;
    const updates = {};
    if (name && name.trim()) updates.name = name.trim();
    if (email !== undefined) {
      if (email && !EMAIL_RE.test(email)) return res.status(400).json({ error: 'Invalid email address' });
      updates.email = email ? email.toLowerCase() : '';
    }
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;
