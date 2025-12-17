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
3. Go to Project Settings > General
4. Scroll down to "Your apps" and click the web icon (`</>`)
5. Copy your Firebase configuration object
6. Open `firebase/config.js` and replace the placeholder values:

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

### 3. Run Development Server

```bash
bun dev
```

The app will be available at `http://localhost:5173`

### 4. Build for Production

```bash
bun run build
```

The built files will be in the `dist/` directory.

### 5. Preview Production Build

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

## Technologies Used

- **Vite** - Build tool and dev server
- **Bun** - Package manager and runtime
- **Firebase** - Authentication and database
- **Vanilla JavaScript** - No frameworks, pure JS
- **CSS3** - Modern styling with mobile-first approach

