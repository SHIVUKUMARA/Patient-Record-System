const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/auth');
const { createPatientProfile, getPatients, getPatient } = require('../controllers/patientController');

router.route('/')
  .get(protect, authorizeRoles('admin'), getPatients)
  .post(protect, authorizeRoles('admin'), createPatientProfile);

router.route('/:id')
  .get(protect, authorizeRoles('admin','doctor'), getPatient);

module.exports = router;
