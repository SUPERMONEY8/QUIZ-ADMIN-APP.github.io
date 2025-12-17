# Quick Start - Tauri + Bun

## 🚀 Exact PowerShell Commands (Copy & Paste)

```powershell
# 1. Install Tauri CLI (choose one method)

# Method A: Global install
bun install -g @tauri-apps/cli

# Method B: Use bunx (no install needed)
# Skip this step if using Method A

# 2. Install project dependencies
bun install

# 3. Run development server
bun run tauri:dev
```

**If Method A doesn't work, use this instead:**
```powershell
bunx @tauri-apps/cli dev
```

## ✅ Verification

After running `bun run tauri:dev`, you should see:
1. Rust compilation messages
2. A window opening with "🎉 Tauri + Bun" interface
3. A "Greet" button that works when clicked

## 📁 Complete Folder Structure

```
PME/
├── .gitignore
├── bun.toml
├── package.json
├── src/
│   ├── index.html
│   └── main.js
└── src-tauri/
    ├── build.rs
    ├── Cargo.toml
    ├── src/
    │   ├── lib.rs
    │   └── main.rs
    └── tauri.conf.json
```

## 🔧 All Config Files Created

✅ `package.json` - Bun/JavaScript dependencies  
✅ `bun.toml` - Bun configuration  
✅ `src-tauri/Cargo.toml` - Rust dependencies  
✅ `src-tauri/tauri.conf.json` - Tauri configuration  
✅ `src-tauri/build.rs` - Rust build script  
✅ `src-tauri/src/main.rs` - Rust entry point  
✅ `src-tauri/src/lib.rs` - Rust app logic  
✅ `src/index.html` - Frontend HTML  
✅ `src/main.js` - Frontend JavaScript  

## 🐛 Troubleshooting

- **"tauri: command not found"**: Use `bunx @tauri-apps/cli dev` instead
- **Rust compilation errors**: Run `rustup update`
- **Bun errors**: Ensure Bun is latest: `bun upgrade`

