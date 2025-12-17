# Fix: Netlify Deploying Participant App Instead of Admin App

## 🔴 The Problem

Netlify is deploying the **participant dashboard** instead of the **admin dashboard**. This means Netlify is connected to the **wrong GitHub repository**.

## ✅ Solution: Connect Netlify to the Correct Repository

### Step 1: Check Your Current Netlify Site

1. Go to [app.netlify.com](https://app.netlify.com)
2. Find your site
3. Click on it
4. Go to **"Site configuration"** → **"Build & deploy"**
5. Check **"Connected repository"** - what does it say?

### Step 2: Identify the Correct Repository

**Your ADMIN app repository should be:**
- **GitHub:** `SUPERMONEY8/QUIZ-APP-ADMIN`
- **Local folder:** `ADMIN-ACCESS FOR QUIZ APP`

**If Netlify shows a different repo** (like `QUIZ-APP` or `quiz-app-participant`), that's the problem!

### Step 3: Fix It - Option A: Change Repository (Recommended)

1. In Netlify, go to **"Site configuration"** → **"Build & deploy"**
2. Scroll to **"Connected repository"**
3. Click **"Change repository"** or **"Disconnect"**
4. Click **"Add new site"** → **"Import an existing project"**
5. Select **"GitHub"**
6. Find and select: **`SUPERMONEY8/QUIZ-APP-ADMIN`**
7. Configure build settings:
   - **Build command:** `bun run build` (or `npm run build`)
   - **Publish directory:** `dist`
   - **Branch to deploy:** `main`
8. Click **"Deploy site"**

### Step 3: Fix It - Option B: Create New Site

If you want to keep both sites:

1. In Netlify dashboard, click **"Add new site"** → **"Import an existing project"**
2. Select **"GitHub"**
3. Find and select: **`SUPERMONEY8/QUIZ-APP-ADMIN`**
4. Configure:
   - **Build command:** `bun run build`
   - **Publish directory:** `dist`
   - **Branch:** `main`
5. Click **"Deploy site"**
6. Add environment variables (see NETLIFY_ENV_SETUP.md)
7. This will give you a NEW URL for the admin app

### Step 4: Verify It's the Admin App

After deployment, check:
- ✅ URL should show admin dashboard (not participant login)
- ✅ Should see "My Quizzes", "Create New Quiz" buttons
- ✅ Should NOT see participant login/entry page

## 🎯 Quick Checklist

- [ ] Checked which repo Netlify is connected to
- [ ] Confirmed it should be `SUPERMONEY8/QUIZ-APP-ADMIN`
- [ ] Changed repository or created new site
- [ ] Set build command: `bun run build`
- [ ] Set publish directory: `dist`
- [ ] Added Firebase environment variables
- [ ] Verified admin dashboard loads (not participant)

## 📝 How to Tell Which App is Which

**Admin App (`QUIZ-APP-ADMIN`):**
- Has `AdminDashboard.jsx`
- Has `CreateQuizForm.jsx`
- Has `QuizList.jsx`
- Shows "My Quizzes" page
- No login required (admin-access mode)

**Participant App:**
- Has participant login/entry page
- Has quiz taking interface
- Users enter codes to access quizzes
- Different repository name

## 🐛 Still Wrong?

1. **Double-check repository name:**
   - In GitHub, your admin repo should be: `QUIZ-APP-ADMIN`
   - In Netlify, it should show the same name

2. **Check build logs:**
   - Go to Deploys → Latest deployment → Build log
   - Look for which files are being built
   - Should see `AdminDashboard.jsx` in the build

3. **Verify local repo:**
   ```bash
   git remote -v
   ```
   Should show: `github.com/SUPERMONEY8/QUIZ-APP-ADMIN.git`

## ✅ After Fixing

Once Netlify is connected to the correct repo:
1. Add environment variables (see NETLIFY_ENV_SETUP.md)
2. Trigger a new deployment
3. Admin dashboard should load!

