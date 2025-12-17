# Depo - Electron Desktop Application

A desktop application built with Bun and Electron for Windows.

## Project Structure

```
/
├── main.js              # Electron main process
├── preload.js           # Electron preload script
├── renderer.js          # Electron renderer process
├── index.html           # Main HTML entry point
├── package.json         # Project configuration
└── src/
    ├── components/      # React/Vue components (if using a framework)
    ├── pages/          # Application pages
    ├── database/       # Database utilities and models
    ├── utils/          # Utility functions
    └── assets/
        ├── css/        # Stylesheets
        └── images/     # Image assets
```

## Prerequisites

- [Bun](https://bun.sh/) installed on your system
- Windows 10/11 (for building Windows installers)

## Installation

Install dependencies using Bun:

```bash
bun install
```

## Development

Run the application in development mode:

```bash
bun run dev
```

## Building

Build a Windows installer:

```bash
bun run build:win
```

The installer will be created in the `dist` directory.

## Dependencies

- **Electron**: Desktop application framework
- **better-sqlite3**: SQLite database library
- **electron-builder**: Building and packaging Electron apps

## ⚠️ Known Compatibility Issue: better-sqlite3 with Electron 39

**Current Status:** `better-sqlite3` is **NOT compatible** with Electron 39.1.2 due to V8 API changes.

### The Error
When running `bun run rebuild`, you'll encounter:
```
error C2039: 'GetIsolate' n'est pas membre de 'v8::Context'
```

This occurs because Electron 39 uses a newer V8 version that removed `v8::Context::GetIsolate()`, which `better-sqlite3` still uses.

### Solutions

#### Option 1: Downgrade Electron (Recommended)
Use Electron 33-38 which are compatible with `better-sqlite3`:

```bash
bun remove electron
bun add -d electron@^33.0.0
bun run rebuild
```

#### Option 2: Wait for better-sqlite3 Update
Monitor the [better-sqlite3 GitHub repository](https://github.com/WiseLibs/better-sqlite3) for Electron 39 support.

#### Option 3: Use Alternative SQLite Library
Consider using:
- `sql.js` - Pure JavaScript SQLite (no native compilation needed)
- `sqlite3` - Alternative native SQLite binding
- Electron's built-in SQLite (if available in your Electron version)

### Current Workaround
If you need to proceed without SQLite for now, you can:
1. Remove `better-sqlite3` temporarily: `bun remove better-sqlite3`
2. The Electron app will run, but SQLite functionality won't be available
3. Re-add it once compatibility is resolved

## Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for all platforms
- `bun run build:win` - Build Windows installer
- `bun run rebuild` - Rebuild native dependencies for Electron
