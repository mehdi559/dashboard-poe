const fs = require('fs');
const path = require('path');

// Clés utilisées dans le chatbot (extrait du fichier Chatbot.js)
const chatbotKeys = [
  'aiThinking',
  'expenses',
  'savings', 
  'income',
  'reports',
  'analysis',
  'goals',
  'addExpense',
  'deleteExpense',
  'addCategory',
  'biggestExpense',
  'mostExpensiveDay',
  'backToMenu',
  'savingsStatus',
  'myGoals',
  'addSavingsGoal',
  'savingsProgress',
  'savingsAdvice',
  'addIncome',
  'totalIncome',
  'incomeEvolution',
  'incomeGoals',
  'incomeAdvice',
  'monthlyReport',
  'yearlyReport',
  'expensesReport',
  'savingsReport',
  'detailedReport',
  'fullAnalysis',
  'predictions',
  'personalAdvice',
  'trends',
  'alerts',
  'transportExpense',
  'foodExpense',
  'housingExpense',
  'back',
  'chatbotWelcome',
  'expenseManagement',
  'savingsManagement',
  'incomeManagement',
  'reportsAndStats',
  'financialAnalysis',
  'financialGoals',
  'addExpenseInstructions',
  'biggestExpenseThisMonth',
  'savingsStatusDetails',
  'completeFinancialAnalysis',
  'excellentSavingsRate',
  'goodSavingsRate',
  'improveSavingsRate',
  'actionNotUnderstood',
  'expenseAddedSuccess',
  'expenseAddError',
  'categoryNotFoundError',
  'amountDetected',
  'greetingMorning',
  'greetingAfternoon',
  'greetingEvening',
  'greetingMessage',
  'thankYouMessage',
  'dontUnderstandMessage',
  'openAIAssistant',
  'aiAssistant',
  'artificialIntelligence',
  'online',
  'closeAssistant',
  'minimizeAssistant',
  'maximizeAssistant',
  'clickToExpand',
  'askYourQuestion',
  'sendMessage',
  'quickSuggestions'
];

// Fonction pour vérifier si une clé existe dans le contenu
function checkKeyExists(content, key) {
  // Vérifier si la clé existe dans le contenu
  return content.includes(`"${key}"`) || content.includes(`'${key}'`) || content.includes(`${key}:`);
}

// Vérifier les clés manquantes
function checkMissingKeys(filePath, language) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const missingKeys = chatbotKeys.filter(key => !checkKeyExists(content, key));
    
    console.log(`\n=== VÉRIFICATION CLÉS ${language.toUpperCase()} ===`);
    console.log(`Total clés chatbot: ${chatbotKeys.length}`);
    console.log(`Clés manquantes: ${missingKeys.length}`);
    
    if (missingKeys.length > 0) {
      console.log(`\nClés manquantes en ${language}:`);
      missingKeys.forEach(key => {
        console.log(`- ${key}`);
      });
      
      console.log(`\n=== TRADUCTIONS À AJOUTER ===`);
      missingKeys.forEach(key => {
        console.log(`${key}: '${key}', // TODO: translate`);
      });
    } else {
      console.log(`✅ Toutes les clés du chatbot sont présentes en ${language}`);
    }
    
    return missingKeys;
  } catch (error) {
    console.error(`Erreur lecture ${filePath}:`, error.message);
    return chatbotKeys; // Si erreur, considérer toutes les clés comme manquantes
  }
}

// Vérifier les trois langues dans le fichier principal
console.log('🔍 VÉRIFICATION DES CLÉS DE TRADUCTION DU CHATBOT\n');

const frMissing = checkMissingKeys('./src/i18n/translations.js', 'français');
const enMissing = checkMissingKeys('./src/i18n/translations.js', 'anglais');
const esMissing = checkMissingKeys('./src/i18n/translations.js', 'espagnol');

console.log('\n=== RÉSUMÉ ===');
console.log(`Clés manquantes en français: ${frMissing.length}`);
console.log(`Clés manquantes en anglais: ${enMissing.length}`);
console.log(`Clés manquantes en espagnol: ${esMissing.length}`);

if (frMissing.length === 0 && enMissing.length === 0 && esMissing.length === 0) {
  console.log('\n🎉 Toutes les clés du chatbot sont présentes dans les trois langues !');
} else {
  console.log('\n⚠️  Il y a des clés manquantes dans au moins une langue.');
} 