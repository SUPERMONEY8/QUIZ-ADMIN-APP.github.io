# Quiz Application - React + Express + MongoDB

A full-stack quiz application boilerplate with React frontend, Express backend, and MongoDB database.

## Project Structure

```
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API service functions
│   │   ├── utils/          # Utility functions
│   │   ├── App.jsx         # Main App component
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # Global styles
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── routes/             # Express routes
│   ├── controllers/        # Route controllers
│   ├── models/             # MongoDB models
│   ├── middleware/         # Express middleware
│   ├── utils/              # Utility functions
│   ├── config/             # Configuration files
│   ├── server.js           # Express server entry point
│   └── package.json
├── config/                 # Shared configuration
│   ├── constants.js        # Shared constants
│   └── env.example.js      # Environment variables example
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your MongoDB connection string:
```
MONGODB_URI=mongodb://localhost:27017/quiz-app
PORT=5000
```

5. Start the backend server:
```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Features

- **Quiz Management**: Create, read, update, and delete quizzes
- **Question System**: Multiple choice questions with options
- **User Authentication**: User registration and login (basic implementation)
- **Quiz Submission**: Submit quizzes and view results with scoring
- **RESTful API**: Well-structured Express routes and controllers
- **MongoDB Models**: User and Quiz models with proper schemas

## API Endpoints

### Quiz Routes
- `GET /api/quiz` - Get all quizzes
- `GET /api/quiz/:id` - Get quiz by ID
- `POST /api/quiz` - Create a new quiz
- `PUT /api/quiz/:id` - Update a quiz
- `DELETE /api/quiz/:id` - Delete a quiz
- `POST /api/quiz/:id/submit` - Submit quiz answers

### User Routes
- `POST /api/user/register` - Register a new user
- `POST /api/user/login` - Login user
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

## Technologies Used

- **Frontend**: React 18, React Router, Axios, Vite
- **Backend**: Express.js, Node.js
- **Database**: MongoDB with Mongoose ODM
- **Validation**: express-validator

## Next Steps

- Add JWT authentication middleware
- Implement proper error handling
- Add password hashing (bcrypt is included but needs to be added to package.json)
- Add unit and integration tests
- Add UI styling (CSS framework or styled-components)
- Implement real-time features with WebSockets
- Add quiz categories and tags
- Implement quiz timer functionality

