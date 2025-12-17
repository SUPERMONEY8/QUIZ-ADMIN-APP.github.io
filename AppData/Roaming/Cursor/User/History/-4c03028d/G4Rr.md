# 🚨 URGENT: Fix Signup Hanging & Localhost Redirect

## ✅ Code Fixes Applied

I've fixed:
1. ✅ **Signup hanging** - Added timeout (10 seconds) and better error handling
2. ✅ **Better user messages** - Shows clear message when email confirmation is required
3. ✅ **Improved error handling** - Handles all edge cases

## 🔧 CRITICAL: Configure Supabase Dashboard (MUST DO THIS!)

The localhost redirect happens because **Supabase needs your Netlify domain configured**. This is the MOST IMPORTANT step!

### Step 1: Configure Supabase Redirect URL

1. **Go to**: https://supabase.com/dashboard
2. **Select your project**
3. **Go to**: **Authentication** → **URL Configuration** (left sidebar)
4. **Set Site URL**:
   - Value: `https://peaceful-cactus-05a8bd.netlify.app`
   - Click **Save**

5. **Add Redirect URLs**:
   - Find **"Redirect URLs"** or **"Allowed Redirect URLs"**
   - Add these URLs (one per line):
     ```
     https://peaceful-cactus-05a8bd.netlify.app/auth/callback
     http://localhost:5173/auth/callback
     ```
   - Click **Save**

### Step 2: Redeploy

After updating Supabase:
1. Go to **Netlify Dashboard** → Your site
2. Click **Deploys** → **Trigger deploy** → **Deploy site**
3. Wait for deployment

---

## 🎯 What's Fixed

### Signup Flow:
- ✅ **No more hanging** - 10 second timeout prevents infinite loading
- ✅ **Clear messages** - Shows "Account created! Check your email" immediately
- ✅ **Better error handling** - Handles all error cases gracefully

### Email Confirmation:
- ✅ **Uses current domain** - `window.location.origin` will be your Netlify domain in production
- ✅ **Proper redirect** - After Supabase config, will redirect to Netlify domain

---

## 📋 Test Flow

1. **Sign up** with new account
2. **Should see**: "✅ Account created! Please check your email to confirm your account"
3. **Check email** for confirmation link
4. **Click link** → Should redirect to `https://peaceful-cactus-05a8bd.netlify.app/auth/callback`
5. **Auto-login** → Redirect to `/participant/dashboard`

---

## 🐛 If Still Having Issues

### Signup Still Hanging?

1. **Check browser console** (F12) for errors
2. **Check network tab** - Is the signup request completing?
3. **Check Supabase Dashboard** → Authentication → Users - Is user being created?

### Still Redirecting to Localhost?

1. **Verify Supabase settings**:
   - Site URL = `https://peaceful-cactus-05a8bd.netlify.app`
   - Redirect URLs include: `https://peaceful-cactus-05a8bd.netlify.app/auth/callback`

2. **Check the email link** - What URL does it point to?
   - Should be: `https://peaceful-cactus-05a8bd.netlify.app/auth/callback`
   - If it's localhost, Supabase config is wrong

3. **Clear browser cache** and try again

---

## ✅ Quick Checklist

- [ ] Supabase Site URL set to Netlify domain
- [ ] Redirect URLs include Netlify domain
- [ ] Redeployed after Supabase changes
- [ ] Tested signup flow
- [ ] Checked email confirmation link

---

**After configuring Supabase (Step 1), everything should work!** 🎉

