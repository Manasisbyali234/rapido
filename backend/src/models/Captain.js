const mongoose = require('mongoose');

const captainSchema = new mongoose.Schema({
  name:          { type: String, required: true },
  phone:         { type: String, required: true, unique: true },
  email:         { type: String },
  password:      { type: String },
  vehicle:       { type: String, enum: ['Bike', 'Auto', 'Cab Economy', 'Cab Premium'], required: true },
  vehicleNumber: { type: String, required: true },
  licenseNumber: { type: String },
  status:        { type: String, enum: ['pending', 'active', 'suspended', 'online', 'offline'], default: 'pending' },
  isOnline:      { type: Boolean, default: false },
  rides:         { type: Number, default: 0 },
  rating:        { type: Number, default: 5.0 },
  earningsToday: { type: Number, default: 0 },
  location: {
    lat: { type: Number },
    lng: { type: Number },
  },
}, { timestamps: true });

module.exports = mongoose.model('Captain', captainSchema);
