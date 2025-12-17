// Main Express server for Quiz App API
import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import usersRouter from './routes/users.js';
import quizzesRouter from './routes/quizzes.js';
import questionsRouter from './routes/questions.js';
import resultsRouter from './routes/results.js';
import { query } from './db.js';

const app = express();

// Middleware
app.use(cors(config.cors));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Test database connection
app.get('/api/test-connection', async (req, res) => {
  try {
    const result = await query('SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\'');
    const tables = result.rows.map(row => row.table_name);
    res.json({
      status: 'success',
      message: 'Connexion réussie',
      tables: tables,
    });
  } catch (error) {
    console.error('Database connection test failed:', error);
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      error: error.message,
    });
  }
});

// API Routes
app.use('/api/users', usersRouter);
app.use('/api/quizzes', quizzesRouter);
app.use('/api/questions', questionsRouter);
app.use('/api/results', resultsRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server (for local development)
if (process.env.NODE_ENV !== 'production') {
  const PORT = config.port;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

// Export for Vercel serverless
export default app;


