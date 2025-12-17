# Fix for npm ENOENT Error

## Problem
Your npm installation has a configuration issue where it tries to spawn `C:\Program Files\nodejs` instead of `C:\Program Files\nodejs\node.exe`.

## Root Cause
This is an npm installation/configuration problem, not a project issue.

## Solutions

### Solution 1: Reinstall Node.js (Recommended)
1. Uninstall Node.js from Windows Settings > Apps
2. Download and install the latest LTS version from [nodejs.org](https://nodejs.org/)
3. During installation, make sure to check "Add to PATH"
4. Restart your computer
5. Verify: `npm --version` and `node --version` should work

### Solution 2: Fix npm Configuration
Try running these commands in an Administrator PowerShell:

```powershell
# Remove npm cache
Remove-Item -Recurse -Force "$env:APPDATA\npm" -ErrorAction SilentlyContinue

# Clear npm config
npm config delete prefix
npm config delete cache

# Reinstall npm globally
npm install -g npm@latest
```

### Solution 3: Use Direct Node Commands (Temporary Workaround)
Until npm is fixed, you can use these workarounds:

**Start dev server:**
```powershell
cd frontend
node "node_modules/vite/bin/vite.js"
```

**Build:**
```powershell
node "node_modules/vite/bin/vite.js" build
```

**Or use the PowerShell scripts:**
```powershell
.\start-dev.ps1
```

**Install dependencies:**
```powershell
npm install --ignore-scripts
node fix-esbuild.js  # Run the fix script manually
```

## Current Workaround Status
✅ Dependencies installed (with `--ignore-scripts`)
✅ esbuild binary manually copied
✅ Project files ready

❌ npm scripts don't work (`npm run dev` fails)
❌ npx doesn't work

## To Use the Project Now:
1. Start backend: `cd backend && npm run dev` (should work)
2. Start frontend: Use `node "node_modules/vite/bin/vite.js"` directly or the PowerShell script

