# Deployment Guide - Participant App

## GitHub Setup

1. Create a new repository on GitHub (e.g., `quiz-app-participant`)

2. Add the remote and push:
```bash
cd c:\Users\LENOVO\Desktop\quiz-app-participant
git remote add origin https://github.com/YOUR_USERNAME/quiz-app-participant.git
git branch -M main
git push -u origin main
```

## Vercel Deployment

1. Go to [Vercel](https://vercel.com) and sign in

2. Click "Add New Project"

3. Import your GitHub repository (`quiz-app-participant`)

4. Configure the project:
   - **Framework Preset:** Vite
   - **Root Directory:** `./`
   - **Build Command:** `npm run build` or `bun run build`
   - **Output Directory:** `dist`

5. Add Environment Variables:
   - `VITE_SUPABASE_URL` - Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` - Your Supabase anon key

6. Click "Deploy"

7. Your app will be live at: `https://your-project-name.vercel.app`

## Post-Deployment

- The app will automatically deploy on every push to `main` branch
- Check the Vercel dashboard for deployment status
- View logs if there are any issues

