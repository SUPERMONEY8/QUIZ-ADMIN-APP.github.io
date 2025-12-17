# PME Desktop Application

A Windows desktop application built with Bun runtime, using vanilla JavaScript, HTML, and CSS. This application is designed to be 100% offline after build.

## Prerequisites

- [Bun](https://bun.sh) installed on your system
- Windows OS (for building the .exe)

## Project Structure

```
PME/
├── src/
│   ├── main.js          # Bun server entry point
│   ├── app.js           # Browser-side JavaScript
│   └── styles.css       # Application styles
├── index.html           # Main HTML file
├── package.json         # Bun-compatible package configuration
├── bunfig.toml          # Bun configuration file
└── README.md            # This file
```

## Getting Started

### 1. Install Dependencies

This project uses Bun's built-in package manager. No npm required!

```bash
# Install Bun if you haven't already
# Visit https://bun.sh for installation instructions

# Verify Bun is installed
bun --version
```

### 2. Run in Development Mode

Start the development server:

```bash
bun run dev
```

Or:

```bash
bun start
```

The application will be available at `http://localhost:3000`

### 3. Build for Production

Build the application for production:

```bash
bun run build
```

This creates optimized files in the `dist/` directory.

### 4. Compile to Windows Executable

Create a standalone Windows .exe file:

```bash
bun run compile
```

This will create `dist/pme-app.exe` - a standalone executable that includes Bun runtime and can run without any dependencies.

## Available Scripts

- `bun run dev` or `bun start` - Run the application in development mode
- `bun run build` - Build optimized production files
- `bun run compile` - Compile to standalone Windows .exe

## Features

- ✅ 100% Offline - No internet connection required after build
- ✅ Vanilla JavaScript - No frameworks or external dependencies
- ✅ Bun Runtime - Fast and efficient
- ✅ Standalone Executable - Can be distributed as a single .exe file
- ✅ Modern UI - Clean and responsive design

## Building the Executable

The `compile` script uses Bun's native compilation feature:

```bash
bun build src/main.js --compile --outfile dist/pme-app.exe --minify
```

This creates a self-contained executable that:
- Includes the Bun runtime
- Bundles all your code
- Requires no installation or dependencies
- Runs completely offline

## Notes

- The application runs a local HTTP server on port 3000
- All assets (HTML, CSS, JS) are served from the executable
- The app is fully self-contained after compilation
- No external package manager (npm/yarn) is required

## Troubleshooting

If you encounter issues:

1. Make sure Bun is properly installed: `bun --version`
2. Check that all files are in the correct locations
3. Ensure port 3000 is not in use by another application
4. For compilation issues, ensure you're on Windows or use cross-compilation flags

## License

MIT

