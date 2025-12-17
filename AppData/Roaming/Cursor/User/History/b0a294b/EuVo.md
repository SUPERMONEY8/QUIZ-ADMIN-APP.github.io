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
- **Pure JavaScript Database**: File-based JSON database (zero external dependencies!)
- **electron-builder**: Building and packaging Electron apps

## Database

This project uses a **pure JavaScript file-based database** - no Node.js-specific dependencies, no native compilation:
- ✅ **Zero dependencies** - Pure JavaScript only
- ✅ **No compilation** - Works everywhere
- ✅ **Simple & Fast** - JSON file storage
- ✅ **SQL-like API** - Familiar query interface
- ✅ **Works in Bun & Electron** - Universal compatibility

### Usage Example

```javascript
const { initDatabase, insert, find, update, remove, run, query } = require('./src/database/db');

// Initialize database
initDatabase('mydb.json');

// Create table
run('CREATE TABLE IF NOT EXISTS users (id INTEGER, name TEXT, email TEXT)');

// Insert data (SQL style)
run('INSERT INTO users (name, email) VALUES (?, ?)', ['John Doe', 'john@example.com']);

// Or use simple API
insert('products', { name: 'Laptop', price: 999.99 });

// Query data
const users = query('SELECT * FROM users');
const products = find('products');

// Update
update('users', u => u.name === 'John Doe', { name: 'John Updated' });

// Delete
remove('products', p => p.price < 50);
```

See `src/database/db.js` for the full database API.

## Why This Database Solution?

We use a pure JavaScript file-based database instead of native SQLite because:
- ✅ **No Node.js dependencies** - Pure JavaScript only
- ✅ **No compilation issues** - Works immediately
- ✅ **Universal compatibility** - Works in Bun, Electron, and anywhere JavaScript runs
- ✅ **Simple & reliable** - JSON file storage is easy to debug and backup

## Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for all platforms
- `bun run build:win` - Build Windows installer
- `bun run rebuild` - Rebuild native dependencies for Electron
