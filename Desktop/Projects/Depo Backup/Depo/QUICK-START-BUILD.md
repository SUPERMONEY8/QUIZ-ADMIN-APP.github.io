# Quick Start: Building Depo for Production

## 🚀 Quick Build Commands

```bash
# Full production build (recommended)
bun run build

# Or use dist command
bun run dist

# Build without optimization (faster, for testing)
bun run build:win
```

## 📋 Prerequisites Check

Before building, ensure:

- ✅ Icon file exists: `build/icon.ico`
- ✅ All dependencies installed: `bun install`
- ✅ Application works in dev mode: `bun run dev`

## 🏗️ Build Process

The `bun run build` command does:

1. **Clean** - Removes old build artifacts
2. **Optimize** - Minifies CSS/JS, removes unused code
3. **Build** - Creates Windows installer

## 📦 Output

After building, find your installer at:

```
dist/Depo-1.0.0-Setup.exe
```

## 🧪 Testing

1. **Run the installer** on your development machine
2. **Install** to a test directory
3. **Launch** the application
4. **Test** all features
5. **Uninstall** to test uninstaller

## 🖥️ Testing on Clean Windows Machine

1. **Copy installer** to a clean Windows 10/11 machine
2. **Run installer** (may need to allow "Unknown Publisher" if not signed)
3. **Install** the application
4. **Test** all functionality
5. **Verify** shortcuts work
6. **Test** uninstallation

## ⚙️ Configuration

All build settings are in `package.json` under the `build` section.

Key settings:
- **App Name**: Depo
- **Version**: 1.0.0
- **Icon**: `build/icon.ico`
- **Installer Type**: NSIS
- **Architecture**: x64

## 🔐 Code Signing (Optional)

To sign your application (prevents Windows warnings):

1. **Obtain certificate** (see `build/code-signing.md`)
2. **Set environment variables**:
   ```bash
   set CSC_LINK=path\to\certificate.pfx
   set CSC_KEY_PASSWORD=your-password
   ```
3. **Build** as normal: `bun run build`

## 📚 Full Documentation

For detailed information, see:
- **BUILD.md** - Complete build guide
- **build/code-signing.md** - Code signing guide

## 🐛 Troubleshooting

### Build fails
- Check Node.js version: `node --version` (should be v18+)
- Clear cache: `bun run clean && rm -rf node_modules && bun install`

### Icon not found
- Ensure `build/icon.ico` exists
- Copy icon: `copy Gemini_Generated_Image_ue4gmpue4gmpue4g.ico build\icon.ico`

### Installer shows warnings
- Code sign the application (see code-signing.md)
- Or users can click "More info" → "Run anyway"

## ✅ Build Checklist

Before releasing:

- [ ] Update version in `package.json`
- [ ] Verify icon exists at `build/icon.ico`
- [ ] Test application in dev mode
- [ ] Run production build
- [ ] Test installer on dev machine
- [ ] Test installer on clean Windows machine
- [ ] Code sign (if applicable)
- [ ] Verify all features work
- [ ] Check file sizes are reasonable

