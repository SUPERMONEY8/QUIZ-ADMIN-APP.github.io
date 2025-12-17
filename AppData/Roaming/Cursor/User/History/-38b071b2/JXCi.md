# Fix: Missing Firebase Environment Variables

## ✅ Your .env File is Correct!

The `.env` file exists and has all the right values. The issue is that **Vite needs to be restarted** to load environment variables.

## 🔧 Solution:

### Step 1: Stop the Dev Server
- Press `Ctrl + C` in the terminal where `bun run dev` is running
- Or close the terminal window

### Step 2: Restart the Dev Server
```bash
bun run dev
```

### Step 3: Refresh Your Browser
- Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
- Or close and reopen the browser tab

## ⚠️ Important Notes:

1. **Vite only reads `.env` on startup** - You MUST restart the server after creating/changing `.env`

2. **Check the terminal output** - After restarting, you should NOT see the "Missing Firebase environment variables!" error

3. **If you still see the error:**
   - Make sure `.env` is in the **project root** (same folder as `package.json`)
   - Make sure there are **NO spaces** around the `=` sign
   - Make sure there are **NO quotes** around the values
   - Check that variable names start with `VITE_`

## ✅ After Restart:

You should see:
- ✅ No error messages in console
- ✅ App loads normally
- ✅ Can create quizzes, add questions, etc.

## 🐛 Still Not Working?

If restarting doesn't work, check:
1. Browser console (F12) for specific error messages
2. Terminal output for any build errors
3. That `.env` file is exactly in the project root folder

