# Quick Start - Run Without Visual Studio

## Option 1: Double-Click the Batch File (Easiest!)

Just **double-click `run.bat`** in your project folder. It will:
- Find dotnet automatically
- Restore packages
- Build the project
- Run the app

## Option 2: PowerShell Script

Right-click `run.ps1` → **Run with PowerShell**

If you get an execution policy error, run this first in PowerShell:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then run:
```powershell
.\run.ps1
```

## Option 3: Manual Command Line

Open PowerShell or Command Prompt in the project folder:

```powershell
# If dotnet is in your PATH:
dotnet restore
dotnet build
dotnet run

# If dotnet is NOT in your PATH, use full path:
"C:\Program Files\dotnet\dotnet.exe" restore
"C:\Program Files\dotnet\dotnet.exe" build
"C:\Program Files\dotnet\dotnet.exe" run
```

## Install .NET 8.0 SDK (if needed)

If you get "dotnet not found" error:
1. Download from: https://dotnet.microsoft.com/download/dotnet/8.0
2. Install the SDK (not just Runtime)
3. Restart your terminal/PowerShell
4. Run the scripts again

## Troubleshooting

- **"dotnet not found"**: Install .NET 8.0 SDK
- **Build errors**: Make sure you're in the project folder
- **Permission errors**: Run PowerShell as Administrator

