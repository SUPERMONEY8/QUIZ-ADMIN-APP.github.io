# Fix Blank Page on Vercel - Environment Variables Setup

## 🔴 The Problem

Your app is deployed on Vercel (`quiz-app-admin-prcp.vercel.app`), but it's showing a blank page because **Vercel doesn't use your local `.env` file**. You need to add environment variables in Vercel's dashboard.

## ✅ Solution: Add Environment Variables in Vercel

### Step 1: Go to Vercel Dashboard

1. Visit [https://vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Find your project: **"QUIZ-APP-ADMIN"** or **"quiz-app-admin-prcp"**
4. Click on it

### Step 2: Go to Settings

1. Click **"Settings"** tab (top navigation)
2. Click **"Environment Variables"** in the left sidebar

### Step 3: Add These Variables

Click **"Add New"** and add each variable one by one:

**Variable 1:**
- **Name:** `VITE_FIREBASE_API_KEY`
- **Value:** `AIzaSyDNEx4vZXxLkKyr2mg_wSnlLYfHsiEglw0`
- **Environment:** Select all (Production, Preview, Development)

**Variable 2:**
- **Name:** `VITE_FIREBASE_AUTH_DOMAIN`
- **Value:** `quizapp-9b0fb.firebaseapp.com`
- **Environment:** Select all

**Variable 3:**
- **Name:** `VITE_FIREBASE_PROJECT_ID`
- **Value:** `quizapp-9b0fb`
- **Environment:** Select all

**Variable 4:**
- **Name:** `VITE_FIREBASE_STORAGE_BUCKET`
- **Value:** `quizapp-9b0fb.firebasestorage.app`
- **Environment:** Select all

**Variable 5:**
- **Name:** `VITE_FIREBASE_MESSAGING_SENDER_ID`
- **Value:** `801341882897`
- **Environment:** Select all

**Variable 6:**
- **Name:** `VITE_FIREBASE_APP_ID`
- **Value:** `1:801341882897:web:f2b15121bac7ade8b2e7b0`
- **Environment:** Select all

### Step 4: Redeploy

After adding all variables:

1. Go to **"Deployments"** tab
2. Find the latest deployment
3. Click the **"..."** menu (three dots)
4. Click **"Redeploy"**
5. Or push a new commit to trigger a new deployment

### Step 5: Wait for Deployment

- Wait 1-2 minutes for the build to complete
- The app should now work!

## 🎯 Quick Checklist

- [ ] Added `VITE_FIREBASE_API_KEY` in Vercel
- [ ] Added `VITE_FIREBASE_AUTH_DOMAIN` in Vercel
- [ ] Added `VITE_FIREBASE_PROJECT_ID` in Vercel
- [ ] Added `VITE_FIREBASE_STORAGE_BUCKET` in Vercel
- [ ] Added `VITE_FIREBASE_MESSAGING_SENDER_ID` in Vercel
- [ ] Added `VITE_FIREBASE_APP_ID` in Vercel
- [ ] Selected "Production, Preview, Development" for all
- [ ] Redeployed the app

## 🐛 Still Blank Page?

1. **Check browser console (F12):**
   - Look for error messages
   - Share them with me

2. **Check Vercel build logs:**
   - Go to Deployments → Click on latest deployment
   - Check "Build Logs" for errors

3. **Verify variables are set:**
   - Go to Settings → Environment Variables
   - Make sure all 6 variables are there
   - Make sure they're enabled for Production

## 📝 Important Notes

- **Local `.env` file doesn't work on Vercel** - you MUST add variables in Vercel dashboard
- **After adding variables, you MUST redeploy** for them to take effect
- **Variables must start with `VITE_`** for Vite to expose them to the client

