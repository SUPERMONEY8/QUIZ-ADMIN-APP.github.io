# Fix Blank Page on Netlify - Environment Variables Setup

## 🔴 The Problem

Your app is deployed on Netlify, but it's showing a blank page because **Netlify doesn't use your local `.env` file**. You need to add environment variables in Netlify's dashboard.

## ✅ Solution: Add Environment Variables in Netlify

### Step 1: Go to Netlify Dashboard

1. Visit [https://app.netlify.com](https://app.netlify.com)
2. Sign in with your GitHub account (or email)
3. Find your site in the dashboard
4. Click on it

### Step 2: Go to Site Settings

1. Click **"Site configuration"** in the top navigation
2. Click **"Environment variables"** in the left sidebar
   - OR click **"Build & deploy"** → **"Environment"** → **"Environment variables"**

### Step 3: Add These Variables

Click **"Add a variable"** and add each variable one by one:

**Variable 1:**
- **Key:** `VITE_FIREBASE_API_KEY`
- **Value:** `AIzaSyDNEx4vZXxLkKyr2mg_wSnlLYfHsiEglw0`
- **Scopes:** Select all (Production, Deploy previews, Branch deploys)

**Variable 2:**
- **Key:** `VITE_FIREBASE_AUTH_DOMAIN`
- **Value:** `quizapp-9b0fb.firebaseapp.com`
- **Scopes:** Select all

**Variable 3:**
- **Key:** `VITE_FIREBASE_PROJECT_ID`
- **Value:** `quizapp-9b0fb`
- **Scopes:** Select all

**Variable 4:**
- **Key:** `VITE_FIREBASE_STORAGE_BUCKET`
- **Value:** `quizapp-9b0fb.firebasestorage.app`
- **Scopes:** Select all

**Variable 5:**
- **Key:** `VITE_FIREBASE_MESSAGING_SENDER_ID`
- **Value:** `801341882897`
- **Scopes:** Select all

**Variable 6:**
- **Key:** `VITE_FIREBASE_APP_ID`
- **Value:** `1:801341882897:web:f2b15121bac7ade8b2e7b0`
- **Scopes:** Select all

### Step 4: Redeploy

After adding all variables:

**Option A: Trigger Redeploy**
1. Go to **"Deploys"** tab
2. Find the latest deployment
3. Click **"..."** menu (three dots)
4. Click **"Trigger deploy"** → **"Clear cache and deploy site"**

**Option B: Push a New Commit**
1. Make a small change (add a space to README.md)
2. Commit and push:
   ```bash
   git commit --allow-empty -m "Trigger Netlify rebuild"
   git push
   ```

### Step 5: Wait for Deployment

- Wait 1-2 minutes for the build to complete
- Check the deploy logs to make sure it succeeded
- The app should now work!

## 🎯 Quick Checklist

- [ ] Added `VITE_FIREBASE_API_KEY` in Netlify
- [ ] Added `VITE_FIREBASE_AUTH_DOMAIN` in Netlify
- [ ] Added `VITE_FIREBASE_PROJECT_ID` in Netlify
- [ ] Added `VITE_FIREBASE_STORAGE_BUCKET` in Netlify
- [ ] Added `VITE_FIREBASE_MESSAGING_SENDER_ID` in Netlify
- [ ] Added `VITE_FIREBASE_APP_ID` in Netlify
- [ ] Selected all scopes (Production, Deploy previews, Branch deploys) for all
- [ ] Triggered a new deployment

## 📍 Where to Find Environment Variables in Netlify

**Path 1:**
1. Site dashboard → **"Site configuration"** (top nav)
2. **"Environment variables"** (left sidebar)

**Path 2:**
1. Site dashboard → **"Build & deploy"** (top nav)
2. **"Environment"** (left sidebar)
3. **"Environment variables"** section

## 🐛 Still Blank Page?

1. **Check browser console (F12):**
   - Look for error messages
   - Share them with me

2. **Check Netlify build logs:**
   - Go to Deploys → Click on latest deployment
   - Check "Deploy log" for errors
   - Look for "Build script" section

3. **Verify variables are set:**
   - Go to Site configuration → Environment variables
   - Make sure all 6 variables are there
   - Make sure they're enabled for Production

4. **Check build settings:**
   - Go to Build & deploy → Build settings
   - Make sure:
     - **Build command:** `bun run build` (or `npm run build`)
     - **Publish directory:** `dist`

## 📝 Important Notes

- **Local `.env` file doesn't work on Netlify** - you MUST add variables in Netlify dashboard
- **After adding variables, you MUST redeploy** for them to take effect
- **Variables must start with `VITE_`** for Vite to expose them to the client
- **Netlify automatically rebuilds** when you push to GitHub (if connected)

## 🔄 Alternative: Use netlify.toml

You can also create a `netlify.toml` file in your project root:

```toml
[build]
  command = "bun run build"
  publish = "dist"

[build.environment]
  VITE_FIREBASE_API_KEY = "AIzaSyDNEx4vZXxLkKyr2mg_wSnlLYfHsiEglw0"
  VITE_FIREBASE_AUTH_DOMAIN = "quizapp-9b0fb.firebaseapp.com"
  VITE_FIREBASE_PROJECT_ID = "quizapp-9b0fb"
  VITE_FIREBASE_STORAGE_BUCKET = "quizapp-9b0fb.firebasestorage.app"
  VITE_FIREBASE_MESSAGING_SENDER_ID = "801341882897"
  VITE_FIREBASE_APP_ID = "1:801341882897:web:f2b15121bac7ade8b2e7b0"
```

**⚠️ Warning:** Don't commit sensitive keys to git! Use the dashboard method instead.

