# 📦 Complete Guide: Creating Installable .exe for Clients

## 🎯 Overview

This guide will help you create a professional Windows installer (.exe) that your clients can easily download, install, and use on their machines.

---

## 📋 Step 1: Build the Installer

### Option A: Quick Build (Recommended)
```bash
bun run dist
```

### Option B: Production Build (Optimized)
```bash
bun run build:prod
```

**What happens:**
- Builds your Electron app
- Creates a Windows installer (.exe)
- Packages all dependencies
- Takes 2-5 minutes

---

## 📁 Step 2: Find Your Installer

After the build completes, your installer will be located at:

```
dist/Depo Setup 1.0.0.exe
```

**This is the file you'll share with your clients!**

---

## ✅ Step 3: Test the Installer (IMPORTANT!)

Before distributing, test it on your machine:

1. **Navigate to the `dist` folder**
2. **Double-click `Depo Setup 1.0.0.exe`**
3. **Follow the installation wizard:**
   - Choose installation directory (or use default: `C:\Program Files\Depo`)
   - Click "Install"
   - Wait for installation to complete
4. **Verify installation:**
   - Check desktop shortcut appears
   - Check Start Menu → Business → Depo
   - Launch the app and test all features
5. **Test uninstallation:**
   - Go to Settings → Apps → Depo
   - Click Uninstall
   - Verify it works correctly

---

## 📤 Step 4: Prepare Distribution Folder

Create a folder structure for your clients:

### Recommended Folder Structure:
```
Depo-Installer/
├── Depo Setup 1.0.0.exe    ← The installer
├── README.txt              ← Instructions for clients
└── System-Requirements.txt ← Optional: System requirements
```

### Create README.txt for Clients:

Create a simple text file with these instructions:

```
==========================================
  DEPO - INSTALLATION INSTRUCTIONS
==========================================

STEP 1: Download/Receive the Installer
  - You should have received: "Depo Setup 1.0.0.exe"
  - Save it to your Desktop or Downloads folder

STEP 2: Run the Installer
  - Double-click "Depo Setup 1.0.0.exe"
  - If Windows shows a security warning:
    * Click "More info"
    * Click "Run anyway"
    * (This is normal for new software)

STEP 3: Follow Installation Wizard
  - Choose installation location (or use default)
  - Click "Install"
  - Wait for installation to complete

STEP 4: Launch Depo
  - Desktop shortcut will be created automatically
  - Or find it in Start Menu → Business → Depo
  - Double-click to launch

STEP 5: Start Using Depo
  - The app will open and you can start working
  - All your data is stored locally on your computer

==========================================
  SYSTEM REQUIREMENTS
==========================================
- Windows 10 or later
- At least 200 MB free disk space
- Internet connection (optional, for updates)

==========================================
  SUPPORT
==========================================
If you encounter any issues:
- Make sure Windows 10 or later is installed
- Close Depo before installing/uninstalling
- Contact support if problems persist

==========================================
```

---

## 🚀 Step 5: Distribute to Clients

### Option 1: Cloud Storage (Recommended)
1. **Upload to:**
   - Google Drive
   - Dropbox
   - OneDrive
   - Your own web server

2. **Share the link:**
   - Send download link to clients
   - They download and run the installer

### Option 2: USB/Flash Drive
1. **Copy files to USB:**
   - Copy the entire `Depo-Installer` folder
   - Label the USB clearly

2. **Deliver to clients:**
   - Physical delivery
   - They run installer from USB

### Option 3: Email (Small files only)
1. **Attach the installer:**
   - Note: File size is ~50-150 MB
   - Some email providers may block large attachments
   - Use cloud storage for better reliability

### Option 4: Your Website
1. **Create download page:**
   - Upload `Depo Setup 1.0.0.exe`
   - Add download button
   - Provide instructions

2. **Client downloads:**
   - They visit your website
   - Click download
   - Run installer

---

## 👤 Step 6: Client Installation Process

Your clients will:

1. **Receive the installer:**
   - Download from link, USB, or email
   - Save to Desktop or Downloads

2. **Run the installer:**
   - Double-click `Depo Setup 1.0.0.exe`
   - If security warning appears: Click "More info" → "Run anyway"

3. **Install:**
   - Choose installation location (default: `C:\Program Files\Depo`)
   - Click "Install"
   - Wait for completion (~30 seconds)

4. **Launch and use:**
   - Desktop shortcut created automatically
   - Or Start Menu → Business → Depo
   - Double-click to launch
   - Start working with the app

---

## 🔐 Important Notes

### Windows Security Warning

When clients first run the installer, Windows may show:
- **"Windows protected your PC"** or **"Unknown publisher"**

**This is normal for unsigned applications.**

**Solution for clients:**
1. Click "More info"
2. Click "Run anyway"
3. The app is safe, it's just not code-signed

**To remove this warning (for future):**
- Purchase a code signing certificate
- Sign the installer before distribution
- See `build/code-signing.md` for details

### File Size

- **Installer size:** ~50-150 MB
- This is normal for Electron applications
- Maximum compression is enabled

---

## 📝 Quick Reference

### Build Commands
```bash
# Standard build (recommended)
bun run dist

# Production build with optimization
bun run build:prod

# Clean and build
bun run clean && bun run dist
```

### Output Location
```
dist/Depo Setup 1.0.0.exe  ← Your installer file
```

### What to Share with Clients
- **Single file:** `Depo Setup 1.0.0.exe`
- **Optional:** `README.txt` with instructions

---

## 🔄 Updating Version

When releasing a new version:

1. **Update version in `package.json`:**
   ```json
   "version": "1.0.1"  // Change from 1.0.0
   ```

2. **Rebuild:**
   ```bash
   bun run dist
   ```

3. **New installer:**
   ```
   dist/Depo Setup 1.0.1.exe
   ```

---

## ✅ Checklist Before Distribution

- [ ] Build completed successfully (`bun run dist`)
- [ ] Installer exists at `dist/Depo Setup 1.0.0.exe`
- [ ] Tested installer on your machine
- [ ] Verified app launches correctly
- [ ] Verified desktop shortcut works
- [ ] Verified Start Menu shortcut works
- [ ] Tested uninstallation
- [ ] Created README.txt for clients (optional)
- [ ] Prepared distribution method (cloud/USB/website)
- [ ] Ready to share with clients!

---

## 🎉 You're Ready!

Once you've completed these steps, you can distribute the installer to your clients. They'll be able to:

1. ✅ Download/receive the installer
2. ✅ Install it on their machine
3. ✅ Run and work with the app locally
4. ✅ Have desktop shortcut for easy access

**That's it! Simple and professional.**

---

## 🐛 Troubleshooting

### Build Fails
```bash
# Install dependencies
bun install

# Try again
bun run dist
```

### Installer Not Found
- Check `dist` folder
- Verify build completed successfully
- Look for `Depo Setup 1.0.0.exe`

### Windows Blocks Installer
- This is normal for unsigned apps
- Clients can click "More info" → "Run anyway"
- Or code sign the application

### Installation Fails
- Check Windows version (requires Windows 10+)
- Run installer as Administrator
- Check disk space (need ~200MB free)

---

**Need more details?** See:
- `CREATE-INSTALLER-GUIDE.md` - Detailed guide
- `QUICK-BUILD-INSTALLER.md` - Quick reference
- `build/code-signing.md` - Code signing information


