const pool = require("../db");

/* ================= TEACHER LOGIN ================= */

exports.teacherLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT teacher_id,name,email FROM teachers WHERE email=$1 AND password=$2",
      [email, password],
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

/* ================= GET STUDENTS ================= */

exports.getStudents = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT student_id,name,roll_number,department,year
 FROM students
 ORDER BY student_id ASC`,
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= ADD MARKS ================= */

exports.addMarks = async (req, res) => {
  const { student_id, subject_id, marks } = req.body;

  const teacher = req.teacher || req.body.teacher_id;

  try {
    const result = await pool.query(
      `INSERT INTO marks(student_id,subject_id,teacher_id,marks)
VALUES($1,$2,$3,$4)
RETURNING *`,
      [student_id, subject_id, teacher, marks],
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= ADD ATTENDANCE ================= */

exports.addAttendance = async (req, res) => {
  const { student_id, subject_id, attendance_percentage } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO attendance(student_id,subject_id,attendance_percentage)
VALUES($1,$2,$3)
RETURNING *`,
      [student_id, subject_id, attendance_percentage],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= TEACHER PROFILE ================= */

exports.getTeacherById = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await pool.query(
      `SELECT teacher_id, name, email, department
FROM teachers
WHERE teacher_id = $1`,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= TEACHER SUBJECTS ================= */

exports.getTeacherSubjects = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await pool.query(
      `SELECT s.subject_id,s.subject_name
FROM teacher_subjects ts
JOIN subjects s ON ts.subject_id = s.subject_id
WHERE ts.teacher_id = $1`,
      [id],
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
