# 🚀 START HERE - Complete Setup Guide

## ⚠️ IMPORTANT: Read This First

Your folder path contains Arabic characters (خفارة), which is fine. Just follow these steps carefully.

---

## 📋 STEP-BY-STEP INSTRUCTIONS

### STEP 1: No Installation Needed! ✅

**Great news:** This uses PowerShell which is built into Windows!
- ✅ No Python needed
- ✅ No npm needed  
- ✅ No installation required
- ✅ Just double-click and go!

**PowerShell is already on your computer** - Windows 7 and later have it built-in.

---

### STEP 2: Start the Web Server

**Easy Method (Recommended):**
1. Go to your folder: `C:\Users\LENOVO\Desktop\خفارة`
2. Find the file named: `start_server.bat`
3. **Double-click** on `start_server.bat`
4. A black window will open
5. You should see: `Server running at http://localhost:3000/`
6. ✅ **DO NOT CLOSE THIS WINDOW!** Keep it open!

**Alternative Method (If double-click doesn't work):**
1. Press `Windows Key`
2. Type `cmd` and press `Enter`
3. Type: `cd "C:\Users\LENOVO\Desktop\خفارة"`
4. Press `Enter`
5. Type: `python server.py`
6. Press `Enter`
7. You should see: `Server running at http://localhost:3000/`
8. ✅ **DO NOT CLOSE THIS WINDOW!**

---

### STEP 3: Test the Server (Optional but Recommended)

**This verifies everything is working:**

1. Open your web browser (Chrome, Edge, or Firefox)
2. In the address bar, type: `http://localhost:3000/taskpane.html`
3. Press `Enter`

**What you should see:**
- ✅ A page with "Shift Assignment" title
- ✅ A dropdown for "Select Sheet"
- ✅ A button "Assign Next Employee"
- ✅ Instructions on how to use

**If you see this page:**
- ✅ **Server is working perfectly!** Go to STEP 4

**If you see an error:**
- ❌ Make sure the server window is still open (from STEP 2)
- ❌ Check if you see "Server running" in the server window
- ❌ Try typing `http://localhost:3000` (without taskpane.html) in browser

---

### STEP 4: Load Add-in into Excel

**Follow these steps exactly:**

1. **Open Microsoft Excel**
   - Double-click Excel icon on desktop, or
   - Search for "Excel" in Windows search

2. **Create or open a workbook**
   - Create a new blank workbook, or
   - Open an existing Excel file

3. **Open Add-ins menu:**
   - Click on **Insert** tab (at the top of Excel)
   - Look for **Add-ins** button (in the ribbon)
   - Click on **Add-ins**
   - Click on **My Add-ins** (in the dropdown menu)

4. **Upload the manifest:**
   - In the "Office Add-ins" dialog box
   - Look at the bottom, find **"Upload My Add-in"**
   - Click on **"Upload My Add-in"**
   - A file browser window will open

5. **Select manifest.xml:**
   - Navigate to: `C:\Users\LENOVO\Desktop\خفارة`
   - Look for file named: `manifest.xml`
   - Click on `manifest.xml`
   - Click **"Open"** or **"Upload"**

6. **Add the add-in:**
   - You should see "Employee Shift Assignment" in the list
   - Click on **"Employee Shift Assignment"**
   - Click **"Add"** or **"Insert"**
   - A task pane should open on the right side of Excel

---

### STEP 5: Verify Add-in is Working

**Once the task pane opens:**

✅ You should see:
- "Shift Assignment" title
- "Select Sheet" dropdown (with Yellow, Green, Red options)
- "Assign Next Employee" button
- Instructions text

✅ **Test it:**
1. Make sure your Excel workbook has sheets named "Yellow", "Green", or "Red"
2. Select one from the dropdown
3. Click "Assign Next Employee"
4. Watch for status messages

---

## 🔧 TROUBLESHOOTING

### Problem: "ExecutionPolicy" error
**Solution:**
- The batch file should handle this automatically
- If you see a PowerShell execution policy error:
  - Right-click `start_server.bat`
  - Select "Run as Administrator"
  - Or run this command in PowerShell as Admin:
    `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`

### Problem: "Port 3000 is already in use"
**Solution:**
- Another program is using port 3000
- Close other applications
- Restart your computer
- Or change PORT in server.py to a different number (like 3001)

### Problem: Server starts but browser shows error
**Solution:**
- Make sure all files are in the same folder
- Check that taskpane.html, taskpane.js, taskpane.css, config.js are all present
- Restart the server

### Problem: Add-in won't load in Excel
**Solution:**
- Make sure server is running (black window is open)
- Test in browser first (STEP 3)
- Check Excel version (needs Excel 2016 or later)
- Try closing and reopening Excel
- Make sure you selected the correct manifest.xml file

### Problem: Add-in loads but shows blank page
**Solution:**
- Check browser console: Right-click in task pane → Inspect → Console
- Look for error messages
- Verify server is still running
- Check that all JavaScript files are loading

---

## 📝 QUICK REFERENCE

**Start Server:**
```
Double-click: start_server.bat
```

**Manifest Location:**
```
C:\Users\LENOVO\Desktop\خفارة\manifest.xml
```

**Test URL:**
```
http://localhost:3000/taskpane.html
```

**Stop Server:**
```
Press Ctrl+C in the server window
```

---

## ✅ CHECKLIST

Before asking for help, make sure:

- [ ] Python is installed (STEP 1)
- [ ] Server is running (STEP 2)
- [ ] Browser test works (STEP 3)
- [ ] Excel is open (STEP 4)
- [ ] manifest.xml is uploaded (STEP 4)
- [ ] Task pane is visible (STEP 5)

---

## 🎉 SUCCESS!

If you see the task pane in Excel with the interface, **you're done!** The add-in is working.

**Remember:** Keep the server window open while using the add-in!

---

## 📞 Need More Help?

1. Read `SETUP_GUIDE.md` for more detailed instructions
2. Read `QUICK_START.txt` for a quick reference
3. Check the troubleshooting section above

