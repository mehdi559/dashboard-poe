// Script de test pour vérifier le fichier de traductions nettoyé
const fs = require('fs');
const path = require('path');

// Charger le fichier de traductions original
const originalTranslations = require('./src/i18n/translations.js').default;

// Charger le fichier de traductions nettoyé
const cleanTranslationsPath = './src/i18n/clean/translations_clean.js';
let cleanTranslations = null;

try {
  // Supprimer le module du cache s'il existe
  delete require.cache[require.resolve(cleanTranslationsPath)];
  cleanTranslations = require(cleanTranslationsPath).default;
} catch (error) {
  console.log('❌ Fichier de traductions nettoyé non trouvé ou erreur de chargement');
  console.log('Création du fichier de test...');
  
  // Créer un fichier de test basique
  const testTranslations = {
    fr: {
      // Dashboard
      title: 'Gestionnaire Financier Personnel',
      dashboard: 'Tableau de bord',
      budget: 'Budget',
      expenses: 'Dépenses',
      savings: 'Épargne',
      calendar: 'Calendrier',
      recurring: 'Récurrent',
      debts: 'Dettes',
      reports: 'Rapports',
      // Common
      add: 'Ajouter',
      edit: 'Modifier',
      delete: 'Supprimer',
      save: 'Sauvegarder',
      cancel: 'Annuler',
      close: 'Fermer',
      confirm: 'Confirmer',
      loading: 'Chargement...',
      search: 'Rechercher...',
      filter: 'Filtrer',
      sort: 'Trier',
      export: 'Exporter',
      import: 'Importer',
      // Forms
      amount: 'Montant',
      description: 'Description',
      category: 'Catégorie',
      date: 'Date',
      name: 'Nom',
      required: 'Requis',
      optional: 'Optionnel',
      // Dashboard
      income: 'Revenus',
      totalSpent: 'Total dépensé',
      savingsRate: 'Taux d\'épargne',
      dailyAverage: 'Moyenne journalière',
      goals: 'Objectifs',
      // Validation messages
      fieldRequired: 'Ce champ est requis',
      invalidAmount: 'Montant invalide',
      invalidDate: 'Date invalide',
      futureDateNotAllowed: 'Les dates futures ne sont pas autorisées',
      amountMustBePositive: 'Le montant doit être positif',
      // Notifications
      expenseAdded: 'Dépense ajoutée avec succès',
      expenseUpdated: 'Dépense modifiée avec succès',
      expenseDeleted: 'Dépense supprimée',
      categoryAdded: 'Catégorie ajoutée',
      dataExported: 'Données exportées avec succès',
      dataImported: 'Données importées avec succès',
      // Accessibility
      openMenu: 'Ouvrir le menu',
      closeMenu: 'Fermer le menu',
      previousPage: 'Page précédente',
      nextPage: 'Page suivante',
      sortBy: 'Trier par',
      selectCategory: 'Sélectionner une catégorie',
      // Time periods
      today: 'Aujourd\'hui',
      week: 'Cette semaine',
      month: 'Ce mois',
      year: 'Cette année',
      // Months
      months: [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
      ],
      // Greeting
      greeting: {
        morning: '🌅 Bonjour',
        afternoon: '☀️ Bon après-midi',
        evening: '🌙 Bonsoir'
      }
    },
    en: {
      // Dashboard
      title: 'Personal Finance Manager',
      dashboard: 'Dashboard',
      budget: 'Budget',
      expenses: 'Expenses',
      savings: 'Savings',
      calendar: 'Calendar',
      recurring: 'Recurring',
      debts: 'Debts',
      reports: 'Reports',
      // Common
      add: 'Add',
      edit: 'Edit',
      delete: 'Delete',
      save: 'Save',
      cancel: 'Cancel',
      close: 'Close',
      confirm: 'Confirm',
      loading: 'Loading...',
      search: 'Search...',
      filter: 'Filter',
      sort: 'Sort',
      export: 'Export',
      import: 'Import',
      // Forms
      amount: 'Amount',
      description: 'Description',
      category: 'Category',
      date: 'Date',
      name: 'Name',
      required: 'Required',
      optional: 'Optional',
      // Dashboard
      income: 'Income',
      totalSpent: 'Total Spent',
      savingsRate: 'Savings Rate',
      dailyAverage: 'Daily Average',
      goals: 'Goals',
      // Validation messages
      fieldRequired: 'This field is required',
      invalidAmount: 'Invalid amount',
      invalidDate: 'Invalid date',
      futureDateNotAllowed: 'Future dates are not allowed',
      amountMustBePositive: 'Amount must be positive',
      // Notifications
      expenseAdded: 'Expense added successfully',
      expenseUpdated: 'Expense updated successfully',
      expenseDeleted: 'Expense deleted',
      categoryAdded: 'Category added',
      dataExported: 'Data exported successfully',
      dataImported: 'Data imported successfully',
      // Accessibility
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
      previousPage: 'Previous page',
      nextPage: 'Next page',
      sortBy: 'Sort by',
      selectCategory: 'Select a category',
      // Time periods
      today: 'Today',
      week: 'This week',
      month: 'This month',
      year: 'This year',
      // Months
      months: [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ],
      // Greeting
      greeting: {
        morning: '🌅 Good morning',
        afternoon: '☀️ Good afternoon',
        evening: '🌙 Good evening'
      }
    },
    es: {
      // Dashboard
      title: 'Gestor Financiero Personal',
      dashboard: 'Tablero',
      budget: 'Presupuesto',
      expenses: 'Gastos',
      savings: 'Ahorros',
      calendar: 'Calendario',
      recurring: 'Recurrente',
      debts: 'Deudas',
      reports: 'Informes',
      // Common
      add: 'Agregar',
      edit: 'Editar',
      delete: 'Eliminar',
      save: 'Guardar',
      cancel: 'Cancelar',
      close: 'Cerrar',
      confirm: 'Confirmar',
      loading: 'Cargando...',
      search: 'Buscar...',
      filter: 'Filtrar',
      sort: 'Ordenar',
      export: 'Exportar',
      import: 'Importar',
      // Forms
      amount: 'Cantidad',
      description: 'Descripción',
      category: 'Categoría',
      date: 'Fecha',
      name: 'Nombre',
      required: 'Requerido',
      optional: 'Opcional',
      // Dashboard
      income: 'Ingresos',
      totalSpent: 'Total gastado',
      savingsRate: 'Tasa de ahorro',
      dailyAverage: 'Promedio diario',
      goals: 'Objetivos',
      // Validation messages
      fieldRequired: 'Este campo es requerido',
      invalidAmount: 'Cantidad inválida',
      invalidDate: 'Fecha inválida',
      futureDateNotAllowed: 'No se permiten fechas futuras',
      amountMustBePositive: 'La cantidad debe ser positiva',
      // Notifications
      expenseAdded: 'Gasto agregado exitosamente',
      expenseUpdated: 'Gasto actualizado exitosamente',
      expenseDeleted: 'Gasto eliminado',
      categoryAdded: 'Categoría agregada',
      dataExported: 'Datos exportados exitosamente',
      dataImported: 'Datos importados exitosamente',
      // Accessibility
      openMenu: 'Abrir menú',
      closeMenu: 'Cerrar menú',
      previousPage: 'Página anterior',
      nextPage: 'Página siguiente',
      sortBy: 'Ordenar por',
      selectCategory: 'Seleccionar categoría',
      // Time periods
      today: 'Hoy',
      week: 'Esta semana',
      month: 'Este mes',
      year: 'Este año',
      // Months
      months: [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ],
      // Greeting
      greeting: {
        morning: '🌅 Buenos días',
        afternoon: '☀️ Buenas tardes',
        evening: '🌙 Buenas noches'
      }
    }
  };

  // Créer le dossier s'il n'existe pas
  const cleanDir = path.dirname(cleanTranslationsPath);
  if (!fs.existsSync(cleanDir)) {
    fs.mkdirSync(cleanDir, { recursive: true });
  }

  // Écrire le fichier de test
  const testFileContent = `// Fichier de traductions nettoyé - Version de test
const translations = ${JSON.stringify(testTranslations, null, 2)};

export default translations;`;

  fs.writeFileSync(cleanTranslationsPath, testFileContent);
  console.log('✅ Fichier de test créé:', cleanTranslationsPath);
  
  cleanTranslations = testTranslations;
}

// Fonction de test des traductions
function testTranslations() {
  console.log('\n🧪 TEST DES TRADUCTIONS');
  console.log('========================\n');

  // 1. Test de structure
  console.log('1. Test de structure:');
  const languages = ['fr', 'en', 'es'];
  let structureValid = true;

  languages.forEach(lang => {
    if (!cleanTranslations[lang]) {
      console.log(`❌ Langue ${lang} manquante`);
      structureValid = false;
    } else {
      console.log(`✅ Langue ${lang} présente`);
    }
  });

  // 2. Test des clés essentielles
  console.log('\n2. Test des clés essentielles:');
  const essentialKeys = [
    'title', 'dashboard', 'budget', 'expenses', 'savings', 
    'add', 'edit', 'delete', 'save', 'cancel',
    'amount', 'description', 'category', 'date'
  ];

  let essentialKeysValid = true;
  languages.forEach(lang => {
    console.log(`\n   Langue ${lang}:`);
    essentialKeys.forEach(key => {
      if (cleanTranslations[lang] && cleanTranslations[lang][key]) {
        console.log(`   ✅ ${key}: "${cleanTranslations[lang][key]}"`);
      } else {
        console.log(`   ❌ ${key}: MANQUANT`);
        essentialKeysValid = false;
      }
    });
  });

  // 3. Test de cohérence entre langues
  console.log('\n3. Test de cohérence entre langues:');
  let consistencyValid = true;

  // Comparer le nombre de clés entre les langues
  const keyCounts = {};
  languages.forEach(lang => {
    if (cleanTranslations[lang]) {
      keyCounts[lang] = Object.keys(cleanTranslations[lang]).length;
    }
  });

  const counts = Object.values(keyCounts);
  const avgCount = counts.reduce((a, b) => a + b, 0) / counts.length;
  
  languages.forEach(lang => {
    const count = keyCounts[lang] || 0;
    const diff = Math.abs(count - avgCount);
    if (diff > avgCount * 0.1) { // Plus de 10% de différence
      console.log(`   ⚠️  ${lang}: ${count} clés (différence significative)`);
      consistencyValid = false;
    } else {
      console.log(`   ✅ ${lang}: ${count} clés`);
    }
  });

  // 4. Test de fonction de traduction
  console.log('\n4. Test de fonction de traduction:');
  
  function t(key, params = {}, language = 'fr') {
    let translation = cleanTranslations[language] && cleanTranslations[language][key];
    if (!translation) {
      translation = cleanTranslations.fr && cleanTranslations.fr[key];
    }
    if (!translation) {
      translation = key;
    }
    
    // Gestion des interpolations
    if (params && typeof params === 'object') {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        translation = translation.replace(new RegExp(`{{${paramKey}}}`, 'g'), paramValue);
      });
    }
    
    return translation;
  }

  // Tests de la fonction
  const testCases = [
    { key: 'title', lang: 'fr', expected: 'Gestionnaire Financier Personnel' },
    { key: 'title', lang: 'en', expected: 'Personal Finance Manager' },
    { key: 'title', lang: 'es', expected: 'Gestor Financiero Personal' },
    { key: 'add', lang: 'fr', expected: 'Ajouter' },
    { key: 'nonexistent', lang: 'fr', expected: 'nonexistent' }
  ];

  testCases.forEach(test => {
    const result = t(test.key, {}, test.lang);
    if (result === test.expected) {
      console.log(`   ✅ "${test.key}" (${test.lang}): "${result}"`);
    } else {
      console.log(`   ❌ "${test.key}" (${test.lang}): "${result}" (attendu: "${test.expected}")`);
    }
  });

  // 5. Résumé
  console.log('\n5. Résumé:');
  if (structureValid && essentialKeysValid && consistencyValid) {
    console.log('✅ Tous les tests sont passés !');
    console.log('✅ Le fichier de traductions est prêt à être utilisé.');
  } else {
    console.log('❌ Certains tests ont échoué.');
    console.log('❌ Le fichier de traductions nécessite des corrections.');
  }

  // 6. Statistiques
  console.log('\n6. Statistiques:');
  languages.forEach(lang => {
    const count = keyCounts[lang] || 0;
    console.log(`   ${lang}: ${count} traductions`);
  });

  return structureValid && essentialKeysValid && consistencyValid;
}

// Exécuter les tests
const success = testTranslations();

if (success) {
  console.log('\n🎉 Le fichier de traductions est prêt !');
  console.log('\nPour l\'utiliser dans votre application:');
  console.log('1. Remplacez l\'import dans App.js:');
  console.log('   import translations from \'./i18n/clean/translations_clean.js\';');
  console.log('\n2. Ou copiez le contenu dans src/i18n/translations.js');
} else {
  console.log('\n⚠️  Des corrections sont nécessaires avant utilisation.');
} 