# Netlify Deployment Guide

## Prerequisites

1. Firebase project set up (see `FIREBASE-SETUP.md`)
2. GitHub/GitLab repository with your code
3. Netlify account (free tier works)

## Step 1: Connect Repository to Netlify

1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Click "Add new site" > "Import an existing project"
3. Connect to your Git provider (GitHub/GitLab/Bitbucket)
4. Select your repository
5. Netlify will auto-detect settings from `netlify.toml`

## Step 2: Configure Build Settings

Netlify should auto-detect from `netlify.toml`, but verify:

- **Build command**: `bun install && bun run build`
- **Publish directory**: `dist`
- **Node version**: 18 (or latest)

## Step 3: Set Environment Variables

1. In Netlify dashboard, go to **Site settings** > **Environment variables**
2. Add all Firebase environment variables:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

3. Click "Save"

## Step 4: Deploy

1. Netlify will automatically deploy on every push to your main branch
2. Or click "Trigger deploy" > "Deploy site" for manual deployment
3. Wait for build to complete
4. Your site will be live at `https://your-site-name.netlify.app`

## Step 5: Custom Domain (Optional)

1. Go to **Domain settings**
2. Click "Add custom domain"
3. Follow the DNS configuration instructions
4. Netlify will handle SSL certificates automatically

## Build Process

Netlify will:
1. Install dependencies with `bun install`
2. Run build with `bun run build`
3. Publish files from `dist/` directory
4. Serve the app with SPA routing (all routes → index.html)

## Troubleshooting

### Build Fails

**Error: "bun: command not found"**
- Netlify might not have Bun installed
- Solution: Add build plugin or use Node.js with a Bun installer script
- Alternative: Update `netlify.toml` to use Node.js build process

**Error: "Environment variables not found"**
- Make sure all `VITE_*` variables are set in Netlify dashboard
- Variables must start with `VITE_` to be accessible in the browser

**Error: "Firebase configuration error"**
- Verify all Firebase environment variables are correct
- Check Firebase console for correct values

### Runtime Errors

**"Firebase: Error (auth/configuration-not-found)"**
- Environment variables not set correctly in Netlify
- Check Netlify dashboard > Environment variables
- Redeploy after adding variables

**"Permission denied" in Firestore**
- Check Firestore security rules
- Make sure rules allow the operations you need
- See `FIREBASE-SETUP.md` for security rules setup

### Performance Issues

- Enable Netlify's CDN caching
- Use Netlify Edge Functions for server-side operations
- Optimize images and assets
- Enable compression in Netlify settings

## Continuous Deployment

Netlify automatically deploys when you:
- Push to main/master branch
- Create a pull request (preview deployment)
- Merge a pull request

## Preview Deployments

Every pull request gets a unique preview URL:
- `https://deploy-preview-123--your-site.netlify.app`
- Perfect for testing before merging

## Rollback

If something goes wrong:
1. Go to **Deploys** tab
2. Find a previous successful deployment
3. Click "..." > "Publish deploy"
4. Your site will rollback to that version

## Monitoring

- **Analytics**: Enable in Netlify dashboard (paid feature)
- **Logs**: View build and function logs in dashboard
- **Status**: Check site status and uptime

## Next Steps

- [ ] Set up custom domain
- [ ] Configure Firestore security rules
- [ ] Enable Firebase Authentication
- [ ] Set up error tracking (e.g., Sentry)
- [ ] Configure backup strategy
- [ ] Set up monitoring and alerts

