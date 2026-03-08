const express = require("express");
const router = express.Router();

const {
  adminLogin,
  addTeacher,
  addSubject,
  getTeachers,
  getSubjects
} = require("../controllers/adminController");

router.post("/login", adminLogin);

router.post("/teachers", addTeacher);
router.get("/teachers", getTeachers);

router.post("/subjects", addSubject);
router.get("/subjects", getSubjects);

module.exports = router;