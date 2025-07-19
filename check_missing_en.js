const fs = require('fs');

// Lire le fichier CalendarScreenAI.js
const calendarFile = fs.readFileSync('src/screens/CalendarScreenAI.js', 'utf8');

// Extraire toutes les clés utilisées avec t('...')
const keyRegex = /t\('([^']+)'\)/g;
const usedKeys = new Set();
let match;
while ((match = keyRegex.exec(calendarFile)) !== null) {
  usedKeys.add(match[1]);
}

// Lire le fichier translations.js
const translationsFile = fs.readFileSync('src/i18n/translations.js', 'utf8');

// Extraire la section anglaise
const enSectionRegex = /en:\s*{([\s\S]*?)}\s*,\s*es:/m;
const enMatch = translationsFile.match(enSectionRegex);

if (enMatch) {
  const enSection = enMatch[1];
  const existingKeys = new Set();
  
  // Extraire les clés existantes
  const keyValueRegex = /(\w+):\s*'[^']*'/g;
  while ((match = keyValueRegex.exec(enSection)) !== null) {
    existingKeys.add(match[1]);
  }
  
  // Trouver les clés manquantes
  const missingKeys = [];
  for (const key of usedKeys) {
    if (!existingKeys.has(key)) {
      missingKeys.push(key);
    }
  }
  
  console.log('=== VÉRIFICATION CLÉS ANGLAISES ===');
  console.log(`Total clés utilisées: ${usedKeys.size}`);
  console.log(`Total clés existantes en anglais: ${existingKeys.size}`);
  console.log(`Clés manquantes: ${missingKeys.length}\n`);
  
  if (missingKeys.length > 0) {
    console.log('Clés manquantes en anglais:');
    missingKeys.forEach(key => {
      console.log(`- ${key}`);
    });
    
    console.log('\n=== TRADUCTIONS À AJOUTER ===');
    missingKeys.forEach(key => {
      console.log(`${key}: '${key}', // TODO: translate`);
    });
  } else {
    console.log('✅ Toutes les clés sont traduites en anglais !');
  }
  
} else {
  console.log('❌ Section anglaise non trouvée dans translations.js');
} 