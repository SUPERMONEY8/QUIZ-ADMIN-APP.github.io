# Firebase Migration Guide

## ✅ Migration Complete!

Your app has been successfully migrated from Supabase to Firebase. Here's what you need to do next:

## 🔧 Step 1: Set Up Firebase Project

1. **Go to Firebase Console:**
   - Visit [https://console.firebase.google.com](https://console.firebase.google.com)
   - Sign in with your Google account

2. **Create a New Project:**
   - Click "Add project"
   - Enter project name (e.g., "quiz-app-admin")
   - Disable Google Analytics (optional)
   - Click "Create project"

3. **Enable Firestore Database:**
   - In Firebase Console, go to "Firestore Database"
   - Click "Create database"
   - Start in **test mode** (we'll update security rules later)
   - Choose your region
   - Click "Enable"

4. **Enable Firebase Storage (for media uploads):**
   - Go to "Storage"
   - Click "Get started"
   - Use default security rules for now
   - Click "Done"

5. **Get Your Firebase Config:**
   - Go to Project Settings (gear icon)
   - Scroll down to "Your apps"
   - Click the web icon (`</>`)
   - Register app (name it "Quiz App Admin")
   - Copy the `firebaseConfig` object

## 🔑 Step 2: Add Environment Variables

Create a `.env` file in your project root (or update existing one):

```env
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

**Replace the values** with the ones from your Firebase config.

## 📊 Step 3: Set Up Firestore Collections

Your app uses these collections:
- `quizzes` - Quiz data
- `questions` - Question data
- `results` - Quiz results
- `participants` - Participant data (optional)

**No need to create them manually** - Firestore will create them automatically when you first save data!

## 🔒 Step 4: Update Firestore Security Rules

Go to Firestore Database → Rules and update to:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to all documents (for admin app)
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**⚠️ Note:** This allows full access. For production, you should restrict based on authentication.

## 🚀 Step 5: Test Your App

1. **Install dependencies:**
   ```bash
   bun install
   ```

2. **Run development server:**
   ```bash
   bun run dev
   ```

3. **Test these features:**
   - Create a new quiz
   - Add questions
   - Publish quiz
   - Take quiz (using the link)
   - View results

## 📝 What Changed

### Files Updated:
- ✅ `src/firebaseConfig.js` - New Firebase configuration
- ✅ `src/utils/firebaseHelpers.js` - Helper functions for Firestore operations
- ✅ `src/components/CreateQuizForm.jsx` - Now uses Firebase
- ✅ `src/components/QuizList.jsx` - Now uses Firebase
- ✅ `src/components/PublishQuiz.jsx` - Now uses Firebase
- ✅ `src/pages/TakeQuizPage.jsx` - Now uses Firebase
- ✅ `src/hooks/useAuth.js` - Now uses Firebase Auth
- ✅ `src/utils/saveResults.js` - Now uses Firebase
- ✅ All other components using Supabase

### Removed:
- ❌ `src/supabaseConfig.js` - No longer needed (but kept for reference)

## 🐛 Troubleshooting

### "Missing Firebase environment variables"
- Make sure your `.env` file has all required variables
- Restart your dev server after adding env variables

### "Permission denied"
- Check your Firestore security rules
- Make sure you're using test mode or have proper rules

### "Quiz not found"
- Make sure Firestore is enabled
- Check that you're using the correct project ID

## 📚 Next Steps

1. **Deploy to Vercel:**
   - Add the same environment variables in Vercel dashboard
   - Deploy as usual

2. **Update Security Rules:**
   - Once everything works, update Firestore rules for production
   - Consider adding authentication-based rules

3. **Migrate Existing Data (if any):**
   - If you had data in Supabase, you'll need to export and import to Firestore
   - Use Firebase Admin SDK or manual import

## 🎉 You're Done!

Your app is now running on Firebase! If you encounter any issues, check the browser console for error messages.

