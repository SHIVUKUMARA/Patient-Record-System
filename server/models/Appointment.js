const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  reason: { type: String },
  status: { type: String, enum: ['SCHEDULED','COMPLETED','CANCELLED'], default: 'SCHEDULED' },
  createdAt: { type: Date, default: Date.now }
});

// Prevent two SCHEDULED appointments for same doctor at exact same datetime
AppointmentSchema.index({ doctor: 1, date: 1 }, { unique: true, partialFilterExpression: { status: 'SCHEDULED' } });

module.exports = mongoose.model('Appointment', AppointmentSchema);
