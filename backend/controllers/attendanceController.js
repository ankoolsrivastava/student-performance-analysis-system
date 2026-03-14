const pool = require("../db");

/* 1. Save Daily Attendance (From Toggle Switches) */
exports.markDailyAttendance = async (req, res) => {
  const { date, subject_id, attendance_data } = req.body;

  try {
    await pool.query("BEGIN");

    for (let record of attendance_data) {
      const existing = await pool.query(
        `SELECT attendance_id FROM attendance WHERE student_id = $1 AND subject_id = $2 AND record_date = $3`,
        [record.student_id, subject_id, date],
      );

      if (existing.rows.length > 0) {
        await pool.query(
          `UPDATE attendance SET status = $1 WHERE attendance_id = $2`,
          [record.status, existing.rows[0].attendance_id],
        );
      } else {
        await pool.query(
          `INSERT INTO attendance (student_id, subject_id, record_date, status) VALUES ($1, $2, $3, $4)`,
          [record.student_id, subject_id, date, record.status],
        );
      }
    }

    await pool.query("COMMIT");
    res.status(200).json({ message: "Attendance saved successfully!" });
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Error saving attendance:", error);
    res.status(500).json({ message: "Server error saving attendance" });
  }
};

/* 2. Get Advanced Analytics (FIXED QUERY) */
exports.getAttendanceReport = async (req, res) => {
  const { subject_id, filterType } = req.query;

  try {
    let dateFilterSQL = "";
    if (filterType === "week") {
      dateFilterSQL = "AND a.record_date >= CURRENT_DATE - INTERVAL '7 days'";
    } else if (filterType === "month") {
      dateFilterSQL = "AND a.record_date >= CURRENT_DATE - INTERVAL '30 days'";
    }

    // FIXED: Moved subject filter and date filter INTO the LEFT JOIN condition
    // This ensures ALL students show up even with 0% attendance
    const query = `
      SELECT 
        s.student_id, 
        s.name, 
        s.roll_number,
        s.is_defaulter,
        COUNT(CASE WHEN a.status = 'Present' THEN 1 END) AS total_present,
        COUNT(a.attendance_id) AS total_days,
        COALESCE(ROUND((COUNT(CASE WHEN a.status = 'Present' THEN 1 END) * 100.0) / NULLIF(COUNT(a.attendance_id), 0), 1), 0) AS attendance_percentage
      FROM students s
      LEFT JOIN attendance a ON s.student_id = a.student_id 
        AND (a.subject_id = $1 OR $1 IS NULL)
        ${dateFilterSQL}
      GROUP BY s.student_id, s.name, s.roll_number, s.is_defaulter
      ORDER BY s.roll_number ASC
    `;

    const result = await pool.query(query, [subject_id || null]);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching report:", error);
    res.status(500).json({ message: "Server error fetching report" });
  }
};

/* 3. Manually Flag a Defaulter */
exports.flagDefaulter = async (req, res) => {
  const { student_id, flag_status } = req.body;

  try {
    const result = await pool.query(
      `UPDATE students SET is_defaulter = $1 WHERE student_id = $2 RETURNING *`,
      [flag_status, student_id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    res
      .status(200)
      .json({ message: "Status updated", student: result.rows[0] });
  } catch (error) {
    console.error("Error flagging defaulter:", error);
    res.status(500).json({ message: "Server error updating defaulter status" });
  }
};
