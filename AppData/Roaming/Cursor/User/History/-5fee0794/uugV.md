# Vercel Deployment Guide - Quiz App Admin

Now that your Supabase is set up, let's deploy to Vercel!

## 🚀 Step 1: Connect GitHub to Vercel

1. **Go to Vercel:**
   - Visit [https://vercel.com](https://vercel.com)
   - Sign in with your **GitHub account** (same one you used for the repo)

2. **Import Your Project:**
   - Click **"Add New..."** → **"Project"**
   - You should see your repositories listed
   - Find **"SUPERMONEY8/QUIZ-APP-ADMIN"**
   - Click **"Import"** next to it

## ⚙️ Step 2: Configure Project Settings

Vercel should auto-detect your project, but verify these settings:

- **Framework Preset**: `Vite` (should be auto-detected)
- **Root Directory**: `./` (default)
- **Build Command**: `bun run build` (or `npm run build` if using npm)
- **Output Directory**: `dist`
- **Install Command**: `bun install` (or `npm install`)

## 🔑 Step 3: Add Environment Variables

**This is crucial!** Add your Supabase credentials:

1. **Before clicking Deploy**, scroll down to **"Environment Variables"**

2. **Add these two variables:**

   **Variable 1:**
   - **Name**: `VITE_SUPABASE_URL`
   - **Value**: `https://tqsejmzmpaltnbvqmqor.supabase.co`
   - **Environment**: Select all (Production, Preview, Development)

   **Variable 2:**
   - **Name**: `VITE_SUPABASE_ANON_KEY`
   - **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxc2VqbXptcGFsdG5idnFtcW9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1NzE5MTYsImV4cCI6MjA3ODE0NzkxNn0.7-fpBTuUH1JdKBMcD4kvIW0v8yPJ5R8W98-ef6cpQwg`
   - **Environment**: Select all (Production, Preview, Development)

3. **Click "Add"** for each variable

## 🚀 Step 4: Deploy!

1. **Click the big "Deploy" button**
2. **Wait 1-2 minutes** for the build to complete
3. **Watch the build logs** - you should see:
   - Installing dependencies
   - Building project
   - Deploying...

## ✅ Step 5: Access Your Live App

Once deployment is complete:

1. **Vercel will show you a URL** like:
   - `https://quiz-app-admin-xxxxx.vercel.app`

2. **Click the URL** or **"Visit"** button

3. **Your admin dashboard is now live!** 🎉

## 🔄 Step 6: Automatic Deployments

Vercel automatically deploys when you push to GitHub:
- **Push to `main` branch** → Deploys to production
- **Create a pull request** → Creates a preview deployment

## 🔧 Troubleshooting

### Build Fails?
- Check the build logs in Vercel dashboard
- Make sure all dependencies are in `package.json`
- Verify environment variables are set correctly

### App Loads But Supabase Doesn't Work?
- Double-check environment variables in Vercel
- Go to: **Project Settings** → **Environment Variables**
- Make sure both variables are set for all environments
- Redeploy after adding variables

### Need to Update Environment Variables?
1. Go to **Project Settings** → **Environment Variables**
2. Edit the values
3. Click **"Save"**
4. Go to **Deployments** tab
5. Click **"..."** on latest deployment → **"Redeploy"**

## 📝 Your Credentials (Saved)

**Supabase:**
- URL: `https://tqsejmzmpaltnbvqmqor.supabase.co`
- Anon Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxc2VqbXptcGFsdG5idnFtcW9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1NzE5MTYsImV4cCI6MjA3ODE0NzkxNn0.7-fpBTuUH1JdKBMcD4kvIW0v8yPJ5R8W98-ef6cpQwg`

**GitHub Repo:**
- `https://github.com/SUPERMONEY8/QUIZ-APP-ADMIN`

---

**Ready to deploy?** Follow the steps above and your app will be live in minutes! 🚀

