# 🚀 DÉPLOIEMENT API - GUIDE COMPLET

## ⚡ DÉPLOIEMENT RAPIDE (5 MINUTES)

### Étape 1 : Préparer les fichiers

Tous les fichiers sont déjà dans le dossier `api/`. Vous devez juste les uploader.

---

### Étape 2 : Choisir votre méthode de déploiement

#### 🎯 Option A : Vercel (Recommandé si votre app React est sur Vercel)

**Vercel ne supporte PAS PHP nativement.** Vous devez utiliser un serveur PHP séparé.

**Solution : Utilisez un service gratuit comme :**
- **000webhost.com** (gratuit, PHP + MySQL)
- **InfinityFree.net** (gratuit, PHP + MySQL)
- **Heroku** (avec buildpack PHP)

**OU utilisez l'Option B ci-dessous.**

---

#### 🎯 Option B : Hébergement Web Classique (cPanel, Plesk, etc.)

**Si votre app React est sur Netlify/Vercel mais vous avez un hébergement web séparé :**

1. **Connectez-vous à votre hébergement** (cPanel, Plesk, FTP)

2. **Créez la base de données MySQL** :
   - Allez dans "MySQL Databases" ou "phpMyAdmin"
   - Créez une base de données : `quiz_app`
   - Créez un utilisateur MySQL
   - Notez : **DB_HOST**, **DB_USER**, **DB_PASS**, **DB_NAME**

3. **Importez le schéma SQL** :
   - Ouvrez phpMyAdmin
   - Sélectionnez votre base `quiz_app`
   - Cliquez sur "Importer"
   - Uploadez le fichier `mysql-schema.sql` du projet

4. **Uploadez le dossier `api/`** :
   - Via FTP/SFTP : `public_html/api/` ou `www/api/`
   - Via cPanel File Manager : glissez-déposez le dossier `api/`

5. **Configurez `api/config.php`** :
   ```php
   define('DB_HOST', 'localhost');
   define('DB_USER', 'votre_utilisateur_mysql');
   define('DB_PASS', 'votre_mot_de_passe_mysql');
   define('DB_NAME', 'quiz_app');
   ```

6. **Testez l'API** :
   ```
   https://votre-domaine.com/api/test-connection.php
   ```
   ✅ Vous devriez voir : `{"status":"success","message":"Connexion réussie"}`

---

#### 🎯 Option C : Serveur Dédié / VPS

**Si vous avez un serveur Linux :**

```bash
# 1. Installez PHP et MySQL
sudo apt update
sudo apt install php php-mysqli apache2 mysql-server

# 2. Créez la base de données
mysql -u root -p
CREATE DATABASE quiz_app;
# (Importez mysql-schema.sql)
exit

# 3. Copiez les fichiers API
sudo cp -r api/ /var/www/html/api/
sudo chown -R www-data:www-data /var/www/html/api/

# 4. Configurez config.php
sudo nano /var/www/html/api/config.php
# (Mettez à jour DB_USER, DB_PASS, DB_NAME)

# 5. Testez
curl http://localhost/api/test-connection.php
```

---

### Étape 3 : Configuration de l'URL de l'API

**L'app détecte automatiquement l'environnement**, mais si vous utilisez un serveur séparé :

1. **Dans Vercel/Netlify**, ajoutez la variable d'environnement :
   ```
   VITE_API_URL=https://votre-domaine-api.com/api
   ```

2. **Redéployez l'app React**

---

## ✅ VÉRIFICATION

### Test 1 : Connexion API
```
https://votre-domaine.com/api/test-connection.php
```
**Résultat attendu :** `{"status":"success","message":"Connexion réussie"}`

### Test 2 : Créer un utilisateur
```bash
curl -X POST https://votre-domaine.com/api/users.php \
  -H "Content-Type: application/json" \
  -d '{"id":"test123","email":"test@example.com","name":"Test"}'
```
**Résultat attendu :** `{"id":"test123",...}`

### Test 3 : Depuis l'app React
1. Ouvrez votre app déployée
2. Ouvrez la console (F12)
3. Créez un quiz
4. Vérifiez qu'il n'y a pas d'erreurs API

---

## 🆘 DÉPANNAGE

### Erreur : "API endpoint not found"
- ✅ Vérifiez que le dossier `api/` est dans `public_html/api/` ou `www/api/`
- ✅ Vérifiez que PHP est activé sur votre serveur
- ✅ Vérifiez les permissions : `chmod 755 api/` et `chmod 644 api/*.php`

### Erreur : "Database connection failed"
- ✅ Vérifiez `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME` dans `config.php`
- ✅ Vérifiez que MySQL est démarré
- ✅ Vérifiez que la base `quiz_app` existe

### Erreur : "CORS policy"
- ✅ Vérifiez que les headers CORS sont dans `config.php`
- ✅ Vérifiez que `.htaccess` est uploadé dans `api/`

### Erreur : "404 Not Found" sur les endpoints
- ✅ Vérifiez l'URL : doit être `https://domaine.com/api/quizzes.php` (pas `/api/api/quizzes.php`)
- ✅ Vérifiez que tous les fichiers PHP sont uploadés

---

## 📋 CHECKLIST DE DÉPLOIEMENT

- [ ] Base de données MySQL créée
- [ ] Schéma SQL importé (`mysql-schema.sql`)
- [ ] Dossier `api/` uploadé sur le serveur
- [ ] `api/config.php` configuré avec les bons identifiants
- [ ] `.htaccess` uploadé dans `api/`
- [ ] Test de connexion réussi : `test-connection.php`
- [ ] Variable d'environnement `VITE_API_URL` configurée (si serveur séparé)
- [ ] App React redéployée
- [ ] Test de création de quiz depuis l'app

---

## 🎯 SERVICES GRATUITS RECOMMANDÉS

### Pour l'API PHP (si Vercel/Netlify) :

1. **000webhost.com**
   - Gratuit
   - PHP + MySQL
   - cPanel
   - URL : `https://votre-site.000webhostapp.com/api`

2. **InfinityFree.net**
   - Gratuit
   - PHP + MySQL
   - Pas de publicité
   - URL : `https://votre-site.infinityfreeapp.com/api`

3. **Heroku** (avec buildpack PHP)
   - Gratuit (limité)
   - Plus complexe à configurer

---

## 📞 BESOIN D'AIDE ?

1. Vérifiez les logs d'erreur PHP : `error_log` dans votre hébergement
2. Testez chaque endpoint individuellement
3. Vérifiez la console du navigateur (F12)
4. Vérifiez que tous les fichiers sont uploadés

---

**✅ Une fois déployé, votre app fonctionnera à 100% !**

