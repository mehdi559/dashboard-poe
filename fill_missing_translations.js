const fs = require('fs');
const path = require('path');

const frFile = path.join(__dirname, 'src/i18n/translations_fr.js');
const enFile = path.join(__dirname, 'src/i18n/translations_en.js');
const esFile = path.join(__dirname, 'src/i18n/translations_es.js');

function loadLang(file) {
  const content = fs.readFileSync(file, 'utf8');
  const js = content.replace(/export default (\w+);/, 'module.exports = $1;');
  const tempFile = file + '.tmp';
  fs.writeFileSync(tempFile, js);
  const langObj = require(tempFile);
  fs.unlinkSync(tempFile);
  return langObj;
}

function saveLang(file, obj, varName) {
  const content = `const ${varName} = ${JSON.stringify(obj, null, 2)};\n\nexport default ${varName};\n`;
  fs.writeFileSync(file, content, 'utf8');
}

const fr = loadLang(frFile);
const en = loadLang(enFile);
const es = loadLang(esFile);

let addedEn = 0, addedEs = 0;
for (const key in fr) {
  if (!(key in en)) {
    en[key] = fr[key];
    addedEn++;
  }
  if (!(key in es)) {
    es[key] = fr[key];
    addedEs++;
  }
}

saveLang(enFile, en, 'en');
saveLang(esFile, es, 'es');

console.log(`Ajouté ${addedEn} clés manquantes en anglais, ${addedEs} en espagnol.`);
console.log('N\'oublie pas de traduire les valeurs copiées !'); 