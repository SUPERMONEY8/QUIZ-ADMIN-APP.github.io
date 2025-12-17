// Quizzes API routes
import express from 'express';
import { query } from '../db.js';

const router = express.Router();

// GET /api/quizzes - Get all quizzes for an admin
router.get('/', async (req, res) => {
  try {
    const { admin_id } = req.query;
    
    if (!admin_id) {
      return res.status(400).json({ error: 'admin_id is required' });
    }
    
    const result = await query(
      `SELECT * FROM quizzes 
       WHERE admin_id = $1 
       ORDER BY created_at DESC`,
      [admin_id]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/quizzes/:id - Get single quiz
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { admin_id } = req.query;
    
    if (!admin_id) {
      return res.status(400).json({ error: 'admin_id is required' });
    }
    
    const result = await query(
      'SELECT * FROM quizzes WHERE id = $1 AND admin_id = $2',
      [id, admin_id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Quiz not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/quizzes - Create new quiz
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      duration_minutes,
      difficulty,
      randomize_questions,
      randomize_answers,
      status,
      admin_id,
    } = req.body;
    
    if (!title || !admin_id) {
      return res.status(400).json({ error: 'title and admin_id are required' });
    }
    
    // Verify admin_id exists in users table
    const userCheck = await query('SELECT id FROM users WHERE id = $1', [admin_id]);
    if (userCheck.rows.length === 0) {
      // Create user if doesn't exist
      await query(
        'INSERT INTO users (id, created_at, updated_at) VALUES ($1, NOW(), NOW()) ON CONFLICT (id) DO NOTHING',
        [admin_id]
      );
    }
    
    const result = await query(
      `INSERT INTO quizzes (
        title, description, duration_minutes, difficulty,
        randomize_questions, randomize_answers, status, admin_id, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
      RETURNING id`,
      [
        title,
        description || null,
        duration_minutes || 30,
        difficulty || 'medium',
        randomize_questions || false,
        randomize_answers || false,
        status || 'draft',
        admin_id,
      ]
    );
    
    res.status(201).json({ id: result.rows[0].id });
  } catch (error) {
    console.error('Error creating quiz:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/quizzes/:id - Update quiz
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { admin_id, ...updateData } = req.body;
    
    if (!admin_id) {
      return res.status(400).json({ error: 'admin_id is required' });
    }
    
    // Verify quiz belongs to admin
    const check = await query('SELECT id FROM quizzes WHERE id = $1 AND admin_id = $2', [id, admin_id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ error: 'Quiz not found or access denied' });
    }
    
    const updates = [];
    const values = [];
    let paramCount = 1;
    
    const allowedFields = [
      'title', 'description', 'duration_minutes', 'difficulty',
      'randomize_questions', 'randomize_answers', 'status',
      'is_published', 'published_at', 'share_code', 'start_date', 'end_date'
    ];
    
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        const dbField = field === 'shareCode' ? 'share_code' : field;
        updates.push(`${dbField} = $${paramCount++}`);
        values.push(updateData[field]);
      }
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    updates.push(`updated_at = NOW()`);
    values.push(id, admin_id);
    
    await query(
      `UPDATE quizzes SET ${updates.join(', ')} 
       WHERE id = $${paramCount} AND admin_id = $${paramCount + 1}`,
      values
    );
    
    res.json({ id, message: 'Quiz updated successfully' });
  } catch (error) {
    console.error('Error updating quiz:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/quizzes/:id - Delete quiz
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { admin_id } = req.query;
    
    if (!admin_id) {
      return res.status(400).json({ error: 'admin_id is required' });
    }
    
    // Verify quiz belongs to admin
    const check = await query('SELECT id FROM quizzes WHERE id = $1 AND admin_id = $2', [id, admin_id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ error: 'Quiz not found or access denied' });
    }
    
    await query('DELETE FROM quizzes WHERE id = $1 AND admin_id = $2', [id, admin_id]);
    
    res.json({ id, message: 'Quiz deleted successfully' });
  } catch (error) {
    console.error('Error deleting quiz:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;


