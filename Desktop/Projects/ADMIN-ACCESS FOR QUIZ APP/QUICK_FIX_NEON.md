# 🚨 FIX RAPIDE - Erreur "Failed to save quiz"

## 🔍 PROBLÈME
L'app essaie d'appeler l'API Node.js mais elle n'est pas encore déployée ou la base de données n'est pas configurée.

---

## ✅ SOLUTION RAPIDE (3 ÉTAPES)

### ÉTAPE 1 : Vérifier que l'API est déployée
1. Ouvrez votre navigateur
2. Allez sur : `https://votre-app.vercel.app/api/test-connection`
3. **Que voyez-vous ?**
   - ✅ `{"status":"success",...}` → L'API fonctionne, passez à l'étape 2
   - ❌ Erreur 404 ou autre → L'API n'est pas déployée, voir ci-dessous

**Si l'API n'est pas déployée :**
1. Vérifiez que `api-node/` est dans votre repo GitHub
2. Vérifiez que `vercel.json` est à la racine
3. Redéployez sur Vercel

---

### ÉTAPE 2 : Configurer Neon (si pas encore fait)
1. Allez sur https://console.neon.tech
2. Importez le schéma SQL (`postgres-schema.sql`)
3. Obtenez la Connection String
4. Ajoutez `DATABASE_URL` dans Vercel Environment Variables
5. Redéployez

---

### ÉTAPE 3 : Vérifier les logs
1. Ouvrez la console du navigateur (F12)
2. Regardez les erreurs
3. Vous devriez voir l'URL de l'API qui est appelée
4. Vérifiez que cette URL fonctionne

---

## 🆘 SI ÇA NE MARCHE TOUJOURS PAS

### Vérifier l'URL de l'API
Dans la console du navigateur, vous devriez voir :
```
🌐 API Call: POST https://votre-app.vercel.app/api/quizzes
```

Si vous voyez une autre URL, c'est que l'app n'est pas au bon endroit.

### Vérifier que DATABASE_URL est bien dans Vercel
1. Vercel → Settings → Environment Variables
2. Vérifiez que `DATABASE_URL` existe
3. Vérifiez qu'il contient votre Connection String de Neon

### Redéployer
1. Vercel → Deployments → 3 points → Redeploy
2. Attendez que le déploiement se termine

---

## 📋 CHECKLIST

- [ ] API déployée sur Vercel (`/api/test-connection` fonctionne)
- [ ] Schéma SQL importé dans Neon
- [ ] `DATABASE_URL` ajouté dans Vercel
- [ ] App redéployée sur Vercel
- [ ] Test de connexion réussi

---

**Dites-moi ce que vous voyez quand vous allez sur `/api/test-connection` !** 🆘

