-- PostgreSQL Schema for Quiz App (Neon)
-- Multi-tenant support with admin_id isolation

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255),
  name VARCHAR(255),
  app_name VARCHAR(255),
  color_palette VARCHAR(50),
  selected_icon VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  duration_minutes INTEGER DEFAULT 30,
  difficulty VARCHAR(50) DEFAULT 'medium',
  randomize_questions BOOLEAN DEFAULT FALSE,
  randomize_answers BOOLEAN DEFAULT FALSE,
  status VARCHAR(50) DEFAULT 'draft',
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP,
  share_code VARCHAR(50),
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  admin_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY,
  quiz_id INTEGER NOT NULL,
  question_text TEXT NOT NULL,
  question_type VARCHAR(50) NOT NULL,
  options JSONB,
  correct_answer TEXT,
  points INTEGER DEFAULT 1,
  question_order INTEGER DEFAULT 0,
  image_url TEXT,
  video_url TEXT,
  status VARCHAR(50) DEFAULT 'published',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

-- Results table
CREATE TABLE IF NOT EXISTS results (
  id SERIAL PRIMARY KEY,
  quiz_id INTEGER NOT NULL,
  participant_name VARCHAR(255),
  participant_email VARCHAR(255),
  score DECIMAL(10,2) DEFAULT 0,
  total_questions INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  answers JSONB,
  time_taken_seconds INTEGER DEFAULT 0,
  submitted_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

-- Participants table (optional, for tracking)
CREATE TABLE IF NOT EXISTS participants (
  id SERIAL PRIMARY KEY,
  quiz_id INTEGER NOT NULL,
  name VARCHAR(255),
  email VARCHAR(255),
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_quizzes_admin_id ON quizzes(admin_id);
CREATE INDEX IF NOT EXISTS idx_questions_quiz_id ON questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_results_quiz_id ON results(quiz_id);
CREATE INDEX IF NOT EXISTS idx_participants_quiz_id ON participants(quiz_id);


