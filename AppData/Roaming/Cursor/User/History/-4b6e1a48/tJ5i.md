# How to Get Firebase Config - Step by Step

## You're Already in the Right Place! ✅

You're on the **Project Settings** page. Now follow these steps:

## 📍 Step 1: Scroll Down

On the **Project Settings** page you're currently on, **scroll down** until you see a section called:

**"Vos applications"** (Your apps) or **"Your apps"**

This section shows all your registered apps (Android, iOS, Web, etc.)

## 📍 Step 2: Find or Add Web App

### Option A: If you see a Web app already registered
- Look for an app with a **`</>``** icon (web icon)
- Click on it to see the config

### Option B: If you DON'T see a Web app
1. Look for a button or icon that says **"Ajouter une application"** (Add app) or **"Add app"**
2. Click the **`</>``** icon (web icon) to register a web app
3. Give it a name (e.g., "Quiz App Admin")
4. Click **"Register app"** or **"Enregistrer"**
5. The config will appear on the next screen

## 📍 Step 3: Copy the Config Values

Once you see the config, you'll see something like:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "quizapp-9b0fb.firebaseapp.com",
  projectId: "quizapp-9b0fb",
  storageBucket: "quizapp-9b0fb.appspot.com",
  messagingSenderId: "801341882897",
  appId: "1:801341882897:web:..."
};
```

## 📍 Step 4: Create Your .env File

Create a `.env` file in your project root with these values:

```env
VITE_FIREBASE_API_KEY=AIzaSyC... (your apiKey value)
VITE_FIREBASE_AUTH_DOMAIN=quizapp-9b0fb.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=quizapp-9b0fb
VITE_FIREBASE_STORAGE_BUCKET=quizapp-9b0fb.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=801341882897
VITE_FIREBASE_APP_ID=1:801341882897:web:... (your appId value)
```

**Replace the values** with your actual config values!

## 🎯 Quick Visual Guide

```
Project Settings Page
├── Your project (top section) ✅ You're here
├── Environment
├── Public settings
└── Your apps ⬇️ SCROLL DOWN TO HERE
    ├── [Android app]
    ├── [iOS app]
    └── [Web app] </> ← Click this or add new one
        └── firebaseConfig ← Copy values from here
```

## 💡 Tip

If you can't find "Your apps" section:
- Make sure you're scrolled all the way down
- Look for tabs at the top: "General", "Service accounts", "Your apps" - click "Your apps" tab
- Or look for a section with app icons (Android robot, Apple logo, Web `</>` icon)

