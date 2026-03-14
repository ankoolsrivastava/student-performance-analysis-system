const express = require("express");
const router = express.Router();

const {
  teacherLogin,
  getStudents,
  addMarks,
  addAttendance,
  getTeacherById,
  getTeacherSubjects,
} = require("../controllers/teacherController");

/* ================= TEACHER AUTH ================= */

/* Teacher login */
router.post("/login", teacherLogin);

/* ================= TEACHER PROFILE ================= */

/* Get teacher profile */
router.get("/:id", getTeacherById);

/* Get subjects taught by teacher */
router.get("/:id/subjects", getTeacherSubjects);

/* ================= STUDENT ACCESS ================= */

/* Get students for teacher dashboard */
router.get("/students", getStudents);

/* ================= MARKS ================= */

/* Add or update student marks */
router.post("/marks", addMarks);

/* ================= ATTENDANCE ================= */

/* Add attendance */
router.post("/attendance", addAttendance);

module.exports = router;
