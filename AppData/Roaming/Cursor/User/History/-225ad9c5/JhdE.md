# 🔧 Fix Email Confirmation Redirect to Localhost

## 🚨 The Problem

When you click the email confirmation link, it redirects to `localhost` instead of your Netlify domain (`peaceful-cactus-05a8bd.netlify.app`).

## ✅ THE FIX (2 Steps)

### Step 1: Configure Supabase Dashboard

**This is the MOST IMPORTANT step!**

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project**
3. **Navigate to**: **Authentication** → **URL Configuration** (left sidebar)
4. **Set Site URL**:
   - Value: `https://peaceful-cactus-05a8bd.netlify.app`
   - Click **Save**

5. **Add Redirect URLs**:
   - Find **"Redirect URLs"** or **"Allowed Redirect URLs"** section
   - Add these URLs (one per line):
     ```
     https://peaceful-cactus-05a8bd.netlify.app/auth/callback
     http://localhost:5173/auth/callback
     ```
   - Click **Save**

### Step 2: Redeploy Your App

After updating Supabase settings, trigger a new deployment:

1. Go to **Netlify Dashboard** → Your site
2. Click **Deploys** tab
3. Click **Trigger deploy** → **Deploy site**
4. Wait for deployment to complete

---

## 🎯 How It Works Now

```
1. User signs up
   ↓
2. Supabase sends confirmation email
   ↓
3. User clicks "Confirm your mail" link
   ↓
4. Supabase redirects to: https://peaceful-cactus-05a8bd.netlify.app/auth/callback#access_token=...
   ↓
5. EmailConfirmationCallback processes tokens
   ↓
6. User is logged in automatically
   ↓
7. Redirect to /participant/dashboard ✅
```

---

## 📋 Updated Signup Flow

I've also fixed the signup flow:

- ✅ If email confirmation is required: Shows message "Please check your email to confirm your account"
- ✅ If email confirmation is disabled: User is logged in immediately
- ✅ No more confusing "successfully logged in" then redirect to login

---

## 🔍 Verify It's Working

1. **Sign up** with a new account
2. **Check email** for confirmation link
3. **Click confirmation link**
4. **Should redirect to**: `https://peaceful-cactus-05a8bd.netlify.app/auth/callback`
5. **Then redirect to**: `/participant/dashboard`
6. **User should be logged in** ✅

---

## 🐛 If Still Redirecting to Localhost

1. **Double-check Supabase settings**:
   - Site URL = `https://peaceful-cactus-05a8bd.netlify.app`
   - Redirect URLs include: `https://peaceful-cactus-05a8bd.netlify.app/auth/callback`

2. **Clear browser cache** and try again

3. **Check the email link** - it should point to your Netlify domain, not localhost

4. **Verify deployment** - Make sure latest code is deployed

---

## ✅ That's It!

After configuring Supabase Dashboard (Step 1), the email confirmation will redirect to your Netlify domain! 🎉

