const pool = require("../db");

/* Teacher login */
exports.teacherLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM teachers WHERE email=$1 AND password=$2",
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

/* Get all students */
exports.getStudents = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT student_id,name,roll_number,department,year FROM students ORDER BY student_id ASC"
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* Add marks */
exports.addMarks = async (req, res) => {
  const { student_id, subject_id, teacher_id, marks } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO marks(student_id,subject_id,teacher_id,marks) VALUES($1,$2,$3,$4) RETURNING *",
      [student_id, subject_id, teacher_id, marks]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* Add attendance */
exports.addAttendance = async (req, res) => {
  const { student_id, subject_id, attendance_percentage } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO attendance(student_id,subject_id,attendance_percentage) VALUES($1,$2,$3) RETURNING *",
      [student_id, subject_id, attendance_percentage]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};