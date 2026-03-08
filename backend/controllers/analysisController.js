const pool = require("../db");

/* Average marks per student */
exports.studentAverages = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.student_id, s.name, ROUND(AVG(m.marks),1) AS average_marks
      FROM students s
      JOIN marks m ON s.student_id = m.student_id
      GROUP BY s.student_id, s.name
      ORDER BY average_marks DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


/* Top students (limit 5) */
exports.topStudents = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.student_id, s.name, ROUND(AVG(m.marks),1) AS average_marks
      FROM students s
      JOIN marks m ON s.student_id = m.student_id
      GROUP BY s.student_id, s.name
      ORDER BY average_marks DESC
      LIMIT 5
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


/* Weak students (any subject <40) */
exports.weakStudents = async (req, res) => {
  try {

    const result = await pool.query(`
      SELECT DISTINCT s.student_id, s.name
      FROM marks m
      JOIN students s ON s.student_id = m.student_id
      WHERE m.marks < 40
      ORDER BY s.name
    `);

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


/* Subject performance averages */
exports.subjectAverages = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT sub.subject_id, sub.subject_name, ROUND(AVG(m.marks),1) AS average_marks
      FROM subjects sub
      JOIN marks m ON sub.subject_id = m.subject_id
      GROUP BY sub.subject_id, sub.subject_name
      ORDER BY sub.subject_id ASC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


/* Student detailed report */
exports.studentReport = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await pool.query(`
      SELECT sub.subject_name, m.marks
      FROM marks m
      JOIN subjects sub ON m.subject_id = sub.subject_id
      WHERE m.student_id = $1
      ORDER BY sub.subject_name ASC
    `, [id]);

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


/* Weak students detailed list (GROUPED PER STUDENT) */

exports.weakStudentsDetail = async (req, res) => {

  try{

    const result = await pool.query(`
SELECT
s.roll_number,
s.name,
STRING_AGG(sub.subject_name || ' (' || m.marks || ')', ', ') AS failed_subjects
FROM marks m
JOIN students s ON s.student_id = m.student_id
JOIN subjects sub ON sub.subject_id = m.subject_id
WHERE m.marks < 40
GROUP BY s.roll_number, s.name
ORDER BY s.roll_number
`);

    res.json(result.rows);

  }catch(error){

    console.error(error);
    res.status(500).json({ message: "Server error" });

  }

};