# 🟢 GUIDE DE DÉPLOIEMENT - NEON + VERCEL

## 🎯 Vue d'ensemble

Ce guide vous explique comment déployer votre Quiz App avec :
- **Neon** (PostgreSQL serverless) pour la base de données
- **Vercel** pour l'app React + API Node.js

---

## 📋 PRÉREQUIS

1. ✅ Compte Vercel (gratuit) : https://vercel.com
2. ✅ Compte Neon (gratuit) : https://neon.tech
3. ✅ Votre code est prêt (déjà fait !)

---

## 🚀 ÉTAPE 1 : CRÉER LA BASE DE DONNÉES NEON (5 min)

### 1.1 : Créer un compte Neon
1. Allez sur https://neon.tech
2. Cliquez "Sign Up" (gratuit)
3. Connectez-vous avec GitHub (recommandé)

### 1.2 : Créer un nouveau projet
1. Cliquez "Create Project"
2. **Nom du projet :** `quiz-app` (ou ce que vous voulez)
3. **Région :** Choisissez la plus proche de vous
4. **PostgreSQL version :** 15 (par défaut, c'est bon)
5. Cliquez "Create Project"

### 1.3 : Noter la connection string
1. Une fois le projet créé, vous verrez une **Connection String**
2. Elle ressemble à : `postgresql://user:password@host.neon.tech/dbname?sslmode=require`
3. **COPIEZ CETTE STRING** - vous en aurez besoin plus tard !
4. Ou cliquez sur "Connection Details" pour la voir

### 1.4 : Importer le schéma SQL
1. Dans Neon, cliquez sur "SQL Editor" (dans le menu de gauche)
2. Cliquez "New Query"
3. **Ouvrez le fichier** `postgres-schema.sql` de votre projet
4. **Copiez TOUT le contenu** du fichier
5. **Collez** dans l'éditeur SQL de Neon
6. Cliquez "Run" (ou F5)
7. ✅ Vous devriez voir "Success" - les tables sont créées !

---

## 🚀 ÉTAPE 2 : CONFIGURER VERCEL (10 min)

### 2.1 : Connecter votre repo GitHub à Vercel
1. Allez sur https://vercel.com
2. Cliquez "Add New Project"
3. **Importez votre repo GitHub** (celui avec votre Quiz App)
4. Cliquez "Import"

### 2.2 : Configurer les variables d'environnement
1. Dans les **Settings** du projet Vercel
2. Allez dans "Environment Variables"
3. **Ajoutez cette variable :**
   - **Name :** `DATABASE_URL`
   - **Value :** La connection string de Neon (étape 1.3)
   - **Environments :** Production, Preview, Development (cochez tout)
4. Cliquez "Save"

### 2.3 : Installer les dépendances de l'API
1. Dans votre terminal local, allez dans le dossier `api-node/`
2. Exécutez :
   ```bash
   cd api-node
   npm install
   ```
3. Commitez et poussez les changements :
   ```bash
   git add api-node/
   git commit -m "Add Node.js API for Neon"
   git push origin main
   ```

### 2.4 : Déployer sur Vercel
1. Vercel va automatiquement détecter les changements
2. Ou allez dans Vercel et cliquez "Redeploy"
3. Attendez que le déploiement se termine

---

## ✅ ÉTAPE 3 : TESTER (2 min)

### 3.1 : Tester la connexion à la base de données
1. Ouvrez votre app déployée sur Vercel
2. Ajoutez `/api/test-connection` à l'URL
   - Exemple : `https://votre-app.vercel.app/api/test-connection`
3. Vous devriez voir :
   ```json
   {
     "status": "success",
     "message": "Connexion réussie",
     "tables": ["users", "quizzes", "questions", "results", "participants"]
   }
   ```

### 3.2 : Tester depuis l'app
1. Ouvrez votre app
2. Créez un quiz
3. Vérifiez qu'il est sauvegardé (pas d'erreurs dans la console)

---

## 🔧 CONFIGURATION DE L'URL DE L'API

L'app détecte automatiquement l'URL de l'API :
- **Production (Vercel) :** Utilise automatiquement `/api`
- **Développement :** Utilise `http://localhost:3000/api` (si vous lancez l'API localement)

**Pas besoin de configurer quoi que ce soit !** ✅

---

## 🛠️ DÉVELOPPEMENT LOCAL (Optionnel)

Si vous voulez tester l'API localement :

### 1. Installer les dépendances
```bash
cd api-node
npm install
```

### 2. Créer un fichier `.env`
```bash
DATABASE_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require
```

### 3. Lancer l'API
```bash
npm run dev
```

L'API sera disponible sur `http://localhost:3000`

---

## 🆘 DÉPANNAGE

### Erreur : "Database connection failed"
- ✅ Vérifiez que `DATABASE_URL` est bien configurée dans Vercel
- ✅ Vérifiez que la connection string de Neon est correcte
- ✅ Vérifiez que le schéma SQL a été importé (étape 1.4)

### Erreur : "API endpoint not found"
- ✅ Vérifiez que `vercel.json` est à la racine du projet
- ✅ Vérifiez que le dossier `api-node/` est bien dans le repo
- ✅ Redéployez sur Vercel

### Erreur : "Module not found"
- ✅ Vérifiez que `api-node/package.json` existe
- ✅ Vérifiez que les dépendances sont installées
- ✅ Redéployez sur Vercel

### Les quiz ne s'affichent pas
- ✅ Vérifiez la console du navigateur (F12)
- ✅ Vérifiez que l'API répond : `/api/test-connection`
- ✅ Vérifiez que les tables existent dans Neon (SQL Editor)

---

## 📊 VÉRIFIER QUE TOUT FONCTIONNE

### Checklist :
- [ ] Base de données Neon créée
- [ ] Schéma SQL importé (tables créées)
- [ ] Connection string notée
- [ ] Variable `DATABASE_URL` configurée dans Vercel
- [ ] Code poussé sur GitHub
- [ ] Déploiement Vercel réussi
- [ ] Test de connexion réussi (`/api/test-connection`)
- [ ] Création de quiz fonctionne

---

## 🎉 C'EST FINI !

Votre app est maintenant déployée avec :
- ✅ **Neon PostgreSQL** (base de données serverless)
- ✅ **Vercel** (app React + API Node.js)
- ✅ **Tout gratuit** (plans gratuits suffisants pour commencer)
- ✅ **Scalable** (s'adapte automatiquement)

---

## 📚 RESSOURCES

- **Neon Docs :** https://neon.tech/docs
- **Vercel Docs :** https://vercel.com/docs
- **PostgreSQL Docs :** https://www.postgresql.org/docs/

---

## 💡 AVANTAGES DE CETTE SOLUTION

✅ **Tout sur Vercel** - Pas besoin d'hébergement séparé  
✅ **Serverless** - Scalable automatiquement  
✅ **Gratuit** - Plans gratuits généreux  
✅ **Rapide** - Performance optimale  
✅ **Moderne** - Stack à jour  
✅ **Sécurisé** - HTTPS par défaut  

---

**Besoin d'aide ?** Vérifiez la section Dépannage ci-dessus ! 🆘

