# Quick Migration Guide

## Problem: `dotnet` command not found

If you see the error: `The term 'dotnet' is not recognized`, use one of these solutions:

## Solution 1: Use the PowerShell Script (Recommended)

Right-click on `create_initial_migration.ps1` and select **"Run with PowerShell"**

Or run in PowerShell:
```powershell
.\create_initial_migration.ps1
```

## Solution 2: Use the Batch Script

Double-click `create_initial_migration.bat`

## Solution 3: Find dotnet Manually

1. Find where dotnet is installed (usually `C:\Program Files\dotnet\dotnet.exe`)
2. Use the full path:

```powershell
& "C:\Program Files\dotnet\dotnet.exe" ef migrations add InitialCreate
```

## Solution 4: Add dotnet to PATH

1. Open System Properties → Environment Variables
2. Add `C:\Program Files\dotnet` to your PATH
3. Restart PowerShell/Command Prompt

## After Creating Migration

The migration will be applied **automatically** when you run the application!

Or apply manually:
```powershell
dotnet ef database update
```

## Troubleshooting

### Build Errors
If migration creation fails, first fix build errors:
```powershell
dotnet build
```

### Migration Already Exists
If you see "Migration 'InitialCreate' already exists":
- Delete the `Migrations` folder
- Run the migration command again

### No Need to Create Migration Manually
**Important**: The app automatically applies migrations on startup using `context.Database.Migrate()`. You only need to create the migration once, then the app handles it automatically!

