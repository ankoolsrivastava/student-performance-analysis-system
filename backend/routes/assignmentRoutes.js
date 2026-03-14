const express = require("express");
const router = express.Router();
const assignmentController = require("../controllers/assignmentController");

router.get("/status", assignmentController.getAssignmentStatus);
router.post("/upsert", assignmentController.upsertAssignment);

module.exports = router;
