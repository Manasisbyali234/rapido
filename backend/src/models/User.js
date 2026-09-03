const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  phone:     { type: String, required: true, unique: true },
  email:     { type: String },
  password:  { type: String },
  role:      { type: String, enum: ['user', 'captain', 'admin'], default: 'user' },
  status:    { type: String, enum: ['active', 'blocked', 'pending', 'suspended'], default: 'active' },
  rides:     { type: Number, default: 0 },
  rating:    { type: Number, default: 5.0 },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
