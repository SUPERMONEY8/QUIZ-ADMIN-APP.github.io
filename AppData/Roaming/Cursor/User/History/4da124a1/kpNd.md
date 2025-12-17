# Setup Guide - Roster Management Application

## Quick Start

### 1. Verify Bun Installation
```bash
bun --version
```

If not installed, visit [bun.sh](https://bun.sh) for installation instructions.

### 2. Create Directory Structure

**Using PowerShell:**
```powershell
New-Item -ItemType Directory -Force -Path src/styles, src/js, src/data, dist, bin
```

**Using CMD:**
```cmd
mkdir src\styles src\js src\data dist bin
```

**Using Bun (one-liner):**
```bash
bun run -e "import { mkdir } from 'fs/promises'; await Promise.all(['src/styles', 'src/js', 'src/data', 'dist', 'bin'].map(d => mkdir(d, { recursive: true })))"
```

### 3. Verify File Structure
All files should already be created. Verify with:
```bash
# PowerShell
Get-ChildItem -Recurse -File | Select-Object FullName

# CMD
dir /s /b
```

### 4. Run Development Server
```bash
bun run dev
```

Open browser to: http://localhost:3000

### 5. Build for Production
```bash
bun run build
```

### 6. Compile to Windows Executable
```bash
bun run compile
```

The executable will be created at: `bin/app.exe`

## File Verification Checklist

- [x] `src/index.html` - Main HTML file
- [x] `src/index.js` - Bun server entry
- [x] `src/styles/main.css` - Global styles
- [x] `src/styles/components.css` - Component styles
- [x] `src/styles/responsive.css` - Responsive styles
- [x] `src/js/app.js` - Core controller
- [x] `src/js/ui.js` - UI rendering
- [x] `src/js/data.js` - Data management
- [x] `src/js/roster.js` - Roster logic
- [x] `src/js/assignments.js` - Assignment algorithms
- [x] `src/js/storage.js` - Storage management
- [x] `src/js/backup.js` - Backup system
- [x] `src/data/roster-data.json` - Data template
- [x] `bun.toml` - Bun configuration
- [x] `package.json` - Package configuration

## Troubleshooting

### Port Already in Use
If port 3000 is in use, modify `bun.toml`:
```toml
[dev]
port = 3001  # Change to available port
```

### Module Not Found Errors
Ensure all files are in correct locations and using ES6 module syntax (`import`/`export`).

### LocalStorage Issues
The app will work but won't persist data if localStorage is unavailable. Check browser console for warnings.

### Build Errors
Ensure Bun is up to date:
```bash
bun upgrade
```

## Next Steps

1. Customize the military olive theme in `src/styles/main.css`
2. Implement roster UI in `src/js/ui.js`
3. Add assignment algorithms in `src/js/assignments.js`
4. Test data persistence and backups
5. Build and test the executable

