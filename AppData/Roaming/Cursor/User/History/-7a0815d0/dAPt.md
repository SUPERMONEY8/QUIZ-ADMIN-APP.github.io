# Google Authentication Setup Guide

This guide will help you set up Google Sign-In for your Enjoyed app.

## What Was Added

✅ **Google Sign-In Integration**
- Users must sign in with Google before using the app
- User progress (names, language, settings, game progress) is saved to Firestore
- Progress is automatically loaded when users sign in again
- Session persists across app restarts

## Firebase Console Setup (REQUIRED)

### Step 1: Enable Google Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **enjoyed-9abf0**
3. Navigate to **Authentication** in the left sidebar
4. Click **Get Started** (if not already enabled)
5. Go to the **Sign-in method** tab
6. Click on **Google** provider
7. Click **Enable**
8. Set the **Project support email** (your email)
9. Click **Save**

### Step 2: Configure Authorized Domains

1. In the **Sign-in method** tab, scroll down to **Authorized domains**
2. Add your deployment domains:
   - `localhost` (already there for development)
   - Your Netlify domain (e.g., `your-app.netlify.app`)
   - Your custom domain (if you have one)

### Step 3: Verify Firestore Rules

Make sure your Firestore security rules allow authenticated users to read/write their own data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can read/write their own game history
    match /gameHistory/{historyId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Other collections...
  }
}
```

## How It Works

1. **First Time User:**
   - User opens app → Sees Google Sign-In screen
   - Clicks "Sign in with Google" → Google popup appears
   - User selects Google account → Signed in
   - User progress is saved to Firestore

2. **Returning User:**
   - User opens app → Automatically signed in (session persists)
   - User progress is loaded from Firestore
   - User continues where they left off

3. **Progress Saved:**
   - Partner names
   - Language preference
   - Selected level
   - Game mode
   - Audio preferences
   - Game history

## Testing

1. **Development:**
   ```bash
   bun run dev
   ```
   - Open `http://localhost:5173`
   - You should see the Google Sign-In screen
   - Click "Sign in with Google"
   - Complete onboarding
   - Close and reopen the app
   - You should be automatically signed in

2. **Production:**
   - Deploy to Netlify
   - Test on mobile device
   - Sign in with Google
   - Verify progress is saved

## Troubleshooting

### "Error: Firebase: Error (auth/unauthorized-domain)"
- **Solution:** Add your domain to Authorized domains in Firebase Console

### "Error: Firebase: Error (auth/popup-blocked)"
- **Solution:** User needs to allow popups for your site

### Progress Not Saving
- **Solution:** Check Firestore security rules allow authenticated users to write

### User Not Auto-Signed In
- **Solution:** Check browser allows cookies/localStorage (required for session persistence)

## Files Modified

- `src/firebase/auth.js` - Added `signInWithGoogle()` function
- `src/views/auth-screen.js` - New authentication screen
- `src/styles/auth-screen.css` - Styles for auth screen
- `src/app.js` - Added auth check before app initialization
- `src/i18n/translations.js` - Added auth-related translations
- `src/onboarding/navigation.js` - Updated to use new progress saving
- `src/views/home.js` - Saves progress when language changes

## Next Steps

1. ✅ Enable Google Sign-In in Firebase Console (see Step 1 above)
2. ✅ Add authorized domains (see Step 2 above)
3. ✅ Test locally
4. ✅ Deploy to Netlify
5. ✅ Test on mobile device

## Notes

- Users must sign in with Google to use the app
- All progress is saved to Firestore (cloud)
- Progress syncs across devices (if user signs in on multiple devices)
- Session persists until user explicitly signs out (not implemented yet)

