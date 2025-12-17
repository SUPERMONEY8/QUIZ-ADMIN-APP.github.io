# 🚀 Démarrage Rapide - Tout est Configuré !

## ✅ Ce qui a été fait automatiquement :

1. ✅ **`api/config.php`** - Configuré avec `root` et mot de passe vide
2. ✅ **`.env`** - Créé avec l'URL de l'API : `http://localhost/quiz-app-api/api`
3. ✅ **Base de données** - Schéma MySQL prêt (`mysql-schema.sql`)
4. ✅ **API PHP** - Tous les endpoints sont prêts

---

## 🎯 3 Étapes pour Démarrer :

### Étape 1 : Copier l'API dans votre serveur web

**XAMPP :**
```bash
# Copiez le dossier api/ dans :
C:\xampp\htdocs\quiz-app-api\api\
```

**WAMP :**
```bash
# Copiez le dossier api/ dans :
C:\wamp64\www\quiz-app-api\api\
```

**Hébergement web :**
```bash
# Uploadez le dossier api/ via FTP dans :
public_html/api/  ou  www/api/
```

---

### Étape 2 : Tester la connexion

Ouvrez dans votre navigateur :
```
http://localhost/quiz-app-api/api/test-connection.php
```

✅ **Si vous voyez "Connexion réussie"** → Tout fonctionne !

❌ **Si vous voyez une erreur** :
- Vérifiez que MySQL est démarré (XAMPP/WAMP)
- Vérifiez que la base `quiz_app` existe dans phpMyAdmin
- Vérifiez que toutes les tables sont créées

---

### Étape 3 : Démarrer l'application React

```bash
npm run dev
```

L'application va :
1. Se connecter automatiquement à l'API MySQL
2. Créer un ID utilisateur unique au premier chargement
3. Vous permettre de créer vos quiz !

---

## 📝 Configuration Actuelle :

- **API URL** : `http://localhost/quiz-app-api/api`
- **MySQL User** : `root`
- **MySQL Password** : (vide)
- **Database** : `quiz_app`

---

## 🔧 Si vous devez changer l'URL de l'API :

Modifiez le fichier `.env` :
```env
VITE_API_URL=http://votre-nouvelle-url/api
```

Ou modifiez directement dans `src/utils/mysqlHelpers.js` (ligne 4).

---

## ✅ C'est tout ! Vous êtes prêt !

1. Copiez `api/` dans votre serveur web
2. Testez avec `test-connection.php`
3. Lancez `npm run dev`
4. Créez votre premier quiz !

---

## 🆘 Besoin d'aide ?

Si `test-connection.php` ne fonctionne pas :
1. Vérifiez que MySQL est démarré
2. Vérifiez que la base `quiz_app` existe
3. Vérifiez les identifiants dans `api/config.php`

