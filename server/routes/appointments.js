const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { createAppointment, getAppointments, updateAppointmentStatus } = require('../controllers/appointmentController');

router.route('/')
  .get(protect, getAppointments)
  .post(protect, createAppointment);

router.route('/:id/status')
  .put(protect, updateAppointmentStatus);

module.exports = router;
