# 🎨 Adding Your Logo as App Icon

## Quick Steps

### Option 1: If you have the image file

1. **Place your image file** (PNG, JPG, etc.) in the project root or `src/assets/images/`

2. **Convert to .ico format:**
   ```powershell
   .\scripts\convert-icon.ps1 -ImagePath "path\to\your\logo.png" -OutputPath "build\icon.ico"
   ```

3. **Or use ImageMagick (recommended):**
   ```powershell
   magick convert "path\to\your\logo.png" -resize 256x256 -define icon:auto-resize=256,128,96,64,48,32,16 "build\icon.ico"
   ```

4. **Rebuild the app:**
   ```powershell
   bunx electron-packager . Depo --platform=win32 --arch=x64 --out=dist --overwrite --icon=build/icon.ico
   ```

### Option 2: Manual conversion

1. **Use an online converter:**
   - Go to https://convertio.co/png-ico/ or https://www.icoconverter.com/
   - Upload your logo image
   - Download the .ico file
   - Save it as `build\icon.ico`

2. **Rebuild the app:**
   ```powershell
   bunx electron-packager . Depo --platform=win32 --arch=x64 --out=dist --overwrite --icon=build/icon.ico
   ```

### Option 3: Using the existing icon file

If you already have a `.ico` file:
1. Copy it to `build\icon.ico`
2. Rebuild the app

## Image Requirements

- **Format:** PNG, JPG, or ICO
- **Recommended size:** 256x256 pixels or larger (square)
- **Background:** Transparent PNG works best
- **Final format:** Must be .ico for Windows

## After Adding Icon

The icon will appear:
- ✅ On the executable file (Depo.exe)
- ✅ In Windows File Explorer
- ✅ On desktop shortcuts
- ✅ In Start Menu
- ✅ In taskbar when app is running

## Need Help?

If you have the image file, tell me the path and I'll convert it for you!

