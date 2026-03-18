# SODB Scheduler

App de scheduling de contenu pour SODB / PARI$ KILLA.

## Variables d'environnement (à configurer sur Vercel)

| Variable | Description |
|---|---|
| `LATE_API_KEY` | Clé API Late (getlate.dev) |
| `ANTHROPIC_API_KEY` | Clé API Anthropic (console.anthropic.com) |
| `APP_PASSWORD` | Mot de passe d'accès à l'app (choisis-en un) |

## Structure

\`\`\`
sodb-scheduler/
├── public/
│   └── index.html        ← Frontend
├── api/
│   ├── auth.js           ← Vérification mot de passe
│   ├── upload.js         ← Upload média → Late API
│   ├── post.js           ← Création post → Late API
│   └── caption.js        ← Génération caption → Anthropic
├── vercel.json           ← Config Vercel
├── .gitignore            ← Protège les fichiers sensibles
└── .env.example          ← Exemple de variables (ne pas modifier)
\`\`\`
