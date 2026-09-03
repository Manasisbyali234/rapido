const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  captainId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Captain' },
  rideId:         { type: mongoose.Schema.Types.ObjectId, ref: 'Ride' },
  pickupLocation: { type: String, required: true },
  dropLocation:   { type: String, required: true },
  vehicleType:    { type: String, enum: ['Bike', 'Auto', 'Cab Economy', 'Cab Premium'] },
  fare:           { type: Number },
  status:         { type: String, enum: ['requested', 'accepted', 'started', 'completed', 'cancelled'], default: 'requested' },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
