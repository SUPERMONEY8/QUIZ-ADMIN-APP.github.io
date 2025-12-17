// Questions API routes
import express from 'express';
import { query } from '../db.js';

const router = express.Router();

// GET /api/questions - Get questions by quiz_id
router.get('/', async (req, res) => {
  try {
    const { quiz_id, admin_id } = req.query;
    
    if (!quiz_id || !admin_id) {
      return res.status(400).json({ error: 'quiz_id and admin_id are required' });
    }
    
    // Verify quiz belongs to admin
    const quizCheck = await query('SELECT id FROM quizzes WHERE id = $1 AND admin_id = $2', [quiz_id, admin_id]);
    if (quizCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Quiz not found or access denied' });
    }
    
    const result = await query(
      `SELECT * FROM questions 
       WHERE quiz_id = $1 
       ORDER BY question_order ASC`,
      [quiz_id]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/questions - Create new question
router.post('/', async (req, res) => {
  try {
    const {
      quiz_id,
      question_text,
      question_type,
      options,
      correct_answer,
      points,
      question_order,
      image_url,
      video_url,
    } = req.body;
    
    if (!quiz_id || !question_text || !question_type) {
      return res.status(400).json({ error: 'quiz_id, question_text, and question_type are required' });
    }
    
    const result = await query(
      `INSERT INTO questions (
        quiz_id, question_text, question_type, options, correct_answer,
        points, question_order, image_url, video_url, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
      RETURNING id`,
      [
        quiz_id,
        question_text,
        question_type,
        options ? JSON.stringify(options) : null,
        correct_answer,
        points || 1,
        question_order || 0,
        image_url || null,
        video_url || null,
      ]
    );
    
    res.status(201).json({ id: result.rows[0].id });
  } catch (error) {
    console.error('Error creating question:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/questions/:id - Update question
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { admin_id, ...updateData } = req.body;
    
    if (!admin_id) {
      return res.status(400).json({ error: 'admin_id is required' });
    }
    
    // Verify question belongs to admin's quiz
    const check = await query(
      `SELECT q.id FROM questions q
       JOIN quizzes qu ON q.quiz_id = qu.id
       WHERE q.id = $1 AND qu.admin_id = $2`,
      [id, admin_id]
    );
    if (check.rows.length === 0) {
      return res.status(404).json({ error: 'Question not found or access denied' });
    }
    
    const updates = [];
    const values = [];
    let paramCount = 1;
    
    const allowedFields = [
      'question_text', 'question_type', 'options', 'correct_answer',
      'points', 'question_order', 'image_url', 'video_url', 'status'
    ];
    
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        if (field === 'options' && typeof updateData[field] === 'object') {
          updates.push(`options = $${paramCount++}`);
          values.push(JSON.stringify(updateData[field]));
        } else {
          updates.push(`${field} = $${paramCount++}`);
          values.push(updateData[field]);
        }
      }
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    updates.push(`updated_at = NOW()`);
    values.push(id);
    
    await query(
      `UPDATE questions SET ${updates.join(', ')} WHERE id = $${paramCount}`,
      values
    );
    
    res.json({ id, message: 'Question updated successfully' });
  } catch (error) {
    console.error('Error updating question:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/questions/:id - Delete question
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { admin_id } = req.query;
    
    if (!admin_id) {
      return res.status(400).json({ error: 'admin_id is required' });
    }
    
    // Verify question belongs to admin's quiz
    const check = await query(
      `SELECT q.id FROM questions q
       JOIN quizzes qu ON q.quiz_id = qu.id
       WHERE q.id = $1 AND qu.admin_id = $2`,
      [id, admin_id]
    );
    if (check.rows.length === 0) {
      return res.status(404).json({ error: 'Question not found or access denied' });
    }
    
    await query('DELETE FROM questions WHERE id = $1', [id]);
    
    res.json({ id, message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;


