# XAMPP Proper Shutdown Guide

## ⚠️ Why This Matters

When you shut down your PC without properly stopping MySQL, it can cause:
- Corrupted tablespace files (.ibd files)
- Lost database connections
- Data integrity issues
- Tables becoming inaccessible

## ✅ Proper Shutdown Procedure

### **ALWAYS do this before shutting down your PC:**

1. **Open XAMPP Control Panel**
2. **Stop MySQL** - Click the "Stop" button next to MySQL
   - Wait until MySQL status shows "Stopped" (not green anymore)
   - Check the log to confirm: "Status change detected: stopped"
3. **Stop Apache** (optional but recommended) - Click "Stop" next to Apache
4. **Close XAMPP Control Panel** (optional)
5. **Now you can safely shut down your PC**

### **What NOT to do:**
- ❌ Don't shut down PC while MySQL is running (green)
- ❌ Don't just close XAMPP window without stopping services
- ❌ Don't force-close XAMPP
- ❌ Don't use "Shut down" on PC while services are active

## 🔄 Quick Shutdown Script

I've created a script (`safe_shutdown.php`) that you can run before shutting down to ensure everything is saved properly.

## 💡 Best Practices

1. **Make it a habit**: Always stop MySQL before shutdown
2. **Check the logs**: If you see errors in XAMPP logs, investigate before shutting down
3. **Backup regularly**: Use `php artisan backup` or export databases periodically
4. **Use XAMPP's quit button**: The "Quit" button in XAMPP will stop all services automatically

## 🆘 If You Forget

If you accidentally shut down without stopping MySQL:
1. Start your PC
2. Start XAMPP and MySQL
3. Check if tables are accessible
4. If you see errors, run: `php backend/fix_tablespace_issues.php`

## 📦 Available Scripts

I've created these helper scripts for you:

1. **`safe_shutdown.php`** - Check database before shutdown
2. **`safe_shutdown.bat`** - Double-click to run safe shutdown check
3. **`fix_tablespace_issues.php`** - Fix corruption if you forgot to stop MySQL
4. **`create_backup.php`** - Backup your database before shutdown

## 🚀 Quick Usage

**Before shutting down your PC:**
```bash
# Option 1: Double-click this file
backend/safe_shutdown.bat

# Option 2: Run from command line
cd backend
php safe_shutdown.php
```

**If you forgot and have issues:**
```bash
cd backend
php fix_tablespace_issues.php
```

**To backup your data:**
```bash
cd backend
php create_backup.php
```

