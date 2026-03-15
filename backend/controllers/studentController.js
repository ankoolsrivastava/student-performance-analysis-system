const pool = require("../db");
/* Auto-Generate Next Roll Number (Safe JS Parsing) */
exports.getNextRollNumber = async (req, res) => {
  try {
    // 1. Just grab all roll numbers, no fancy SQL regex that might crash
    const result = await pool.query(
      "SELECT roll_number FROM students WHERE roll_number IS NOT NULL",
    );

    if (result.rows.length === 0) {
      return res.json({ nextRoll: "BCS301" });
    }

    let maxNum = 300; // Baseline starting number
    let currentPrefix = "BCS"; // Default prefix

    // 2. Loop through them in JavaScript to find the absolute highest number safely
    result.rows.forEach((row) => {
      // Look for a pattern of "Letters followed by Numbers" (e.g., "BCS302")
      const match = row.roll_number.match(/^([A-Za-z]+)(\d+)$/);

      if (match) {
        currentPrefix = match[1].toUpperCase(); // Extracts "BCS"
        const num = parseInt(match[2], 10); // Extracts 302

        if (num > maxNum) {
          maxNum = num; // Keep track of the highest number we find
        }
      }
    });

    // 3. Add 1 to the highest number found
    const nextRoll = `${currentPrefix}${maxNum + 1}`;

    res.json({ nextRoll });
  } catch (err) {
    console.error("Roll Number Gen Error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
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
    blood_group,
  } = req.body; // <-- Added blood_group here

  try {
    const result = await pool.query(
      `INSERT INTO students
      (name, roll_number, email, phone, parent_name, parent_phone, address, date_of_birth, department, year, blood_group)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      RETURNING *`,
      [
        name,
        roll_number,
        email,
        phone,
        parent_name,
        parent_phone,
        address,
        date_of_birth || null,
        department,
        year,
        blood_group || null,
      ],
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === "23505") {
      return res
        .status(400)
        .json({ message: `Roll number ${roll_number} is already taken.` });
    }
    console.error("Create student error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= UPDATE STUDENT ================= */
exports.updateStudent = async (req, res) => {
  const id = req.params.id;
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
      `UPDATE students 
       SET name = $1, roll_number = $2, email = $3, phone = $4, 
           parent_name = $5, parent_phone = $6, address = $7, 
           date_of_birth = $8, department = $9, year = $10
       WHERE student_id = $11 
       RETURNING *`,
      [
        name,
        roll_number,
        email,
        phone,
        parent_name,
        parent_phone,
        address,
        date_of_birth || null,
        department,
        year,
        id,
      ],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    if (err.code === "23505") {
      return res
        .status(400)
        .json({ message: `Roll number ${roll_number} is already taken.` });
    }
    console.error("Update student error:", err);
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
      [id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Student not found." });
    }

    res.json({
      message: "Student and all related records deleted successfully!",
    });
  } catch (err) {
    console.error("Deletion Error:", err.message);
    res.status(500).json({ message: "Server error during deletion." });
  }
};
