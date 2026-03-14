const pool = require("../db");

/* ================= GET ALL STUDENTS ================= */

exports.getAllStudents = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
student_id,
name,
roll_number,
email,
department,
year
FROM students
ORDER BY student_id ASC`,
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Get all students error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET SINGLE STUDENT ================= */

exports.getStudentById = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await pool.query(
      `SELECT * FROM students WHERE student_id = $1`,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Get student error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= CREATE STUDENT ================= */

exports.createStudent = async (req, res) => {
  const {
    name,
    roll_number,
    email,
    phone,
    parent_name,
    parent_phone,
    address,
    date_of_birth,
    department,
    year,
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO students
(name, roll_number, email, phone, parent_name, parent_phone, address, date_of_birth, department, year)
VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
RETURNING *`,
      [
        name,
        roll_number,
        email,
        phone,
        parent_name,
        parent_phone,
        address,
        date_of_birth,
        department,
        year,
      ],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Create student error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= UPDATE STUDENT ================= */

exports.updateStudent = async (req, res) => {
  const id = req.params.id;

  const { name, roll_number, email, department, year } = req.body;

  try {
    const result = await pool.query(
      `UPDATE students
SET
name = $1,
roll_number = $2,
email = $3,
department = $4,
year = $5
WHERE student_id = $6
RETURNING student_id,name,roll_number,email,department,year`,
      [name, roll_number, email, department, year, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Update student error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= DELETE STUDENT ================= */

exports.deleteStudent = async (req, res) => {
  const { id } = req.params;
  
  try {
    // 1. Delete all related data FIRST (Order matters!)
    await pool.query("DELETE FROM marks WHERE student_id = $1", [id]);
    await pool.query("DELETE FROM assignments WHERE student_id = $1", [id]);
    await pool.query("DELETE FROM attendance WHERE student_id = $1", [id]);

    // 2. NOW it is safe to delete the student
    const result = await pool.query(
      "DELETE FROM students WHERE student_id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Student not found." });
    }

    res.json({ message: "Student and all related records deleted successfully!" });
    
  } catch (err) {
    console.error("Deletion Error:", err.message);
    res.status(500).json({ message: "Server error during deletion." });
  }
};