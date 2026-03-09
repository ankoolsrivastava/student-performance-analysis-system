const express = require("express");
const router = express.Router();
const { upsertMarks } = require("../controllers/marksController");

router.post("/", upsertMarks);

module.exports = router;