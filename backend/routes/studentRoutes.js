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

/* Validation middleware */
const validateStudent = [
  body("name").notEmpty().withMessage("Name is required"),
  body("roll_number").notEmpty().withMessage("Roll number is required"),
  body("email").isEmail().withMessage("Valid email required"),
  body("year").isInt({ min: 1, max: 4 }).withMessage("Year must be between 1 and 4"),
];

/* Handle validation errors */
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

/* Routes */

router.get("/", getAllStudents);

router.get("/:id", getStudentById);

router.post("/", validateStudent, handleValidation, createStudent);
router.post("/", createStudent);

router.put("/:id", validateStudent, handleValidation, updateStudent);

router.delete("/:id", deleteStudent);

module.exports = router;