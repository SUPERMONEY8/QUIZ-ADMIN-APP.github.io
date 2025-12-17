// Results API routes
import express from 'express';
import { query } from '../db.js';

const router = express.Router();

// GET /api/results - Get results by quiz_id (requires admin_id)
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
      `SELECT * FROM results 
       WHERE quiz_id = $1 
       ORDER BY submitted_at DESC`,
      [quiz_id]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching results:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/results - Create new result (public, no admin_id required)
router.post('/', async (req, res) => {
  try {
    const {
      quiz_id,
      participant_name,
      participant_email,
      score,
      total_questions,
      correct_answers,
      answers,
      time_taken_seconds,
    } = req.body;
    
    if (!quiz_id) {
      return res.status(400).json({ error: 'quiz_id is required' });
    }
    
    const result = await query(
      `INSERT INTO results (
        quiz_id, participant_name, participant_email, score, total_questions,
        correct_answers, answers, time_taken_seconds, submitted_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
      RETURNING id`,
      [
        quiz_id,
        participant_name || null,
        participant_email || null,
        score || 0,
        total_questions || 0,
        correct_answers || 0,
        answers ? JSON.stringify(answers) : null,
        time_taken_seconds || 0,
      ]
    );
    
    res.status(201).json({ id: result.rows[0].id });
  } catch (error) {
    console.error('Error creating result:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;


