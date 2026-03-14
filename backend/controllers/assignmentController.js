const pool = require("../db");

// Get students and their assignment status for a specific subject
exports.getAssignmentStatus = async (req, res) => {
  const { subject_id } = req.query;
  try {
    const result = await pool.query(
      `
            SELECT 
                s.student_id, 
                s.name, 
                s.roll_number,
                a.assignment_id,
                a.title,
                COALESCE(a.status, false) as is_done,
                a.due_date
            FROM students s
            LEFT JOIN assignments a ON s.student_id = a.student_id AND a.subject_id = $1
            ORDER BY s.roll_number ASC
        `,
      [subject_id],
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching assignments" });
  }
};

// Create or Update an assignment record
exports.upsertAssignment = async (req, res) => {
  const { student_id, subject_id, title, status, due_date } = req.body;
  try {
    const result = await pool.query(
      `
            INSERT INTO assignments (student_id, subject_id, title, status, due_date)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (student_id, subject_id, title) 
            DO UPDATE SET status = EXCLUDED.status, due_date = EXCLUDED.due_date
            RETURNING *
        `,
      [student_id, subject_id, title, status, due_date],
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving assignment" });
  }
};
