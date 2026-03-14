const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");

const {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentController");

/* ---------- Validation ---------- */

const validateStudent = [
  body("name").notEmpty().withMessage("Name is required"),
  body("roll_number").notEmpty().withMessage("Roll number is required"),
  body("email").isEmail().withMessage("Valid email required"),
  body("year")
    .isInt({ min: 1, max: 4 })
    .withMessage("Year must be between 1 and 4"),
];

/* ---------- Validation Error Handler ---------- */

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

/* Get all students */
router.get("/", getAllStudents);

/* Get single student */
router.get("/:id", getStudentById);

/* Create student */
router.post("/", validateStudent, handleValidation, createStudent);

/* Update student */
router.put("/:id", validateStudent, handleValidation, updateStudent);

/* Delete student */
router.delete("/:id", deleteStudent);

module.exports = router;
