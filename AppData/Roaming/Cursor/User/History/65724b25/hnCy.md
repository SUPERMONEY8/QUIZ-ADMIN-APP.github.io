# Netlify Environment Variables - Complete List

## 🔴 IMPORTANT: Add These to Netlify Dashboard

Your app needs these environment variables to work on Netlify. **Netlify doesn't use your local `.env` file**, so you MUST add them in the Netlify dashboard.

---

## 📍 How to Add Environment Variables in Netlify

1. Go to [https://app.netlify.com](https://app.netlify.com)
2. Select your site
3. Go to **Site configuration** → **Environment variables** (or **Build & deploy** → **Environment** → **Environment variables**)
4. Click **"Add a variable"** for each variable below
5. **Enable for all scopes**: Production, Deploy previews, Branch deploys

---

## ✅ Required Environment Variables

### Firebase Variables (6 variables)

**Variable 1:**
- **Key:** `VITE_FIREBASE_API_KEY`
- **Value:** `AIzaSyDNEx4vZXxLkKyr2mg_wSnlLYfHsiEglw0`
- **Scopes:** All (Production, Deploy previews, Branch deploys)

**Variable 2:**
- **Key:** `VITE_FIREBASE_AUTH_DOMAIN`
- **Value:** `quizapp-9b0fb.firebaseapp.com`
- **Scopes:** All

**Variable 3:**
- **Key:** `VITE_FIREBASE_PROJECT_ID`
- **Value:** `quizapp-9b0fb`
- **Scopes:** All

**Variable 4:**
- **Key:** `VITE_FIREBASE_STORAGE_BUCKET`
- **Value:** `quizapp-9b0fb.firebasestorage.app`
- **Scopes:** All

**Variable 5:**
- **Key:** `VITE_FIREBASE_MESSAGING_SENDER_ID`
- **Value:** `801341882897`
- **Scopes:** All

**Variable 6:**
- **Key:** `VITE_FIREBASE_APP_ID`
- **Value:** `1:801341882897:web:f2b15121bac7ade8b2e7b0`
- **Scopes:** All

---

### Supabase Variables (2 variables)

**Variable 7:**
- **Key:** `VITE_SUPABASE_URL`
- **Value:** `https://tqsejmzmpaltnbvqmqor.supabase.co`
- **Scopes:** All

**Variable 8:**
- **Key:** `VITE_SUPABASE_ANON_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxc2VqbXptcGFsdG5idnFtcW9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1NzE5MTYsImV4cCI6MjA3ODE0NzkxNn0.7-fpBTuUH1JdKBMcD4kvIW0v8yPJ5R8W98-ef6cpQwg`
- **Scopes:** All

---

## 📋 Quick Copy-Paste Checklist

Copy each variable below and paste into Netlify:

```
VITE_FIREBASE_API_KEY=AIzaSyDNEx4vZXxLkKyr2mg_wSnlLYfHsiEglw0
VITE_FIREBASE_AUTH_DOMAIN=quizapp-9b0fb.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=quizapp-9b0fb
VITE_FIREBASE_STORAGE_BUCKET=quizapp-9b0fb.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=801341882897
VITE_FIREBASE_APP_ID=1:801341882897:web:f2b15121bac7ade8b2e7b0
VITE_SUPABASE_URL=https://tqsejmzmpaltnbvqmqor.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxc2VqbXptcGFsdG5idnFtcW9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1NzE5MTYsImV4cCI6MjA3ODE0NzkxNn0.7-fpBTuUH1JdKBMcD4kvIW0v8yPJ5R8W98-ef6cpQwg
```

---

## 🔄 After Adding Variables

1. **Trigger a new deployment:**
   - Go to **Deploys** tab
   - Click **"..."** on the latest deployment
   - Click **"Trigger deploy"** → **"Clear cache and deploy site"**

   **OR**

   - Push a new commit to trigger automatic deployment:
     ```bash
     git commit --allow-empty -m "Trigger Netlify rebuild with env vars"
     git push
     ```

2. **Wait 1-2 minutes** for the build to complete

3. **Check the deploy logs** to make sure it succeeded

4. **Test your app** - it should now work!

---

## ✅ Verification Checklist

- [ ] Added all 8 environment variables in Netlify
- [ ] Enabled all variables for Production, Deploy previews, and Branch deploys
- [ ] Triggered a new deployment
- [ ] Build completed successfully
- [ ] App is working (no blank page)

---

## 🐛 Still Not Working?

1. **Check browser console (F12):**
   - Look for error messages about missing environment variables
   - Share errors with me

2. **Check Netlify build logs:**
   - Go to Deploys → Click on latest deployment
   - Check "Deploy log" for errors
   - Look for "Build script" section

3. **Verify variables are set:**
   - Go to Site configuration → Environment variables
   - Make sure all 8 variables are there
   - Make sure they're enabled for Production

4. **Check build settings:**
   - Go to Build & deploy → Build settings
   - Make sure:
     - **Build command:** `bun run build` (or `npm run build`)
     - **Publish directory:** `dist`

---

## 📝 Important Notes

- ⚠️ **Local `.env` file doesn't work on Netlify** - you MUST add variables in Netlify dashboard
- ⚠️ **After adding variables, you MUST redeploy** for them to take effect
- ✅ **Variables must start with `VITE_`** for Vite to expose them to the client
- ✅ **Netlify automatically rebuilds** when you push to GitHub (if connected)

---

## 🎉 You're All Set!

Once you've added all 8 environment variables and triggered a new deployment, your app should work perfectly on Netlify!

