# Production Build Guide

This guide explains how to build and distribute the Depo application for Windows.

## 📋 Prerequisites

1. **Windows 10/11** (for building Windows installers)
2. **Bun** installed ([Download Bun](https://bun.sh/))
3. **Node.js** (for Electron Builder - comes with Bun)
4. **Icon file** at `build/icon.ico`

## 🏗️ Build Configuration

### App Metadata

- **App Name**: Depo
- **App ID**: `com.depo.app`
- **Version**: `1.0.0`
- **Description**: Business Management System for inventory, sales, purchases, and customer management
- **Publisher**: Depo Team
- **Icon**: `build/icon.ico`

### Build Settings

- **Target**: NSIS (Windows Installer)
- **Architecture**: x64
- **Compression**: Maximum
- **ASAR**: Enabled (app packaging)
- **One-Click Install**: Disabled (allows custom installation directory)
- **Desktop Shortcut**: Enabled
- **Start Menu Shortcut**: Enabled

## 🚀 Build Commands

### Development

```bash
# Run in development mode
bun run dev
```

### Production Build

```bash
# Full production build (clean + optimize + build)
bun run build

# Or use the dist command
bun run dist

# Windows-specific build
bun run build:win
```

### Build Directory Only (No Installer)

```bash
# Build app directory without creating installer
bun run build:win:dir
```

### Optimization

```bash
# Run optimization before build
bun run optimize

# Build with optimization
bun run build:optimize
```

### Clean Build

```bash
# Clean build artifacts
bun run clean
```

## 📦 Build Output

After building, you'll find:

- **Installer**: `dist/Depo-1.0.0-Setup.exe`
- **Unpacked App**: `dist/win-unpacked/` (for testing)

## 🔧 Build Configuration Details

### Files Included

The build includes:
- All source files (`src/**/*`)
- Main application files (`main.js`, `preload.js`, `renderer.js`, `index.html`)
- Required dependencies (`node_modules/bcryptjs`)
- Icon file

### Files Excluded

The build excludes:
- Documentation files (`*.md`)
- Example files (`*.example.js`)
- Example directories (`src/examples/**/*`)
- Development files

### Bundle Optimization

- **ASAR Packaging**: All files packaged into a single archive
- **Maximum Compression**: Reduces installer size
- **Tree Shaking**: Unused code removed
- **Minification**: CSS/JS minified (via optimize script)

## 🔐 Code Signing (Optional)

To sign your application:

1. **Obtain a code signing certificate**:
   - Purchase from a Certificate Authority (CA)
   - Or use a self-signed certificate for testing

2. **Configure signing** in `package.json`:

```json
{
  "build": {
    "win": {
      "certificateFile": "path/to/certificate.pfx",
      "certificatePassword": "your-password",
      "signingHashAlgorithms": ["sha256"],
      "sign": "path/to/signtool.exe"
    }
  }
}
```

3. **Environment variables** (alternative):

```bash
# Windows Certificate Store
set CSC_LINK=path/to/certificate.pfx
set CSC_KEY_PASSWORD=your-password

# Or use certificate file
set WIN_CERTIFICATE_FILE=path/to/certificate.pfx
set WIN_CERTIFICATE_PASSWORD=your-password
```

**Note**: Code signing is optional but recommended for production releases to avoid Windows security warnings.

## 🧪 Testing the Installer

### On Your Development Machine

1. **Build the installer**:
   ```bash
   bun run dist
   ```

2. **Run the installer**:
   - Navigate to `dist/`
   - Run `Depo-1.0.0-Setup.exe`
   - Follow the installation wizard

3. **Test the application**:
   - Launch from desktop shortcut
   - Launch from Start Menu
   - Verify all features work correctly

### On a Clean Windows Machine

1. **Create a VM or use a separate machine**:
   - Windows 10/11 clean installation
   - No development tools installed

2. **Transfer the installer**:
   - Copy `dist/Depo-1.0.0-Setup.exe` to the test machine
   - Or use a USB drive/network share

3. **Install and test**:
   - Run the installer
   - Verify installation completes successfully
   - Test application functionality
   - Test uninstallation

4. **Check for issues**:
   - Missing dependencies
   - File permissions
   - Registry entries
   - Shortcuts

## 🔄 Auto-Update Configuration (Optional)

To enable auto-updates:

1. **Set up update server**:
   - GitHub Releases (recommended)
   - Custom update server
   - S3/CloudFront

2. **Configure in `package.json`**:

```json
{
  "build": {
    "publish": {
      "provider": "github",
      "owner": "your-username",
      "repo": "depo-app"
    }
  }
}
```

3. **Implement update logic** in `main.js`:

```javascript
const { autoUpdater } = require('electron-updater');

autoUpdater.checkForUpdatesAndNotify();
```

## 📊 Build Size Optimization

### Current Optimizations

- ✅ ASAR packaging
- ✅ Maximum compression
- ✅ Exclude unnecessary files
- ✅ Tree shaking
- ✅ Minification (via optimize script)

### Further Optimization Tips

1. **Remove unused dependencies**:
   ```bash
   bun remove <unused-package>
   ```

2. **Optimize images**:
   - Use WebP format
   - Compress images
   - Remove unused images

3. **Code splitting**:
   - Lazy load pages
   - Split large modules

4. **Review bundle size**:
   ```bash
   # After build, check dist/win-unpacked/resources/app.asar
   ```

## 🐛 Troubleshooting

### Build Fails

1. **Check Node.js version**:
   ```bash
   node --version
   ```
   Should be v18 or later

2. **Clear cache**:
   ```bash
   bun run clean
   rm -rf node_modules
   bun install
   ```

3. **Check icon file**:
   - Ensure `build/icon.ico` exists
   - Verify it's a valid ICO file

### Installer Issues

1. **Windows Defender blocks installer**:
   - Code sign the application
   - Or add exception in Windows Defender

2. **Installation fails**:
   - Check Windows version (requires Windows 10+)
   - Run installer as Administrator
   - Check disk space

3. **App doesn't launch**:
   - Check Windows Event Viewer for errors
   - Verify all dependencies included
   - Check file permissions

### Icon Issues

1. **Icon not showing**:
   - Verify `build/icon.ico` exists
   - Check icon file is valid ICO format
   - Rebuild after adding icon

## 📝 Build Checklist

Before building for production:

- [ ] Update version in `package.json`
- [ ] Update app description
- [ ] Verify icon file exists at `build/icon.ico`
- [ ] Test application in development mode
- [ ] Run optimization script
- [ ] Clean previous builds
- [ ] Build installer
- [ ] Test installer on development machine
- [ ] Test installer on clean Windows machine
- [ ] Verify all features work
- [ ] Check file sizes
- [ ] Code sign (if applicable)

## 🚀 Release Process

1. **Update version**:
   ```bash
   # Edit package.json version
   # e.g., "1.0.0" -> "1.0.1"
   ```

2. **Build**:
   ```bash
   bun run dist
   ```

3. **Test**:
   - Test installer on clean machine
   - Verify all features

4. **Release**:
   - Upload installer to release server
   - Create release notes
   - Distribute to users

5. **Auto-update** (if configured):
   - Push release to GitHub
   - Auto-updater will notify users

## 📚 Additional Resources

- [Electron Builder Documentation](https://www.electron.build/)
- [NSIS Documentation](https://nsis.sourceforge.io/Docs/)
- [Code Signing Guide](https://www.electron.build/code-signing)
- [Auto-Update Guide](https://www.electron.build/auto-update)

