const express = require("express");
const router = express.Router();
const analysisController = require("../controllers/analysisController");

/* Academic Data Routes */
router.get("/averages", analysisController.studentAverages);
router.get("/top-students", analysisController.topStudents);
router.get("/subjects", analysisController.subjectAverages);
router.get("/report/:id", analysisController.studentReport);
router.get("/full-profile", analysisController.getFullStudentProfile);

router.get("/filtered-standings", analysisController.getFilteredClassStandings);
/* Analysis Specific Routes */
router.get("/weak-students", analysisController.getWeakStudents);
router.get("/weak-details", analysisController.weakStudentsDetail);
router.get("/defaulters", analysisController.attendanceDefaulters);
router.get("/pass-ratio", analysisController.passFailRatio);
router.get("/at-risk", analysisController.atRiskStudents);
router.get("/trend", analysisController.getTrendData);
module.exports = router;
