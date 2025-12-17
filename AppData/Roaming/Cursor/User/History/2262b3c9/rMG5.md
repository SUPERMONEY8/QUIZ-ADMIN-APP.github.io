# Work Scheduler - Installer Creation Guide

This guide will help you create an installable version of the Work Scheduler application that can be distributed via flash disk or CD.

## Method 1: Using Inno Setup (Recommended)

### Step 1: Download and Install Inno Setup
1. Download Inno Setup from: https://jrsoftware.org/isdl.php
2. Install it on your computer (it's free and open source)

### Step 2: Create the Installer
1. Open Inno Setup Compiler
2. Go to **File** → **Open**
3. Select `installer_simple.iss` from this folder
4. Click **Build** → **Compile** (or press F9)
5. The installer will be created in the `installer_output` folder
6. The file will be named: `WorkScheduler_Setup.exe`

### Step 3: Distribute the Installer
- Copy `WorkScheduler_Setup.exe` to your flash disk or CD
- Your clients can run this file to install the application
- The installer will:
  - Install the app to Program Files
  - Create Start Menu shortcuts
  - Optionally create a desktop shortcut
  - Add an uninstaller

## Method 2: Portable Version (No Installation Required)

If you prefer a portable version that doesn't require installation:

### Step 1: Create a Portable Folder
1. Create a new folder named `WorkScheduler_Portable`
2. Copy ALL files from your application folder to this new folder:
   - All .js, .html, .css, .png files
   - All .dll, .exe, .dat, .pak, .bin files
   - The `locales` folder (entire folder)
   - The `swiftshader` folder (entire folder)

### Step 2: Create a Launcher
Create a file named `Start_WorkScheduler.bat` with this content:
```batch
@echo off
cd /d "%~dp0"
start nw.exe
```

### Step 3: Distribute
- Copy the entire `WorkScheduler_Portable` folder to flash disk or CD
- Users can run `Start_WorkScheduler.bat` to launch the app
- No installation required - works from any location

## Method 3: Using NSIS (Alternative)

If you prefer NSIS instead of Inno Setup:

1. Download NSIS from: https://nsis.sourceforge.io/Download
2. Use the provided NSIS script (if created)
3. Compile using NSIS compiler

## Important Notes

### For Distribution:
- **Test the installer** on a clean Windows machine before distributing
- Make sure all files are included in the installer script
- The installer requires Windows 7 or later
- Works on both 32-bit and 64-bit Windows

### File Size:
- The installer will be approximately 100-150 MB (includes NW.js runtime)
- The portable version will be the same size

### Security:
- Windows SmartScreen may show a warning on first run
- This is normal for unsigned applications
- Users need to click "More info" → "Run anyway"

## Troubleshooting

### If the installer doesn't work:
1. Make sure all source files exist in the current directory
2. Check that Inno Setup is properly installed
3. Verify the file paths in the .iss script are correct

### If the installed app doesn't run:
1. Check Windows Event Viewer for errors
2. Make sure all DLL files are included
3. Try running as administrator
4. Check antivirus isn't blocking the app

## Customization

You can customize the installer by editing `installer_simple.iss`:
- Change `AppName` to your preferred name
- Change `AppVersion` to update version number
- Modify `DefaultDirName` to change installation location
- Add your company information in `AppPublisher`

## Support

For issues or questions, refer to:
- Inno Setup documentation: https://jrsoftware.org/ishelp/
- NW.js documentation: https://nwjs.io/

