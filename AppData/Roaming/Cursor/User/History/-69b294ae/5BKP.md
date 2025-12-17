# Firebase Setup Guide

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard:
   - Enter project name (e.g., "depo-web")
   - Enable/disable Google Analytics (optional)
   - Click "Create project"

## Step 2: Enable Firestore Database

1. In Firebase Console, go to **Build** > **Firestore Database**
2. Click "Create database"
3. Choose **Start in production mode** (or test mode for development)
4. Select a location for your database (choose closest to your users)
5. Click "Enable"

## Step 3: Set Up Firestore Security Rules

Go to **Firestore Database** > **Rules** and add:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to all documents (for now)
    // TODO: Implement proper authentication and security rules
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // Or for development/testing (NOT for production):
    // match /{document=**} {
    //   allow read, write: if true;
    // }
  }
}
```

## Step 4: Get Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to "Your apps"
3. Click the **Web** icon (`</>`) to add a web app
4. Register app with a nickname (e.g., "Depo Web")
5. Copy the Firebase configuration object

## Step 5: Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Firebase credentials in `.env`:
   ```
   VITE_FIREBASE_API_KEY=AIza...
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abc123
   ```

## Step 6: Configure Netlify Environment Variables

1. Go to your Netlify dashboard
2. Navigate to **Site settings** > **Environment variables**
3. Add all the Firebase environment variables:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

## Step 7: Install Dependencies

```bash
bun install
```

## Step 8: Test Locally

```bash
bun run dev
```

Visit `http://localhost:3000` and check the browser console for Firebase connection status.

## Step 9: Deploy to Netlify

1. Push your code to GitHub/GitLab
2. Connect your repository to Netlify
3. Netlify will automatically detect the build settings from `netlify.toml`
4. Make sure environment variables are set in Netlify dashboard
5. Deploy!

## Optional: Enable Firebase Authentication

If you want to add user authentication:

1. In Firebase Console, go to **Build** > **Authentication**
2. Click "Get started"
3. Enable **Email/Password** provider (or others as needed)
4. Update `src/config/firebase-config.js` to include auth initialization

## Optional: Enable Firebase Storage

If you want to store product images:

1. In Firebase Console, go to **Build** > **Storage**
2. Click "Get started"
3. Start in production mode
4. Storage is already initialized in `firebase-config.js`

## Troubleshooting

### "Firebase: Error (auth/configuration-not-found)"
- Make sure all environment variables are set correctly
- Check that `.env` file exists and has correct values
- For Netlify, verify environment variables in dashboard

### "Permission denied" errors
- Check Firestore security rules
- Make sure rules allow the operations you're trying to perform
- For development, you can temporarily allow all access (NOT for production)

### Data not persisting
- Check browser console for errors
- Verify Firebase connection in Network tab
- Check Firestore console to see if data is being written

## Next Steps

- [ ] Set up proper authentication
- [ ] Implement Firestore security rules based on user roles
- [ ] Set up Firebase Storage for product images
- [ ] Configure Firebase Functions for server-side operations (if needed)
- [ ] Set up Firebase Hosting (alternative to Netlify)

