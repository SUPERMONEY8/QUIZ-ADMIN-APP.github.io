# 🚀 Flash Drive Setup Instructions

## Quick Start for Your Client

### Step 1: Copy Files to Flash Drive

1. Copy the **entire contents** of the `dist/win-unpacked` folder to your flash drive
2. You can create a folder on the flash drive called `Depo` and copy everything inside it

### Step 2: Run the Application

**Option A: Double-click the batch file (Easiest)**
- Double-click `RUN-DEPO.bat` or `START-DEPO.bat`
- The app will launch automatically

**Option B: Double-click the executable**
- Double-click `electron.exe` directly
- The app will launch

### Step 3: Using the App

- The app will create a `business.db.json` file in the same folder to store all data
- All your business data stays with the app on the flash drive
- No installation required - just plug and play!

## 📁 Folder Structure on Flash Drive

```
Flash Drive/
└── Depo/
    ├── RUN-DEPO.bat          ← Double-click this to start!
    ├── START-DEPO.bat         ← Or this one!
    ├── electron.exe           ← Or double-click this directly
    ├── resources/             (App files)
    ├── locales/               (Language files)
    ├── *.dll                  (Required libraries)
    └── business.db.json       (Created automatically - your data)
```

## ✅ Requirements

- **Windows 10 or Windows 11**
- **No installation needed** - runs directly from flash drive
- **No internet required** - works offline
- **No admin rights needed** - runs as regular user

## 🔒 Data Storage

- All data is stored in `business.db.json` in the same folder as the app
- Backups are stored in `DepoBackups/` folder (created automatically)
- **Important**: Keep the entire folder together - don't delete any files!

## 💡 Tips

1. **Keep it together**: Don't separate files - keep everything in one folder
2. **Backup regularly**: Copy the entire folder to another location as backup
3. **Safe removal**: Close the app before removing the flash drive
4. **Multiple computers**: Works on any Windows computer - just plug and run!

## ❓ Troubleshooting

**App won't start?**
- Make sure all files are in the same folder
- Try running `electron.exe` directly
- Check if Windows Defender is blocking it (add exception if needed)

**Data missing?**
- Check for `business.db.json` in the app folder
- Make sure you're running from the same flash drive location

**Slow performance?**
- Flash drives can be slower than hard drives - this is normal
- For better performance, copy the folder to the computer's hard drive

---

**Ready to use!** Just double-click `RUN-DEPO.bat` and start managing your business! 🎉

