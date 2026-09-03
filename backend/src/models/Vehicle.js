const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  captainId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Captain', required: true },
  vehicleNumber: { type: String, required: true, unique: true },
  vehicleType:   { type: String, enum: ['Bike', 'Auto', 'Cab Economy', 'Cab Premium'], required: true },
  seats:         { type: Number },
  make:          { type: String },
  model:         { type: String },
  year:          { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);
