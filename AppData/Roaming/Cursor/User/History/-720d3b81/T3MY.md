# Fixing Login Issues After Signup

## Problem
After signing up, users cannot log in. This is typically due to one of these issues:

1. **Email Confirmation Required**: Supabase requires email confirmation by default
2. **RLS Policy Issues**: Row Level Security policies may be blocking admin entry creation
3. **User ID Mismatch**: The user ID format might not match between auth and database

## Solutions

### Solution 1: Disable Email Confirmation (Recommended for Development)

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Settings**
3. Find **Email Auth** section
4. **Disable** the "Confirm email" toggle
5. Save changes

This allows users to log in immediately after signup without email confirmation.

### Solution 2: Check RLS Policies

Make sure your RLS policies allow admins to insert their own records:

```sql
-- This policy should exist in your database
CREATE POLICY "Admins can insert own profile"
    ON admins FOR INSERT
    WITH CHECK (auth.uid()::text = id::text);
```

To verify:
1. Go to Supabase Dashboard → **Table Editor** → **admins** table
2. Click **Policies** tab
3. Verify the "Admins can insert own profile" policy exists
4. If missing, run the RLS policies SQL script

### Solution 3: Verify User ID Format

The user ID from Supabase Auth should match the UUID format in your `admins` table. The code now handles this correctly, but verify:

1. Check browser console for any errors during signup
2. Look for "Error creating admin entry" messages
3. Verify the user ID is a valid UUID format

## Testing

After applying fixes:

1. **Sign up** with a new account
2. **Check browser console** for any errors
3. **Try logging in** immediately
4. If it still fails, check:
   - Browser console for specific error messages
   - Supabase Dashboard → Authentication → Users (verify user was created)
   - Supabase Dashboard → Table Editor → admins (verify admin entry exists)

## Common Error Messages

### "Email confirmation required"
- **Fix**: Disable email confirmation in Supabase settings (Solution 1)

### "Permission denied" or "RLS policy violation"
- **Fix**: Check RLS policies (Solution 2)

### "Invalid login credentials"
- **Fix**: 
  - Verify email/password are correct
  - Check if email confirmation is required
  - Verify user exists in Supabase Auth

## Code Changes Made

1. ✅ Fixed `LoginPage.jsx` to use `authUser.id` instead of `authUser.uid`
2. ✅ Fixed `SignUpPage.jsx` to use `authUser.id` instead of `authUser.uid`
3. ✅ Added email confirmation check in `useAuth.js` signup function
4. ✅ Improved error logging in `ensureAdminEntry` function
5. ✅ Added better RLS error detection and logging

## Next Steps

1. **Disable email confirmation** in Supabase Dashboard (if you want immediate login)
2. **Test signup and login** flow
3. **Check browser console** for any remaining errors
4. **Verify admin entry** is created in the database

If issues persist, check the browser console for specific error messages and share them for further debugging.

