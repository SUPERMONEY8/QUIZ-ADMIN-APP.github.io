# 📋 Guide de Configuration Complète - API PHP

## ✅ Étape 1 : Configuration MySQL (FAIT)

Votre fichier `api/config.php` est maintenant configuré avec :
- **DB_HOST**: `localhost`
- **DB_USER**: `root`
- **DB_PASS**: `` (vide - standard pour XAMPP/WAMP)
- **DB_NAME**: `quiz_app`

---

## 🔧 Étape 2 : Tester la Connexion

### Option A : Test via navigateur (Recommandé)

1. **Copiez le dossier `api/` dans votre serveur web :**
   - **XAMPP** : `C:\xampp\htdocs\quiz-app-api\`
   - **WAMP** : `C:\wamp64\www\quiz-app-api\`
   - **Hébergement web** : Dans le dossier `public_html` ou `www`

2. **Ouvrez dans votre navigateur :**
   ```
   http://localhost/quiz-app-api/api/test-connection.php
   ```

3. **Vérifiez le résultat :**
   - ✅ Si vous voyez "Connexion réussie" → Tout fonctionne !
   - ❌ Si vous voyez une erreur → Vérifiez les identifiants

### Option B : Test via phpMyAdmin

1. Ouvrez phpMyAdmin : `http://localhost/phpmyadmin`
2. Connectez-vous avec `root` (sans mot de passe)
3. Vérifiez que la base `quiz_app` existe
4. Vérifiez que toutes les tables sont créées :
   - `users`
   - `quizzes`
   - `questions`
   - `results`
   - `participants`

---

## 🌐 Étape 3 : Configurer l'URL de l'API dans React

### Pour développement local :

1. **Créez un fichier `.env` à la racine du projet :**
   ```env
   VITE_API_URL=http://localhost/quiz-app-api/api
   ```

2. **Ou modifiez directement dans le code :**
   - Ouvrez `src/utils/mysqlHelpers.js`
   - Ligne 3 : `const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/quiz-app-api/api';`

### Pour production (hébergement web) :

1. **Créez un fichier `.env` :**
   ```env
   VITE_API_URL=https://votre-domaine.com/api
   ```

2. **Ou modifiez dans le code :**
   - Remplacez `http://localhost/quiz-app-api/api` par votre URL d'API

---

## 📁 Structure des Fichiers

```
Votre Projet/
├── api/
│   ├── config.php          ← ✅ Configuré avec root
│   ├── test-connection.php ← 🆕 Fichier de test
│   ├── users.php
│   ├── quizzes.php
│   ├── questions.php
│   └── results.php
├── src/
│   └── utils/
│       └── mysqlHelpers.js ← Utilise l'API PHP
└── .env                    ← À créer pour l'URL de l'API
```

---

## 🚀 Étape 4 : Déployer l'API

### Local (XAMPP/WAMP) :

1. **Copiez le dossier `api/` :**
   ```bash
   # XAMPP
   C:\xampp\htdocs\quiz-app-api\api\
   
   # WAMP
   C:\wamp64\www\quiz-app-api\api\
   ```

2. **Testez l'API :**
   ```
   http://localhost/quiz-app-api/api/test-connection.php
   ```

### Hébergement Web :

1. **Uploadez le dossier `api/` via FTP :**
   - Dans `public_html/api/` ou `www/api/`

2. **Modifiez `api/config.php` si nécessaire :**
   - Vérifiez `DB_HOST` (peut être différent de `localhost`)
   - Vérifiez `DB_USER` et `DB_PASS` (fournis par l'hébergeur)

3. **Testez l'API :**
   ```
   https://votre-domaine.com/api/test-connection.php
   ```

---

## ✅ Étape 5 : Vérifier que Tout Fonctionne

### Test 1 : Connexion MySQL
```
http://localhost/quiz-app-api/api/test-connection.php
```
✅ Doit afficher "Connexion réussie"

### Test 2 : API Endpoints
```
http://localhost/quiz-app-api/api/users.php
```
✅ Doit retourner du JSON (peut être vide si aucun utilisateur)

### Test 3 : Application React
1. Démarrez l'application React
2. Ouvrez la console du navigateur (F12)
3. Vérifiez qu'il n'y a pas d'erreurs de connexion à l'API

---

## 🔧 Dépannage

### Erreur : "Connection failed"
- ✅ Vérifiez que MySQL est démarré (XAMPP/WAMP)
- ✅ Vérifiez les identifiants dans `api/config.php`
- ✅ Vérifiez que la base `quiz_app` existe

### Erreur : "Base de données introuvable"
- ✅ Exécutez `mysql-schema.sql` dans phpMyAdmin
- ✅ Vérifiez que le nom de la base est `quiz_app`

### Erreur : "Aucune table trouvée"
- ✅ Exécutez `mysql-schema.sql` dans phpMyAdmin
- ✅ Vérifiez que toutes les tables sont créées

### Erreur CORS dans le navigateur
- ✅ Vérifiez que les headers CORS sont dans `api/config.php`
- ✅ Vérifiez que l'URL de l'API est correcte dans `.env`

---

## 📝 Résumé

1. ✅ **Config.php** : Configuré avec `root` et mot de passe vide
2. 🔄 **Test de connexion** : Exécutez `test-connection.php`
3. 🔄 **URL de l'API** : Configurez dans `.env` ou `mysqlHelpers.js`
4. 🔄 **Déployer l'API** : Copiez le dossier `api/` dans votre serveur web
5. 🔄 **Tester** : Vérifiez que tout fonctionne

---

## 🎯 Prochaine Étape

Une fois que `test-connection.php` fonctionne, vous pouvez :
1. Configurer l'URL de l'API dans React
2. Tester l'application complète
3. Créer votre premier quiz !

