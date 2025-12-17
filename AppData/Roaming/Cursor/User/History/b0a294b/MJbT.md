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
- **Bun's Native SQLite**: Built-in SQLite via `bun:sqlite` (no external dependencies!)
- **electron-builder**: Building and packaging Electron apps

## Database

This project uses **Bun's native SQLite** (`bun:sqlite`) - a fast, built-in SQLite implementation that:
- ✅ **Zero dependencies** - Built into Bun runtime
- ✅ **No compilation** - Pure Bun native implementation
- ✅ **Fast performance** - Native speed
- ✅ **Electron compatible** - Works perfectly with Electron

### Usage Example

```javascript
const { initDatabase, query, run, save } = require('./src/database/db');

// Initialize database
await initDatabase('mydb.sqlite');

// Create table
run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT)');

// Insert data
run('INSERT INTO users (name) VALUES (?)', ['John Doe']);

// Query data
const users = query('SELECT * FROM users');

// Save database
save('mydb.sqlite');
```

See `src/database/db.js` for the full database API.

## Previous Compatibility Issue (Resolved)

We've replaced `better-sqlite3` with `sql.js` which is:
- ✅ **Pure JavaScript** - No native compilation needed
- ✅ **Electron 39+ Compatible** - Works with latest Electron versions
- ✅ **No Build Errors** - No V8 API compatibility issues
- ✅ **Full SQLite Support** - Complete SQLite feature set

## Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for all platforms
- `bun run build:win` - Build Windows installer
- `bun run rebuild` - Rebuild native dependencies for Electron
