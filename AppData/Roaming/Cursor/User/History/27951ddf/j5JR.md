# Firestore Security Rules Setup

## CRITICAL: You MUST deploy these rules for the app to work!

The quiz app requires Firestore security rules to allow users to create and manage their quizzes.

## Steps to Deploy Rules:

### Option 1: Using Firebase Console (Easiest)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `quizapp-9b0fb`
3. Go to **Firestore Database** → **Rules** tab
4. Copy the contents from `firestore.rules` file
5. Paste into the rules editor
6. Click **Publish**

### Option 2: Using Firebase CLI

```bash
# Install Firebase CLI if you haven't
npm install -g firebase-tools

# Login
firebase login

# Initialize (if not already done)
firebase init firestore

# Deploy rules
firebase deploy --only firestore:rules
```

## Required Rules

The rules allow:
- Users to read/write their own data under `users/{userId}`
- Users to manage their quizzes, questions, attempts, and analytics
- Public read access for published quizzes

## Quick Test Rules (For Development Only - NOT SECURE)

If you just want to test quickly, you can temporarily use these rules (DO NOT USE IN PRODUCTION):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

This allows any authenticated user to read/write everything. Only use for testing!

