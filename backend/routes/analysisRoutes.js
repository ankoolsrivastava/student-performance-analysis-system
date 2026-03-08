const express = require("express");
const router = express.Router();

const {
  studentAverages,
  topStudents,
  weakStudents,
  subjectAverages,
  studentReport,
  weakStudentsDetail
} = require("../controllers/analysisController");

router.get("/averages", studentAverages);
router.get("/top-students", topStudents);
router.get("/weak-students", weakStudents);
router.get("/subjects", subjectAverages);
router.get("/student/:id", studentReport);
router.get("/weak-students-detail", weakStudentsDetail);

module.exports = router;