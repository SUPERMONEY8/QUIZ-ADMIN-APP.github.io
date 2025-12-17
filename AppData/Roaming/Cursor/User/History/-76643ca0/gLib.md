# 🌐 Configuration API pour Production

## ⚠️ IMPORTANT : Déployer l'API PHP sur votre serveur

Votre application React est déployée en ligne, mais l'API PHP doit aussi être déployée sur le même serveur ou un serveur accessible.

---

## 📋 Options de Déploiement de l'API

### Option 1 : Même serveur que l'app React (Recommandé)

1. **Uploadez le dossier `api/` sur votre serveur web**
   - Via FTP/SFTP dans votre hébergement
   - Placez-le dans : `public_html/api/` ou `www/api/`

2. **Configurez `api/config.php` avec vos identifiants MySQL de production**
   ```php
   define('DB_HOST', 'localhost'); // Ou l'adresse fournie par l'hébergeur
   define('DB_USER', 'votre_utilisateur_mysql');
   define('DB_PASS', 'votre_mot_de_passe_mysql');
   define('DB_NAME', 'quiz_app');
   ```

3. **L'URL de l'API sera automatiquement** : `https://votre-domaine.com/api`

### Option 2 : Serveur séparé

1. **Déployez l'API sur un serveur PHP séparé**
2. **Configurez la variable d'environnement** dans Vercel/Netlify :
   ```
   VITE_API_URL=https://api.votre-domaine.com/api
   ```

---

## 🔧 Configuration Automatique

L'application détecte automatiquement si elle est en production ou en développement :

- **Production** : Utilise `https://votre-domaine.com/api`
- **Développement** : Utilise `http://localhost/quiz-app-api/api`

---

## ✅ Vérification

1. **Vérifiez que l'API est accessible** :
   ```
   https://votre-domaine.com/api/test-connection.php
   ```

2. **Vérifiez la console du navigateur** :
   - Plus d'erreurs CSP
   - Requêtes vers l'API réussies

3. **Testez la création d'un quiz** :
   - Le quiz devrait être sauvegardé dans MySQL

---

## 🆘 Si l'API n'est pas accessible

1. **Vérifiez que PHP est activé** sur votre serveur
2. **Vérifiez les permissions** du dossier `api/`
3. **Vérifiez la configuration MySQL** dans `api/config.php`
4. **Vérifiez les logs d'erreur** du serveur

---

## 📝 Prochaines Étapes

1. ✅ Code mis à jour pour détecter automatiquement l'environnement
2. 🔄 Déployez l'API PHP sur votre serveur
3. 🔄 Configurez `api/config.php` avec vos identifiants MySQL
4. 🔄 Testez la création d'un quiz

