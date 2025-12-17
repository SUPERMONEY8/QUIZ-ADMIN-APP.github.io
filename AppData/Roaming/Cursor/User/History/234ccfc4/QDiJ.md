# Complete Folder Structure - Roster Management Application

## ✅ Complete Directory Tree

```
roster-app/
├── src/
│   ├── index.html              ✅ Main HTML entry point
│   ├── index.js                ✅ Bun server entry point
│   ├── styles/
│   │   ├── main.css            ✅ Global styles (military olive theme)
│   │   ├── components.css      ✅ Cards, buttons, forms
│   │   └── responsive.css      ✅ Mobile/desktop responsive
│   ├── js/
│   │   ├── app.js              ✅ Core application controller
│   │   ├── ui.js               ✅ All UI rendering
│   │   ├── data.js             ✅ JSON data management
│   │   ├── roster.js           ✅ Roster logic
│   │   ├── assignments.js      ✅ Assignment algorithms
│   │   ├── storage.js          ✅ localStorage/file management
│   │   └── backup.js           ✅ Backup & autosave
│   └── data/
│       └── roster-data.json    ✅ Main data file template
├── dist/                       ✅ Build output directory
├── bin/                        ✅ Executable output directory
├── bun.toml                    ✅ Bun configuration
├── package.json                ✅ Bun-compatible package config
├── .gitignore                  ✅ Git ignore file
├── PROJECT_STRUCTURE.md        ✅ Detailed structure documentation
├── SETUP.md                    ✅ Setup instructions
├── QUICK_REFERENCE.md          ✅ Quick reference guide
└── README.md                   ✅ Main documentation
```

## 📁 Directory Creation Commands

### PowerShell (Recommended for Windows)
```powershell
New-Item -ItemType Directory -Force -Path src/styles, src/js, src/data, dist, bin
```

### CMD
```cmd
mkdir src\styles src\js src\data dist bin
```

### Bun One-Liner
```bash
bun run -e "import { mkdir } from 'fs/promises'; await Promise.all(['src/styles', 'src/js', 'src/data', 'dist', 'bin'].map(d => mkdir(d, { recursive: true })))"
```

## 📄 File Purposes Summary

### Configuration Files
- **`package.json`**: Bun-compatible package configuration with scripts
- **`bun.toml`**: Bun runtime configuration (ports, build settings)

### Source Files
- **`src/index.html`**: Main HTML entry point, loads all CSS and JS
- **`src/index.js`**: Bun HTTP server that serves static files

### Styles (`src/styles/`)
- **`main.css`**: Global styles with military olive color theme
- **`components.css`**: Reusable component styles (cards, buttons, forms, tables)
- **`responsive.css`**: Mobile-first responsive design

### JavaScript Modules (`src/js/`)
- **`app.js`**: Core controller - initializes all modules, coordinates operations
- **`ui.js`**: UI rendering - handles all DOM updates and notifications
- **`data.js`**: Data management - load/save/export/import JSON data
- **`roster.js`**: Roster operations - CRUD for personnel
- **`assignments.js`**: Assignment logic - create/manage assignments, auto-assign algorithms
- **`storage.js`**: Storage management - localStorage, file download/upload
- **`backup.js`**: Backup system - autosave every 5 min, backup rotation (max 10)

### Data Files (`src/data/`)
- **`roster-data.json`**: Initial data template with empty arrays

### Build Directories
- **`dist/`**: Production build output (created by `bun run build`)
- **`bin/`**: Windows executable output (created by `bun run compile`)

## 🚀 Quick Start Commands

```bash
# Development
bun run dev          # Start dev server on localhost:3000

# Build
bun run build        # Build optimized files to dist/

# Compile
bun run compile      # Create standalone bin/app.exe
```

## 📊 Module Architecture

```
┌─────────┐
│ app.js  │ ← Main Controller
└────┬────┘
    │
    ├──→ ui.js          (UI Rendering)
    ├──→ data.js        (Data Management)
    ├──→ roster.js      (Roster Logic)
    ├──→ storage.js     (Persistence)
    └──→ backup.js ──→ storage.js (Backup System)
```

## 🎨 Color Theme (Military Olive)

- **Primary**: `#556b2f` (Olive green)
- **Dark**: `#3d4a21` (Dark olive)
- **Light**: `#6b7a3f` (Light olive)
- **Accent**: `#8b9a5f` (Olive accent)
- **Background**: `#f5f5dc` (Beige/cream)
- **Text**: `#2c3e1f` (Dark green text)

## ✨ Key Features

- ✅ **100% Offline**: Works completely offline after compilation
- ✅ **Autosave**: Automatic saves every 5 minutes
- ✅ **Backup System**: Maintains up to 10 automatic backups
- ✅ **LocalStorage**: Browser-based data persistence
- ✅ **JSON Import/Export**: Full data portability
- ✅ **Responsive Design**: Mobile and desktop support
- ✅ **Military Theme**: Professional olive green color scheme
- ✅ **Modular Architecture**: Clean separation of concerns

## 📝 Next Steps

1. **Customize Theme**: Edit `src/styles/main.css` for color changes
2. **Implement UI**: Complete roster rendering in `src/js/ui.js`
3. **Add Features**: Extend roster and assignment logic
4. **Test**: Run `bun run dev` and test functionality
5. **Build**: Create executable with `bun run compile`

## 📚 Documentation Files

- **PROJECT_STRUCTURE.md**: Complete detailed structure explanation
- **SETUP.md**: Step-by-step setup guide
- **QUICK_REFERENCE.md**: Quick command and file reference
- **README.md**: Main project documentation

---

**Status**: ✅ All files and directories created successfully!

