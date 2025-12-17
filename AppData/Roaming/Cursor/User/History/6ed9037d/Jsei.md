# Build Directory

This directory contains build resources and configuration files for electron-builder.

## Files

- `installer.nsh` - Custom NSIS installer script for additional installation steps

## Icon Requirements

Place the following icon files in `/assets`:

- `icon.ico` - Windows icon (256x256, ICO format)
- `icon.png` - Source icon (256x256, PNG format)

### Converting PNG to ICO

You can use online tools or ImageMagick:

```bash
# Using ImageMagick
magick convert icon.png -define icon:auto-resize=256,128,64,48,32,16 icon.ico
```

Or use online converters:
- https://convertio.co/png-ico/
- https://www.icoconverter.com/

## Installation Script

The `installer.nsh` file contains custom NSIS instructions for:
- Creating AppData directories (database, config, backups)
- Setting up registry keys
- Custom uninstaller behavior

