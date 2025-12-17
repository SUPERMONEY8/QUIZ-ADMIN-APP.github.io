// Users API routes
import express from 'express';
import { query } from '../db.js';

const router = express.Router();

// GET /api/users/:id - Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/users - Create new user
router.post('/', async (req, res) => {
  try {
    const { id, email, name } = req.body;
    
    if (!id) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    // Check if user already exists
    const existing = await query('SELECT id FROM users WHERE id = $1', [id]);
    if (existing.rows.length > 0) {
      return res.json({ id, message: 'User already exists' });
    }
    
    // Create new user
    await query(
      `INSERT INTO users (id, email, name, created_at, updated_at)
       VALUES ($1, $2, $3, NOW(), NOW())
       ON CONFLICT (id) DO NOTHING`,
      [id, email || null, name || null]
    );
    
    res.status(201).json({ id, message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/users/:id - Update user
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { email, name, app_name, color_palette, selected_icon } = req.body;
    
    const updates = [];
    const values = [];
    let paramCount = 1;
    
    if (email !== undefined) {
      updates.push(`email = $${paramCount++}`);
      values.push(email);
    }
    if (name !== undefined) {
      updates.push(`name = $${paramCount++}`);
      values.push(name);
    }
    if (app_name !== undefined) {
      updates.push(`app_name = $${paramCount++}`);
      values.push(app_name);
    }
    if (color_palette !== undefined) {
      updates.push(`color_palette = $${paramCount++}`);
      values.push(color_palette);
    }
    if (selected_icon !== undefined) {
      updates.push(`selected_icon = $${paramCount++}`);
      values.push(selected_icon);
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    updates.push(`updated_at = NOW()`);
    values.push(id);
    
    await query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramCount}`,
      values
    );
    
    res.json({ id, message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;


