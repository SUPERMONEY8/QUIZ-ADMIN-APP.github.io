# Supabase Setup Guide for Quiz App Admin

Follow these steps to set up your Supabase database for the Quiz App Admin.

## 🗄️ Step 1: Create Supabase Project

1. **Go to Supabase:**
   - Visit [https://supabase.com](https://supabase.com)
   - Sign in with your GitHub account (or create an account)

2. **Create New Project:**
   - Click **"New Project"** button
   - Fill in the details:
     - **Name**: `quiz-app-admin` (or your preferred name)
     - **Database Password**: Create a strong password ⚠️ **SAVE THIS PASSWORD!**
     - **Region**: Choose the region closest to you
     - **Pricing Plan**: Select **Free** (good for development)

3. **Click "Create new project"**
   - Wait 1-2 minutes for the project to be created

## 🔑 Step 2: Get Your API Credentials

1. **Navigate to API Settings:**
   - In your Supabase project dashboard, go to **Settings** (gear icon in sidebar)
   - Click **"API"** in the settings menu

2. **Copy Your Credentials:**
   You'll need these two values:
   
   - **Project URL** 
     - Found under "Project URL"
     - Looks like: `https://xxxxxxxxxxxxx.supabase.co`
     - Copy this entire URL
   
   - **anon public key**
     - Found under "Project API keys" → "anon public"
     - Long string starting with `eyJ...`
     - Click the eye icon to reveal, then copy

3. **Save these values** - you'll need them for Vercel deployment!

## 📊 Step 3: Set Up Database Tables

Your app needs these tables. Let's create them:

1. **Go to SQL Editor:**
   - Click **"SQL Editor"** in the left sidebar
   - Click **"New query"**

2. **Run this SQL to create the tables:**

```sql
-- Create quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_published BOOLEAN DEFAULT FALSE,
  settings JSONB DEFAULT '{}'::jsonb
);

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('multiple_choice', 'true_false', 'short_answer')),
  options JSONB,
  correct_answer TEXT,
  points INTEGER DEFAULT 1,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create results table
CREATE TABLE IF NOT EXISTS results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  participant_name TEXT,
  participant_email TEXT,
  score INTEGER DEFAULT 0,
  total_points INTEGER DEFAULT 0,
  answers JSONB DEFAULT '[]'::jsonb,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  graded_at TIMESTAMP WITH TIME ZONE,
  is_graded BOOLEAN DEFAULT FALSE
);

-- Create participants table (optional, for tracking)
CREATE TABLE IF NOT EXISTS participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_questions_quiz_id ON questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_results_quiz_id ON results(quiz_id);
CREATE INDEX IF NOT EXISTS idx_participants_quiz_id ON participants(quiz_id);

-- Enable Row Level Security (RLS) - we'll configure policies next
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
```

3. **Click "Run"** to execute the SQL

4. **Verify Tables Created:**
   - Go to **"Table Editor"** in the sidebar
   - You should see: `quizzes`, `questions`, `results`, `participants`

## 🔒 Step 4: Configure Row Level Security (RLS)

Since this is an admin app, we'll allow all operations. Run this SQL:

```sql
-- Allow all operations on quizzes (admin access)
CREATE POLICY "Allow all on quizzes" ON quizzes
  FOR ALL USING (true) WITH CHECK (true);

-- Allow all operations on questions
CREATE POLICY "Allow all on questions" ON questions
  FOR ALL USING (true) WITH CHECK (true);

-- Allow all operations on results
CREATE POLICY "Allow all on results" ON results
  FOR ALL USING (true) WITH CHECK (true);

-- Allow all operations on participants
CREATE POLICY "Allow all on participants" ON participants
  FOR ALL USING (true) WITH CHECK (true);
```

## ✅ Step 5: Verify Setup

1. **Test the connection:**
   - Go to **"Table Editor"**
   - Try creating a test quiz manually
   - If it works, your database is ready!

2. **Check API access:**
   - Go to **Settings** → **API**
   - Make sure your Project URL and anon key are saved

## 📝 Next Steps

Now that Supabase is set up:

1. ✅ You have your **Project URL** and **anon key**
2. ✅ Database tables are created
3. ✅ RLS policies are configured

**Next:** Deploy to Vercel and add these environment variables:
- `VITE_SUPABASE_URL` = your Project URL
- `VITE_SUPABASE_ANON_KEY` = your anon public key

## 🔧 Troubleshooting

### Can't see tables?
- Check SQL Editor for any errors
- Make sure you ran the CREATE TABLE statements

### RLS blocking operations?
- Verify the policies were created
- Check the policies in **Authentication** → **Policies**

### Need to reset?
- Go to **Settings** → **Database** → **Reset Database** (⚠️ This deletes all data!)

---

**Your Supabase project is ready!** 🎉

Move on to Vercel deployment next.

