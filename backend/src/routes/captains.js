const express = require('express');
const Captain = require('../models/Captain');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

// GET /captains/me
router.get('/me', auth, requireRole('captain'), async (req, res) => {
  try {
    const captain = await Captain.findById(req.user.id).select('-password');
    if (!captain) return res.status(404).json({ error: 'Captain not found' });
    res.json(captain);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// PATCH /captains/toggle-online  { isOnline: boolean }
router.patch('/toggle-online', auth, requireRole('captain'), async (req, res) => {
  try {
    const { isOnline } = req.body;
    if (typeof isOnline !== 'boolean')
      return res.status(400).json({ error: 'isOnline must be a boolean' });

    const captain = await Captain.findByIdAndUpdate(
      req.user.id,
      { isOnline, status: isOnline ? 'online' : 'offline' },
      { new: true }
    ).select('-password');

    if (!captain) return res.status(404).json({ error: 'Captain not found' });

    req.app.get('io').emit('captain_status_changed', { captainId: captain._id, isOnline });
    res.json(captain);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// PATCH /captains/location  { lat: number, lng: number }
router.patch('/location', auth, requireRole('captain'), async (req, res) => {
  try {
    const { lat, lng } = req.body;
    if (lat === undefined || lng === undefined)
      return res.status(400).json({ error: 'lat and lng are required' });
    if (typeof lat !== 'number' || typeof lng !== 'number')
      return res.status(400).json({ error: 'lat and lng must be numbers' });
    if (lat < -90 || lat > 90) return res.status(400).json({ error: 'lat must be between -90 and 90' });
    if (lng < -180 || lng > 180) return res.status(400).json({ error: 'lng must be between -180 and 180' });

    await Captain.findByIdAndUpdate(req.user.id, { location: { lat, lng } });
    req.app.get('io').emit('captain_location', { captainId: req.user.id, lat, lng });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update location' });
  }
});

module.exports = router;
