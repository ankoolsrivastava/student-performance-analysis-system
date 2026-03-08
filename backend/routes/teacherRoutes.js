const express = require("express");
const router = express.Router();

const {
  teacherLogin,
  getStudents,
  addMarks,
  addAttendance,
} = require("../controllers/teacherController");

router.post("/login", teacherLogin);
router.get("/students", getStudents);
router.post("/marks", addMarks);
router.post("/attendance", addAttendance);

module.exports = router;