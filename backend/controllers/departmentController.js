const { validationResult } = require('express-validator');
const pool = require('../config/db');

// ======================
// GET ALL COLLEGES
// ======================
const getColleges = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT c.*, 
              (SELECT COUNT(*) FROM departments d WHERE d.college_id = c.id AND d.is_active = 1) AS department_count
       FROM colleges c
       WHERE c.is_active = 1
       ORDER BY c.name`
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Get colleges error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching colleges.' });
  }
};

// ======================
// CREATE COLLEGE (Admin)
// ======================
const createCollege = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { name, code, description } = req.body;

  try {
    const [result] = await pool.execute(
      `INSERT INTO colleges (name, code, description) VALUES (?, ?, ?)`,
      [name, code || null, description || null]
    );

    res.status(201).json({
      success: true,
      message: 'College created successfully.',
      data: { id: result.insertId, name, code, description }
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ success: false, message: 'College name or code already exists.' });
    }
    console.error('Create college error:', error);
    res.status(500).json({ success: false, message: 'Server error creating college.' });
  }
};

// ======================
// GET ALL DEPARTMENTS (with college info)
// ======================
const getDepartments = async (req, res) => {
  try {
    const { college_id, active_only } = req.query;

    let sql = `
      SELECT d.*, c.name AS college_name, c.code AS college_code
      FROM departments d
      JOIN colleges c ON d.college_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (college_id) {
      sql += ` AND d.college_id = ?`;
      params.push(college_id);
    }
    if (active_only === 'true' || active_only === '1') {
      sql += ` AND d.is_active = 1 AND c.is_active = 1`;
    }

    sql += ` ORDER BY c.name, d.priority_order, d.name`;

    const [rows] = await pool.execute(sql, params);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Get departments error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching departments.' });
  }
};

// ======================
// GET SINGLE DEPARTMENT
// ======================
const getDepartment = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT d.*, c.name AS college_name, c.code AS college_code
       FROM departments d
       JOIN colleges c ON d.college_id = c.id
       WHERE d.id = ?`,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Department not found.' });
    }

    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Get department error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ======================
// CREATE DEPARTMENT (Admin)
// ======================
const createDepartment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const {
    college_id,
    name,
    code,
    description,
    capacity,
    min_total_score,
    min_gpa,
    min_english,
    min_mathematics,
    min_science,
    min_social,
    allowed_stream,
    priority_order
  } = req.body;

  const cap = parseInt(capacity, 10) || 0;

  try {
    // Verify college exists
    const [colleges] = await pool.execute('SELECT id FROM colleges WHERE id = ? AND is_active = 1', [college_id]);
    if (colleges.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid or inactive college.' });
    }

    const [result] = await pool.execute(
      `INSERT INTO departments 
       (college_id, name, code, description, capacity, remaining_capacity,
        min_total_score, min_gpa, min_english, min_mathematics, min_science, min_social,
        allowed_stream, priority_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        college_id,
        name,
        code || null,
        description || null,
        cap,
        cap, // remaining_capacity starts equal to capacity
        min_total_score || 0,
        min_gpa || 0,
        min_english || 0,
        min_mathematics || 0,
        min_science || 0,
        min_social || 0,
        allowed_stream || null,
        priority_order || 100
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Department created successfully.',
      data: { id: result.insertId, name, code, capacity: cap }
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ success: false, message: 'Department name or code already exists in this college.' });
    }
    console.error('Create department error:', error);
    res.status(500).json({ success: false, message: 'Server error creating department.' });
  }
};

// ======================
// UPDATE DEPARTMENT (Admin)
// ======================
const updateDepartment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { id } = req.params;
  const {
    college_id,
    name,
    code,
    description,
    capacity,
    min_total_score,
    min_gpa,
    min_english,
    min_mathematics,
    min_science,
    min_social,
    allowed_stream,
    priority_order,
    is_active
  } = req.body;

  try {
    // Check exists
    const [existing] = await pool.execute('SELECT id, capacity, remaining_capacity FROM departments WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Department not found.' });
    }

    const current = existing[0];
    const newCapacity = capacity !== undefined ? parseInt(capacity, 10) : current.capacity;

    // Adjust remaining_capacity if capacity changes
    let newRemaining = current.remaining_capacity;
    if (capacity !== undefined) {
      const used = current.capacity - current.remaining_capacity;
      newRemaining = Math.max(0, newCapacity - used);
    }

    await pool.execute(
      `UPDATE departments SET
         college_id = COALESCE(?, college_id),
         name = COALESCE(?, name),
         code = COALESCE(?, code),
         description = COALESCE(?, description),
         capacity = ?,
         remaining_capacity = ?,
         min_total_score = COALESCE(?, min_total_score),
         min_gpa = COALESCE(?, min_gpa),
         min_english = COALESCE(?, min_english),
         min_mathematics = COALESCE(?, min_mathematics),
         min_science = COALESCE(?, min_science),
         min_social = COALESCE(?, min_social),
         allowed_stream = ?,
         priority_order = COALESCE(?, priority_order),
         is_active = COALESCE(?, is_active)
       WHERE id = ?`,
      [
        college_id || null,
        name || null,
        code || null,
        description || null,
        newCapacity,
        newRemaining,
        min_total_score,
        min_gpa,
        min_english,
        min_mathematics,
        min_science,
        min_social,
        allowed_stream !== undefined ? allowed_stream : null,
        priority_order,
        is_active,
        id
      ]
    );

    res.json({ success: true, message: 'Department updated successfully.' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ success: false, message: 'Department name or code conflict.' });
    }
    console.error('Update department error:', error);
    res.status(500).json({ success: false, message: 'Server error updating department.' });
  }
};

// ======================
// DELETE / DEACTIVATE DEPARTMENT (Admin)
// ======================
const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { hard } = req.query; // ?hard=true for permanent delete

    if (hard === 'true') {
      await pool.execute('DELETE FROM departments WHERE id = ?', [id]);
      return res.json({ success: true, message: 'Department permanently deleted.' });
    }

    // Soft delete
    const [result] = await pool.execute(
      'UPDATE departments SET is_active = 0 WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Department not found.' });
    }

    res.json({ success: true, message: 'Department deactivated successfully.' });
  } catch (error) {
    console.error('Delete department error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ======================
// UPDATE COLLEGE (Admin)
// ======================
const updateCollege = async (req, res) => {
  const { id } = req.params;
  const { name, code, description, is_active } = req.body;

  try {
    const [result] = await pool.execute(
      `UPDATE colleges SET
         name = COALESCE(?, name),
         code = COALESCE(?, code),
         description = COALESCE(?, description),
         is_active = COALESCE(?, is_active)
       WHERE id = ?`,
      [name, code, description, is_active, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'College not found.' });
    }

    res.json({ success: true, message: 'College updated successfully.' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ success: false, message: 'College name or code already exists.' });
    }
    console.error('Update college error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = {
  getColleges,
  createCollege,
  updateCollege,
  getDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment
};
