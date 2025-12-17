# Backend Testing Guide

## Quick Start

### 1. Start the Backend Server
```bash
cd backend
npm run dev
```

The server will start on `http://localhost:5000`

### 2. Test the API

#### Option A: Use the Web Interface (Recommended)
1. Open `test-api.html` in your browser
2. Click "Run All Tests" to test all endpoints
3. Or test individual endpoints using the buttons

#### Option B: Use the Command Line Script
```bash
cd backend
node test-api.js
```

#### Option C: Manual Testing with Browser/Postman

**Health Check:**
```
GET http://localhost:5000/api/health
```

**Get All Quizzes:**
```
GET http://localhost:5000/api/quiz
```

**Create a Quiz:**
```
POST http://localhost:5000/api/quiz
Content-Type: application/json

{
  "title": "JavaScript Basics",
  "description": "Test your knowledge",
  "questions": [
    {
      "question": "What is JavaScript?",
      "options": ["Language", "Framework", "Library", "Tool"],
      "correctAnswer": "Language",
      "points": 1
    }
  ]
}
```

**Submit Quiz:**
```
POST http://localhost:5000/api/quiz/{quizId}/submit
Content-Type: application/json

{
  "answers": ["Language"]
}
```

**Register User:**
```
POST http://localhost:5000/api/user/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "test123"
}
```

**Login:**
```
POST http://localhost:5000/api/user/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "test123"
}
```

## Expected Responses

### Health Check
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

### Quiz List (Empty initially)
```json
[]
```

### Created Quiz
```json
{
  "_id": "...",
  "title": "JavaScript Basics",
  "description": "Test your knowledge",
  "questions": [...],
  "createdAt": "...",
  "updatedAt": "..."
}
```

### Quiz Submission Result
```json
{
  "score": 1,
  "totalQuestions": 1,
  "percentage": "100.00",
  "results": [...]
}
```

## MongoDB Note

The server will work without MongoDB for testing basic endpoints. However, database operations (creating quizzes, users, etc.) require MongoDB to be running.

To set up MongoDB:
1. Install MongoDB locally, or
2. Use MongoDB Atlas (free tier)
3. Set `MONGODB_URI` in `.env` file

For testing without MongoDB, the server will still respond to health checks.

