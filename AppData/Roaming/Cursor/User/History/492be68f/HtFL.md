# 📡 API PHP - Quiz App

API REST pour l'application Quiz App avec MySQL.

## 📁 Structure

```
api/
├── config.php              # Configuration MySQL et CORS
├── users.php              # Gestion des utilisateurs
├── quizzes.php            # Gestion des quiz
├── questions.php          # Gestion des questions
├── results.php            # Gestion des résultats
├── test-connection.php    # Test de connexion MySQL
├── error.php              # Gestion des erreurs 404
└── .htaccess              # Configuration Apache
```

## 🚀 Déploiement Rapide

### 1. Créer la base de données MySQL

```sql
CREATE DATABASE quiz_app;
-- Puis importer mysql-schema.sql
```

### 2. Configurer `config.php`

```php
define('DB_HOST', 'localhost');
define('DB_USER', 'votre_utilisateur');
define('DB_PASS', 'votre_mot_de_passe');
define('DB_NAME', 'quiz_app');
```

### 3. Uploader sur le serveur

- Via FTP : `public_html/api/`
- Via cPanel : Glisser-déposer le dossier `api/`

### 4. Tester

```
https://votre-domaine.com/api/test-connection.php
```

## 📋 Endpoints

### Users
- `GET /api/users.php/{id}` - Obtenir un utilisateur
- `POST /api/users.php` - Créer un utilisateur

### Quizzes
- `GET /api/quizzes.php?admin_id={id}` - Liste des quiz
- `GET /api/quizzes.php/{id}?admin_id={id}` - Obtenir un quiz
- `POST /api/quizzes.php` - Créer un quiz
- `PUT /api/quizzes.php/{id}` - Modifier un quiz
- `DELETE /api/quizzes.php/{id}?admin_id={id}` - Supprimer un quiz

### Questions
- `GET /api/questions.php?quiz_id={id}&admin_id={id}` - Liste des questions
- `POST /api/questions.php` - Créer une question
- `PUT /api/questions.php/{id}` - Modifier une question
- `DELETE /api/questions.php/{id}?admin_id={id}` - Supprimer une question

### Results
- `GET /api/results.php?quiz_id={id}&admin_id={id}` - Liste des résultats
- `POST /api/results.php` - Créer un résultat

## 🔒 Sécurité

- ✅ CORS configuré
- ✅ Validation des données
- ✅ Isolation multi-tenant (admin_id)
- ✅ Protection SQL injection (prepared statements)

## 🆘 Dépannage

Voir `DEPLOY_API_NOW.md` pour le guide complet de déploiement.

