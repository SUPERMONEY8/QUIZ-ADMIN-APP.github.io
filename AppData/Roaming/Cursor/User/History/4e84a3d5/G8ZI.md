# Streamable Video Fix Guide

## What I Fixed

I've improved the VideoPlayer component and video helper utilities to better handle Streamable video embeds. The changes include:

1. **Better URL parsing** - Now handles various Streamable URL formats
2. **Improved error handling** - Shows clearer error messages and provides a direct link fallback
3. **Enhanced loading detection** - Better timeout handling and iframe load detection
4. **Direct link fallback** - If the embed fails, users can click a link to open the video in a new tab

## Common Issues and Solutions

### Issue 1: Video Shows Broken Icon or Doesn't Load

**Most Common Cause:** The video is not set to "Public" in Streamable settings.

**Solution:**
1. Go to your Streamable account
2. Find the video that's not working
3. Click on the video to open it
4. Click the "Edit" or "Settings" button
5. Change the privacy setting to **"Public"**
6. Save the changes
7. Refresh your quiz page

### Issue 2: Video URL Format is Incorrect

**Solution:**
Make sure you're using the correct Streamable embed URL format:
- ✅ **Correct:** `https://streamable.com/e/xxxxxx`
- ✅ **Also works:** `https://streamable.com/xxxxxx` (will be converted automatically)
- ❌ **Wrong:** Just the video ID without the domain

**How to get the embed URL:**
1. Go to your Streamable video
2. Click the "Share" button
3. Copy the "Embed" URL (it should look like `https://streamable.com/e/xxxxxx`)
4. Paste this URL into your quiz question form

### Issue 3: Browser or Network Issues

**Solutions:**
1. **Clear browser cache** - Sometimes cached data can cause issues
2. **Try a different browser** - Test in Chrome, Firefox, or Edge
3. **Disable browser extensions** - Ad blockers or privacy extensions might block the iframe
4. **Check your internet connection** - Ensure you have a stable connection
5. **Try incognito/private mode** - This helps rule out extension issues

### Issue 4: Video Takes Too Long to Load

**Solutions:**
1. Check if the video is set to "Public" (see Issue 1)
2. Check your internet connection speed
3. Try the "Open video in new tab" link that appears if the video fails to load
4. Verify the video URL is correct in your database

## How to Verify Your Video URL

1. **Check the database:**
   - Go to your Supabase dashboard
   - Navigate to the `questions` table
   - Find the question with the video
   - Check the `video_url` field
   - It should be in format: `https://streamable.com/e/xxxxxx`

2. **Test the URL directly:**
   - Copy the URL from the database
   - Paste it in a new browser tab
   - If it loads, the URL is correct
   - If it doesn't, the video might be private or the URL is wrong

3. **Check the browser console:**
   - Open your browser's developer tools (F12)
   - Go to the Console tab
   - Look for any error messages related to the video
   - The console will show the original and converted URLs

## Testing the Fix

After the fix, test your videos:

1. **Refresh your quiz page** - Make sure you're using the latest code
2. **Check the browser console** - Look for any error messages
3. **Wait 8 seconds** - If the video doesn't load, you'll see an error message with a direct link
4. **Click the direct link** - If the embed doesn't work, users can still access the video

## Still Having Issues?

If videos still don't work after trying the above:

1. **Verify the video is public:**
   - Go to Streamable
   - Check the video privacy settings
   - Make sure it's set to "Public"

2. **Check the URL format:**
   - Ensure it's `https://streamable.com/e/VIDEO_ID`
   - No extra parameters or paths

3. **Test in a different environment:**
   - Try on a different device
   - Try on a different network
   - This helps identify if it's a local issue

4. **Contact Streamable support:**
   - If the video is public and the URL is correct, there might be an issue with Streamable's service
   - Check Streamable's status page for any outages

## Quick Checklist

- [ ] Video is set to "Public" in Streamable settings
- [ ] URL format is `https://streamable.com/e/xxxxxx`
- [ ] Browser cache is cleared
- [ ] No ad blockers or privacy extensions blocking the iframe
- [ ] Internet connection is stable
- [ ] Video URL is correctly stored in the database

## Need Help?

If you're still experiencing issues:
1. Check the browser console for error messages
2. Verify the video URL in your database
3. Test the URL directly in a browser
4. Make sure the video is set to "Public" in Streamable

