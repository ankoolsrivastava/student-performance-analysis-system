const express = require("express");
const router = express.Router();
const marksController = require("../controllers/marksController");

// This route now handles Unit Tests and End Sem based on the body data
router.post("/upsert", marksController.upsertMarks);

module.exports = router;
