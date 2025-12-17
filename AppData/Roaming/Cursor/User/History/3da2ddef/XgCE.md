# 🚀 CORRECTION RAPIDE - Déploiement API Node.js

## ✅ CE QUI A ÉTÉ FAIT

1. ✅ **API Node.js créée** dans `api-node/` avec routes pour :
   - `/api/users` - Gestion des utilisateurs
   - `/api/quizzes` - Gestion des quiz
   - `/api/questions` - Gestion des questions
   - `/api/results` - Gestion des résultats

2. ✅ **Helpers frontend mis à jour** :
   - `postgresHelpers.js` - Utilise l'API Node.js
   - `databaseConfig.js` - Configuré pour PostgreSQL
   - `userManager.js` - Utilise l'API Node.js

3. ✅ **Vercel configuré** :
   - `vercel.json` à la racine
   - Routes configurées pour `/api/*` → `api-node/index.js`

---

## 🎯 PROCHAINES ÉTAPES (5 MINUTES)

### 1. Importer le schéma SQL dans Neon (2 min)
1. Allez sur https://console.neon.tech
2. Ouvrez votre projet
3. Cliquez sur **"SQL Editor"**
4. Créez un nouveau fichier `postgres-schema.sql` avec ce contenu :

```sql
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255),
  name VARCHAR(255),
  app_name VARCHAR(255),
  color_palette VARCHAR(50),
  selected_icon VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  duration_minutes INTEGER DEFAULT 30,
  difficulty VARCHAR(50) DEFAULT 'medium',
  randomize_questions BOOLEAN DEFAULT FALSE,
  randomize_answers BOOLEAN DEFAULT FALSE,
  status VARCHAR(50) DEFAULT 'draft',
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP,
  share_code VARCHAR(50),
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  admin_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY,
  quiz_id INTEGER NOT NULL,
  question_text TEXT NOT NULL,
  question_type VARCHAR(50) NOT NULL,
  options JSONB,
  correct_answer TEXT,
  points INTEGER DEFAULT 1,
  question_order INTEGER DEFAULT 0,
  image_url TEXT,
  video_url TEXT,
  status VARCHAR(50) DEFAULT 'published',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

-- Results table
CREATE TABLE IF NOT EXISTS results (
  id SERIAL PRIMARY KEY,
  quiz_id INTEGER NOT NULL,
  participant_name VARCHAR(255),
  participant_email VARCHAR(255),
  score DECIMAL(10,2) DEFAULT 0,
  total_questions INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  answers JSONB,
  time_taken_seconds INTEGER DEFAULT 0,
  submitted_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

-- Participants table (optional, for tracking)
CREATE TABLE IF NOT EXISTS participants (
  id SERIAL PRIMARY KEY,
  quiz_id INTEGER NOT NULL,
  name VARCHAR(255),
  email VARCHAR(255),
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_quizzes_admin_id ON quizzes(admin_id);
CREATE INDEX IF NOT EXISTS idx_questions_quiz_id ON questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_results_quiz_id ON results(quiz_id);
CREATE INDEX IF NOT EXISTS idx_participants_quiz_id ON participants(quiz_id);
```

5. **Copiez-collez** tout le SQL dans l'éditeur
6. Cliquez **"Run"** (ou F5)
7. ✅ Vérifiez dans "Tables" que les tables sont créées

---

### 2. Ajouter DATABASE_URL dans Vercel (1 min)
1. Allez sur https://vercel.com → votre projet
2. **Settings** → **Environment Variables**
3. Cliquez **"Add New"**
4. Remplissez :
   - **Name :** `DATABASE_URL`
   - **Value :** Collez votre Connection String de Neon
   - **Environments :** ✅ Production, ✅ Preview, ✅ Development
5. Cliquez **"Save"**

---

### 3. Redéployer sur Vercel (1 min)
1. Dans Vercel, allez dans **"Deployments"**
2. Trouvez le dernier déploiement
3. Cliquez sur les **3 points** (⋯) → **"Redeploy"**
4. Confirmez
5. ⏳ Attendez 1-2 minutes

---

### 4. Tester (1 min)
1. Ouvrez : `https://votre-app.vercel.app/api/test-connection`
2. Vous devriez voir :
   ```json
   {
     "status": "success",
     "message": "Connexion réussie",
     "tables": ["users", "quizzes", "questions", "results", "participants"]
   }
   ```
3. ✅ Si c'est bon, **créez un quiz** dans l'app !

---

## 🆘 SI ÇA NE MARCHE PAS

### Erreur 405 (Method Not Allowed)
- ✅ Vérifiez que `vercel.json` est bien à la racine
- ✅ Vérifiez que `api-node/` est bien dans votre repo
- ✅ Redéployez sur Vercel

### Erreur "Database connection failed"
- ✅ Vérifiez que `DATABASE_URL` est bien dans Vercel Environment Variables
- ✅ Vérifiez que la Connection String est complète (commence par `postgresql://`)
- ✅ Redéployez après avoir ajouté la variable

### Erreur "Tables not found"
- ✅ Vérifiez que vous avez bien importé le schéma SQL dans Neon
- ✅ Vérifiez dans Neon → Tables que les tables existent

---

## ✅ CHECKLIST

- [ ] Schéma SQL importé dans Neon
- [ ] Tables créées (users, quizzes, questions, results, participants)
- [ ] `DATABASE_URL` ajouté dans Vercel
- [ ] App redéployée sur Vercel
- [ ] Test de connexion réussi (`/api/test-connection`)
- [ ] Création de quiz fonctionne

---

**C'est tout ! Votre app devrait maintenant fonctionner avec Neon PostgreSQL ! 🎉**


