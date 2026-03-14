const pool = require("../db");

exports.upsertMarks = async (req, res) => {
  const { student_id, subject_id, marks, teacher_id, exam_type } = req.body;

  // Log to terminal for debugging
  console.log("Processing Upsert:", {
    student_id,
    subject_id,
    marks,
    exam_type,
  });

  try {
    // We use the column names directly in ON CONFLICT.
    // PostgreSQL looks for the unique index that covers these 3 columns.
    const result = await pool.query(
      `
  INSERT INTO marks (student_id, subject_id, marks, teacher_id, exam_type)
  VALUES ($1, $2, $3, $4, $5)
  ON CONFLICT (student_id, subject_id, exam_type) 
  DO UPDATE SET marks = EXCLUDED.marks
  RETURNING *
`,
      [student_id, subject_id, marks, teacher_id, exam_type],
    );

    console.log("Successfully saved:", result.rows[0]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error("DATABASE ERROR:", err.message);
    res.status(500).json({
      message: "Server error",
      detail: err.message,
    });
  }
};

exports.addMarks = async (req, res) => {
  const { student_id, subject_id, marks, exam_type } = req.body;
  try {
    await pool.query(
      "INSERT INTO marks (student_id, subject_id, marks, exam_type) VALUES ($1, $2, $3, $4)",
      [
        parseInt(student_id),
        parseInt(subject_id),
        parseFloat(marks),
        exam_type,
      ],
    );
    res.json({ message: "Marks added successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
