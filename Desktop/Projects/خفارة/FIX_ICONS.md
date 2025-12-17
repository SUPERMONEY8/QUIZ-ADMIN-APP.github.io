# How to Fix Work Scheduler Icons

## Problem
Windows may cache icons, and the taskbar icon comes from the executable (nw.exe) itself, not from shortcuts.

## Solution 1: Run the Icon Update Script (Recommended)

### Option A: PowerShell Script (Run as Administrator)
1. Right-click `update_icons.ps1`
2. Select "Run with PowerShell"
3. If prompted, allow script execution
4. The script will:
   - Update desktop shortcut icon
   - Update Start Menu shortcut icon
   - Clear Windows icon cache
   - Restart Windows Explorer

### Option B: Batch File (Run as Administrator)
1. Right-click `update_icons.bat`
2. Select "Run as Administrator"
3. Follow the on-screen instructions

## Solution 2: Manual Icon Update

### For Desktop Shortcut:
1. Right-click the desktop shortcut
2. Select "Properties"
3. Click "Change Icon" button
4. Browse to: `C:\Program Files\WorkScheduler\Logo (1).ico`
5. Click "OK" and "Apply"

### For Start Menu Shortcut:
1. Press Windows Key
2. Find "Work Scheduler" in the Start Menu
3. Right-click → More → Open file location
4. Right-click the shortcut → Properties
5. Click "Change Icon"
6. Browse to: `C:\Program Files\WorkScheduler\Logo (1).ico`
7. Click "OK" and "Apply"

## Solution 3: Fix Taskbar Icon

The taskbar icon comes from the executable itself. To fix it:

### Method 1: Pin the Shortcut (Not the Executable)
1. Delete any pinned nw.exe from taskbar
2. Pin the desktop shortcut instead:
   - Right-click desktop shortcut
   - Select "Pin to taskbar"

### Method 2: Clear Icon Cache and Restart
1. Close all instances of the app
2. Run `update_icons.bat` or `update_icons.ps1` as Administrator
3. Restart your computer
4. The taskbar should now show the correct icon

### Method 3: Reinstall the Application
1. Uninstall the current version
2. Run the installer again (it will use the correct icon)
3. This ensures all shortcuts are created with the correct icon

## Solution 4: Clear Windows Icon Cache Manually

1. Open Task Manager (Ctrl+Shift+Esc)
2. End "Windows Explorer" process
3. Open Command Prompt as Administrator
4. Run these commands:
   ```
   del /f /q %LOCALAPPDATA%\IconCache.db
   del /f /q %LOCALAPPDATA%\Microsoft\Windows\Explorer\iconcache*.db
   ```
5. Restart Windows Explorer from Task Manager (File → Run new task → explorer.exe)
6. Or restart your computer

## Solution 5: Refresh Desktop Icons

1. Press F5 on the desktop to refresh
2. Or right-click desktop → Refresh

## Troubleshooting

### Icons Still Not Updating?
1. **Restart Windows** - This clears all icon caches
2. **Check icon file location** - Ensure `Logo (1).ico` exists in the app directory
3. **Run as Administrator** - Some operations require admin rights
4. **Check file permissions** - Ensure the icon file is not read-only

### Taskbar Icon Still Wrong?
- The taskbar uses the executable's embedded icon
- For NW.js apps, this is the nw.exe icon
- **Best solution**: Pin the shortcut (not nw.exe) to the taskbar
- The shortcut will use the custom icon from `Logo (1).ico`

### After Reinstalling:
- The installer should automatically use `Logo (1).ico` for shortcuts
- If not, run the update scripts after installation

## Notes

- **Window Icon**: Set in `package.json` - works for the app window title bar
- **Shortcut Icons**: Set in installer script - works for desktop/Start Menu shortcuts
- **Taskbar Icon**: Uses executable icon or pinned shortcut icon
- **Icon Cache**: Windows caches icons for performance - may need clearing

## Quick Fix Command (PowerShell as Admin)

```powershell
# Update shortcuts
$shell = New-Object -ComObject WScript.Shell
$shortcut = $shell.CreateShortcut("$env:USERPROFILE\Desktop\Work Scheduler.lnk")
$shortcut.IconLocation = "C:\Program Files\WorkScheduler\Logo (1).ico,0"
$shortcut.Save()

# Clear cache and restart explorer
taskkill /f /im explorer.exe
Remove-Item "$env:LOCALAPPDATA\IconCache.db" -ErrorAction SilentlyContinue
Start-Process explorer.exe
```

