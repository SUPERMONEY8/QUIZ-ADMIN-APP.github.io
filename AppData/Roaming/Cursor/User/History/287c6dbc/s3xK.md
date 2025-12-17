# Icon Setup Guide

## Required Icon Files

For the Windows build, you need:

1. **icon.ico** - Windows icon file (256x256, ICO format)
2. **icon.png** - Source icon (256x256, PNG format)

## Creating the Icon

### Step 1: Create PNG Icon

Create a 256x256 PNG image with your application icon/logo.

**Requirements:**
- Size: 256x256 pixels
- Format: PNG with transparency support
- Design: Should be recognizable at small sizes (16x16, 32x32)

### Step 2: Convert PNG to ICO

#### Option A: Online Converter (Easiest)

1. Go to https://convertio.co/png-ico/ or https://www.icoconverter.com/
2. Upload your `icon.png`
3. Download `icon.ico`
4. Place in `/assets` folder

#### Option B: ImageMagick (Command Line)

```bash
# Install ImageMagick first
# Then run:
magick convert icon.png -define icon:auto-resize=256,128,64,48,32,16 icon.ico
```

#### Option C: GIMP (Free Image Editor)

1. Open `icon.png` in GIMP
2. File → Export As
3. Change extension to `.ico`
4. GIMP will prompt for ICO export options
5. Select sizes: 256, 128, 64, 48, 32, 16
6. Export to `assets/icon.ico`

#### Option D: Online ICO Generator

- https://www.icoconverter.com/
- https://convertio.co/png-ico/
- https://www.favicon-generator.org/

### Step 3: Verify Icon

1. Place both files in `/assets`:
   - `assets/icon.png` (256x256 PNG)
   - `assets/icon.ico` (multi-size ICO)

2. Verify file sizes:
   - `icon.png`: ~50-200 KB
   - `icon.ico`: ~100-500 KB (contains multiple sizes)

3. Test in Windows:
   - Right-click `icon.ico` → Properties → Preview
   - Should show icon at various sizes

## Icon Design Tips

- **Simple**: Works well at 16x16 and 256x256
- **High Contrast**: Visible on light and dark backgrounds
- **No Text**: Avoid small text that becomes unreadable
- **Square**: Icons are square, design accordingly
- **Transparent Background**: Use PNG transparency

## File Structure

```
assets/
├── icon.png      # Source icon (256x256 PNG)
├── icon.ico      # Windows icon (multi-size ICO)
└── ICON_GUIDE.md # This file
```

## Troubleshooting

**Problem**: Build fails with "Icon not found"
- **Solution**: Ensure `assets/icon.ico` exists

**Problem**: Icon looks blurry
- **Solution**: Use high-resolution source (256x256 minimum)

**Problem**: Icon doesn't appear in Windows
- **Solution**: Clear icon cache: `ie4uinit.exe -show` (run in Command Prompt)

## Testing the Icon

After building:

1. Check installer: Should show icon in installer window
2. Check installed app: Desktop shortcut should have icon
3. Check Start Menu: App entry should have icon
4. Check Taskbar: Running app should show icon

## Notes

- The icon is used in:
  - Installer window
  - Desktop shortcut
  - Start Menu entry
  - Taskbar (when app is running)
  - File Explorer (executable file)
  - About dialog (if implemented)

