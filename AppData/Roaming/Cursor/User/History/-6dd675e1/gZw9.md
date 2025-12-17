# Deployment Guide - Admin Quiz App

This guide will walk you through deploying your Admin Quiz App to GitHub, Supabase, and Vercel.

## 📋 Step-by-Step Instructions

### 1. ✅ Git Repository Setup (COMPLETED)
- Git repository has been initialized
- Files are ready to commit

### 2. 🔵 Create New GitHub Repository

**You need to do this manually:**

1. Go to [GitHub](https://github.com) and sign in
2. Click the **"+"** icon in the top right → **"New repository"**
3. Fill in:
   - **Repository name**: `admin-quiz-app` (or your preferred name)
   - **Description**: "Admin dashboard for quiz application"
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
4. Click **"Create repository"**

### 3. 📤 Push to GitHub

After creating the repository, GitHub will show you commands. Run these in your terminal:

```bash
cd "c:\Users\LENOVO\Desktop\ADMIN-ACCESS FOR QUIZ APP"

# Add the remote (replace YOUR_USERNAME and REPO_NAME with your actual values)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

**Or if you prefer SSH:**
```bash
git remote add origin git@github.com:YOUR_USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

### 4. 🗄️ Set Up Supabase

1. Go to [Supabase](https://supabase.com) and sign in
2. Click **"New Project"**
3. Fill in:
   - **Name**: `admin-quiz-app` (or your preferred name)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you
   - **Pricing Plan**: Free tier is fine for development
4. Click **"Create new project"** (takes 1-2 minutes)

5. **Get Your Credentials:**
   - Go to **Settings** → **API**
   - Copy these values:
     - **Project URL** (looks like: `https://xxxxx.supabase.co`)
     - **anon/public key** (long string starting with `eyJ...`)

6. **Set up your database tables:**
   - Go to **SQL Editor** in Supabase dashboard
   - You'll need to create tables for:
     - `quizzes`
     - `questions`
     - `results`
     - `participants`
   - (Check your app code to see what schema you need)

### 5. 🚀 Deploy to Vercel

1. Go to [Vercel](https://vercel.com) and sign in (use GitHub account for easy integration)

2. Click **"Add New..."** → **"Project"**

3. **Import your GitHub repository:**
   - Select the repository you just created
   - Click **"Import"**

4. **Configure Project:**
   - **Framework Preset**: Vite (should auto-detect)
   - **Root Directory**: `./` (default)
   - **Build Command**: `bun run build` (or `npm run build`)
   - **Output Directory**: `dist`
   - **Install Command**: `bun install` (or `npm install`)

5. **Add Environment Variables:**
   - Click **"Environment Variables"**
   - Add these two variables:
     ```
     VITE_SUPABASE_URL = your_supabase_project_url
     VITE_SUPABASE_ANON_KEY = your_supabase_anon_key
     ```
   - Replace with the values you copied from Supabase

6. Click **"Deploy"**

7. **Wait for deployment** (usually 1-2 minutes)

8. **Your app will be live at:** `https://your-project-name.vercel.app`

### 6. ✅ Verify Deployment

1. Visit your Vercel deployment URL
2. Check that the admin dashboard loads
3. Test creating a quiz
4. Verify Supabase connection is working

## 🔧 Troubleshooting

### If Vercel build fails:
- Check the build logs in Vercel dashboard
- Make sure all dependencies are in `package.json`
- Verify environment variables are set correctly

### If Supabase connection fails:
- Double-check environment variables in Vercel
- Verify your Supabase project is active
- Check browser console for error messages

### If you need to update environment variables:
- Go to Vercel → Your Project → Settings → Environment Variables
- Update the values
- Redeploy (or wait for automatic redeploy)

## 📝 Next Steps

- Set up your database schema in Supabase
- Configure Row Level Security (RLS) policies if needed
- Set up custom domain (optional)
- Enable analytics (optional)

## 🔗 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [GitHub Documentation](https://docs.github.com)

---

**Need help?** Check the error messages in:
- Vercel deployment logs
- Browser console (F12)
- Supabase dashboard logs

