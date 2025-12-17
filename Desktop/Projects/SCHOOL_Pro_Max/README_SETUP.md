# École de Formation - Setup Guide

## Prerequisites

1. **Install Bun**: 
   ```bash
   # Windows (PowerShell)
   powershell -c "irm bun.sh/install.ps1 | iex"
   
   # macOS/Linux
   curl -fsSL https://bun.sh/install | bash
   ```

   Verify installation:
   ```bash
   bun --version
   ```

## Quick Start

### 1. Install Dependencies

```bash
bun install
```

### 2. Start Development Server

```bash
bun run dev
```

The app will open at `http://localhost:3000`

### 3. Build for Production

```bash
bun run build
```

### 4. Preview Production Build

```bash
bun run preview
```

## Project Structure

```
SCHOOL_Pro_Max/
├── src/
│   ├── components/      # React components
│   │   ├── auth/        # Authentication components
│   │   ├── common/      # Common/reusable components
│   │   └── layout/      # Layout components
│   ├── context/         # React Context providers
│   ├── pages/           # Page components
│   ├── styles/          # CSS files
│   ├── utils/           # Utility functions
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── public/              # Static assets
├── index.html           # HTML template
├── package.json         # Dependencies
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── postcss.config.js    # PostCSS configuration
```

## Available Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run preview` - Preview production build
- `bun run lint` - Run ESLint

## Features

✅ Authentication system with role-based login
✅ Protected routes
✅ Session management (localStorage)
✅ Responsive design with Tailwind CSS
✅ Glassmorphism UI design
✅ RBAC permission system

## Demo Login

Use these email patterns to test different roles:

- `admin@ecole.fr` → Super Admin
- `schooladmin@ecole.fr` → School Admin
- `teacher@ecole.fr` → Teacher
- `student@ecole.fr` → Student
- `parent@ecole.fr` → Parent

**Password**: Any (demo mode)

## Troubleshooting

### Port Already in Use

If port 3000 is taken, edit `vite.config.js`:
```js
server: {
  port: 3001, // Change to available port
}
```

### Module Not Found Errors

Clear cache and reinstall:
```bash
rm -rf node_modules bun.lockb
bun install
```

### Build Errors

Make sure all dependencies are installed:
```bash
bun install
```

## Next Steps

1. Start the dev server: `bun run dev`
2. Navigate to `http://localhost:3000`
3. Test login with demo credentials
4. Explore the application

## Development Tips

- Hot Module Replacement (HMR) is enabled - changes appear instantly
- Check browser console for any errors
- Use React DevTools for debugging
- Tailwind classes are available - see `tailwind.config.js` for custom colors

