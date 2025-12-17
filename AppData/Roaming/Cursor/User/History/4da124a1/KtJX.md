# Tauri + Bun Setup Instructions

## Exact PowerShell Commands (Copy-Paste Ready)

Run these commands **one by one** in PowerShell:

```powershell
# Step 1: Install Tauri CLI globally using Bun
bun install -g @tauri-apps/cli

# Step 2: Install project dependencies
bun install

# Step 3: Verify installations (optional checks)
rustc --version
bun --version

# Step 4: Run the development server
bun run tauri:dev
```

**Alternative if global install doesn't work:**
```powershell
# Use bunx instead of global install
bunx @tauri-apps/cli dev
```

## Project Structure

```
PME/
├── src/                    # Frontend files
│   ├── index.html         # Main HTML file
│   └── main.js            # Main JavaScript file
├── src-tauri/             # Rust backend
│   ├── src/
│   │   ├── main.rs        # Entry point
│   │   └── lib.rs         # Main application logic
│   ├── Cargo.toml         # Rust dependencies
│   ├── build.rs           # Build script
│   └── tauri.conf.json    # Tauri configuration
├── package.json           # Bun/JavaScript dependencies
└── bun.toml              # Bun configuration
```

## Verification Steps

1. **Check Rust**: `rustc --version` should show Rust version
2. **Check Bun**: `bun --version` should show Bun version
3. **Install dependencies**: `bun install` should complete without errors
4. **Run dev server**: `bun run tauri:dev` should:
   - Compile Rust backend
   - Open a window with the Tauri app
   - Show "Tauri + Bun" interface

## Troubleshooting

- If `bun add -g` fails, try: `bun install -g @tauri-apps/cli`
- If Rust compilation fails, ensure Rust toolchain is up to date: `rustup update`
- If Tauri CLI not found, check PATH or use: `bunx @tauri-apps/cli dev`

