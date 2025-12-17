# Create Single Portable EXE File

## Best Solution: Build a Single Portable Executable

Instead of the folder with multiple files, you can create a **single .exe file** that your client can just double-click!

### Build the Portable Executable

Run this command in your project folder:

```bash
bun run build:portable
```

This will create a single file: `dist/Depo Portable 1.0.0.exe`

### Advantages:
- ✅ Single file - just one .exe to copy
- ✅ No folder structure needed
- ✅ Client just double-clicks the .exe
- ✅ All files bundled inside
- ✅ Works from flash drive

### How to Use:
1. Run: `bun run build:portable`
2. Find the .exe in the `dist` folder
3. Copy that ONE file to flash drive
4. Client double-clicks it - done!

---

## Alternative: Use VBScript Launchers (Current Solution)

If you prefer the folder approach, use the VBScript launchers:

- **START-HERE.vbs** ← Best option
- **Launch-Depo.vbs** ← Alternative
- **START.vbs** ← Another option

These are more reliable than batch files on Windows!

