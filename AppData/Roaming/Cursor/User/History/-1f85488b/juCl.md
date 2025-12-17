# Quick Deployment Steps

## 1. GitHub Setup
```bash
git init
git add .
git commit -m "Ready for deployment"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

## 2. Netlify Deployment
- Go to netlify.com → Import from GitHub
- Select your repo
- Build settings auto-detected ✅
- Deploy → Copy URL

## 3. Firebase Setup
- Firebase Console → Authentication → Authorized domains
- Add your Netlify domain (e.g., `your-app.netlify.app`)
- Firestore → Rules → Paste `firestore.rules` → Publish

## 4. Update Firebase Config
- Edit `src/firebase/config.js` with your Firebase credentials
- OR use Netlify environment variables (recommended)

## 5. Redeploy
- Netlify auto-deploys on git push
- Or manually trigger: Netlify → Deploys → Trigger deploy

## Done! 🎉

