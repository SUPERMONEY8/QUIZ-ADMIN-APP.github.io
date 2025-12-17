# Quick Start - Building for Production

## Prerequisites

1. **Icon File**: Create `assets/icon.ico` (256x256, ICO format)
   - See `assets/ICON_GUIDE.md` for instructions

2. **Version**: Update version in `package.json`:
   ```json
   {
     "version": "1.0.0"
   }
   ```

## Build Command

```bash
bun run build
```

## Output

After building, find the installer in:
```
dist/نظام إدارة التوزيع-1.0.0-Setup.exe
```

## Installation

1. Double-click the `.exe` file
2. Follow the installation wizard
3. Launch from Desktop or Start Menu

## File Locations (After Installation)

- **App**: `C:\Program Files\نظام إدارة التوزيع\`
- **Database**: `%APPDATA%\نظام إدارة التوزيع\database\`
- **Settings**: `%APPDATA%\نظام إدارة التوزيع\config\`
- **Backups**: `%APPDATA%\نظام إدارة التوزيع\backups\`

## Troubleshooting

**Build fails?**
- Check `assets/icon.ico` exists
- Run `bun install` first
- Check `BUILD.md` for detailed instructions

**Installation issues?**
- See `INSTALL.md` for detailed installation guide

## Next Steps

- See `BUILD.md` for detailed build documentation
- See `CODE_SIGNING.md` for code signing instructions
- See `RELEASE_NOTES_TEMPLATE.md` for release notes

