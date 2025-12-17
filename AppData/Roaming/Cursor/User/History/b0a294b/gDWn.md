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

## Note on better-sqlite3

There may be compatibility issues when rebuilding `better-sqlite3` for Electron. If you encounter build errors, you can:

1. Try rebuilding native modules manually:
   ```bash
   bun run rebuild
   ```

2. Or use a compatible version of better-sqlite3 that matches your Electron version.

## Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for all platforms
- `bun run build:win` - Build Windows installer
- `bun run rebuild` - Rebuild native dependencies for Electron
