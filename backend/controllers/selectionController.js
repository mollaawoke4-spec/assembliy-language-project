const { validationResult } = require('express-validator');
const pool = require('../config/db');

// ======================
// GET SYSTEM SETTINGS
// ======================
const getSettings = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT setting_key, setting_value FROM system_settings');
    const settings = {};
    rows.forEach(r => { settings[r.setting_key] = r.setting_value; });
    res.json({ success: true, data: settings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to load settings' });
  }
};

// ======================
// UPDATE SETTINGS (Admin)
// ======================
const updateSettings = async (req, res) => {
  const { selection_open, max_choices, selection_message } = req.body;
  try {
    if (selection_open !== undefined) {
      await pool.execute(
        `INSERT INTO system_settings (setting_key, setting_value) VALUES ('selection_open', ?)
         ON DUPLICATE KEY UPDATE setting_value = ?`,
        [String(selection_open), String(selection_open)]
      );
    }
    if (max_choices !== undefined) {
      await pool.execute(
        `INSERT INTO system_settings (setting_key, setting_value) VALUES ('max_choices', ?)
         ON DUPLICATE KEY UPDATE setting_value = ?`,
        [String(max_choices), String(max_choices)]
      );
    }
    if (selection_message !== undefined) {
      await pool.execute(
        `INSERT INTO system_settings (setting_key, setting_value) VALUES ('selection_message', ?)
         ON DUPLICATE KEY UPDATE setting_value = ?`,
        [selection_message, selection_message]
      );
    }
    res.json({ success: true, message: 'Settings updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to update settings' });
  }
};

// ======================
// GET ELIGIBLE DEPARTMENTS FOR CURRENT STUDENT
// ======================
const getEligibleDepartments = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get student academic data
    const [academic] = await pool.execute(
      `SELECT total_score, gpa, english_score, mathematics_score, science_score, social_score, stream, category
       FROM student_academic WHERE user_id = ?`,
      [userId]
    );

    if (academic.length === 0) {
      return res.status(400).json({ success: false, message: 'Academic information not found. Please complete your profile.' });
    }

    const student = academic[0];

    // Get all active departments
    const [departments] = await pool.execute(
      `SELECT d.*, c.name AS college_name, c.code AS college_code
       FROM departments d
       JOIN colleges c ON d.college_id = c.id
       WHERE d.is_active = 1 AND c.is_active = 1
       ORDER BY c.name, d.priority_order, d.name`
    );

    // Filter eligible
    const eligible = departments.filter(d => {
      if (d.min_total_score && student.total_score < d.min_total_score) return false;
      if (d.min_gpa && student.gpa < d.min_gpa) return false;
      if (d.min_english && student.english_score < d.min_english) return false;
      if (d.min_mathematics && student.mathematics_score < d.min_mathematics) return false;
      if (d.min_science && student.science_score < d.min_science) return false;
      if (d.min_social && student.social_score < d.min_social) return false;
      if (d.allowed_stream && student.stream && d.allowed_stream !== student.stream) return false;
      return true;
    });

    res.json({
      success: true,
      data: {
        student_scores: student,
        eligible_count: eligible.length,
        total_departments: departments.length,
        departments: eligible
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to load eligible departments' });
  }
};

// ======================
// GET CURRENT STUDENT CHOICES
// ======================
const getMyChoices = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT sc.id, sc.choice_order, sc.department_id,
              d.name AS department_name, d.code AS department_code,
              c.name AS college_name
       FROM student_choices sc
       JOIN departments d ON sc.department_id = d.id
       JOIN colleges c ON d.college_id = c.id
       WHERE sc.user_id = ?
       ORDER BY sc.choice_order`,
      [req.user.id]
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to load choices' });
  }
};

// ======================
// SUBMIT / UPDATE CHOICES
// ======================
const submitChoices = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { choices } = req.body; // array of { department_id, choice_order }
  const userId = req.user.id;

  if (!Array.isArray(choices) || choices.length === 0) {
    return res.status(400).json({ success: false, message: 'Please provide at least one choice' });
  }

  // Check if selection is open
  const [settings] = await pool.execute(
    `SELECT setting_value FROM system_settings WHERE setting_key = 'selection_open'`
  );
  if (settings.length && settings[0].setting_value !== '1') {
    return res.status(403).json({ success: false, message: 'Department selection is currently closed.' });
  }

  // Check max choices
  const [maxSet] = await pool.execute(
    `SELECT setting_value FROM system_settings WHERE setting_key = 'max_choices'`
  );
  const maxChoices = maxSet.length ? parseInt(maxSet[0].setting_value, 10) : 3;
  if (choices.length > maxChoices) {
    return res.status(400).json({ success: false, message: `You can select maximum ${maxChoices} departments.` });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Delete previous choices
    await connection.execute('DELETE FROM student_choices WHERE user_id = ?', [userId]);

    // Insert new choices
    for (const choice of choices) {
      await connection.execute(
        `INSERT INTO student_choices (user_id, department_id, choice_order) VALUES (?, ?, ?)`,
        [userId, choice.department_id, choice.choice_order]
      );
    }

    await connection.commit();
    res.json({ success: true, message: 'Your department preferences have been saved successfully.' });
  } catch (error) {
    await connection.rollback();
    console.error(error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, message: 'Duplicate choice detected.' });
    }
    res.status(500).json({ success: false, message: 'Failed to save choices' });
  } finally {
    connection.release();
  }
};

// ======================
// GET MY RESULT
// ======================
const getMyResult = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT a.*, d.name AS department_name, d.code AS department_code,
              c.name AS college_name, c.code AS college_code
       FROM assignments a
       LEFT JOIN departments d ON a.department_id = d.id
       LEFT JOIN colleges c ON d.college_id = c.id
       WHERE a.user_id = ?`,
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.json({
        success: true,
        data: { status: 'Pending', message: 'Assignment has not been run yet. Please check back later.' }
      });
    }

    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to load result' });
  }
};

// ======================
// RUN AUTOMATIC ASSIGNMENT (Admin)
// ======================
const runAssignment = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Reset remaining capacity
    await connection.execute(
      `UPDATE departments SET remaining_capacity = capacity WHERE is_active = 1`
    );

    // Clear previous assignments
    await connection.execute('DELETE FROM assignments');

    // Get all students who have submitted choices, ordered by total_score DESC
    const [students] = await connection.execute(
      `SELECT u.id AS user_id, sa.total_score, sa.gpa
       FROM users u
       JOIN student_academic sa ON u.id = sa.user_id
       JOIN student_choices sc ON u.id = sc.user_id
       WHERE u.role = 'student' AND u.is_active = 1
       GROUP BY u.id
       ORDER BY sa.total_score DESC, sa.gpa DESC`
    );

    let assignedCount = 0;
    let notAssignedCount = 0;

    for (const student of students) {
      // Get student's choices in order
      const [choices] = await connection.execute(
        `SELECT sc.department_id, sc.choice_order, d.remaining_capacity, d.name
         FROM student_choices sc
         JOIN departments d ON sc.department_id = d.id
         WHERE sc.user_id = ? AND d.is_active = 1
         ORDER BY sc.choice_order ASC`,
        [student.user_id]
      );

      let assigned = false;

      for (const choice of choices) {
        if (choice.remaining_capacity > 0) {
          // Assign
          await connection.execute(
            `INSERT INTO assignments (user_id, department_id, choice_order, status, score_used, assigned_at)
             VALUES (?, ?, ?, 'Assigned', ?, NOW())`,
            [student.user_id, choice.department_id, choice.choice_order, student.total_score]
          );

          // Decrease remaining capacity
          await connection.execute(
            `UPDATE departments SET remaining_capacity = remaining_capacity - 1 WHERE id = ?`,
            [choice.department_id]
          );

          assigned = true;
          assignedCount++;
          break;
        }
      }

      if (!assigned) {
        await connection.execute(
          `INSERT INTO assignments (user_id, department_id, choice_order, status, score_used, remarks)
           VALUES (?, NULL, NULL, 'Not Assigned', ?, 'No available capacity in selected departments')`,
          [student.user_id, student.total_score]
        );
        notAssignedCount++;
      }
    }

    // Mark assignment as done
    await connection.execute(
      `INSERT INTO system_settings (setting_key, setting_value) VALUES ('assignment_done', '1')
       ON DUPLICATE KEY UPDATE setting_value = '1'`
    );

    await connection.commit();

    res.json({
      success: true,
      message: 'Automatic assignment completed successfully.',
      data: {
        total_students: students.length,
        assigned: assignedCount,
        not_assigned: notAssignedCount
      }
    });
  } catch (error) {
    await connection.rollback();
    console.error('Assignment error:', error);
    res.status(500).json({ success: false, message: 'Failed to run assignment', error: error.message });
  } finally {
    connection.release();
  }
};

// ======================
// GET ALL RESULTS (Admin)
// ======================
const getAllResults = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT a.id, a.status, a.choice_order, a.score_used, a.assigned_at, a.remarks,
              u.student_id, p.first_name, p.last_name,
              d.name AS department_name, d.code AS department_code,
              c.name AS college_name
       FROM assignments a
       JOIN users u ON a.user_id = u.id
       LEFT JOIN student_profiles p ON u.id = p.user_id
       LEFT JOIN departments d ON a.department_id = d.id
       LEFT JOIN colleges c ON d.college_id = c.id
       ORDER BY a.status, a.score_used DESC`
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to load results' });
  }
};

module.exports = {
  getSettings,
  updateSettings,
  getEligibleDepartments,
  getMyChoices,
  submitChoices,
  getMyResult,
  runAssignment,
  getAllResults
};
