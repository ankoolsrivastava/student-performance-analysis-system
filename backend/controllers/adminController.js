const pool = require("../db");

/* Admin login */
exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM admins WHERE email=$1 AND password=$2",
      [email, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* Add teacher */
exports.addTeacher = async (req, res) => {
  const { name, email, password, department } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO teachers(name,email,password,department) VALUES($1,$2,$3,$4) RETURNING *",
      [name, email, password, department]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* Add subject */
exports.addSubject = async (req, res) => {
  const { subject_name, subject_code } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO subjects(subject_name,subject_code) VALUES($1,$2) RETURNING *",
      [subject_name, subject_code]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* View teachers */
exports.getTeachers = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT teacher_id,name,email,department FROM teachers ORDER BY teacher_id ASC"
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* View subjects */
exports.getSubjects = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM subjects ORDER BY subject_id ASC"
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};