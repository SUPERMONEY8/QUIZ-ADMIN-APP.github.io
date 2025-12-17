# Instructions pour Basculer vers MySQL

## 🔄 Changement Rapide

Pour basculer tous les fichiers vers MySQL en une seule fois, exécutez cette commande dans PowerShell (à la racine du projet) :

```powershell
# Remplacer tous les imports firebaseHelpers par databaseConfig
Get-ChildItem -Path src -Recurse -Filter *.js,*.jsx,*.ts,*.tsx | ForEach-Object {
    (Get-Content $_.FullName) -replace "from ['\"]\.\.?\/utils\/firebaseHelpers['\"]", "from '../utils/databaseConfig'" -replace "from ['\"]\.\.?\/utils\/firebaseHelpers\.js['\"]", "from '../utils/databaseConfig'" | Set-Content $_.FullName
}
```

## 📝 Changement Manuel

Si vous préférez changer manuellement, remplacez dans tous les fichiers :

**AVANT :**
```javascript
import { quizOperations, questionOperations, resultOperations } from '../utils/firebaseHelpers';
```

**APRÈS :**
```javascript
import { quizOperations, questionOperations, resultOperations } from '../utils/databaseConfig';
```

## ⚙️ Configuration

Dans `src/utils/databaseConfig.js`, changez :
```javascript
export const USE_MYSQL = true; // true pour MySQL, false pour Firebase
```

## 📋 Fichiers à Modifier

Les fichiers suivants doivent être mis à jour :
- src/components/ParticipantManagement.jsx
- src/components/AnalyticsOverview.jsx
- src/components/QuizList.jsx
- src/components/EditQuestionFormShortAnswer.jsx
- src/components/EditQuestionFormTrueFalse.jsx
- src/components/EditQuestionForm.jsx
- src/components/CreateQuizForm.jsx
- src/pages/TakeQuizPage.jsx
- src/components/QuestionForm.jsx
- src/components/QuestionFormShortAnswer.jsx
- src/components/QuestionFormTrueFalse.jsx
- src/pages/QuizQuestionsPage.jsx
- src/components/QuestionList.jsx
- src/pages/EditQuestionPage.jsx
- src/utils/quizActions.js
- src/utils/saveResults.js
- src/components/PublishQuiz.jsx

## ✅ Vérification

Après le changement, vérifiez que :
1. L'API PHP fonctionne (`http://localhost/quiz-app-api/api/quizzes.php`)
2. La base de données MySQL est créée
3. Le fichier `.env` contient `VITE_API_URL=http://localhost/quiz-app-api/api`

