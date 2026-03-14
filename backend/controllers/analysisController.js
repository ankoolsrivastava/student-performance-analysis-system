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
  const { exam_type } = req.query;
  try {
    let query;
    let params = [];
    if (exam_type && exam_type !== "Overall") {
      query = `
        SELECT s.student_id, s.name, m.marks AS average_marks
        FROM students s
        JOIN marks m ON s.student_id = m.student_id
        WHERE m.exam_type = $1
        ORDER BY m.marks DESC
        LIMIT 5
      `;
      params = [exam_type];
    } else {
      query = `
        SELECT s.student_id, s.name, ROUND(AVG(m.marks),1) AS average_marks
        FROM students s
        JOIN marks m ON s.student_id = m.student_id
        GROUP BY s.student_id, s.name
        ORDER BY average_marks DESC
        LIMIT 5
      `;
    }
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* Weak students - THE CORE FIX FOR YOUR NEW UI */
exports.getWeakStudents = async (req, res) => {
  try {
    const query = `
            SELECT 
                s.roll_number, 
                s.name, 
                json_agg(json_build_object(
                    'subject', sub.subject_name, 
                    'marks', m.marks, 
                    'type', m.exam_type
                )) as failures
            FROM students s
            JOIN marks m ON s.student_id = m.student_id
            JOIN subjects sub ON m.subject_id = sub.subject_id
            WHERE m.marks < 40
            GROUP BY s.student_id, s.roll_number, s.name
            ORDER BY s.roll_number ASC;
        `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error("Weak Analysis Error:", err.message);
    res.status(500).json({ error: err.message });
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
    const result = await pool.query(
      `
      SELECT sub.subject_name, m.marks, m.exam_type
      FROM marks m
      JOIN subjects sub ON m.subject_id = sub.subject_id
      WHERE m.student_id = $1
      ORDER BY 
        CASE 
          WHEN m.exam_type = 'Unit Test 1' THEN 1
          WHEN m.exam_type = 'Unit Test 2' THEN 2
          WHEN m.exam_type = 'End Sem' THEN 3
          ELSE 4 
        END ASC, 
        sub.subject_name ASC
    `,
      [id],
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* Weak students detailed list */
/* Weak students detailed list */
exports.weakStudentsDetail = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
          s.roll_number, 
          s.name,
          -- This line fixes the logical error by adding the Exam Type before the Subject
          STRING_AGG(m.exam_type || ': ' || sub.subject_name || ' (' || m.marks || ')', ', ') AS failed_subjects
      FROM marks m
      JOIN students s ON s.student_id = m.student_id
      JOIN subjects sub ON sub.subject_id = m.subject_id
      WHERE m.marks < 40
      GROUP BY s.roll_number, s.name
      ORDER BY s.roll_number
    `);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* Attendance Defaulters */
exports.attendanceDefaulters = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.student_id, s.name, s.roll_number, 
      COALESCE(ROUND((COUNT(CASE WHEN a.status = 'Present' THEN 1 END) * 100.0) / NULLIF(COUNT(a.attendance_id), 0), 1), 0) AS attendance_percentage
      FROM students s
      LEFT JOIN attendance a ON s.student_id = a.student_id
      WHERE s.is_defaulter = true
      GROUP BY s.student_id, s.name, s.roll_number
      ORDER BY attendance_percentage ASC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* Pass / Fail Ratio */
exports.passFailRatio = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        COUNT(CASE WHEN avg_marks >= 40 THEN 1 END) AS passed,
        COUNT(CASE WHEN avg_marks < 40 THEN 1 END) AS failed
      FROM (
        SELECT AVG(marks) AS avg_marks
        FROM marks
        GROUP BY student_id
      ) as student_avgs
    `);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* At-Risk Students */
exports.atRiskStudents = async (req, res) => {
  try {
    const result = await pool.query(`
      WITH academic_avg AS (
        SELECT student_id, AVG(marks) as avg_marks
        FROM marks
        GROUP BY student_id
      ),
      attendance_avg AS (
        SELECT student_id, ROUND((COUNT(CASE WHEN status = 'Present' THEN 1 END) * 100.0) / NULLIF(COUNT(attendance_id), 0), 1) AS att_percentage
        FROM attendance
        GROUP BY student_id
      )
      SELECT s.student_id, s.name, s.roll_number,
      COALESCE(ROUND(acad.avg_marks, 1), 0) as current_avg_marks,
      COALESCE(att.att_percentage, 0) as current_att_percentage
      FROM students s
      LEFT JOIN academic_avg acad ON s.student_id = acad.student_id
      LEFT JOIN attendance_avg att ON s.student_id = att.student_id
      WHERE acad.avg_marks < 50 AND att.att_percentage < 75
      ORDER BY acad.avg_marks ASC;
    `);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* Full Academic Profile */
exports.getFullStudentProfile = async (req, res) => {
  try {
    const result = await pool.query(`
            SELECT 
                s.student_id, s.name, s.roll_number,
                MAX(CASE WHEN m.exam_type = 'Unit Test 1' THEN m.marks END) as ut1,
                MAX(CASE WHEN m.exam_type = 'Unit Test 2' THEN m.marks END) as ut2,
                MAX(CASE WHEN m.exam_type = 'End Sem' THEN m.marks END) as end_sem,
                ROUND((COUNT(CASE WHEN a.status = true THEN 1 END)::numeric / NULLIF(COUNT(a.assignment_id), 0)::numeric) * 100, 1) as assign_completion
            FROM students s
            LEFT JOIN marks m ON s.student_id = m.student_id
            LEFT JOIN assignments a ON s.student_id = a.student_id
            GROUP BY s.student_id, s.name, s.roll_number
            ORDER BY s.roll_number ASC
        `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};


/* Filtered Class Standings for Report Tab */
exports.getFilteredClassStandings = async (req, res) => {
  const { exam_type, subject_id } = req.query;

  // This will print in your VS Code terminal when you change the dropdown
  console.log(
    `[REPORT API] Fetching Exam: "${exam_type}", Subject ID: "${subject_id}"`,
  );

  try {
    const result = await pool.query(
      `
      SELECT 
          s.student_id, 
          s.name, 
          s.roll_number,
          MAX(m.marks) as academic_progress,
          COALESCE(
              ROUND(
                  (COUNT(CASE WHEN a.status = true THEN 1 END)::numeric / 
                  NULLIF(COUNT(a.assignment_id), 0)::numeric) * 100, 
              1), 
          0) as assign_completion
      FROM students s
      LEFT JOIN marks m ON s.student_id = m.student_id 
          AND m.exam_type = $1 
          AND m.subject_id = $2::integer
      LEFT JOIN assignments a ON s.student_id = a.student_id 
          AND a.subject_id = $2::integer
      GROUP BY s.student_id, s.name, s.roll_number
      ORDER BY s.roll_number ASC
    `,
      [exam_type, subject_id],
    );

    console.log(`[REPORT API] Success! Found ${result.rows.length} rows.`);
    res.json(result.rows);
  } catch (err) {
    // This will print the EXACT error in your terminal
    console.error("🔥 CRITICAL SQL ERROR:", err.message);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
