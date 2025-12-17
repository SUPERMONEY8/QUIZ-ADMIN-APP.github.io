# Couple Action App

A mobile-friendly web application built with Vite, Bun, HTML, CSS, and JavaScript, using Firebase for authentication and data storage.

## Prerequisites

- [Bun](https://bun.sh/) installed on your system
- A Firebase project set up in the [Firebase Console](https://console.firebase.google.com/)

## Project Structure

```
├── components/          # Reusable UI components
├── public/             # Static assets
├── src/                # Main application code
│   ├── firebase/       # Firebase configuration and services
│   │   ├── config.js   # Firebase initialization
│   │   ├── auth.js     # Authentication helper functions
│   │   ├── firestore.js # Firestore database helper functions
│   │   ├── index.js    # Main Firebase exports
│   │   └── example-usage.js # Usage examples
│   ├── main.js         # Application entry point
│   └── style.css       # Main styles
├── styles/             # Additional stylesheets
│   └── mobile.css      # Mobile-first responsive styles
├── index.html          # HTML entry point
├── vite.config.js      # Vite configuration
├── firestore.rules     # Firestore security rules
├── FIRESTORE_STRUCTURE.md # Database structure documentation
└── package.json        # Project dependencies
```

## Setup Instructions

### 1. Install Dependencies

```bash
bun install
```

### 2. Configure Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable "Email/Password" provider
4. Create Firestore Database:
   - Go to Firestore Database
   - Click "Create database"
   - Start in test mode (we'll add security rules next)
5. Get your Firebase configuration:
   - Go to Project Settings > General
   - Scroll down to "Your apps" and click the web icon (`</>`)
   - Copy your Firebase configuration object
6. Update `src/firebase/config.js` with your credentials:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 3. Set Up Firestore Security Rules

1. Go to Firestore Database > Rules in Firebase Console
2. Copy the contents of `firestore.rules` from this project
3. Paste and publish the rules in Firebase Console

The security rules ensure that:
- Users can only access their own profile
- Couples can only access data for couples they belong to
- Action cards are only accessible by the couple that owns them
- Game history is only accessible by the couple that created it

### 4. Run Development Server

```bash
bun dev
```

The app will be available at `http://localhost:5173`

### 5. Build for Production

```bash
bun run build
```

The built files will be in the `dist/` directory.

### 6. Preview Production Build

```bash
bun run preview
```

## Mobile Optimization Features

- Responsive viewport meta tags
- Touch-friendly button sizes (minimum 44x44px)
- Mobile-first CSS approach
- Prevents horizontal scrolling
- Optimized font sizes to prevent iOS zoom
- Landscape orientation support

## Important Notes

- **Never use NPM or Node.js** - This project uses Bun exclusively
- All package management should use `bun install` instead of `npm install`
- The project is configured for ES modules (`"type": "module"` in package.json)

## Firebase Usage

### Quick Start

Import Firebase functions in your components:

```javascript
import { 
  signInUser, 
  getCurrentUser,
  getCoupleByUserId,
  getActionCards 
} from './firebase/index.js';
```

### Available Functions

**Authentication:**
- `registerUser(email, password, displayName)` - Register new user
- `signInUser(email, password)` - Sign in user
- `signOutUser()` - Sign out current user
- `getCurrentUser()` - Get current authenticated user
- `onAuthChange(callback)` - Listen to auth state changes

**Firestore:**
- `getUserProfile(userId)` - Get user profile
- `getCouple(coupleId)` - Get couple data
- `getCoupleByUserId(userId)` - Get couple by user ID
- `getActionCards(filters)` - Get action cards with filters
- `getGameHistory(coupleId, limit)` - Get game history
- And many more... See `src/firebase/example-usage.js` for complete examples

### Database Structure

See `FIRESTORE_STRUCTURE.md` for detailed documentation on:
- Collection schemas
- Data relationships
- Best practices
- Example usage

## Technologies Used

- **Vite** - Build tool and dev server
- **Bun** - Package manager and runtime
- **Firebase** - Authentication and Firestore database
- **Vanilla JavaScript** - No frameworks, pure JS (ES modules)
- **CSS3** - Modern styling with mobile-first approach

