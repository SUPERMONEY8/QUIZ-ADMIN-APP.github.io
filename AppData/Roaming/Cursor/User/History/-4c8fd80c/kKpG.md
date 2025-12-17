# Google Sheets Integration Troubleshooting Guide

## Quick Check: What to Do Right Now

### Step 1: Check Browser Console
1. Open your quiz app in the browser
2. Open Developer Tools (F12)
3. Go to the **Console** tab
4. Complete a quiz
5. Look for messages starting with:
   - 🔄 Starting Google Sheets export...
   - 📤 Sending request...
   - 📥 Response status...
   - ✅ Result added to Google Sheets successfully
   - ❌ Error messages

**What to look for:**
- If you see "Failed to fetch" or "Network error" → The Netlify function isn't deployed or accessible
- If you see "Google Sheets credentials not configured" → Environment variables aren't set in Netlify
- If you see a 500 error → Check Netlify function logs

### Step 2: Check Netlify Function Logs
1. Go to your Netlify dashboard
2. Navigate to **Functions** tab
3. Click on `googleSheets` function
4. Check the **Logs** tab
5. Look for error messages

**Common errors:**
- `Google Sheets credentials not configured` → Set environment variables
- `Permission denied` → Service account doesn't have access to spreadsheet
- `Function not found` → Function isn't deployed

### Step 3: Verify Environment Variables
1. Go to Netlify dashboard
2. Navigate to **Site settings** > **Environment variables**
3. Verify these are set:
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL` = `sheets-access-sa@data-478012.iam.gserviceaccount.com`
   - `GOOGLE_PRIVATE_KEY` = (the full private key from your JSON file, including `\n` characters)

**Important:** The private key must include the `\n` characters. Copy it exactly as it appears in the JSON file.

### Step 4: Verify Spreadsheet Sharing
1. Open your Google Spreadsheet
2. Click the **Share** button
3. Make sure this email has **Editor** access:
   - `sheets-access-sa@data-478012.iam.gserviceaccount.com`

### Step 5: Verify Function Deployment
1. Go to Netlify dashboard
2. Check **Deploys** tab
3. Make sure the latest deployment includes the `netlify/functions/googleSheets.js` file
4. If not, trigger a new deployment

---

## Alternative Solution: Use Google Apps Script (Easier!)

If the Netlify function isn't working, use Google Apps Script instead. This doesn't require serverless functions or environment variables.

### Setup Google Apps Script:

1. **Open your Google Spreadsheet:**
   - https://docs.google.com/spreadsheets/d/14X5Lh_ezbBTv-cmZN20WX8VL-wG5QXfGtUUEm5Kaf8g/edit

2. **Open Apps Script:**
   - Go to **Extensions** > **Apps Script**

3. **Paste the code:**
   - Open the file `GOOGLE_APPS_SCRIPT_FALLBACK.js` in your project
   - Copy all the code
   - Paste it into the Apps Script editor
   - Delete any existing code first

4. **Save the script:**
   - Click **Save** (or Ctrl+S)
   - Give it a name like "Quiz Results Handler"

5. **Deploy as Web App:**
   - Click **Deploy** > **New deployment**
   - Click the gear icon ⚙️ next to "Select type"
   - Choose **Web app**
   - Fill in:
     - **Description:** Quiz Results Handler
     - **Execute as:** Me
     - **Who has access:** Anyone
   - Click **Deploy**
   - **Copy the Web App URL** (looks like: `https://script.google.com/macros/s/.../exec`)

6. **Update your code:**
   - Open `src/utils/googleSheets.js`
   - Find this line:
     ```javascript
     const GOOGLE_APPS_SCRIPT_URL = null;
     ```
   - Replace `null` with your Web App URL in quotes:
     ```javascript
     const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
     ```
   - Save and redeploy

7. **Test it:**
   - Complete a quiz
   - Check your spreadsheet - a new sheet should appear with the results!

---

## Common Issues and Solutions

### Issue: "Failed to fetch" error
**Cause:** Netlify function isn't deployed or accessible
**Solution:**
- Check if `netlify/functions/googleSheets.js` exists
- Verify `netlify.toml` has `[functions]` section
- Trigger a new deployment in Netlify
- Or use Google Apps Script instead (easier!)

### Issue: "Google Sheets credentials not configured"
**Cause:** Environment variables not set in Netlify
**Solution:**
- Go to Netlify > Site settings > Environment variables
- Add `GOOGLE_SERVICE_ACCOUNT_EMAIL` and `GOOGLE_PRIVATE_KEY`
- Redeploy the site

### Issue: "Permission denied" error
**Cause:** Service account doesn't have access to spreadsheet
**Solution:**
- Open Google Spreadsheet
- Click Share
- Add `sheets-access-sa@data-478012.iam.gserviceaccount.com` with Editor access

### Issue: Function returns 500 error
**Cause:** Error in the function code
**Solution:**
- Check Netlify function logs
- Look for the specific error message
- Common issues:
  - Invalid private key format
  - Missing environment variables
  - Spreadsheet ID incorrect

### Issue: Nothing happens, no errors
**Cause:** Function might not be called, or errors are silently caught
**Solution:**
- Check browser console for detailed logs
- Check Netlify function logs
- Verify the function is being called (look for "🔄 Starting Google Sheets export..." in console)

---

## Testing Checklist

- [ ] Browser console shows "🔄 Starting Google Sheets export..."
- [ ] Browser console shows "📤 Sending request..."
- [ ] Browser console shows "📥 Response status: 200"
- [ ] Browser console shows "✅ Result added to Google Sheets successfully"
- [ ] Netlify function logs show successful execution
- [ ] New sheet appears in Google Spreadsheet
- [ ] Data appears in the new sheet

If any of these fail, check the corresponding section above.

---

## Still Not Working?

1. **Check all console logs** (browser and Netlify)
2. **Verify environment variables** are set correctly
3. **Try Google Apps Script approach** (simpler, no serverless function needed)
4. **Check that the spreadsheet ID is correct** in the code
5. **Make sure you've shared the spreadsheet** with the service account

If nothing works, the Google Apps Script approach is the most reliable and doesn't require any serverless functions or environment variables!

