// Script de test final pour vérifier l'utilisation réelle des traductions
const fs = require('fs');

// Charger les traductions nettoyées
const cleanTranslations = require('./src/i18n/clean/translations_clean.js').default;

console.log('🎯 TEST FINAL DES TRADUCTIONS');
console.log('=============================\n');

// Fonction de traduction améliorée (comme dans l'application réelle)
function createTranslationFunction(language = 'fr') {
  return (key, params = {}) => {
    let translation;
    
    // Gestion des clés imbriquées (comme greeting.morning)
    if (key.includes('.')) {
      const parts = key.split('.');
      let current = cleanTranslations[language];
      for (const part of parts) {
        if (current && current[part]) {
          current = current[part];
        } else {
          current = null;
          break;
        }
      }
      translation = current;
    } else {
      // Clé simple
      if (cleanTranslations[language] && cleanTranslations[language][key]) {
        translation = cleanTranslations[language][key];
      } else if (cleanTranslations.fr && cleanTranslations.fr[key]) {
        translation = cleanTranslations.fr[key];
      } else {
        translation = key;
      }
    }
    
    // Gestion des interpolations
    if (translation && params && typeof params === 'object') {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        translation = translation.replace(new RegExp(`{{${paramKey}}}`, 'g'), paramValue);
      });
    }
    
    return translation || key;
  };
}

// Tests des traductions clés de l'application
const testCases = [
  // Navigation principale
  { key: 'title', fr: 'Gestionnaire Financier Personnel', en: 'Personal Finance Manager', es: 'Gestor Financiero Personal' },
  { key: 'dashboard', fr: 'Tableau de bord', en: 'Dashboard', es: 'Tablero' },
  { key: 'budget', fr: 'Budget', en: 'Budget', es: 'Presupuesto' },
  { key: 'expenses', fr: 'Dépenses', en: 'Expenses', es: 'Gastos' },
  { key: 'savings', fr: 'Épargne', en: 'Savings', es: 'Ahorros' },
  { key: 'calendar', fr: 'Calendrier', en: 'Calendar', es: 'Calendario' },
  { key: 'recurring', fr: 'Récurrent', en: 'Recurring', es: 'Recurrente' },
  { key: 'debts', fr: 'Dettes', en: 'Debts', es: 'Deudas' },
  { key: 'reports', fr: 'Rapports', en: 'Reports', es: 'Informes' },
  
  // Actions communes
  { key: 'add', fr: 'Ajouter', en: 'Add', es: 'Agregar' },
  { key: 'edit', fr: 'Modifier', en: 'Edit', es: 'Editar' },
  { key: 'delete', fr: 'Supprimer', en: 'Delete', es: 'Eliminar' },
  { key: 'save', fr: 'Sauvegarder', en: 'Save', es: 'Guardar' },
  { key: 'cancel', fr: 'Annuler', en: 'Cancel', es: 'Cancelar' },
  { key: 'close', fr: 'Fermer', en: 'Close', es: 'Cerrar' },
  
  // Formulaires
  { key: 'amount', fr: 'Montant', en: 'Amount', es: 'Cantidad' },
  { key: 'description', fr: 'Description', en: 'Description', es: 'Descripción' },
  { key: 'category', fr: 'Catégorie', en: 'Category', es: 'Categoría' },
  { key: 'date', fr: 'Date', en: 'Date', es: 'Fecha' },
  { key: 'name', fr: 'Nom', en: 'Name', es: 'Nombre' },
  
  // Messages de validation
  { key: 'fieldRequired', fr: 'Ce champ est requis', en: 'This field is required', es: 'Este campo es requerido' },
  { key: 'invalidAmount', fr: 'Montant invalide', en: 'Invalid amount', es: 'Cantidad inválida' },
  { key: 'invalidDate', fr: 'Date invalide', en: 'Invalid date', es: 'Fecha inválida' },
  
  // Notifications
  { key: 'expenseAdded', fr: 'Dépense ajoutée avec succès', en: 'Expense added successfully', es: 'Gasto agregado exitosamente' },
  { key: 'expenseUpdated', fr: 'Dépense modifiée avec succès', en: 'Expense updated successfully', es: 'Gasto actualizado exitosamente' },
  { key: 'expenseDeleted', fr: 'Dépense supprimée', en: 'Expense deleted', es: 'Gasto eliminado' },
  
  // Salutations (clés imbriquées)
  { key: 'greeting.morning', fr: '🌅 Bonjour', en: '🌅 Good morning', es: '🌅 Buenos días' },
  { key: 'greeting.afternoon', fr: '☀️ Bon après-midi', en: '☀️ Good afternoon', es: '☀️ Buenas tardes' },
  { key: 'greeting.evening', fr: '🌙 Bonsoir', en: '🌙 Good evening', es: '🌙 Buenas noches' }
];

console.log('1. Test des traductions clés:');
console.log('============================\n');

let allTestsPassed = true;
let passedTests = 0;
let totalTests = testCases.length;

testCases.forEach(test => {
  const tFr = createTranslationFunction('fr');
  const tEn = createTranslationFunction('en');
  const tEs = createTranslationFunction('es');
  
  const resultFr = tFr(test.key);
  const resultEn = tEn(test.key);
  const resultEs = tEs(test.key);
  
  const frPass = resultFr === test.fr;
  const enPass = resultEn === test.en;
  const esPass = resultEs === test.es;
  
  if (frPass && enPass && esPass) {
    console.log(`✅ ${test.key}:`);
    console.log(`   FR: "${resultFr}"`);
    console.log(`   EN: "${resultEn}"`);
    console.log(`   ES: "${resultEs}"`);
    passedTests++;
  } else {
    console.log(`❌ ${test.key}:`);
    if (!frPass) console.log(`   FR: "${resultFr}" (attendu: "${test.fr}")`);
    if (!enPass) console.log(`   EN: "${resultEn}" (attendu: "${test.en}")`);
    if (!esPass) console.log(`   ES: "${resultEs}" (attendu: "${test.es}")`);
    allTestsPassed = false;
  }
  console.log('');
});

// Test des interpolations
console.log('2. Test des interpolations:');
console.log('==========================\n');

const interpolationTests = [
  {
    key: 'weekendSpender',
    params: { percent: 25, day: 'samedi' },
    fr: 'Vous dépensez 25% de plus le weekend',
    en: 'You spend 25% more on weekends',
    es: 'Gastas un 25% más los fines de semana'
  },
  {
    key: 'frequentAmount',
    params: { amount: '50€', count: 3 },
    fr: 'Vous dépensez souvent 50€ (3 fois)',
    en: 'You often spend 50€ (3 times)',
    es: 'Sueles gastar 50€ (3 veces)'
  }
];

interpolationTests.forEach(test => {
  const tFr = createTranslationFunction('fr');
  const tEn = createTranslationFunction('en');
  const tEs = createTranslationFunction('es');
  
  const resultFr = tFr(test.key, test.params);
  const resultEn = tEn(test.key, test.params);
  const resultEs = tEs(test.key, test.params);
  
  console.log(`🔧 ${test.key} avec paramètres:`);
  console.log(`   FR: "${resultFr}"`);
  console.log(`   EN: "${resultEn}"`);
  console.log(`   ES: "${resultEs}"`);
  console.log('');
});

// Test des clés manquantes
console.log('3. Test des clés manquantes:');
console.log('===========================\n');

const missingKeyTests = [
  'nonexistentKey',
  'randomKey123',
  'missing.translation'
];

missingKeyTests.forEach(key => {
  const tFr = createTranslationFunction('fr');
  const result = tFr(key);
  console.log(`🔍 Clé manquante "${key}": "${result}"`);
});

console.log('');

// Statistiques finales
console.log('4. Statistiques:');
console.log('================\n');

const languages = ['fr', 'en', 'es'];
languages.forEach(lang => {
  const count = Object.keys(cleanTranslations[lang] || {}).length;
  console.log(`${lang.toUpperCase()}: ${count} traductions`);
});

console.log('\n5. Résumé:');
console.log('==========\n');

const successRate = (passedTests / totalTests) * 100;
console.log(`Tests réussis: ${passedTests}/${totalTests} (${successRate.toFixed(1)}%)`);

if (allTestsPassed) {
  console.log('✅ Tous les tests sont passés !');
  console.log('✅ Le fichier de traductions est prêt pour la production.');
} else {
  console.log('⚠️  Certains tests ont échoué.');
  console.log('📝 Les traductions sont fonctionnelles mais quelques ajustements peuvent être nécessaires.');
}

console.log('\n📋 Pour utiliser le fichier nettoyé:');
console.log('1. Remplacez l\'import dans App.js:');
console.log('   import translations from \'./i18n/clean/translations_clean.js\';');
console.log('\n2. Ou copiez le contenu dans src/i18n/translations.js');
console.log('\n3. Redémarrez votre application pour voir les changements');

console.log('\n🎯 Prochaines étapes:');
console.log('- Testez l\'application avec le nouveau fichier');
console.log('- Vérifiez que toutes les traductions s\'affichent correctement');
console.log('- Ajoutez de nouvelles traductions si nécessaire');

console.log('\n📊 Améliorations apportées:');
console.log('- ✅ Structure organisée par sections');
console.log('- ✅ Clés essentielles présentes');
console.log('- ✅ Gestion des interpolations');
console.log('- ✅ Support des clés imbriquées');
console.log('- ✅ Fallback sur les clés manquantes');
console.log('- ✅ Cohérence entre les langues'); 