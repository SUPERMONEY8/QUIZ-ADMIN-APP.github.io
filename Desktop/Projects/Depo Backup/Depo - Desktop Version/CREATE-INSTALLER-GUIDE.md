# 📦 Creating Installer (.exe) for Distribution

This guide will help you create a professional Windows installer (.exe) that your clients can download and install easily.

## ✅ Prerequisites Check

Before building, ensure you have:

- ✅ **Windows 10/11** (required for building Windows installers)
- ✅ **Bun** installed ([Download here](https://bun.sh/) if needed)
- ✅ **All dependencies installed** (run `bun install` if needed)
- ✅ **Icon file** exists at `build/icon.ico` ✅ (Verified)

## 🚀 Step-by-Step: Building the Installer

### Step 1: Prepare Your Project

1. **Ensure all dependencies are installed:**
   ```bash
   bun install
   ```

2. **Test your application works:**
   ```bash
   bun run dev
   ```
   - Verify everything works correctly
   - Close the app when done testing

### Step 2: Clean Previous Builds (Optional but Recommended)

```bash
bun run clean
```

This removes old build artifacts to ensure a fresh build.

### Step 3: Build the Installer

Choose one of these commands:

**Option A: Standard Build (Recommended)**
```bash
bun run dist
```

**Option B: Production Build with Optimization**
```bash
bun run build:prod
```

**Option C: Windows-Specific Build**
```bash
bun run build:win
```

### Step 4: Find Your Installer

After the build completes, your installer will be located at:

```
dist/Depo Setup 1.0.0.exe
```

This is the file you'll share with your clients!

## 📋 What the Installer Includes

Your installer is configured to:

- ✅ **Allow custom installation directory** (users can choose where to install)
- ✅ **Create desktop shortcut** (easy access for users)
- ✅ **Create Start Menu shortcut** (in Business category)
- ✅ **Launch app after installation** (optional, can be disabled)
- ✅ **Check if app is running** (prevents installation issues)
- ✅ **Require Windows 10+** (ensures compatibility)
- ✅ **Preserve user data on uninstall** (data won't be deleted)

## 🧪 Testing the Installer

### Test on Your Machine First

1. **Navigate to the dist folder:**
   ```
   dist/Depo Setup 1.0.0.exe
   ```

2. **Run the installer:**
   - Double-click `Depo Setup 1.0.0.exe`
   - Follow the installation wizard
   - Choose installation directory (or use default)
   - Complete installation

3. **Verify installation:**
   - Check desktop shortcut appears
   - Check Start Menu → Business → Depo
   - Launch the app and test functionality
   - Verify it works correctly

4. **Test uninstallation:**
   - Go to Settings → Apps → Depo
   - Click Uninstall
   - Verify uninstaller works

### Test on a Clean Machine (Recommended)

1. **Use a VM or separate Windows machine:**
   - Windows 10/11 clean installation
   - No development tools installed
   - This simulates your client's environment

2. **Transfer the installer:**
   - Copy `dist/Depo Setup 1.0.0.exe` to the test machine
   - Use USB drive, network share, or cloud storage

3. **Install and test:**
   - Run the installer
   - Complete installation
   - Test all features
   - Verify shortcuts work

## 📤 Distributing to Clients

### Option 1: Direct Download

1. **Upload to cloud storage:**
   - Google Drive
   - Dropbox
   - OneDrive
   - Your own web server

2. **Share download link:**
   - Send link to clients
   - They download and run the installer

### Option 2: USB/Flash Drive

1. **Copy installer to USB:**
   - Copy `dist/Depo Setup 1.0.0.exe` to USB drive
   - Label the USB clearly

2. **Deliver to clients:**
   - Physical delivery
   - They run installer from USB

### Option 3: Your Website

1. **Upload to your website:**
   - Create a download page
   - Upload `Depo Setup 1.0.0.exe`
   - Add download button/link

2. **Client downloads:**
   - They visit your website
   - Click download
   - Run installer

## 🔐 Important Notes

### Windows Security Warning

When clients first run the installer, Windows may show a security warning:

**"Windows protected your PC"** or **"Unknown publisher"**

This is normal for unsigned applications. To fix this:

1. **Code Signing (Recommended for production):**
   - Purchase a code signing certificate
   - Sign the installer before distribution
   - See `build/code-signing.md` for details

2. **For now, clients can:**
   - Click "More info"
   - Click "Run anyway"
   - The app is safe, it's just not signed

### File Size

The installer will be approximately:
- **50-150 MB** (depending on Electron version and dependencies)
- This is normal for Electron applications
- Maximum compression is enabled to minimize size

## 📝 Build Checklist

Before distributing:

- [ ] Test application in development mode
- [ ] Build the installer (`bun run dist`)
- [ ] Test installer on your machine
- [ ] Test installer on clean Windows machine (if possible)
- [ ] Verify all features work after installation
- [ ] Check desktop shortcut works
- [ ] Check Start Menu shortcut works
- [ ] Test uninstallation
- [ ] Verify file size is reasonable
- [ ] Update version number if needed (in `package.json`)

## 🔄 Updating the Version

When you release a new version:

1. **Update version in `package.json`:**
   ```json
   "version": "1.0.1"  // Change from 1.0.0 to 1.0.1
   ```

2. **Rebuild:**
   ```bash
   bun run dist
   ```

3. **New installer will be:**
   ```
   dist/Depo Setup 1.0.1.exe
   ```

## 🐛 Troubleshooting

### Build Fails

**Error: "electron-builder not found"**
```bash
bun install
```

**Error: "Icon file not found"**
- Verify `build/icon.ico` exists
- Rebuild after adding icon

**Error: "Out of memory"**
- Close other applications
- Try building again

### Installer Issues

**Windows Defender blocks installer:**
- This is normal for unsigned apps
- Clients can click "More info" → "Run anyway"
- Or code sign the application

**Installation fails:**
- Check Windows version (requires Windows 10+)
- Run installer as Administrator
- Check disk space (need ~200MB free)

**App doesn't launch after installation:**
- Check Windows Event Viewer for errors
- Verify installation completed successfully
- Try reinstalling

## 📚 Quick Reference

### Build Commands

```bash
# Standard build
bun run dist

# Production build with optimization
bun run build:prod

# Windows-specific build
bun run build:win

# Clean before building
bun run clean && bun run dist
```

### Output Location

```
dist/Depo Setup 1.0.0.exe  ← This is your installer!
```

### File to Share

Share this single file with clients:
- **`dist/Depo Setup 1.0.0.exe`**

That's it! One file, easy distribution.

## 🎉 You're Ready!

Once you've built the installer and tested it, you're ready to distribute to clients. The installer handles everything automatically - your clients just need to:

1. Download the `.exe` file
2. Double-click to run
3. Follow the installation wizard
4. Start using Depo!

---

**Need help?** Check the other documentation files:
- `BUILD.md` - Detailed build information
- `BUILD-CONFIGURATION-SUMMARY.md` - Configuration details
- `build/code-signing.md` - Code signing guide

