const fs = require('fs');
const path = require('path');

const files = [
  { code: 'fr', file: path.join(__dirname, 'src/i18n/translations_fr.js') },
  { code: 'en', file: path.join(__dirname, 'src/i18n/translations_en.js') },
  { code: 'es', file: path.join(__dirname, 'src/i18n/translations_es.js') },
];

function extractKeys(obj) {
  const keys = [];
  function recurse(o, prefix = '') {
    for (const k in o) {
      if (typeof o[k] === 'object' && o[k] !== null) {
        recurse(o[k], prefix ? `${prefix}.${k}` : k);
      } else {
        keys.push(prefix ? `${prefix}.${k}` : k);
      }
    }
  }
  recurse(obj);
  return keys;
}

function loadLang(file) {
  const content = fs.readFileSync(file, 'utf8');
  const js = content.replace(/export default (\w+);/, 'module.exports = $1;');
  const tempFile = file + '.tmp';
  fs.writeFileSync(tempFile, js);
  const langObj = require(tempFile);
  fs.unlinkSync(tempFile);
  return langObj;
}

const langs = {};
const allKeys = new Set();

for (const { code, file } of files) {
  const obj = loadLang(file);
  langs[code] = extractKeys(obj);
  langs[code].forEach(k => allKeys.add(k));
}

console.log('--- Résumé des clés de traduction ---');
for (const { code } of files) {
  const missing = [...allKeys].filter(k => !langs[code].includes(k));
  const extra = langs[code].filter(k => !allKeys.has(k));
  console.log(`\nLangue: ${code}`);
  console.log(`  Clés manquantes (${missing.length}):`, missing);
  if (extra.length) console.log(`  Clés en trop (${extra.length}):`, extra);
  else console.log('  Pas de clés en trop.');
}

// Afficher les clés qui existent en anglais mais manquent en français et espagnol
const enKeys = new Set(langs['en']);
const frMissingFromEn = [...enKeys].filter(k => !langs['fr'].includes(k));
const esMissingFromEn = [...enKeys].filter(k => !langs['es'].includes(k));

console.log('\n--- Clés présentes en anglais mais manquantes en français ---');
console.log(frMissingFromEn);
console.log('\n--- Clés présentes en anglais mais manquantes en espagnol ---');
console.log(esMissingFromEn); 