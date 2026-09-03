const mongoose = require('mongoose');

const supportMessageSchema = new mongoose.Schema({
  name:    { type: String },
  email:   { type: String },
  phone:   { type: String },
  message: { type: String, required: true },
  status:  { type: String, enum: ['new', 'in_progress', 'resolved'], default: 'new' },
}, { timestamps: true });

module.exports = mongoose.model('SupportMessage', supportMessageSchema);
