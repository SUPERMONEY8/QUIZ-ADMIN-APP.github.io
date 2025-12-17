# Couple Action App - Project Structure

Complete file tree and structure for the Couple Action App.

## File Tree

```
couple-action-app/
├── public/                          # Static assets (served as-is)
│   ├── images/                     # Image assets
│   │   └── .gitkeep
│   ├── sounds/                     # Sound effects and music
│   │   └── .gitkeep
│   ├── icons/                      # Icon files
│   │   └── .gitkeep
│   └── vite.svg                    # Vite logo (default)
│
├── src/                            # Source code
│   ├── main.js                     # Application entry point
│   ├── app.js                      # Main app logic and routing
│   │
│   ├── components/                 # Reusable UI components (ES modules)
│   │   ├── Button.js               # Button component
│   │   ├── Card.js                 # Card component
│   │   ├── Modal.js                # Modal dialog component
│   │   └── index.js                # Component exports
│   │
│   ├── styles/                     # CSS stylesheets
│   │   ├── mobile.css              # Mobile-first responsive styles
│   │   ├── main.css                # Main app styles
│   │   └── components.css          # Component-specific styles
│   │
│   ├── firebase/                   # Firebase utilities
│   │   ├── config.js               # Firebase configuration
│   │   ├── auth.js                 # Authentication helpers
│   │   ├── firestore.js            # Firestore database helpers
│   │   ├── index.js                # Firebase exports
│   │   └── example-usage.js        # Usage examples
│   │
│   ├── animations/                 # Animation utilities
│   │   ├── fade.js                 # Fade animations
│   │   ├── slide.js                # Slide animations
│   │   └── index.js                # Animation exports
│   │
│   └── audio/                      # Audio management
│       ├── manager.js              # Audio manager singleton
│       └── index.js                # Audio exports
│
├── index.html                      # HTML entry point
├── vite.config.js                  # Vite configuration (mobile-optimized)
├── package.json                    # Project dependencies (Bun)
├── bun.lock                        # Bun lockfile
├── firestore.rules                 # Firestore security rules
├── FIRESTORE_STRUCTURE.md          # Database structure docs
├── PROJECT_STRUCTURE.md            # This file
└── README.md                       # Project documentation
```

## Directory Descriptions

### `/public`
Static assets served directly by Vite. Files here are accessible at the root URL.

- **images/**: Place PNG, JPG, SVG images here
- **sounds/**: Place MP3, WAV, OGG audio files here
- **icons/**: Place icon files (SVG, PNG) here

### `/src`
Main application source code.

#### `/src/main.js`
Application entry point. Imports all styles and initializes the app.

#### `/src/app.js`
Main application logic:
- Authentication state management
- View routing
- Event handling
- App initialization

#### `/src/components/`
Reusable UI components as ES modules:
- **Button.js**: Button component with variants
- **Card.js**: Card component for content display
- **Modal.js**: Modal dialog component
- **index.js**: Central export for all components

#### `/src/styles/`
CSS stylesheets:
- **mobile.css**: Mobile-first responsive base styles
- **main.css**: Main app styles and CSS variables
- **components.css**: Component-specific styles

#### `/src/firebase/`
Firebase integration:
- **config.js**: Firebase initialization
- **auth.js**: Authentication helper functions
- **firestore.js**: Firestore database operations
- **index.js**: Central Firebase exports
- **example-usage.js**: Usage examples

#### `/src/animations/`
Animation utilities:
- **fade.js**: Fade in/out animations
- **slide.js**: Slide animations
- **index.js**: Animation exports

#### `/src/audio/`
Audio management:
- **manager.js**: Audio manager singleton for sounds and music
- **index.js**: Audio exports

## Configuration Files

### `package.json`
- Configured for Bun (not npm)
- ES modules enabled (`"type": "module"`)
- Dependencies: Firebase
- Dev dependencies: Vite

### `vite.config.js`
- Mobile-optimized build configuration
- Code splitting for Firebase modules
- Public directory configuration
- Server settings for mobile device access

### `firestore.rules`
Firestore security rules ensuring:
- Users can only access their own data
- Couples can only access their couple data
- Proper data isolation

## Usage Examples

### Importing Components
```javascript
import { Button, Card, Modal } from './components/index.js';
```

### Importing Firebase
```javascript
import { signInUser, getCoupleByUserId } from './firebase/index.js';
```

### Importing Animations
```javascript
import { fadeIn, slideIn } from './animations/index.js';
```

### Importing Audio
```javascript
import { audioManager } from './audio/index.js';
audioManager.loadSound('click', '/sounds/click.mp3');
audioManager.playSound('click');
```

## Development Commands

```bash
# Install dependencies
bun install

# Start development server
bun dev

# Build for production
bun run build

# Preview production build
bun run preview
```

## Notes

- All JavaScript files use ES modules (`import`/`export`)
- All imports use `.js` extensions (required for ES modules)
- No CommonJS (`require`) syntax
- Optimized for mobile devices
- Uses Bun exclusively (no npm/node)

