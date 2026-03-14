const express = require("express");
const router = express.Router();

const {
  markDailyAttendance,
  getAttendanceReport,
  flagDefaulter
} = require("../controllers/attendanceController");

router.post("/mark", markDailyAttendance);
router.get("/report", getAttendanceReport);
router.post("/flag", flagDefaulter);

module.exports = router;