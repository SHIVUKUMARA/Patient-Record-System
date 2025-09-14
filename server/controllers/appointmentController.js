const asyncHandler = require('express-async-handler');
const Appointment = require('../models/Appointment');
const User = require('../models/User');

const isDoctorAvailable = async (doctorId, date) => {
  const existing = await Appointment.findOne({ doctor: doctorId, date: date, status: 'SCHEDULED' });
  return !existing;
};

const createAppointment = asyncHandler(async (req, res) => {
  const { doctorId, date, reason, patientId } = req.body;

  if (!date) { res.status(400); throw new Error('Appointment date/time required'); }
  const apptDate = new Date(date);
  if (isNaN(apptDate)) { res.status(400); throw new Error('Invalid date'); }

  const doctor = await User.findById(doctorId);
  if (!doctor || doctor.role !== 'doctor') { res.status(400); throw new Error('Doctor not found'); }

  let patientRef = null;
  if (req.user.role === 'patient') {
    patientRef = req.user._id;
  } else if (req.user.role === 'admin') {
    if (!patientId) { res.status(400); throw new Error('patientId required when admin creates appointment'); }
    const patient = await User.findById(patientId);
    if (!patient || patient.role !== 'patient') { res.status(400); throw new Error('Patient not found'); }
    patientRef = patientId;
  } else {
    res.status(403);
    throw new Error('Only patients or admins can book appointments');
  }

  const available = await isDoctorAvailable(doctorId, apptDate);
  if (!available) { res.status(409); throw new Error('Doctor already has an appointment at this time'); }

  const appt = await Appointment.create({ patient: patientRef, doctor: doctorId, date: apptDate, reason });
  res.status(201).json(appt);
});

const getAppointments = asyncHandler(async (req, res) => {
  const user = req.user;
  let query = {};
  if (user.role === 'doctor') query = { doctor: user._id };
  else if (user.role === 'patient') query = { patient: user._id };
  const appts = await Appointment.find(query)
    .populate('patient', 'name email phone')
    .populate('doctor', 'name email specialization phone')
    .sort({ date: 1 });
  res.json(appts);
});

const updateAppointmentStatus = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') { res.status(403); throw new Error('Only admin can update appointment status'); }
  const appt = await Appointment.findById(req.params.id);
  if (!appt) { res.status(404); throw new Error('Appointment not found'); }
  const { status } = req.body;
  if (!['SCHEDULED','COMPLETED','CANCELLED'].includes(status)) { res.status(400); throw new Error('Invalid status'); }
  appt.status = status;
  await appt.save();
  res.json(appt);
});

module.exports = { createAppointment, getAppointments, updateAppointmentStatus };
