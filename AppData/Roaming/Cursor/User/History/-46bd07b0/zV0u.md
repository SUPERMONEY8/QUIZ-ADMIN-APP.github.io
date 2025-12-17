# 👶 GUIDE POUR ENFANT DE 2 ANS - DÉPLOIEMENT API

## 🎯 CE QU'ON VA FAIRE

On va mettre l'API (le cerveau de l'app) sur internet pour que l'app fonctionne.

---

## 📦 ÉTAPE 1 : CRÉER LA BASE DE DONNÉES (Comme créer une boîte)

### 1.1 : Se connecter à son hébergement
- **Où ?** Sur le site de votre hébergeur (cPanel, Plesk, etc.)
- **Comment ?** Connectez-vous avec votre nom d'utilisateur et mot de passe
- **C'est quoi ?** C'est comme ouvrir la porte de votre maison sur internet

### 1.2 : Trouver "MySQL Databases"
- **Où ?** Dans le menu de votre hébergement
- **Cherchez :** "MySQL Databases" ou "Bases de données"
- **C'est quoi ?** C'est l'endroit où on crée la boîte pour stocker les données

### 1.3 : Créer la base de données
- **Cliquez sur :** "Créer une nouvelle base de données"
- **Nom :** Tapez `quiz_app` (tout en minuscules)
- **Cliquez :** "Créer"
- **C'est quoi ?** On vient de créer une boîte vide appelée "quiz_app"

### 1.4 : Créer un utilisateur MySQL
- **Nom d'utilisateur :** Créez un nom (exemple : `quiz_user`)
- **Mot de passe :** Créez un mot de passe (notez-le quelque part !)
- **Cliquez :** "Créer"
- **C'est quoi ?** C'est comme créer une clé pour ouvrir la boîte

### 1.5 : Donner les permissions
- **Cochez :** "Tous les privilèges" (All Privileges)
- **Cliquez :** "Ajouter l'utilisateur à la base"
- **C'est quoi ?** On donne la clé à l'utilisateur pour qu'il puisse ouvrir la boîte

### 1.6 : Ouvrir phpMyAdmin
- **Cherchez :** "phpMyAdmin" dans le menu
- **Cliquez dessus**
- **C'est quoi ?** C'est un outil pour voir et gérer la boîte qu'on vient de créer

### 1.7 : Sélectionner la base de données
- **Dans la liste à gauche :** Cliquez sur `quiz_app`
- **C'est quoi ?** On ouvre la boîte qu'on vient de créer

### 1.8 : Importer le fichier SQL
- **En haut :** Cliquez sur l'onglet "Importer"
- **Cliquez :** "Choisir un fichier"
- **Sélectionnez :** Le fichier `mysql-schema.sql` (il est à la racine du projet)
- **Cliquez :** "Exécuter" ou "Go"
- **Attendez :** Quelques secondes
- **C'est quoi ?** On met des étagères dans la boîte pour ranger les données

### 1.9 : Vérifier que ça a marché
- **Vous devriez voir :** "Importation réussie"
- **Dans la liste à gauche :** Vous devriez voir des tables (users, quizzes, questions, etc.)
- **C'est quoi ?** Les étagères sont maintenant dans la boîte !

---

## 📤 ÉTAPE 2 : UPLOADER L'API (Mettre les fichiers sur internet)

### 2.1 : Choisir comment uploader

**Option A : Via FTP (comme copier des fichiers)**

1. **Téléchargez FileZilla** (gratuit) : https://filezilla-project.org/
2. **Installez-le**
3. **Ouvrez FileZilla**
4. **En haut :** Entrez :
   - **Hôte :** `ftp.votre-domaine.com` (ou l'adresse FTP de votre hébergeur)
   - **Nom d'utilisateur :** Votre nom d'utilisateur FTP
   - **Mot de passe :** Votre mot de passe FTP
   - **Port :** 21
5. **Cliquez :** "Connexion rapide"
6. **À droite :** Allez dans `public_html/` ou `www/`
7. **À gauche :** Trouvez le dossier `api/` de votre projet
8. **Glissez-déposez :** Le dossier `api/` de gauche vers `public_html/` à droite
9. **Attendez :** Que tous les fichiers soient uploadés

**Option B : Via cPanel File Manager (plus simple)**

1. **Dans cPanel :** Cherchez "File Manager"
2. **Cliquez dessus**
3. **Allez dans :** `public_html/` (cliquez dessus)
4. **Cliquez :** "Upload" (en haut)
5. **Glissez-déposez :** Le dossier `api/` entier
6. **Attendez :** Que tous les fichiers soient uploadés
7. **Fermez :** La fenêtre d'upload

### 2.2 : Vérifier que les fichiers sont là
- **Dans File Manager :** Ouvrez le dossier `public_html/api/`
- **Vous devriez voir :** 
  - `config.php`
  - `users.php`
  - `quizzes.php`
  - `questions.php`
  - `results.php`
  - `test-connection.php`
  - `.htaccess`
  - `error.php`
- **Si vous voyez tous ces fichiers :** ✅ C'est bon !

---

## ⚙️ ÉTAPE 3 : CONFIGURER (Dire à l'API où est la base de données)

### 3.1 : Ouvrir le fichier config.php
- **Dans File Manager :** Allez dans `public_html/api/`
- **Trouvez :** `config.php`
- **Clic droit :** "Modifier" ou "Edit"

### 3.2 : Trouver les 4 lignes à changer
- **Cherchez ces lignes :**
  ```php
  define('DB_HOST', 'localhost');
  define('DB_USER', 'root');
  define('DB_PASS', '');
  define('DB_NAME', 'quiz_app');
  ```

### 3.3 : Changer les valeurs
- **DB_HOST :** Laissez `'localhost'` (ne changez rien)
- **DB_USER :** Remplacez `'root'` par le nom d'utilisateur MySQL que vous avez créé à l'étape 1.4
  - Exemple : `define('DB_USER', 'quiz_user');`
- **DB_PASS :** Remplacez `''` par le mot de passe MySQL que vous avez créé à l'étape 1.4
  - Exemple : `define('DB_PASS', 'monMotDePasse123');`
- **DB_NAME :** Laissez `'quiz_app'` (ne changez rien)

### 3.4 : Sauvegarder
- **Cliquez :** "Sauvegarder" ou "Save"
- **Fermez :** Le fichier

---

## ✅ ÉTAPE 4 : TESTER (Vérifier que tout fonctionne)

### 4.1 : Ouvrir le test dans le navigateur
- **Ouvrez :** Votre navigateur (Chrome, Firefox, etc.)
- **Tapez dans la barre d'adresse :**
  ```
  https://votre-domaine.com/api/test-connection.php
  ```
  (Remplacez `votre-domaine.com` par votre vrai domaine)

### 4.2 : Voir le résultat
- **Si vous voyez :** ✅ "Connexion réussie !" → **C'EST BON !** 🎉
- **Si vous voyez :** ❌ Une erreur → Lisez l'erreur et corrigez-la

### 4.3 : Vérifier les tables
- **Sur la page de test :** Vous devriez voir une liste de tables
- **Vous devriez voir :** users, quizzes, questions, results, participants
- **Si vous voyez ces tables :** ✅ Tout est parfait !

---

## 🎉 C'EST FINI !

Votre API est maintenant sur internet et fonctionne !

### Ce qui se passe maintenant :
- L'app React va automatiquement trouver l'API
- Les quiz vont être sauvegardés dans la base de données
- Tout fonctionne ! 🚀

---

## 🆘 SI ÇA NE MARCHE PAS

### Problème 1 : "Erreur de connexion"
- **Solution :** Vérifiez que vous avez bien mis le bon nom d'utilisateur et mot de passe dans `config.php`
- **Vérifiez :** Que la base de données `quiz_app` existe bien

### Problème 2 : "404 Not Found"
- **Solution :** Vérifiez que le dossier `api/` est bien dans `public_html/api/`
- **Vérifiez :** Que tous les fichiers sont bien uploadés

### Problème 3 : "Tables manquantes"
- **Solution :** Retournez à l'étape 1.8 et importez à nouveau `mysql-schema.sql`

### Problème 4 : "Permission denied"
- **Solution :** Vérifiez que l'utilisateur MySQL a bien "Tous les privilèges" (étape 1.5)

---

## 📝 RÉCAPITULATIF

1. ✅ Créer la base de données `quiz_app`
2. ✅ Créer un utilisateur MySQL
3. ✅ Importer `mysql-schema.sql` dans phpMyAdmin
4. ✅ Uploader le dossier `api/` dans `public_html/`
5. ✅ Modifier `config.php` avec vos identifiants
6. ✅ Tester avec `test-connection.php`

**C'est tout ! Vous avez terminé !** 🎊

