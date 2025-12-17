# ⚡ DÉPLOIEMENT RAPIDE - 3 ÉTAPES SIMPLES

> 💡 **Besoin d'aide ?** Si vous êtes débutant, ouvrez `BABY_STEPS_DEPLOY.md` pour un guide ultra-détaillé !

## 🎯 ÉTAPE 1 : CRÉER LA BASE DE DONNÉES (2 min)

**C'est quoi ?** On crée une "boîte" sur internet pour stocker les quiz.

1. **Connectez-vous à votre hébergement** (cPanel, Plesk, etc.)
   - C'est comme ouvrir la porte de votre maison sur internet

2. **Allez dans "MySQL Databases"** (ou "Bases de données")
   - Cherchez dans le menu de votre hébergement

3. **Créez la base de données** :
   - Nom : `quiz_app` (tout en minuscules)
   - Cliquez "Créer"

4. **Créez un utilisateur MySQL** :
   - Nom d'utilisateur : (exemple : `quiz_user`)
   - Mot de passe : (créez-en un et **NOTEZ-LE** !)
   - Cochez "Tous les privilèges"
   - Cliquez "Créer"

5. **Ouvrez phpMyAdmin**
   - Cherchez "phpMyAdmin" dans le menu
   - Cliquez dessus

6. **Sélectionnez votre base `quiz_app`**
   - Dans la liste à gauche, cliquez sur `quiz_app`

7. **Cliquez sur l'onglet "Importer"** (en haut)

8. **Uploadez le fichier `mysql-schema.sql`**
   - Cliquez "Choisir un fichier"
   - Sélectionnez `mysql-schema.sql` (il est à la racine du projet)
   - Cliquez "Exécuter" ou "Go"
   - Attendez quelques secondes
   - ✅ Vous devriez voir "Importation réussie"

---

## 🎯 ÉTAPE 2 : UPLOADER L'API (1 min)

### Via FTP/SFTP :
1. Connectez-vous à votre serveur
2. Allez dans `public_html/` ou `www/`
3. **Uploadez TOUT le dossier `api/`**

### Via cPanel File Manager :
1. Ouvrez File Manager
2. Allez dans `public_html/`
3. **Glissez-déposez le dossier `api/`**

---

## 🎯 ÉTAPE 3 : CONFIGURER (1 min)

1. **Ouvrez** `api/config.php` sur votre serveur (via File Manager ou FTP)
2. **Modifiez** ces 4 lignes :

```php
define('DB_HOST', 'localhost');
define('DB_USER', 'VOTRE_UTILISATEUR_MYSQL');  // ← Changez ça
define('DB_PASS', 'VOTRE_MOT_DE_PASSE_MYSQL'); // ← Changez ça
define('DB_NAME', 'quiz_app');
```

3. **Sauvegardez**

---

## ✅ TESTER

Ouvrez dans votre navigateur :
```
https://votre-domaine.com/api/test-connection.php
```

**Vous devriez voir** : ✅ Connexion réussie !

---

## 🚀 C'EST TOUT !

Votre API est déployée. L'app React détectera automatiquement l'URL de l'API.

**Si votre API est sur un serveur différent** :
- Ajoutez dans Vercel/Netlify : `VITE_API_URL=https://votre-domaine-api.com/api`
- Redéployez l'app

---

## 🆘 PROBLÈME ?

1. **Erreur de connexion** → Vérifiez `config.php`
2. **404 Not Found** → Vérifiez que `api/` est dans `public_html/api/`
3. **Tables manquantes** → Importez `mysql-schema.sql` dans phpMyAdmin

---

**📖 Guide complet :** Voir `DEPLOY_API_NOW.md`

