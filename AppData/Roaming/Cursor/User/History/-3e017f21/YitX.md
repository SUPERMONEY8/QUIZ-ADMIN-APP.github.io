# 🚀 Quick Backend Test

## Server Status

The backend server should be running on **http://localhost:5000**

## Test Methods

### 🌐 Method 1: Web Interface (Easiest)

1. Open `test-api.html` in your browser (double-click the file)
2. The page will automatically check if the server is running
3. Click **"Run All Tests"** to test all endpoints at once
4. Or click individual buttons to test specific endpoints

### 💻 Method 2: Browser Address Bar

Open these URLs directly in your browser:

- Health Check: http://localhost:5000/api/health
- Get Quizzes: http://localhost:5000/api/quiz
- Get Users: http://localhost:5000/api/user/profile (requires auth)

### 📝 Method 3: PowerShell Commands

```powershell
# Health check
Invoke-RestMethod -Uri "http://localhost:5000/api/health"

# Get all quizzes
Invoke-RestMethod -Uri "http://localhost:5000/api/quiz"

# Create a quiz (PowerShell 7+)
$body = @{
    title = "Test Quiz"
    description = "A test quiz"
    questions = @(
        @{
            question = "What is 2+2?"
            options = @("3", "4", "5", "6")
            correctAnswer = "4"
            points = 1
        }
    )
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "http://localhost:5000/api/quiz" -Method POST -Body $body -ContentType "application/json"
```

### 🧪 Method 4: Test Script

```bash
cd backend
node test-api.js
```

## Expected Results

✅ **Server Running**: Should see JSON responses
❌ **Server Not Running**: Connection refused error

## If Server Isn't Running

Start it with:
```bash
cd backend
npm run dev
```

Look for: `Server is running on port 5000`

