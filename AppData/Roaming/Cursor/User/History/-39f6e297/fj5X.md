# Connect Participant App to Same Supabase Database

## 🎯 Goal
Make the participant app use the same Supabase database as the admin app so quiz links work.

---

## 📋 Step-by-Step Instructions

### Step 1: Find Participant App's Supabase Config

1. **Open your participant app project** (the separate project where students take quizzes)

2. **Find the Supabase configuration file:**
   - Look for files like:
     - `supabaseConfig.js`
     - `supabase.js`
     - `.env` or `.env.local`
     - `config.js`
   - Usually in `src/` folder

### Step 2: Update Supabase Credentials

**Replace the participant app's Supabase credentials with these:**

```javascript
// In participant app's supabaseConfig.js (or similar file)

const supabaseUrl = 'https://tqsejmzmpaltnbvqmqor.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxc2VqbXptcGFsdG5idnFtcW9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1NzE5MTYsImV4cCI6MjA3ODE0NzkxNn0.7-fpBTuUH1JdKBMcD4kvIW0v8yPJ5R8W98-ef6cpQwg';
```

**OR if using environment variables:**

```env
VITE_SUPABASE_URL=https://tqsejmzmpaltnbvqmqor.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxc2VqbXptcGFsdG5idnFtcW9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1NzE5MTYsImV4cCI6MjA3ODE0NzkxNn0.7-fpBTuUH1JdKBMcD4kvIW0v8yPJ5R8W98-ef6cpQwg
```

### Step 3: Check Quiz Lookup Logic

**In the participant app, find where it loads quizzes from the link:**

1. **Find the route handler** for `/quiz/:quizId/enter` or similar
2. **Check how it queries Supabase:**
   - Should query: `supabase.from("quizzes").select("*").eq("id", quizId).single()`
   - Should also check for `share_code` if provided in URL params

**Example of what it should look like:**

```javascript
// In participant app - quiz loading logic
const { quizId } = useParams(); // or from URL
const { code, owner } = useSearchParams(); // URL query params

const { data: quiz, error } = await supabase
  .from("quizzes")
  .select("*")
  .eq("id", quizId)
  .single();

// Optional: Verify share_code if provided
if (code && quiz.share_code !== code) {
  // Invalid share code
  return;
}
```

### Step 4: Verify RLS Policies

**Make sure the participant app can READ quizzes:**

The RLS policy should allow reading published quizzes. If needed, run this in Supabase SQL Editor:

```sql
-- Allow reading published quizzes (for participants)
CREATE POLICY "Allow read published quizzes" ON quizzes
  FOR SELECT USING (status = 'published' OR is_published = true);
```

**OR if you want participants to access all quizzes (including drafts):**

The existing policy `"Allow all on quizzes"` should work fine.

### Step 5: Test the Connection

1. **Start the participant app** (if running locally)
2. **Copy a quiz link** from admin app
3. **Paste it in participant app**
4. **It should now find the quiz!**

---

## 🔍 Troubleshooting

### "Quiz not found" error?

1. **Check the quiz ID in the URL:**
   - Make sure it matches the UUID in your database
   - Check Supabase Table Editor → `quizzes` table

2. **Check RLS policies:**
   - Go to Supabase → Authentication → Policies
   - Make sure there's a policy allowing SELECT on quizzes

3. **Check browser console (F12):**
   - Look for Supabase error messages
   - Check network tab for failed requests

### Still not working?

1. **Verify both apps use same Supabase URL:**
   - Admin app: Check `src/supabaseConfig.js`
   - Participant app: Check its config file
   - They should be identical

2. **Check the quiz exists:**
   - Go to Supabase Table Editor
   - Check `quizzes` table
   - Find the quiz by ID

3. **Check quiz status:**
   - Make sure quiz is published (`status = "published"`)
   - Or adjust participant app to show drafts too

---

## ✅ Checklist

- [ ] Found participant app's Supabase config file
- [ ] Updated `VITE_SUPABASE_URL` to match admin app
- [ ] Updated `VITE_SUPABASE_ANON_KEY` to match admin app
- [ ] Verified quiz lookup logic queries correct table
- [ ] Checked RLS policies allow reading quizzes
- [ ] Tested with a quiz link from admin app
- [ ] Quiz loads successfully in participant app

---

## 🎉 Done!

Once you've updated the participant app's Supabase config, both apps will share the same database and quiz links will work perfectly!

