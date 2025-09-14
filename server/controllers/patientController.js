const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const createPatientProfile = asyncHandler(async (req, res) => {
  const { name, email, password, dob, gender, phone, address } = req.body;
  const exists = await User.findOne({ email });
  if (exists) {
    res.status(400);
    throw new Error('User already exists');
  }
  const user = await User.create({ name, email, password, role: 'patient', dob, gender, phone, address });
  res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role });
});

const getPatients = asyncHandler(async (req, res) => {
  const patients = await User.find({ role: 'patient' }).select('-password').sort({ createdAt: -1 });
  res.json(patients);
});

const getPatient = asyncHandler(async (req, res) => {
  const patient = await User.findById(req.params.id).select('-password');
  if (!patient || patient.role !== 'patient') { res.status(404); throw new Error('Patient not found'); }
  res.json(patient);
});

module.exports = { createPatientProfile, getPatients, getPatient };
