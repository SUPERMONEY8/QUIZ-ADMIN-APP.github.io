# 📋 ÉTAPES INFINITYFREE - ÉTAPE PAR ÉTAPE

## ✅ ÉTAPE 3 : IMPORTER LE SCHÉMA SQL DANS phpMyAdmin

### 3.1 : Ouvrir phpMyAdmin
1. Dans votre panneau InfinityFree, allez dans **"MySQL Databases"**
2. Cliquez sur **"phpMyAdmin"** (ou le bouton pour ouvrir phpMyAdmin)
3. Connectez-vous avec vos identifiants MySQL

### 3.2 : Sélectionner votre base de données
1. Dans la colonne de gauche, **cliquez sur le nom de votre base de données** (ex: `quizapp_db`)
2. ✅ Vous devriez voir la base vide ou avec quelques tables système

### 3.3 : Ouvrir l'onglet SQL
1. En haut, cliquez sur l'onglet **"SQL"**
2. Vous verrez une grande zone de texte

### 3.4 : COPIER-COLLER LE CODE SQL
1. **Ouvrez le fichier** `api/mysql-schema.sql` de votre projet
2. **Sélectionnez TOUT** (Ctrl+A ou Cmd+A)
3. **Copiez** (Ctrl+C ou Cmd+C)
4. **Collez** dans la zone SQL de phpMyAdmin (Ctrl+V ou Cmd+V)
5. Cliquez sur **"Go"** (ou appuyez sur F5)

### 3.5 : Vérifier que les tables sont créées
1. Dans la colonne de gauche, vous devriez voir :
   - ✅ `users`
   - ✅ `quizzes`
   - ✅ `questions`
   - ✅ `results`
   - ✅ `participants`
2. Si vous les voyez, **C'EST BON !** ✅

---

## ✅ ÉTAPE 4 : UPLOADER LES FICHIERS PHP

### 4.1 : Ouvrir File Manager
1. Dans le panneau InfinityFree, allez dans **"File Manager"**
2. Naviguez vers `htdocs` ou `public_html` (c'est le dossier racine de votre site)

### 4.2 : Créer le dossier `api`
1. Cliquez sur **"New Folder"** (ou bouton pour créer un dossier)
2. Nommez-le : `api`
3. Entrez dans ce dossier

### 4.3 : Uploader les fichiers PHP
1. Cliquez sur **"Upload"** (ou bouton d'upload)
2. Uploadez **TOUS** ces fichiers depuis le dossier `api/` de votre projet :
   - ✅ `config.php`
   - ✅ `users.php`
   - ✅ `quizzes.php`
   - ✅ `questions.php`
   - ✅ `results.php`

### 4.4 : MODIFIER `config.php` avec vos identifiants
1. Dans File Manager, **cliquez sur `config.php`** pour l'éditer
2. **Remplacez** ces lignes avec VOS identifiants InfinityFree :

```php
define('DB_HOST', 'sqlXXX.infinityfree.com'); // Votre serveur MySQL (trouvé dans MySQL Databases)
define('DB_USER', 'votre_utilisateur'); // Votre nom d'utilisateur MySQL
define('DB_PASS', 'votre_mot_de_passe'); // Votre mot de passe MySQL
define('DB_NAME', 'votre_base'); // Votre nom de base de données
```

3. **Sauvegardez** le fichier

---

## ✅ ÉTAPE 5 : TESTER L'API

1. Ouvrez votre navigateur
2. Allez sur : `https://votre-site.infinityfreeapp.com/api/users.php`
3. Vous devriez voir : `{"error":"User ID required"}` ou similaire
4. ✅ Si vous voyez du JSON (pas une erreur 404), **L'API FONCTIONNE !**

---

## ✅ ÉTAPE 6 : METTRE À JOUR VOTRE APP

Modifiez `src/utils/mysqlHelpers.js` et `src/utils/userManager.js` :

**Trouvez cette ligne :**
```javascript
return `${protocol}//${hostname}/api`;
```

**Remplacez par :**
```javascript
return 'https://votre-site.infinityfreeapp.com/api';
```

(Remplacez `votre-site.infinityfreeapp.com` par VOTRE URL InfinityFree)

---

## 🎉 C'EST FINI !

Votre API PHP est maintenant en ligne et accessible ! 🚀

