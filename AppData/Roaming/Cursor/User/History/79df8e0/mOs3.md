# Deployment Guide - Environment Variables Setup

## ⚠️ Important: Set Environment Variables Before Deployment

Your app requires Supabase environment variables to work properly. Without them, you'll see a blank white page or errors.

## Required Environment Variables

You need to set these two environment variables in your deployment platform:

1. **`VITE_SUPABASE_URL`**
   - Value: `https://xgssqibdwhrllsdgwobt.supabase.co`

2. **`VITE_SUPABASE_ANON_KEY`**
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhnc3NxaWJkd2hybGxzZGd3b2J0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NTQzMjUsImV4cCI6MjA3ODAzMDMyNX0._TRMrd4l2psTdYegoLvfr2U26T7A2dQ4rKj6SViWxl4`

## How to Set Environment Variables

### For Netlify:

1. Go to your Netlify dashboard
2. Select your site
3. Navigate to **Site settings** → **Environment variables**
4. Click **Add variable**
5. Add each variable:
   - **Key:** `VITE_SUPABASE_URL`
   - **Value:** `https://xgssqibdwhrllsdgwobt.supabase.co`
   - **Scopes:** Production, Deploy previews, Branch deploys (select all)
6. Click **Add variable** again:
   - **Key:** `VITE_SUPABASE_ANON_KEY`
   - **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhnc3NxaWJkd2hybGxzZGd3b2J0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NTQzMjUsImV4cCI6MjA3ODAzMDMyNX0._TRMrd4l2psTdYegoLvfr2U26T7A2dQ4rKj6SViWxl4`
   - **Scopes:** Production, Deploy previews, Branch deploys (select all)
7. **Redeploy** your site after adding variables

### For Vercel:

1. Go to your Vercel dashboard
2. Select your project
3. Navigate to **Settings** → **Environment Variables**
4. Click **Add New**
5. Add each variable:
   - **Key:** `VITE_SUPABASE_URL`
   - **Value:** `https://xgssqibdwhrllsdgwobt.supabase.co`
   - **Environment:** Production, Preview, Development (select all)
6. Click **Add** again:
   - **Key:** `VITE_SUPABASE_ANON_KEY`
   - **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhnc3NxaWJkd2hybGxzZGd3b2J0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NTQzMjUsImV4cCI6MjA3ODAzMDMyNX0._TRMrd4l2psTdYegoLvfr2U26T7A2dQ4rKj6SViWxl4`
   - **Environment:** Production, Preview, Development (select all)
7. **Redeploy** your project after adding variables

### For Other Platforms:

The process is similar:
1. Find the **Environment Variables** or **Config Variables** section
2. Add both `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
3. Make sure they're available during the build process
4. Redeploy after adding

## Verify Environment Variables Are Set

After setting the variables and redeploying:

1. Check the browser console (F12) - you should NOT see the warning about missing Supabase variables
2. The app should load normally
3. Try logging in or accessing features that use Supabase

## Troubleshooting

### Still seeing a blank page?

1. **Check browser console** (F12 → Console tab)
   - Look for error messages
   - Check if environment variables are being logged

2. **Verify variables are set correctly**
   - Make sure variable names are exactly: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
   - Make sure values are correct (no extra spaces)
   - Make sure they're set for the correct environment (Production/Preview)

3. **Redeploy after setting variables**
   - Environment variables are only available after a new build
   - Trigger a new deployment after adding variables

4. **Check build logs**
   - Look for any errors during the build process
   - Make sure the build completes successfully

### Getting "Invalid API key" errors?

- Double-check that the `VITE_SUPABASE_ANON_KEY` value is correct
- Make sure there are no extra spaces or line breaks in the value

### Getting "Network error" or "Failed to fetch"?

- Check that `VITE_SUPABASE_URL` is correct
- Make sure your Supabase project is active and not paused
- Check Supabase dashboard for any service issues

## Security Notes

- The `VITE_SUPABASE_ANON_KEY` is safe to expose in client-side code (it's designed for this)
- However, make sure your Supabase RLS (Row Level Security) policies are properly configured
- Never commit these values to public repositories (they're already in `.env.local` which should be in `.gitignore`)

## Need Help?

If you're still experiencing issues:
1. Check the browser console for specific error messages
2. Check the network tab to see if Supabase requests are failing
3. Verify your Supabase project is active and accessible
4. Check the deployment platform's build logs for any errors

