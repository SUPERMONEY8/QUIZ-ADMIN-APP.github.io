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

**C'est quoi ?** On met les fichiers de l'API sur internet pour qu'ils fonctionnent.

### Option A : Via cPanel File Manager (PLUS SIMPLE) ⭐

1. **Dans cPanel :** Cherchez "File Manager" et cliquez dessus
2. **Allez dans :** `public_html/` (cliquez dessus dans la liste)
3. **Cliquez :** "Upload" (bouton en haut)
4. **Glissez-déposez :** Le dossier `api/` entier de votre ordinateur
5. **Attendez :** Que tous les fichiers soient uploadés (barre de progression)
6. **Fermez :** La fenêtre d'upload

**Vérifiez :** Ouvrez `public_html/api/` et vous devriez voir tous les fichiers PHP

### Option B : Via FTP (si vous préférez)

1. **Téléchargez FileZilla** (gratuit) : https://filezilla-project.org/
2. **Connectez-vous** avec vos identifiants FTP
3. **À droite :** Allez dans `public_html/`
4. **À gauche :** Trouvez le dossier `api/` de votre projet
5. **Glissez-déposez :** Le dossier `api/` de gauche vers `public_html/` à droite

---

## 🎯 ÉTAPE 3 : CONFIGURER (1 min)

**C'est quoi ?** On dit à l'API où trouver la base de données qu'on a créée.

1. **Dans File Manager :** Allez dans `public_html/api/`
2. **Trouvez :** `config.php`
3. **Clic droit :** "Modifier" ou "Edit"
4. **Cherchez ces 4 lignes** et modifiez-les :

```php
define('DB_HOST', 'localhost');  // ← Ne changez PAS ça
define('DB_USER', 'VOTRE_UTILISATEUR_MYSQL');  // ← Remplacez par le nom d'utilisateur de l'étape 1.4
define('DB_PASS', 'VOTRE_MOT_DE_PASSE_MYSQL'); // ← Remplacez par le mot de passe de l'étape 1.4
define('DB_NAME', 'quiz_app');  // ← Ne changez PAS ça
```

**Exemple :**
- Si votre utilisateur MySQL est `quiz_user` et votre mot de passe est `monPass123`
- Alors mettez :
  ```php
  define('DB_USER', 'quiz_user');
  define('DB_PASS', 'monPass123');
  ```

5. **Cliquez :** "Sauvegarder" ou "Save"
6. **Fermez :** Le fichier

---

## ✅ ÉTAPE 4 : TESTER (Vérifier que tout fonctionne)

**C'est quoi ?** On vérifie que l'API peut parler à la base de données.

1. **Ouvrez votre navigateur** (Chrome, Firefox, etc.)
2. **Tapez dans la barre d'adresse :**
   ```
   https://votre-domaine.com/api/test-connection.php
   ```
   (Remplacez `votre-domaine.com` par votre vrai domaine, par exemple : `monsite.com`)

3. **Appuyez sur Entrée**

4. **Vous devriez voir :**
   - ✅ "Connexion réussie !"
   - ✅ Une liste de tables (users, quizzes, questions, etc.)

**Si vous voyez une erreur :** Lisez la section "🆘 PROBLÈME ?" ci-dessous

---

## 🚀 C'EST TOUT !

Votre API est déployée. L'app React détectera automatiquement l'URL de l'API.

**Si votre API est sur un serveur différent** :
- Ajoutez dans Vercel/Netlify : `VITE_API_URL=https://votre-domaine-api.com/api`
- Redéployez l'app

---

## 🆘 PROBLÈME ?

### ❌ Erreur : "Database connection failed" ou "Erreur de connexion"
**Solution :**
- Vérifiez que vous avez bien mis le bon nom d'utilisateur MySQL dans `config.php` (étape 3)
- Vérifiez que vous avez bien mis le bon mot de passe MySQL dans `config.php` (étape 3)
- Vérifiez que la base de données `quiz_app` existe bien (retournez à l'étape 1)

### ❌ Erreur : "404 Not Found" ou "API endpoint not found"
**Solution :**
- Vérifiez que le dossier `api/` est bien dans `public_html/api/` (pas dans `public_html/public_html/api/`)
- Vérifiez que tous les fichiers sont bien uploadés (config.php, users.php, quizzes.php, etc.)

### ❌ Erreur : "Tables manquantes" ou "No tables found"
**Solution :**
- Retournez à l'étape 1.8
- Réimportez le fichier `mysql-schema.sql` dans phpMyAdmin

### ❌ Erreur : "Permission denied"
**Solution :**
- Retournez à l'étape 1.5
- Vérifiez que l'utilisateur MySQL a bien "Tous les privilèges" (All Privileges)

---

---

## 📚 AUTRES GUIDES

- **👶 Guide ultra-détaillé (pour débutants) :** `BABY_STEPS_DEPLOY.md`
- **📖 Guide complet (toutes les options) :** `DEPLOY_API_NOW.md`

