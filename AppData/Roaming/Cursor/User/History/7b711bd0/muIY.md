# 📡 Quiz App API - Node.js + PostgreSQL (Neon)

API REST pour l'application Quiz App, déployée sur Vercel avec Neon PostgreSQL.

## 📁 Structure

```
api-node/
├── index.js           # Serveur Express principal
├── config.js          # Configuration PostgreSQL (Neon)
├── package.json       # Dépendances Node.js
├── routes/
│   ├── users.js       # Gestion des utilisateurs
│   ├── quizzes.js     # Gestion des quiz
│   ├── questions.js   # Gestion des questions
│   └── results.js      # Gestion des résultats
└── vercel.json        # Configuration Vercel
```

## 🚀 Déploiement

### Sur Vercel (Production)

1. **Configurer la variable d'environnement** dans Vercel :
   - `DATABASE_URL` = Connection string de Neon

2. **Vercel détecte automatiquement** l'API dans `api-node/`

3. **L'API sera accessible** sur : `https://votre-app.vercel.app/api`

### Local (Développement)

```bash
cd api-node
npm install
echo "DATABASE_URL=postgresql://..." > .env
npm run dev
```

L'API sera sur `http://localhost:3000`

## 📋 Endpoints

### Health Check
- `GET /api/health` - Vérifier l'état de l'API
- `GET /api/test-connection` - Tester la connexion PostgreSQL

### Users
- `GET /api/users/:id` - Obtenir un utilisateur
- `GET /api/users?email=xxx` - Obtenir par email
- `POST /api/users` - Créer un utilisateur
- `PUT /api/users/:id` - Modifier un utilisateur

### Quizzes
- `GET /api/quizzes?admin_id=xxx` - Liste des quiz
- `GET /api/quizzes/:id?admin_id=xxx` - Obtenir un quiz
- `POST /api/quizzes` - Créer un quiz
- `PUT /api/quizzes/:id` - Modifier un quiz
- `DELETE /api/quizzes/:id?admin_id=xxx` - Supprimer un quiz

### Questions
- `GET /api/questions?quiz_id=xxx&admin_id=xxx` - Liste des questions
- `GET /api/questions/:id?admin_id=xxx` - Obtenir une question
- `POST /api/questions` - Créer une question
- `PUT /api/questions/:id` - Modifier une question
- `DELETE /api/questions/:id?admin_id=xxx` - Supprimer une question

### Results
- `GET /api/results?quiz_id=xxx&admin_id=xxx` - Liste des résultats
- `GET /api/results/:id?admin_id=xxx` - Obtenir un résultat
- `POST /api/results` - Créer un résultat
- `PUT /api/results/:id` - Modifier un résultat
- `DELETE /api/results/:id?admin_id=xxx` - Supprimer un résultat

## 🔒 Sécurité

- ✅ CORS configuré
- ✅ Validation des données
- ✅ Isolation multi-tenant (admin_id requis)
- ✅ Protection SQL injection (prepared statements)
- ✅ Vérification de propriété pour toutes les opérations

## 📦 Dépendances

- `express` - Framework web
- `pg` - Client PostgreSQL
- `cors` - Gestion CORS
- `dotenv` - Variables d'environnement (dev)

## 🔧 Configuration

L'API utilise la variable d'environnement `DATABASE_URL` pour se connecter à Neon.

Format : `postgresql://user:password@host.neon.tech/dbname?sslmode=require`

## 📚 Documentation

Voir `NEON_DEPLOYMENT_GUIDE.md` pour le guide complet de déploiement.

