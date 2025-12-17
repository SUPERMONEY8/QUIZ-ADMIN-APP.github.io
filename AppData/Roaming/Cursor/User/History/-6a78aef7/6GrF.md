# Bun Commands Reference

This project uses **Bun** as the JavaScript runtime and package manager. All commands below should be run from the `grocery-delivery-app` directory.

## Installation & Dependencies

```bash
# Install all dependencies
bun install
# or shorthand
bun i

# Add a new dependency
bun add <package-name>

# Add a dev dependency
bun add -d <package-name>

# Remove a dependency
bun remove <package-name>
# or
bun rm <package-name>

# Update dependencies
bun update

# Check for outdated packages
bun outdated

# Audit for vulnerabilities
bun audit
```

## Development Commands

```bash
# Start development server (Vite)
bun run dev
# or
bun run start

# Build for production
bun run build

# Preview production build
bun run preview
```

## Running Scripts

```bash
# Run any package.json script
bun run <script-name>

# Run with watch mode (auto-restart on file changes)
bun run --watch <script-name>

# Run with hot reload
bun run --hot <script-name>

# Force using Bun runtime
bun run --bun <script-name>
```

## Direct Execution

```bash
# Run a JavaScript/TypeScript file directly
bun run ./path/to/file.js
bun run ./path/to/file.ts

# Execute a package binary
bunx <package-name>
# Example: bunx vite
```

## Testing

```bash
# Run tests
bun test

# Run tests in watch mode
bun test --watch

# Run tests with coverage
bun test --coverage
```

## Other Useful Commands

```bash
# Start Bun REPL
bun repl

# Bundle files
bun build ./input.js --outdir ./dist

# Check package info
bun info <package-name>

# Explain why a package is installed
bun why <package-name>

# Upgrade Bun itself
bun upgrade
```

## Configuration

Bun configuration is stored in `bunfig.toml`. This file configures:
- Auto-install behavior
- Lockfile settings
- Shell preferences
- Test configuration

## Current Project Scripts

- `bun run dev` - Start Vite development server on port 3000
- `bun run start` - Same as dev (starts Vite dev server)
- `bun run build` - Build the project for production
- `bun run preview` - Preview the production build locally

## Notes

- Bun is faster than npm/yarn for package installation
- Bun can run TypeScript files directly without compilation
- All npm scripts work with Bun - just use `bun run` instead of `npm run`
- Bun uses `bun.lockb` instead of `package-lock.json` or `yarn.lock`

