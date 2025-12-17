# 🧹 SQL Files Cleanup Guide

## ✅ KEEP THESE FILES:

### **1. `database_migration_complete.sql` ⭐ (NEW - USE THIS ONE!)**
- **What it does**: Adds ALL missing columns in ONE file
- **Contains**:
  - `share_code` column for quizzes table
  - `total_score`, `max_score`, `time_spent_seconds` for results table
- **Why keep**: This is the consolidated, complete migration file

### **2. `supabase-setup.sql`** (Keep for reference)
- **What it does**: Initial database setup (creates all tables)
- **When to use**: Only if you're setting up a brand new database from scratch
- **Why keep**: Useful reference for the full schema

---

## ❌ DELETE THESE FILES (They're duplicates/outdated):

### **1. `add_share_code_column.sql`**
- **Why delete**: Now included in `database_migration_complete.sql`
- **Status**: Duplicate

### **2. `add_max_score_column.sql`**
- **Why delete**: Only adds `max_score`, but we need all 3 columns (`total_score`, `max_score`, `time_spent_seconds`)
- **Status**: Incomplete, replaced by complete migration

---

## 📋 Summary:

**KEEP:**
- ✅ `database_migration_complete.sql` (NEW - run this one!)
- ✅ `supabase-setup.sql` (keep for reference)

**DELETE:**
- ❌ `add_share_code_column.sql`
- ❌ `add_max_score_column.sql`

---

## 🚀 What to Do Next:

1. **Run `database_migration_complete.sql`** in Supabase SQL Editor
   - This ONE file will add all missing columns
   - Safe to run multiple times

2. **Delete the old files**:
   - `add_share_code_column.sql`
   - `add_max_score_column.sql`

3. **Done!** Your database will have all the columns it needs.

---

## 📝 Note:

The other SQL files like `supabase_schema.sql`, `supabase_schema_fresh.sql`, etc. are schema reference files. You can keep them for reference, but you don't need to run them if your database is already set up.

