# Next Steps - Firebase Setup

## ✅ You Already Have:
- ✅ Firebase project created
- ✅ Firestore rules configured (but need updating)

## 🔧 What to Do Now:

### Step 1: Update Firestore Rules

Your current rules use a nested structure (`/users/{userId}/quizzes/...`), but the app uses top-level collections.

**Go to Firebase Console:**
1. Open [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to **Firestore Database** → **Rules** tab
4. **Replace** your current rules with the rules from `firestore.rules` file
5. Click **"Publish"**

### Step 2: Add Environment Variables

1. **Get your Firebase config:**
   - In Firebase Console, go to **Project Settings** (gear icon)
   - Scroll to **"Your apps"** section
   - If you don't have a web app, click the web icon (`</>`) and register one
   - Copy the `firebaseConfig` values

2. **Create `.env` file** in your project root:
   ```env
   VITE_FIREBASE_API_KEY=your-api-key-here
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```

3. **Replace the placeholder values** with your actual Firebase config values

### Step 3: Enable Firestore Database

Make sure Firestore is enabled:
1. Go to **Firestore Database** in Firebase Console
2. If you see "Create database", click it
3. Choose **"Start in test mode"** (or use production mode with the rules from `firestore.rules`)
4. Select your region
5. Click **"Enable"**

### Step 4: Enable Firebase Storage (Optional, for media uploads)

1. Go to **Storage** in Firebase Console
2. Click **"Get started"**
3. Use default security rules
4. Click **"Done"**

### Step 5: Test the App

1. **Restart your dev server:**
   ```bash
   bun run dev
   ```

2. **Test these features:**
   - ✅ Create a new quiz
   - ✅ Add questions to quiz
   - ✅ Publish quiz
   - ✅ Get quiz link
   - ✅ Take quiz (using the link)
   - ✅ View results

## 🎯 Quick Checklist

- [ ] Updated Firestore rules (from `firestore.rules`)
- [ ] Created `.env` file with Firebase config
- [ ] Firestore Database enabled
- [ ] Firebase Storage enabled (optional)
- [ ] Tested creating a quiz
- [ ] Tested taking a quiz

## 🐛 Troubleshooting

### "Missing Firebase environment variables"
- Make sure `.env` file exists in project root
- Restart dev server after adding env variables
- Check that variable names start with `VITE_`

### "Permission denied" errors
- Make sure you updated Firestore rules
- Check that rules are published (not just saved)
- Verify rules match the app structure (top-level collections)

### "Quiz not found"
- Make sure Firestore is enabled
- Check browser console for detailed error messages
- Verify your Firebase project ID is correct

## 📝 Important Notes

1. **Data Structure:** The app uses top-level collections:
   - `quizzes` (not `/users/{userId}/quizzes`)
   - `questions` (not nested under quizzes)
   - `results` (not nested under quizzes)

2. **Admin-Access Mode:** The app runs in admin-access mode (no login required). The rules allow full access. For production, you should add authentication.

3. **No Manual Setup Needed:** Firestore will automatically create collections when you first save data. You don't need to create them manually.

## ✅ You're Ready!

Once you've completed these steps, your app should work perfectly with Firebase!

