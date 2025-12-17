# Roster Management Application - Project Structure

## Complete Folder Structure

```
roster-app/
├── src/
│   ├── index.html              # Main HTML entry point
│   ├── index.js                # Bun server entry point
│   ├── styles/
│   │   ├── main.css            # Global styles with military olive theme
│   │   ├── components.css      # Cards, buttons, forms styling
│   │   └── responsive.css      # Mobile/desktop responsive styles
│   ├── js/
│   │   ├── app.js              # Core application controller
│   │   ├── ui.js               # All UI rendering logic
│   │   ├── data.js             # JSON data management
│   │   ├── roster.js           # Roster logic and operations
│   │   ├── assignments.js      # Assignment algorithms
│   │   ├── storage.js          # localStorage/file management
│   │   └── backup.js           # Backup & autosave functionality
│   └── data/
│       └── roster-data.json    # Main data file (initial template)
├── dist/                       # Built files (created on build)
├── bin/                        # Windows executable (created by compile)
├── bun.toml                    # Bun configuration file
├── package.json                # Bun-compatible package configuration
└── README.md                   # Project documentation
```

## Directory Creation Commands

### Using Bun (PowerShell/CMD)
```powershell
# Create all directories at once
bun run -e "import { mkdir } from 'fs/promises'; await Promise.all(['src/styles', 'src/js', 'src/data', 'dist', 'bin'].map(d => mkdir(d, { recursive: true })))"
```

### Using PowerShell (Native)
```powershell
New-Item -ItemType Directory -Force -Path src/styles, src/js, src/data, dist, bin
```

### Using CMD
```cmd
mkdir src\styles src\js src\data dist bin
```

### Manual Creation
```bash
mkdir -p src/styles
mkdir -p src/js
mkdir -p src/data
mkdir -p dist
mkdir -p bin
```

## File Purposes

### Root Files

#### `package.json`
- **Purpose**: Bun-compatible package configuration
- **Contains**: Project metadata, scripts for dev/build/compile
- **Key Scripts**:
  - `bun run dev` - Start development server
  - `bun run build` - Build for production
  - `bun run compile` - Create Windows .exe executable

#### `bun.toml`
- **Purpose**: Bun runtime configuration
- **Contains**: Install settings, build targets, dev server config
- **Features**: Auto-install, minification, source maps

### Source Files (`src/`)

#### `index.html`
- **Purpose**: Main HTML entry point for the application
- **Features**: Links all CSS files, loads main JavaScript module
- **Structure**: Minimal HTML with app container div

#### `index.js`
- **Purpose**: Bun server entry point
- **Features**: 
  - Serves static files (HTML, CSS, JS, JSON)
  - Handles routing and MIME types
  - Security: Prevents directory traversal
- **Port**: 3000 (configurable in bun.toml)

### Styles (`src/styles/`)

#### `main.css`
- **Purpose**: Global styles with military olive theme
- **Contains**:
  - CSS custom properties (variables) for color palette
  - Typography styles
  - Base element styling
  - Utility classes
- **Theme**: Military olive green color scheme

#### `components.css`
- **Purpose**: Reusable component styles
- **Contains**:
  - Card components
  - Button variants (primary, secondary, success, warning, error)
  - Form elements (inputs, selects, textareas)
  - Tables
  - Badges

#### `responsive.css`
- **Purpose**: Responsive design for mobile and desktop
- **Features**:
  - Mobile-first approach
  - Breakpoints: 768px (mobile), 1024px (tablet), 1025px+ (desktop)
  - Grid layouts for desktop
  - Print styles

### JavaScript Modules (`src/js/`)

#### `app.js`
- **Purpose**: Core application controller
- **Responsibilities**:
  - Initializes all modules
  - Coordinates between UI, data, and business logic
  - Handles global events
  - Manages save/export operations
- **Entry Point**: Main application initialization

#### `ui.js`
- **Purpose**: All UI rendering and updates
- **Responsibilities**:
  - Renders main application template
  - Updates DOM elements
  - Shows notifications (success/error)
  - Manages loading states
- **Pattern**: Centralized UI management

#### `data.js`
- **Purpose**: JSON data management
- **Responsibilities**:
  - Loads data from localStorage or file
  - Saves data to localStorage
  - Exports/imports data
  - Validates data structure
- **Storage**: Primary localStorage, fallback to JSON file

#### `roster.js`
- **Purpose**: Roster logic and operations
- **Responsibilities**:
  - Add/remove/update personnel
  - Search personnel
  - Manage personnel data
  - Dispatch update events
- **Operations**: CRUD operations for personnel

#### `assignments.js`
- **Purpose**: Assignment algorithms and logic
- **Responsibilities**:
  - Create/update/remove assignments
  - Query assignments by person, role, or status
  - Auto-assignment algorithms
  - Assignment ID generation
- **Features**: Round-robin and custom assignment algorithms

#### `storage.js`
- **Purpose**: LocalStorage and file management
- **Responsibilities**:
  - Save/load from localStorage
  - Download JSON files
  - Upload/import JSON files
  - Check storage availability
  - Monitor storage size
- **Features**: File download/upload, storage utilities

#### `backup.js`
- **Purpose**: Backup & autosave functionality
- **Responsibilities**:
  - Automatic backups (every 5 minutes)
  - Manual backup creation
  - Restore from backup
  - Export backups
  - Manage backup history (max 10 backups)
- **Features**: Autosave, backup rotation, recovery

### Data Files (`src/data/`)

#### `roster-data.json`
- **Purpose**: Main data file template
- **Structure**:
  ```json
  {
    "personnel": [],
    "assignments": [],
    "schedules": [],
    "metadata": {
      "version": "1.0.0",
      "lastModified": "...",
      "createdAt": "..."
    }
  }
  ```
- **Usage**: Initial template, actual data stored in localStorage

### Build Directories

#### `dist/`
- **Purpose**: Production build output
- **Created By**: `bun run build`
- **Contains**: Minified, optimized files ready for deployment

#### `bin/`
- **Purpose**: Compiled executable output
- **Created By**: `bun run compile`
- **Contains**: `app.exe` - Standalone Windows executable

## Module Dependencies

```
app.js
├── ui.js
├── data.js
├── roster.js
├── storage.js
└── backup.js
    └── storage.js (dynamic import)

ui.js
└── (renders data from app.js)

data.js
└── (standalone, no dependencies)

roster.js
└── (standalone, dispatches events)

assignments.js
└── (standalone, dispatches events)

storage.js
└── (standalone, browser APIs)

backup.js
└── storage.js (dynamic import)
```

## Running the Application

### Development Mode
```bash
bun run dev
# or
bun start
```
- Starts server on http://localhost:3000
- Serves files from `src/` directory
- Hot reload enabled (if configured)

### Production Build
```bash
bun run build
```
- Creates optimized files in `dist/`
- Minifies JavaScript and CSS
- Ready for deployment

### Compile to Executable
```bash
bun run compile
```
- Creates `bin/app.exe`
- Standalone executable (includes Bun runtime)
- No dependencies required
- 100% offline capable

## Data Flow

1. **Initialization**:
   - `app.js` initializes all modules
   - `data.js` loads data from localStorage or file
   - `ui.js` renders initial UI
   - `backup.js` starts autosave

2. **User Interaction**:
   - User interacts with UI
   - `ui.js` triggers actions
   - `roster.js` or `assignments.js` processes logic
   - Events dispatched for updates

3. **Data Persistence**:
   - Changes trigger save events
   - `data.js` saves to localStorage
   - `storage.js` handles persistence
   - `backup.js` creates periodic backups

4. **Updates**:
   - Events trigger UI updates
   - `ui.js` re-renders affected sections
   - Data remains synchronized

## Security Features

- Directory traversal prevention in `index.js`
- Input validation in data modules
- Safe JSON parsing with error handling
- LocalStorage availability checks

## Offline Capability

- All assets bundled in executable
- No external dependencies
- LocalStorage for data persistence
- File-based backup/restore
- 100% offline after compilation

