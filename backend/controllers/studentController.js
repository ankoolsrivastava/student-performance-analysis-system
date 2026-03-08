const pool = require("../db");
const bcrypt = require("bcrypt");

/* Get all students */
exports.getAllStudents = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT student_id,name,roll_number,email,department,year FROM students ORDER BY student_id ASC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* Get single student */
exports.getStudentById = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await pool.query(
      "SELECT student_id,name,roll_number,email,department,year FROM students WHERE student_id=$1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* Create student */
exports.createStudent = async (req, res) => {
  const { name, roll_number, email, password, department, year } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO students(name,roll_number,email,password,department,year) VALUES($1,$2,$3,$4,$5,$6) RETURNING student_id,name,roll_number,email,department,year",
      [name, roll_number, email, hashedPassword, department, year]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    if (error.code === "23505") {
      return res.status(400).json({ message: "Email or roll number already exists" });
    }

    res.status(500).json({ message: "Server error" });
  }
};

/* Update student */
exports.updateStudent = async (req, res) => {
  const id = req.params.id;
  const { name, roll_number, email, department, year } = req.body;

  try {
    const result = await pool.query(
      "UPDATE students SET name=$1, roll_number=$2, email=$3, department=$4, year=$5 WHERE student_id=$6 RETURNING student_id,name,roll_number,email,department,year",
      [name, roll_number, email, department, year, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* Delete student */
exports.deleteStudent = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await pool.query(
      "DELETE FROM students WHERE student_id=$1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};