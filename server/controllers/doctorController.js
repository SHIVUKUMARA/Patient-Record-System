const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const createDoctorProfile = asyncHandler(async (req, res) => {
  const { name, email, password, specialization, phone, address, dob, gender } = req.body;
  const exists = await User.findOne({ email });
  if (exists) {
    res.status(400);
    throw new Error('User with email already exists');
  }
  const user = await User.create({ name, email, password, role: 'doctor', specialization, phone, address, dob, gender });
  res.status(201).json(user);
});

const getDoctors = asyncHandler(async (req, res) => {
  const doctors = await User.find({ role: 'doctor' }).select('-password').sort({ createdAt: -1 });
  res.json(doctors);
});

module.exports = { createDoctorProfile, getDoctors };
