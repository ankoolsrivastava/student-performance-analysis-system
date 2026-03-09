const pool = require("../db");

exports.upsertMarks = async (req, res) => {
  const { student_id, subject_id, marks, teacher_id } = req.body;

  try {
    const result = await pool.query(`
      INSERT INTO marks(student_id, subject_id, marks, teacher_id)
      VALUES ($1,$2,$3,$4)
      ON CONFLICT (student_id, subject_id)
      DO UPDATE SET marks = EXCLUDED.marks
      RETURNING *
    `, [student_id, subject_id, marks, teacher_id]);

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};