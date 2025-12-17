# How to Create Your .env File

## ❌ DON'T Use Placeholder Values!

**WRONG:**
```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_PROJECT_ID=your-project-id
```

**✅ CORRECT:**
```env
VITE_FIREBASE_API_KEY=AIzaSyC1234567890abcdefghijklmnop
VITE_FIREBASE_PROJECT_ID=quizapp-9b0fb
```

## 📝 Step-by-Step:

### Step 1: Get Your Real Values from Firebase

From Firebase Console, you should have values like:
- **apiKey**: `AIzaSyC...` (long string starting with AIza)
- **authDomain**: `quizapp-9b0fb.firebaseapp.com`
- **projectId**: `quizapp-9b0fb` (you already have this!)
- **storageBucket**: `quizapp-9b0fb.appspot.com`
- **messagingSenderId**: `801341882897` (you already have this!)
- **appId**: `1:801341882897:web:abc123...` (long string)

### Step 2: Create .env File

1. In your project root folder, create a file named `.env` (just `.env`, nothing else)
2. Copy this template and **REPLACE** the values:

```env
VITE_FIREBASE_API_KEY=PASTE_YOUR_ACTUAL_API_KEY_HERE
VITE_FIREBASE_AUTH_DOMAIN=quizapp-9b0fb.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=quizapp-9b0fb
VITE_FIREBASE_STORAGE_BUCKET=quizapp-9b0fb.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=801341882897
VITE_FIREBASE_APP_ID=PASTE_YOUR_ACTUAL_APP_ID_HERE
```

### Step 3: Fill in the Missing Values

You already have:
- ✅ `projectId`: `quizapp-9b0fb`
- ✅ `messagingSenderId`: `801341882897`
- ✅ `authDomain`: `quizapp-9b0fb.firebaseapp.com` (just add `.firebaseapp.com`)
- ✅ `storageBucket`: `quizapp-9b0fb.appspot.com` (just add `.appspot.com`)

You need to get from Firebase Console:
- ❓ `apiKey`: Get from Firebase config
- ❓ `appId`: Get from Firebase config

### Step 4: Example of What It Should Look Like

```env
VITE_FIREBASE_API_KEY=AIzaSyC1234567890abcdefghijklmnopqrstuvwxyz
VITE_FIREBASE_AUTH_DOMAIN=quizapp-9b0fb.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=quizapp-9b0fb
VITE_FIREBASE_STORAGE_BUCKET=quizapp-9b0fb.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=801341882897
VITE_FIREBASE_APP_ID=1:801341882897:web:abc123def456ghi789
```

**Notice:** All values are REAL, not placeholders!

## 🎯 Quick Checklist

- [ ] Created `.env` file in project root
- [ ] Replaced `your-api-key` with actual API key
- [ ] Replaced `your-project-id` with `quizapp-9b0fb`
- [ ] Replaced `your-sender-id` with `801341882897`
- [ ] Replaced `your-app-id` with actual app ID
- [ ] All values are real (no "your-" placeholders)

## ⚠️ Important

- **NO quotes** around values
- **NO spaces** around the `=` sign
- **NO** `your-` placeholders - use real values!

