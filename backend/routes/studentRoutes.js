const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");

const {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getNextRollNumber // <--- ADDED THIS IMPORT
} = require("../controllers/studentController");

/* ---------- Validation ---------- */
const validateStudent = [
  body("name").notEmpty().withMessage("Name is required"),
  body("roll_number").notEmpty().withMessage("Roll number is required"),
  body("year")
    .isInt({ min: 1, max: 4 })
    .withMessage("Year must be between 1 and 4"),
];

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  next();
};

/* ---------- Routes ---------- */

// 1. STATIC ROUTES MUST BE AT THE TOP
router.get("/next-roll", getNextRollNumber);

// 2. GENERAL GET ROUTES
router.get("/", getAllStudents);

// 3. DYNAMIC ID ROUTES AT THE BOTTOM
router.get("/:id", getStudentById);
router.post("/", validateStudent, handleValidation, createStudent);
router.put("/:id", validateStudent, handleValidation, updateStudent);
router.delete("/:id", deleteStudent);

module.exports = router;