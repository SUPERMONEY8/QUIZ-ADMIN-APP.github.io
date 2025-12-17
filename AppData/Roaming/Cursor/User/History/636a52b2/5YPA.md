# Portable Build Instructions

## Building the Portable Version

To create a portable version of Depo that can run from a flash drive:

### Option 1: Single Portable Executable (Recommended)
```bash
bun run build:portable
```
This creates a single `.exe` file in the `dist` folder that can be copied to a flash drive and run directly.

### Option 2: Portable Directory (Unpacked)
```bash
bun run build:portable:dir
```
This creates an unpacked folder in `dist/win-unpacked` that contains all files. You can copy this entire folder to a flash drive.

## Using the Portable Version

1. **Copy to Flash Drive:**
   - Copy the `.exe` file (from Option 1) or the entire folder (from Option 2) to your flash drive
   - The app will create a `business.db.json` file next to the executable to store all data

2. **Running the App:**
   - Double-click `Depo.exe` (or `Depo Portable.exe` if using Option 1)
   - The app will run directly from the flash drive
   - All data is stored in the same folder as the executable

3. **Data Storage:**
   - Database: `business.db.json` (next to the executable)
   - Backups: `DepoBackups/` folder (next to the executable)
   - All data stays with the app - perfect for portable use!

## Important Notes

- The portable version stores all data locally (next to the executable)
- No installation required - just copy and run
- Works on any Windows computer without admin rights
- Data is portable - move the entire folder to keep all data

## File Structure (Portable Directory)

```
Depo/
├── Depo.exe          (Main executable - double-click to run)
├── resources/        (App resources)
├── locales/          (Language files)
├── business.db.json  (Created automatically - your data)
└── DepoBackups/      (Created automatically - backup files)
```

