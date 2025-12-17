# ⚡ NEON - DÉMARRAGE RAPIDE (10 MINUTES)

## 🎯 3 ÉTAPES SIMPLES

### ÉTAPE 1 : Créer Neon (2 min)
1. Allez sur https://neon.tech
2. Créez un compte (gratuit)
3. Créez un projet : `quiz-app`
4. **COPIEZ la Connection String** (elle ressemble à `postgresql://...`)

### ÉTAPE 2 : Importer le schéma (1 min)
1. Dans Neon, cliquez "SQL Editor"
2. Ouvrez `postgres-schema.sql` de votre projet
3. Copiez-collez TOUT dans l'éditeur SQL
4. Cliquez "Run"
5. ✅ Tables créées !

### ÉTAPE 3 : Configurer Vercel (2 min)
1. Dans Vercel, allez dans "Settings" → "Environment Variables"
2. Ajoutez :
   - **Name :** `DATABASE_URL`
   - **Value :** La Connection String de Neon
3. Redéployez votre app

### ✅ TESTER (1 min)
1. Ouvrez : `https://votre-app.vercel.app/api/test-connection`
2. Vous devriez voir : `{"status":"success",...}`

---

## 🎉 C'EST TOUT !

Votre app fonctionne maintenant avec Neon PostgreSQL !

**Guide complet :** Voir `NEON_DEPLOYMENT_GUIDE.md`

