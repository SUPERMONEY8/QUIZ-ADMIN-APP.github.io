# Production Build Guide

## Prerequisites

- Bun installed and configured
- Electron Builder installed globally: `bun add -g electron-builder`
- Windows 10/11 for building Windows installers
- Icon file: `assets/icon.ico` (256x256 PNG converted to ICO)

## Building the Application

### 1. Prepare Assets

Ensure you have the following files:
- `assets/icon.ico` - Application icon (256x256, converted to ICO format)
- `assets/icon.png` - Source icon (256x256 PNG)

### 2. Update Version

Update the version in `package.json`:
```json
{
  "version": "1.0.0"
}
```

### 3. Build Command

Run the build command:
```bash
bun run build
```

This will:
- Compile the application
- Create Windows installer (.exe)
- Generate blockmap file
- Output to `/dist` directory

## Build Output

After building, you'll find:

```
dist/
├── نظام إدارة التوزيع-1.0.0-Setup.exe    # Installer
├── نظام إدارة التوزيع-1.0.0-Setup.exe.blockmap  # Update blockmap
└── win-unpacked/                          # Unpacked app (for testing)
```

## Installation

### For End Users

1. **Download** the installer: `نظام إدارة التوزيع-1.0.0-Setup.exe`
2. **Double-click** the installer to run
3. **Follow** the installation wizard:
   - Choose installation directory (default: `C:\Program Files\نظام إدارة التوزيع`)
   - Select additional options (Desktop shortcut, Start Menu shortcut)
   - Click "Install"
4. **Launch** the application from:
   - Desktop shortcut
   - Start Menu: "نظام إدارة التوزيع"
   - Installation directory

### Installation Locations

- **Application**: `C:\Program Files\نظام إدارة التوزيع\` (or chosen directory)
- **Database**: `%APPDATA%\نظام إدارة التوزيع\database\pme.db`
- **Config**: `%APPDATA%\نظام إدارة التوزيع\config\settings.json`
- **Backups**: `%APPDATA%\نظام إدارة التوزيع\backups\`

### Shortcuts Created

- **Desktop Shortcut**: `نظام إدارة التوزيع`
- **Start Menu**: `نظام إدارة التوزيع` (in Programs folder)

## Code Signing (Optional)

### Self-Signing Certificate

For development/testing, you can create a self-signed certificate:

1. **Install OpenSSL** (if not already installed)

2. **Generate Certificate**:
```bash
openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365 -nodes
```

3. **Convert to PFX** (for Windows):
```bash
openssl pkcs12 -export -out certificate.pfx -inkey key.pem -in cert.pem
```

4. **Add to electron-builder.yml**:
```yaml
win:
  certificateFile: path/to/certificate.pfx
  certificatePassword: your-password
```

### Commercial Code Signing

For production releases, use a commercial code signing certificate:

1. Purchase a code signing certificate from a trusted CA
2. Install the certificate on your build machine
3. Configure in `electron-builder.yml`:
```yaml
win:
  signingHashAlgorithms: ['sha256']
  certificateFile: path/to/certificate.pfx
  certificatePassword: ${env.CERTIFICATE_PASSWORD}
```

**Note**: Code signing is optional but recommended for production releases to avoid Windows security warnings.

## Version Management

### Updating Version

1. Update `version` in `package.json`
2. Update `CHANGELOG.md` with release notes
3. Build new version: `bun run build`
4. Test the installer
5. Distribute the new installer

### Version Format

Follow semantic versioning: `MAJOR.MINOR.PATCH`
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes

Example: `1.0.0` → `1.1.0` → `1.1.1` → `2.0.0`

## Troubleshooting

### Build Fails

- **Error**: "Icon not found"
  - **Solution**: Ensure `assets/icon.ico` exists (256x256, ICO format)

- **Error**: "Cannot find module"
  - **Solution**: Run `bun install` before building

- **Error**: "NSIS error"
  - **Solution**: Check `build/installer.nsh` for syntax errors

### Installation Issues

- **Error**: "Windows protected your PC"
  - **Solution**: This is normal for unsigned apps. Click "More info" → "Run anyway"
  - **Better Solution**: Use code signing certificate

- **Error**: "Cannot write to Program Files"
  - **Solution**: Run installer as Administrator

### Runtime Issues

- **Database not found**: Check `%APPDATA%\نظام إدارة التوزيع\database\`
- **Config not loading**: Check `%APPDATA%\نظام إدارة التوزيع\config\`

## Distribution

### Internal Distribution

1. Build the installer: `bun run build`
2. Share `dist/نظام إدارة التوزيع-{version}-Setup.exe`
3. Users install and run

### Update Distribution

1. Build new version
2. Distribute new installer
3. Users install over existing installation (settings preserved)

## Build Scripts

Available in `package.json`:

- `bun run build` - Build production installer
- `bun run dev` - Run development version
- `bun run start` - Run production version (if installed)

## Notes

- Database is stored in user's AppData folder (persists across updates)
- Settings are stored in AppData (persists across updates)
- Backups are stored in AppData (user-accessible)
- Uninstaller removes application but preserves user data (optional)

