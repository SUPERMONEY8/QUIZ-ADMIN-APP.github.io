# Installation Guide - نظام إدارة التوزيع

## System Requirements

- **Operating System**: Windows 10 or Windows 11 (64-bit)
- **Screen Resolution**: Minimum 1366x768
- **Disk Space**: 100 MB free space
- **RAM**: 512 MB minimum
- **No Internet Required**: Fully offline application

## Installation Steps

### Step 1: Download the Installer

Download the installer file: `نظام إدارة التوزيع-{version}-Setup.exe`

### Step 2: Run the Installer

1. **Double-click** the installer file
2. If Windows shows a security warning:
   - Click "More info"
   - Click "Run anyway"
   - *(This is normal for unsigned applications)*

### Step 3: Installation Wizard

1. **Welcome Screen**: Click "Next"
2. **License Agreement**: Read and accept the license, click "Next"
3. **Choose Installation Location**:
   - Default: `C:\Program Files\نظام إدارة التوزيع`
   - Or choose a different location
   - Click "Next"
4. **Additional Options**:
   - ✅ Create Desktop shortcut (recommended)
   - ✅ Create Start Menu shortcut (recommended)
   - Click "Next"
5. **Ready to Install**: Click "Install"
6. **Installation Complete**: Click "Finish"

### Step 4: Launch the Application

You can launch the application from:

- **Desktop**: Double-click "نظام إدارة التوزيع" shortcut
- **Start Menu**: Search for "نظام إدارة التوزيع"
- **Installation Directory**: Navigate to installation folder and run the executable

## First Launch

On first launch:

1. The application will create necessary folders
2. Database will be initialized automatically
3. Default settings will be applied
4. You're ready to use the application!

## File Locations

### Application Files
- **Installation**: `C:\Program Files\نظام إدارة التوزيع\` (or chosen location)
- **Executable**: `نظام إدارة التوزيع.exe`

### User Data (Stored in AppData)
- **Database**: `%APPDATA%\نظام إدارة التوزيع\database\pme.db`
- **Settings**: `%APPDATA%\نظام إدارة التوزيع\config\settings.json`
- **Backups**: `%APPDATA%\نظام إدارة التوزيع\backups\`

**Note**: User data persists across application updates and uninstalls (unless explicitly deleted).

## Updating the Application

### Method 1: Install Over Existing Version

1. Download the new installer
2. Run the installer
3. Install over the existing installation
4. Your data and settings will be preserved

### Method 2: Uninstall and Reinstall

1. Uninstall the old version (Settings → Apps → Uninstall)
2. Install the new version
3. Your data in AppData will be preserved

## Uninstallation

### To Uninstall

1. Go to **Settings** → **Apps** → **Apps & features**
2. Find "نظام إدارة التوزيع"
3. Click "Uninstall"
4. Follow the uninstaller wizard

### What Gets Removed

- Application files (installation directory)
- Desktop shortcut
- Start Menu shortcut
- Registry entries

### What Stays (Optional)

- User data in AppData (database, settings, backups)
- You can manually delete these if needed:
  - `%APPDATA%\نظام إدارة التوزيع\`

## Troubleshooting

### Installation Issues

**Problem**: "Windows protected your PC"
- **Solution**: Click "More info" → "Run anyway"
- **Note**: This is normal for unsigned applications. For production, use code signing.

**Problem**: "Cannot write to Program Files"
- **Solution**: Right-click installer → "Run as administrator"

**Problem**: Installation fails
- **Solution**: 
  1. Check disk space (need 100 MB)
  2. Close other applications
  3. Run as administrator
  4. Check Windows Event Viewer for errors

### Runtime Issues

**Problem**: Application won't start
- **Solution**: 
  1. Check Windows Event Viewer
  2. Try running as administrator
  3. Check if database file exists in AppData
  4. Reinstall if necessary

**Problem**: Database errors
- **Solution**: 
  1. Check `%APPDATA%\نظام إدارة التوزيع\database\`
  2. Restore from backup if available
  3. Delete database file to reset (data will be lost)

**Problem**: Settings not saving
- **Solution**: 
  1. Check `%APPDATA%\نظام إدارة التوزيع\config\`
  2. Ensure write permissions
  3. Run as administrator if needed

## Support

For issues or questions:
- Check the application's built-in help
- Review `BUILD.md` for technical details
- Contact the development team

## Security Notes

- The application runs completely offline
- No data is sent to external servers
- All data is stored locally on your computer
- Database is encrypted by SQLite (if configured)
- Backups are stored in user-accessible location

## License

See `LICENSE.txt` for license information.

