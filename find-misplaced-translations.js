const fs = require('fs');

// Mots anglais à détecter dans la section française
const englishWords = [
  'dashboard', 'report', 'settings', 'add', 'delete', 'update', 'save', 'edit', 'user', 'tools', 'insight', 'future', 'goal', 'budget', 'category', 'export', 'import', 'notification', 'planner', 'calendar', 'heatmap', 'trend', 'prediction', 'week', 'month', 'year', 'amount', 'description', 'success', 'error', 'warning', 'info', 'analysis', 'recommendation', 'distribution'
];

// Mots français à détecter dans la section anglaise
const frenchWords = [
  'ajouter', 'supprimer', 'modifier', 'utilisateur', 'dépense', 'catégorie', 'épargne', 'revenu', 'rapport', 'objectif', 'budget', 'paramètre', 'alerte', 'conseil', 'analyse', 'recommandation', 'distribution', 'mois', 'semaine', 'année', 'description', 'succès', 'erreur', 'avertissement', 'information'
];

const file = fs.readFileSync('src/i18n/translations.js', 'utf8');
const lines = file.split('\n');

let inFr = false;
let inEn = false;

console.log('--- Valeurs anglaises dans la section FR ---');
lines.forEach((line, idx) => {
  if (line.match(/^\s*fr\s*:/)) { inFr = true; inEn = false; }
  if (line.match(/^\s*en\s*:/)) { inFr = false; inEn = true; }
  if (line.match(/^\s*es\s*:/)) { inFr = false; inEn = false; }

  if (inFr) {
    englishWords.forEach(word => {
      if (line.match(new RegExp(`:.*\\b${word}\\b`, 'i'))) {
        console.log(`Ligne ${idx + 1}: ${line.trim()}`);
      }
    });
  }
});

console.log('\n--- Valeurs françaises dans la section EN ---');
lines.forEach((line, idx) => {
  if (line.match(/^\s*fr\s*:/)) { inFr = true; inEn = false; }
  if (line.match(/^\s*en\s*:/)) { inFr = false; inEn = true; }
  if (line.match(/^\s*es\s*:/)) { inFr = false; inEn = false; }

  if (inEn) {
    frenchWords.forEach(word => {
      if (line.match(new RegExp(`:.*\\b${word}\\b`, 'i'))) {
        console.log(`Ligne ${idx + 1}: ${line.trim()}`);
      }
    });
  }
}); 