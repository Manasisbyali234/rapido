const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');
const Captain = require('../models/Captain');
const Ride = require('../models/Ride');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

router.use(auth, requireRole('admin'));

const VALID_RIDE_STATUSES = ['searching', 'accepted', 'otp_verified', 'in_progress', 'completed', 'cancelled'];
const MAX_LIMIT = 100;

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// Escape special regex chars to prevent ReDoS
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function startOfDay() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

// GET /admin/stats
router.get('/stats', async (req, res) => {
  try {
    const [totalUsers, totalCaptains, onlineCaptains, ridesToday, revenueAgg] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Captain.countDocuments({ status: { $in: ['active', 'online', 'offline'] } }),
      Captain.countDocuments({ isOnline: true }),
      Ride.countDocuments({ createdAt: { $gte: startOfDay() }, status: 'completed' }),
      Ride.aggregate([
        { $match: { createdAt: { $gte: startOfDay() }, status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$fare' } } },
      ]),
    ]);
    res.json({ totalUsers, totalCaptains, onlineCaptains, ridesToday, revenueToday: revenueAgg[0]?.total || 0 });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// GET /admin/users?search=
router.get('/users', async (req, res) => {
  try {
    const q = req.query.search?.trim();
    const filter = { role: 'user' };
    if (q) {
      const safe = escapeRegex(q);
      filter.$or = [{ name: new RegExp(safe, 'i') }, { phone: new RegExp(safe, 'i') }];
    }
    const users = await User.find(filter).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET /admin/users/:id
router.get('/users/:id', async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ error: 'Invalid user ID' });
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// PATCH /admin/users/:id/toggle-block
router.patch('/users/:id/toggle-block', async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ error: 'Invalid user ID' });
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.status = user.status === 'blocked' ? 'active' : 'blocked';
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// GET /admin/captains/pending  — must be before /captains/:id
router.get('/captains/pending', async (req, res) => {
  try {
    const captains = await Captain.find({ status: 'pending' }).select('-password');
    res.json(captains);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch pending captains' });
  }
});

// GET /admin/captains?search=
router.get('/captains', async (req, res) => {
  try {
    const q = req.query.search?.trim();
    const filter = {};
    if (q) {
      const safe = escapeRegex(q);
      filter.$or = [{ name: new RegExp(safe, 'i') }, { phone: new RegExp(safe, 'i') }];
    }
    const captains = await Captain.find(filter).select('-password').sort({ createdAt: -1 });
    res.json(captains);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch captains' });
  }
});

// GET /admin/captains/:id
router.get('/captains/:id', async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ error: 'Invalid captain ID' });
    const captain = await Captain.findById(req.params.id).select('-password');
    if (!captain) return res.status(404).json({ error: 'Captain not found' });
    res.json(captain);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch captain' });
  }
});

// PATCH /admin/captains/:id/approve
router.patch('/captains/:id/approve', async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ error: 'Invalid captain ID' });
    const captain = await Captain.findByIdAndUpdate(
      req.params.id, { status: 'active' }, { new: true }
    ).select('-password');
    if (!captain) return res.status(404).json({ error: 'Captain not found' });
    res.json(captain);
  } catch (err) {
    res.status(500).json({ error: 'Failed to approve captain' });
  }
});

// PATCH /admin/captains/:id/reject
router.patch('/captains/:id/reject', async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ error: 'Invalid captain ID' });
    const captain = await Captain.findByIdAndUpdate(
      req.params.id, { status: 'suspended' }, { new: true }
    ).select('-password');
    if (!captain) return res.status(404).json({ error: 'Captain not found' });
    res.json(captain);
  } catch (err) {
    res.status(500).json({ error: 'Failed to reject captain' });
  }
});

// PATCH /admin/captains/:id/toggle-suspend
router.patch('/captains/:id/toggle-suspend', async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ error: 'Invalid captain ID' });
    const captain = await Captain.findById(req.params.id);
    if (!captain) return res.status(404).json({ error: 'Captain not found' });
    captain.status = captain.status === 'suspended' ? 'active' : 'suspended';
    await captain.save();
    res.json(captain);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update captain' });
  }
});

// GET /admin/users/:id/rides
router.get('/users/:id/rides', async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ error: 'Invalid user ID' });
    const rides = await Ride.find({ user: req.params.id })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('captain', 'name phone vehicle');
    res.json(rides);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch rides' });
  }
});

// GET /admin/rides?status=&limit=
router.get('/rides', async (req, res) => {
  try {
    const { status } = req.query;
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 50, 1), MAX_LIMIT);

    if (status && !VALID_RIDE_STATUSES.includes(status))
      return res.status(400).json({ error: `status must be one of: ${VALID_RIDE_STATUSES.join(', ')}` });

    const filter = status ? { status } : {};
    const rides = await Ride.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('user', 'name phone')
      .populate('captain', 'name phone vehicle');
    res.json(rides);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch rides' });
  }
});

module.exports = router;
