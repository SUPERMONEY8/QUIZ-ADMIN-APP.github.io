# Google Sheets Integration Setup

This guide explains how to set up automatic Google Sheets integration for quiz results.

## Overview

When a participant completes a quiz, the system will:
1. Create a new sheet in the Google Spreadsheet (if it doesn't exist)
2. Add the quiz results to that sheet
3. Include detailed question-by-question data

**Spreadsheet Link:** https://docs.google.com/spreadsheets/d/14X5Lh_ezbBTv-cmZN20WX8VL-wG5QXfGtUUEm5Kaf8g/edit?usp=sharing

## Setup Instructions

### Option 1: Using Google Service Account (Recommended)

1. **Create a Service Account:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the Google Sheets API
   - Go to "IAM & Admin" > "Service Accounts"
   - Click "Create Service Account"
   - Give it a name (e.g., "quiz-app-sheets")
   - Click "Create and Continue"
   - Skip role assignment, click "Done"

2. **Create and Download Key:**
   - Click on the service account you just created
   - Go to "Keys" tab
   - Click "Add Key" > "Create new key"
   - Choose "JSON" format
   - Download the JSON file

3. **Share Spreadsheet with Service Account:**
   - Open the JSON file you downloaded
   - Copy the `client_email` value (looks like: `quiz-app-sheets@project-id.iam.gserviceaccount.com`)
   - Open your Google Spreadsheet: https://docs.google.com/spreadsheets/d/14X5Lh_ezbBTv-cmZN20WX8VL-wG5QXfGtUUEm5Kaf8g/edit
   - Click "Share" button
   - Paste the service account email
   - Give it "Editor" access
   - Click "Send"

4. **Add Environment Variables to Netlify:**
   - Go to your Netlify site dashboard
   - Navigate to "Site settings" > "Environment variables"
   - Add these variables:
     ```
     GOOGLE_SERVICE_ACCOUNT_EMAIL = (the client_email from JSON file)
     GOOGLE_PRIVATE_KEY = (the private_key from JSON file - keep the \n characters)
     ```
   - Click "Save"

5. **Redeploy:**
   - The changes will take effect on the next deployment
   - Or trigger a new deployment manually

### Option 2: Using Google Apps Script (Alternative - No Backend Required)

If you prefer not to use a service account, you can use Google Apps Script:

1. **Create Apps Script:**
   - Open your Google Spreadsheet
   - Go to "Extensions" > "Apps Script"
   - Replace the code with the script from `google-apps-script.js` (if provided)
   - Save the script
   - Deploy as a web app
   - Set permissions to "Anyone" can access
   - Copy the web app URL

2. **Update the client code:**
   - Modify `src/utils/googleSheets.js` to call the Apps Script URL instead of Netlify function

## What Gets Added to Sheets

Each quiz gets its own sheet (named after the quiz title). Each row contains:

- **Timestamp** - When the quiz was completed
- **Participant Name** - Name of the participant
- **Score** - Number of correct answers
- **Total Questions** - Total number of questions
- **Percentage** - Score percentage
- **Total Time** - Total time spent on quiz
- **For each question:**
  - Question Number
  - Question Text
  - User's Answer
  - Correct Answer
  - Whether it was correct (Yes/No)
  - Number of attempts
  - Which attempt was correct (1st, 2nd, 3rd, or Never)
  - Time spent on that question

## Troubleshooting

### Error: "Google Sheets credentials not configured"
- Make sure you've added the environment variables to Netlify
- Check that the service account email has access to the spreadsheet
- Verify the private key is correctly formatted (with \n characters)

### Error: "Permission denied"
- Make sure you've shared the spreadsheet with the service account email
- The service account needs "Editor" access

### Sheets not being created
- Check Netlify function logs for errors
- Verify the spreadsheet ID is correct
- Make sure the Google Sheets API is enabled in your Google Cloud project

## Testing

After setup, complete a quiz and check:
1. A new sheet should be created (if it's the first result for that quiz)
2. The result should appear as a new row in the sheet
3. All question details should be included

