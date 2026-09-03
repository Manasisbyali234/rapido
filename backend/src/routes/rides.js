const express = require('express');
const mongoose = require('mongoose');
const Ride = require('../models/Ride');
const Captain = require('../models/Captain');
const User = require('../models/User');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

const FARES = { bike: 42, auto: 68, cab: 145, cabpremium: 210 };
const VALID_RIDE_TYPES = Object.keys(FARES);

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// POST /rides  — user books a ride
router.post('/', auth, requireRole('user'), async (req, res) => {
  try {
    const { rideType, pickup, drop, distance } = req.body;
    if (!rideType || !pickup || !drop)
      return res.status(400).json({ error: 'rideType, pickup and drop are required' });
    if (!VALID_RIDE_TYPES.includes(rideType))
      return res.status(400).json({ error: `rideType must be one of: ${VALID_RIDE_TYPES.join(', ')}` });
    if (pickup.trim().length < 3) return res.status(400).json({ error: 'Pickup location too short' });
    if (drop.trim().length < 3) return res.status(400).json({ error: 'Drop location too short' });

    const fare = FARES[rideType];
    const otp = String(Math.floor(1000 + Math.random() * 9000));

    const ride = await Ride.create({
      user: req.user.id, rideType,
      pickup: pickup.trim(), drop: drop.trim(),
      fare, distance, otp, status: 'searching',
    });

    req.app.get('io').emit('new_ride_request', { rideId: ride._id, rideType, pickup, drop, fare, distance });
    res.status(201).json(ride);
  } catch (err) {
    res.status(500).json({ error: 'Failed to book ride' });
  }
});

// GET /rides/my  — user's ride history
router.get('/my', auth, requireRole('user'), async (req, res) => {
  try {
    const rides = await Ride.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate('captain', 'name phone vehicle vehicleNumber rating');
    res.json(rides);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch rides' });
  }
});

// GET /rides/captain/active  — must be before /:id routes to avoid conflict
router.get('/captain/active', auth, requireRole('captain'), async (req, res) => {
  try {
    const ride = await Ride.findOne({
      captain: req.user.id,
      status: { $in: ['accepted', 'in_progress'] },
    }).populate('user', 'name phone rating');
    res.json(ride || null);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch active ride' });
  }
});

// GET /rides/captain/history
router.get('/captain/history', auth, requireRole('captain'), async (req, res) => {
  try {
    const rides = await Ride.find({ captain: req.user.id, status: 'completed' })
      .sort({ createdAt: -1 })
      .populate('user', 'name rating');
    res.json(rides);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch ride history' });
  }
});

// GET /rides/active  — user's current active ride
router.get('/active', auth, requireRole('user'), async (req, res) => {
  try {
    const ride = await Ride.findOne({
      user: req.user.id,
      status: { $in: ['searching', 'accepted', 'otp_verified', 'in_progress'] },
    }).populate('captain', 'name phone vehicle vehicleNumber rating location');
    res.json(ride || null);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch active ride' });
  }
});

// PATCH /rides/:id/cancel
router.patch('/:id/cancel', auth, async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ error: 'Invalid ride ID' });

    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ error: 'Ride not found' });

    // Only the rider or the assigned captain can cancel
    const isRider = ride.user.toString() === req.user.id;
    const isCaptain = ride.captain?.toString() === req.user.id;
    if (!isRider && !isCaptain) return res.status(403).json({ error: 'Not authorised to cancel this ride' });

    if (!['searching', 'accepted'].includes(ride.status))
      return res.status(400).json({ error: 'Cannot cancel at this stage' });

    ride.status = 'cancelled';
    await ride.save();
    req.app.get('io').to(`ride_${ride._id}`).emit('ride_cancelled', { rideId: ride._id });
    res.json(ride);
  } catch (err) {
    res.status(500).json({ error: 'Failed to cancel ride' });
  }
});

// PATCH /rides/:id/accept  — captain accepts
router.patch('/:id/accept', auth, requireRole('captain'), async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ error: 'Invalid ride ID' });

    const ride = await Ride.findById(req.params.id);
    if (!ride || ride.status !== 'searching')
      return res.status(400).json({ error: 'Ride not available' });

    ride.captain = req.user.id;
    ride.status = 'accepted';
    await ride.save();

    const captain = await Captain.findById(req.user.id).select('name phone vehicle vehicleNumber rating');
    req.app.get('io').to(`ride_${ride._id}`).emit('ride_accepted', { ride, captain });
    res.json({ ride, captain });
  } catch (err) {
    res.status(500).json({ error: 'Failed to accept ride' });
  }
});

// PATCH /rides/:id/verify-otp  — captain verifies rider OTP to start
router.patch('/:id/verify-otp', auth, requireRole('captain'), async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ error: 'Invalid ride ID' });

    const { otp } = req.body;
    if (!otp) return res.status(400).json({ error: 'OTP is required' });
    if (!/^\d{4}$/.test(otp)) return res.status(400).json({ error: 'OTP must be 4 digits' });

    const ride = await Ride.findById(req.params.id);
    if (!ride || ride.status !== 'accepted')
      return res.status(400).json({ error: 'Invalid ride state' });
    if (ride.captain?.toString() !== req.user.id)
      return res.status(403).json({ error: 'Not your ride' });
    if (ride.otp !== otp)
      return res.status(400).json({ error: 'Wrong OTP' });

    ride.status = 'in_progress';
    ride.startedAt = new Date();
    await ride.save();
    req.app.get('io').to(`ride_${ride._id}`).emit('ride_started', { rideId: ride._id });
    res.json(ride);
  } catch (err) {
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
});

// PATCH /rides/:id/complete  — captain completes ride
router.patch('/:id/complete', auth, requireRole('captain'), async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ error: 'Invalid ride ID' });

    const ride = await Ride.findById(req.params.id);
    if (!ride || ride.status !== 'in_progress')
      return res.status(400).json({ error: 'Invalid ride state' });
    if (ride.captain?.toString() !== req.user.id)
      return res.status(403).json({ error: 'Not your ride' });

    ride.status = 'completed';
    ride.completedAt = new Date();
    await ride.save();

    await Captain.findByIdAndUpdate(req.user.id, { $inc: { rides: 1, earningsToday: ride.fare } });
    await User.findByIdAndUpdate(ride.user, { $inc: { rides: 1 } });

    req.app.get('io').to(`ride_${ride._id}`).emit('ride_completed', { rideId: ride._id, fare: ride.fare });
    res.json(ride);
  } catch (err) {
    res.status(500).json({ error: 'Failed to complete ride' });
  }
});

module.exports = router;
