# 📋 Complete Step-by-Step Setup Guide

## ✅ STEP 1: Verify Python is Installed

**Check if Python is installed:**
1. Press `Windows Key + R`
2. Type `cmd` and press Enter
3. In the command prompt, type: `python --version`
4. Press Enter

**If you see a version number (like Python 3.11.0):**
- ✅ Python is installed! Go to **STEP 2**

**If you see "python is not recognized":**
- ❌ Python is not installed
- Download from: https://www.python.org/downloads/
- **IMPORTANT:** During installation, check "Add Python to PATH"
- After installation, restart your computer, then repeat this step

---

## ✅ STEP 2: Start the Web Server

**Method A: Double-Click (Easiest)**
1. Go to your folder: `C:\Users\LENOVO\Desktop\خفارة`
2. Double-click on `start_server.bat`
3. A black window will open showing: "Server running at http://localhost:3000/"
4. **DO NOT CLOSE THIS WINDOW** - Keep it open!

**Method B: Command Prompt**
1. Open Command Prompt (Windows Key + R, type `cmd`, press Enter)
2. Type: `cd "C:\Users\LENOVO\Desktop\خفارة"`
3. Press Enter
4. Type: `python server.py`
5. Press Enter
6. You should see: "Server running at http://localhost:3000/"
7. **DO NOT CLOSE THIS WINDOW** - Keep it open!

---

## ✅ STEP 3: Verify Server is Running

1. Open your web browser (Chrome, Edge, Firefox)
2. Go to: `http://localhost:3000/taskpane.html`
3. You should see the add-in interface (buttons, dropdowns, etc.)
4. If you see the page, ✅ **Server is working!** Continue to STEP 4
5. If you see an error, check that the server window is still open

---

## ✅ STEP 4: Sideload Add-in into Excel

### 4.1: Open Excel
1. Open Microsoft Excel
2. Create a new blank workbook or open an existing one

### 4.2: Access Add-ins Menu
1. Click on the **Insert** tab (at the top)
2. Click on **Add-ins** (in the ribbon)
3. Click on **My Add-ins** (dropdown menu)

### 4.3: Upload the Manifest
1. In the "My Add-ins" dialog, click **Upload My Add-in** (at the bottom)
2. Navigate to: `C:\Users\LENOVO\Desktop\خفارة`
3. Select `manifest.xml`
4. Click **Upload**

### 4.4: Launch the Add-in
1. The add-in should appear in your list
2. Click on **Employee Shift Assignment**
3. Click **Add** or **Insert**
4. A task pane should open on the right side of Excel

---

## ✅ STEP 5: Test the Add-in

Once the task pane is open:
1. You should see dropdowns for "Select Sheet" and "Action"
2. Click "Refresh Sheets" - it should populate with your Excel sheets
3. Select a sheet from the dropdown
4. Try selecting different actions (Read Data, Write Data, etc.)
5. Click "Execute Action" to test

---

## 🔧 Troubleshooting

### Server won't start
- **Error: "python is not recognized"**
  - Python is not installed or not in PATH
  - Reinstall Python with "Add to PATH" checked

- **Error: "Port 3000 is already in use"**
  - Another application is using port 3000
  - Close other applications or restart your computer

### Add-in won't load in Excel
- **Check server is running:** Go to `http://localhost:3000/taskpane.html` in browser
- **Check manifest path:** Make sure you're selecting the correct `manifest.xml` file
- **Excel version:** Make sure you're using Excel 2016 or later (Windows/Mac) or Excel Online

### Add-in loads but shows errors
- **Check browser console:** Right-click in task pane → Inspect → Console tab
- **Verify all files exist:** Make sure all files are in the same folder
- **Check server logs:** Look at the server window for error messages

---

## 📝 Quick Reference

**Start Server:**
```
Double-click: start_server.bat
OR
Command: python server.py
```

**Manifest Path:**
```
C:\Users\LENOVO\Desktop\خفارة\manifest.xml
```

**Server URL:**
```
http://localhost:3000
```

**Test URL:**
```
http://localhost:3000/taskpane.html
```

---

## ⚠️ Important Notes

1. **Keep server running:** Don't close the server window while using the add-in
2. **Restart server after changes:** If you modify files, restart the server
3. **One instance only:** Don't run multiple servers at the same time
4. **Firewall:** Windows may ask for permission - click "Allow"

---

## 🎉 You're Done!

Once you complete all steps, your Office Add-in should be working in Excel!

