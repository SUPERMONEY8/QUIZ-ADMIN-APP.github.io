# Guide de Migration vers MySQL/phpMyAdmin

## 📋 Prérequis

1. **XAMPP, WAMP, ou MAMP** installé (pour MySQL et Apache)
2. **phpMyAdmin** accessible (généralement sur `http://localhost/phpmyadmin`)
3. **PHP 7.4+** activé dans votre serveur web

## 🚀 Étapes de Migration

### Étape 1 : Créer la Base de Données

1. Ouvrez **phpMyAdmin** dans votre navigateur (`http://localhost/phpmyadmin`)
2. Cliquez sur l'onglet **SQL**
3. Copiez-collez le contenu du fichier `mysql-schema.sql`
4. Cliquez sur **Exécuter** (Go)
5. Vérifiez que les tables sont créées : `quizzes`, `questions`, `results`, `participants`

### Étape 2 : Configurer l'API PHP

1. Copiez le dossier `api/` dans votre serveur web :
   - **XAMPP** : `C:\xampp\htdocs\quiz-app-api\`
   - **WAMP** : `C:\wamp64\www\quiz-app-api\`
   - **MAMP** : `/Applications/MAMP/htdocs/quiz-app-api/`

2. Modifiez `api/config.php` avec vos identifiants MySQL :
   ```php
   define('DB_HOST', 'localhost');
   define('DB_USER', 'root'); // Votre nom d'utilisateur MySQL
   define('DB_PASS', ''); // Votre mot de passe MySQL
   define('DB_NAME', 'quiz_app'); // Nom de votre base de données
   ```

### Étape 3 : Tester l'API

1. Démarrez Apache dans XAMPP/WAMP/MAMP
2. Testez l'API dans votre navigateur :
   - `http://localhost/quiz-app-api/api/quizzes.php`
   - Vous devriez voir `[]` (tableau vide) si tout fonctionne

### Étape 4 : Configurer React pour utiliser MySQL

1. Créez un fichier `.env` à la racine du projet React :
   ```
   VITE_API_URL=http://localhost/quiz-app-api/api
   ```

2. Installez les dépendances si nécessaire :
   ```bash
   npm install
   ```

3. Le code React utilisera maintenant l'API PHP au lieu de Firebase/Supabase

## 📁 Structure des Fichiers

```
quiz-app/
├── api/
│   ├── config.php          # Configuration MySQL
│   ├── quizzes.php         # API pour les quiz
│   ├── questions.php       # API pour les questions
│   └── results.php         # API pour les résultats
├── mysql-schema.sql        # Schéma de base de données
└── src/
    └── utils/
        └── mysqlHelpers.js # Helpers pour appeler l'API PHP
```

## 🔧 Configuration CORS

L'API PHP est configurée pour accepter les requêtes depuis React. Si vous avez des problèmes CORS :

1. Vérifiez que `Access-Control-Allow-Origin: *` est présent dans `config.php`
2. Assurez-vous que React s'exécute sur le même domaine ou configurez CORS correctement

## 🧪 Test de l'API

### Tester avec cURL :

```bash
# Créer un quiz
curl -X POST http://localhost/quiz-app-api/api/quizzes.php \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Quiz","admin_id":"admin-1"}'

# Récupérer tous les quiz
curl http://localhost/quiz-app-api/api/quizzes.php?admin_id=admin-1
```

### Tester avec Postman :

1. Créez une requête GET : `http://localhost/quiz-app-api/api/quizzes.php`
2. Vous devriez recevoir un tableau JSON vide `[]`

## ⚠️ Notes Importantes

1. **Sécurité** : En production, changez `Access-Control-Allow-Origin: *` pour votre domaine spécifique
2. **Mot de passe** : Ne laissez jamais un mot de passe vide en production
3. **Backup** : Faites régulièrement des sauvegardes de votre base de données MySQL

## 🔄 Migration des Données Existantes

Si vous avez des données dans Firebase/Supabase :

1. Exportez vos données depuis Firebase/Supabase
2. Convertissez-les au format MySQL
3. Importez-les dans phpMyAdmin via l'onglet **Importer**

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs Apache/PHP
2. Vérifiez la connexion MySQL dans `config.php`
3. Assurez-vous que toutes les tables sont créées

