# 🔗 CONNECTER VERCEL À GITHUB

## ❌ PROBLÈME
Vercel ne détecte pas automatiquement le push vers GitHub.

---

## ✅ SOLUTION : CONNECTER LE REPO À VERCEL

### Option 1 : Vérifier la connexion existante
1. Allez sur **https://vercel.com** → votre projet
2. Allez dans **"Settings"** → **"Git"**
3. Vérifiez que le repo GitHub est connecté :
   - **Repository :** `SUPERMONEY8/DEPO` (ou votre repo)
   - Si ce n'est pas le bon repo, déconnectez et reconnectez

### Option 2 : Connecter un nouveau repo
1. Allez sur **https://vercel.com**
2. Cliquez sur **"Add New..."** → **"Project"**
3. **Import Git Repository**
4. Sélectionnez **"GitHub"**
5. Autorisez Vercel à accéder à GitHub (si demandé)
6. Cherchez votre repo : `SUPERMONEY8/DEPO`
7. Cliquez sur **"Import"**
8. Vercel va détecter automatiquement :
   - Framework : Vite
   - Build Command : `npm run build`
   - Output Directory : `dist`
9. Cliquez sur **"Deploy"**

### Option 3 : Redéployer manuellement
1. Allez sur **https://vercel.com** → votre projet
2. Allez dans **"Deployments"**
3. Cliquez sur **"Redeploy"** sur le dernier déploiement
4. **IMPORTANT** : Décochez **"Use existing Build Cache"**
5. Cliquez sur **"Redeploy"**

---

## ✅ VÉRIFICATION

### Vérifier que le repo est connecté
1. **Vercel** → votre projet → **Settings** → **Git**
2. Vous devriez voir :
   - **Repository :** `SUPERMONEY8/DEPO`
   - **Branch :** `master`
   - **Auto-deploy :** ✅ Enabled

### Vérifier les fichiers dans GitHub
1. Allez sur **https://github.com/SUPERMONEY8/DEPO**
2. Vérifiez que vous voyez :
   - ✅ `api-node/` (dossier avec les fichiers Node.js)
   - ✅ `vercel.json` (fichier de configuration)
   - ✅ `src/utils/databaseConfig.js` (avec `USE_POSTGRES = true`)

---

## 🆘 SI ÇA NE MARCHE TOUJOURS PAS

### Forcer un nouveau déploiement
1. **Vercel** → votre projet → **Settings** → **Git**
2. Cliquez sur **"Disconnect"** (si connecté)
3. Cliquez sur **"Connect Git Repository"**
4. Sélectionnez **GitHub** → **SUPERMONEY8/DEPO**
5. Cliquez sur **"Import"**
6. Vercel va redéployer automatiquement

---

## 📋 CHECKLIST

- [ ] Repo GitHub : `SUPERMONEY8/DEPO` existe
- [ ] Fichiers pushés vers GitHub (vérifier sur GitHub.com)
- [ ] Vercel connecté au repo GitHub
- [ ] Auto-deploy activé dans Vercel
- [ ] Nouveau déploiement en cours ou terminé

---

**Dites-moi ce que vous voyez dans Vercel → Settings → Git !** 🆘


