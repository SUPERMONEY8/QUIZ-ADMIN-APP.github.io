# Available Commands

## Working Commands ✅

### 1. `bun run dev`
**Status:** ✅ Works perfectly
- This command uses the `dev` script from `bunfile.toml`
- Runs the Electron app in development mode
- **Use this as your primary development command**

### 2. `bunx electron .`
**Status:** ✅ Works perfectly  
- Directly runs Electron using Bun's package runner
- Alternative to `bun run dev`
- You can also use: `bun run electron .` (uses the script from package.json)

## Commands That Don't Work ❌

### 1. `bun run bunfile.toml`
**Status:** ❌ This is incorrect syntax
- `bunfile.toml` is a **configuration file**, not a script
- You cannot run TOML files directly
- **Use instead:** `bun run dev` (which reads from bunfile.toml)

### 2. `electron .`
**Status:** ❌ Electron is not in system PATH
- The `electron` command is not available globally
- **Use instead:** `bunx electron .` or `bun run dev`

## Summary

**Recommended commands:**
- **Development:** `bun run dev` ← Use this!
- **Alternative:** `bunx electron .`
- **Build:** `bun run build` (when electron-builder is set up)

