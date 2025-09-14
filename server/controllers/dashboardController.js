// controllers/dashboardController.js
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Appointment = require("../models/Appointment");

// GET /api/dashboard/summary
// Returns counts for patients, doctors, appointments and appointment status breakdown
const getSummary = asyncHandler(async (req, res) => {
  // Count users by role
  const [patientsCount, doctorsCount, adminsCount] = await Promise.all([
    User.countDocuments({ role: "patient" }),
    User.countDocuments({ role: "doctor" }),
    User.countDocuments({ role: "admin" }),
  ]);

  // Appointment counts
  const totalAppointments = await Appointment.countDocuments();
  // status breakdown - adjust statuses if your DB stores uppercase enums
  const scheduled = await Appointment.countDocuments({
    status: { $in: ["SCHEDULED", "Scheduled", "scheduled"] },
  });
  const completed = await Appointment.countDocuments({
    status: { $in: ["COMPLETED", "Completed", "completed"] },
  });
  const cancelled = await Appointment.countDocuments({
    status: { $in: ["CANCELLED", "Cancelled", "cancelled"] },
  });

  // Optionally: upcoming appointments (future and scheduled)
  const now = new Date();
  const upcoming = await Appointment.countDocuments({
    date: { $gte: now },
    status: { $in: ["SCHEDULED", "Scheduled", "scheduled"] },
  });

  res.json({
    users: {
      patients: patientsCount,
      doctors: doctorsCount,
      admins: adminsCount,
    },
    appointments: {
      total: totalAppointments,
      upcoming,
      byStatus: {
        scheduled,
        completed,
        cancelled,
      },
    },
  });
});

module.exports = { getSummary };
