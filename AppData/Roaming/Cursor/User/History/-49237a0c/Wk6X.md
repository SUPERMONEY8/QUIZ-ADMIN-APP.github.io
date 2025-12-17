# 📚 How to Run SQL Migration in Supabase - Step by Step Guide

## 🎯 What We're Doing
We're adding a new column called `share_code` to your `quizzes` table in Supabase. This column will store the quiz codes (like "ABC123") that participants use to access quizzes.

---

## ✅ Step-by-Step Instructions

### **STEP 1: Open Your Supabase Dashboard**

1. Open your web browser (Chrome, Firefox, Edge, etc.)
2. Go to: **https://supabase.com/dashboard**
3. **Log in** with your Supabase account credentials
4. You should see a list of your projects

---

### **STEP 2: Select Your Project**

1. Look for your project in the list
   - It should be the one with URL: `https://dppbvokydkclcprsrpyv.supabase.co`
   - Or look for the project name you created
2. **Click on the project** to open it

---

### **STEP 3: Open the SQL Editor**

1. In the left sidebar, look for **"SQL Editor"**
   - It might be under a menu icon (☰) if the sidebar is collapsed
   - The icon looks like a document with lines of code
2. **Click on "SQL Editor"**
3. You should see a page with:
   - A text area/editor on the left (where you type SQL)
   - Results/output area on the right (where results appear)

---

### **STEP 4: Create a New Query**

1. Look for a button that says:
   - **"New query"** or
   - **"+"** (plus icon) or
   - **"Create new query"**
2. **Click it** to create a new SQL query tab
3. You should see an empty text editor

---

### **STEP 5: Copy the SQL Code**

1. Open the file `add_share_code_column.sql` in your project folder
   - Location: `C:\Users\LENOVO\Desktop\quiz-app-participant\add_share_code_column.sql`
2. **Select ALL the text** in that file:
   - Press `Ctrl + A` (select all)
   - Or click and drag to select everything
3. **Copy it**:
   - Press `Ctrl + C` (copy)
   - Or right-click → Copy

---

### **STEP 6: Paste the SQL Code into Supabase**

1. Go back to your Supabase SQL Editor (in the browser)
2. **Click inside the empty text editor** (the big text area)
3. **Paste the code**:
   - Press `Ctrl + V` (paste)
   - Or right-click → Paste
4. You should now see the SQL code in the editor

---

### **STEP 7: Run the SQL Code**

1. Look for a button to run the query:
   - **"Run"** button (usually green or blue)
   - Or **"Execute"** button
   - Or press `Ctrl + Enter` keyboard shortcut
2. **Click "Run"** (or press `Ctrl + Enter`)
3. Wait a few seconds...

---

### **STEP 8: Check the Results**

1. Look at the **results/output area** (usually on the right side or bottom)
2. You should see one of these messages:
   - ✅ **"Column share_code added successfully to quizzes table"** 
     - This means it worked! The column was added.
   - ✅ **"Column share_code already exists in quizzes table"**
     - This also means it worked! The column was already there.
3. If you see an **error message** (red text):
   - Don't panic! 
   - Copy the error message
   - Share it with me and I'll help you fix it

---

## 🎉 Success!

If you see either success message, you're done! The `share_code` column is now in your database.

---

## 🔍 Optional: Verify the Column Was Added

If you want to double-check that it worked:

1. In Supabase, go to **"Table Editor"** in the left sidebar
2. Click on the **"quizzes"** table
3. Look at the columns list
4. You should see **"share_code"** in the list of columns

---

## ❓ Troubleshooting

### **Problem: "I can't find SQL Editor"**
- **Solution**: Look for a menu icon (☰) in the top-left corner and click it to expand the sidebar

### **Problem: "I see an error about permissions"**
- **Solution**: Make sure you're logged in as the project owner/admin

### **Problem: "The code won't paste"**
- **Solution**: Try copying again, or type it manually (it's only 28 lines)

### **Problem: "I don't see any results"**
- **Solution**: Look for a "Results" tab or panel. Sometimes it's hidden - look for tabs at the bottom

---

## 📝 Quick Reference: The SQL Code

Here's what the code does (you don't need to understand it, but it's here for reference):

```sql
-- This checks if the share_code column exists
-- If it doesn't exist, it adds it
-- If it already exists, it does nothing (safe to run multiple times)
```

---

## ✅ Checklist

- [ ] Opened Supabase dashboard
- [ ] Selected the correct project
- [ ] Opened SQL Editor
- [ ] Created new query
- [ ] Copied SQL code from `add_share_code_column.sql`
- [ ] Pasted SQL code into Supabase editor
- [ ] Clicked "Run" button
- [ ] Saw success message
- [ ] (Optional) Verified column in Table Editor

---

**That's it! You're done! 🎉**

If you get stuck at any step, just tell me which step number and I'll help you!

