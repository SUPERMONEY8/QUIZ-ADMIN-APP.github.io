# ⚡ NETLIFY BLANK PAGE - QUICK FIX

## 🎯 The Problem
Blank white page = **Environment variables are missing in Netlify**

## ✅ THE FIX (2 Steps):

### STEP 1: Add Environment Variables

1. Go to: https://app.netlify.com
2. Click your site: **peaceful-cactus-05a8bd**
3. Click: **Site settings** (left sidebar)
4. Click: **Environment variables**
5. Click: **Add variable**

**Add Variable 1:**
- Key: `VITE_SUPABASE_URL`
- Value: `https://xgssqibdwhrllsdgwobt.supabase.co`
- Scopes: ✅ Production ✅ Deploy previews ✅ Branch deploys
- Click **Save**

**Add Variable 2:**
- Key: `VITE_SUPABASE_ANON_KEY`  
- Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhnc3NxaWJkd2hybGxzZGd3b2J0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NTQzMjUsImV4cCI6MjA3ODAzMDMyNX0._TRMrd4l2psTdYegoLvfr2U26T7A2dQ4rKj6SViWxl4`
- Scopes: ✅ Production ✅ Deploy previews ✅ Branch deploys
- Click **Save**

### STEP 2: Redeploy

1. Go to **Deploys** tab
2. Click **Trigger deploy** → **Deploy site**
3. Wait 2-3 minutes
4. Refresh your site!

## ✅ DONE! Your site should work now!

---

## 🔍 If Still Blank:

1. **Press F12** in browser
2. **Check Console tab** for errors
3. **Share the errors** with me

---

**That's it!** 🚀

