const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  user:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  captain:    { type: mongoose.Schema.Types.ObjectId, ref: 'Captain' },
  rideType:   { type: String, enum: ['bike', 'auto', 'cab', 'cabpremium'], required: true },
  pickup:     { type: String, required: true },
  drop:       { type: String, required: true },
  fare:       { type: Number, required: true },
  distance:   { type: String },
  status:     { type: String, enum: ['searching', 'accepted', 'otp_verified', 'in_progress', 'completed', 'cancelled'], default: 'searching' },
  otp:        { type: String },
  startedAt:  { type: Date },
  completedAt:{ type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Ride', rideSchema);
