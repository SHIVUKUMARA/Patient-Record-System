const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/auth');
const { createDoctorProfile, getDoctors } = require('../controllers/doctorController');

router.route('/')
  .get(protect, getDoctors)
  .post(protect, authorizeRoles('admin'), createDoctorProfile);

module.exports = router;
