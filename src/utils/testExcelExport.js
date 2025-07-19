// Test pour l'export Excel
import ExcelExportEngine from './ExcelExportEngine';

export const testExcelExport = async () => {
  // Données de test avec plus de variété pour tester les couleurs
  const testData = {
    expenses: [
      {
        id: '1',
        date: '2024-01-15',
        category: 'Alimentation',
        description: 'Courses Carrefour',
        amount: 85.50,
        notes: 'Courses de la semaine'
      },
      {
        id: '2',
        date: '2024-01-16',
        category: 'Transport',
        description: 'Essence',
        amount: 65.00,
        notes: 'Plein d\'essence'
      },
      {
        id: '3',
        date: '2024-01-17',
        category: 'Loisirs',
        description: 'Cinéma',
        amount: 12.50,
        notes: 'Film avec amis'
      },
      {
        id: '4',
        date: '2024-01-18',
        category: 'Alimentation',
        description: 'Restaurant',
        amount: 45.00,
        notes: 'Dîner en ville'
      },
      {
        id: '5',
        date: '2024-01-19',
        category: 'Transport',
        description: 'Taxi',
        amount: 25.00,
        notes: 'Retour tardif'
      }
    ],
    categories: [
      {
        id: '1',
        name: 'Alimentation',
        budget: 300,
        color: '#3B82F6'
      },
      {
        id: '2',
        name: 'Transport',
        budget: 150,
        color: '#10B981'
      },
      {
        id: '3',
        name: 'Loisirs',
        budget: 100,
        color: '#F59E0B'
      },
      {
        id: '4',
        name: 'Santé',
        budget: 50,
        color: '#EF4444'
      }
    ],
    totalBudget: 600,
    totalSpent: 232.00, // Dépassé pour tester les couleurs de statut
    selectedMonth: '2024-01',
    userName: 'Test User',
    language: 'fr'
  };

  try {
    console.log('🚀 Test d\'export Excel en cours...');
    const result = await ExcelExportEngine.exportProfessionalBudget(testData);
    
    if (result.success) {
      console.log('✅ Export Excel réussi !');
      console.log('📁 Fichier créé:', result.fileName);
      return true;
    } else {
      console.log('❌ Échec de l\'export Excel');
      return false;
    }
  } catch (error) {
    console.error('❌ Erreur lors du test Excel:', error);
    return false;
  }
};

// Fonction pour tester les méthodes individuelles
export const testExcelMethods = () => {
  console.log('🧪 Test des méthodes Excel...');
  
  // Test des traductions
  const translations = ExcelExportEngine.getTranslations('fr');
  console.log('✅ Traductions chargées:', Object.keys(translations).length, 'clés');
  
  // Test des noms de feuilles
  const sheetNames = ['dashboard', 'analysis', 'rawData', 'charts', 'recommendations'];
  sheetNames.forEach(name => {
    const sheetName = ExcelExportEngine.getSheetName(name, 'fr');
    console.log(`✅ Nom de feuille "${name}":`, sheetName);
  });
  
  // Test des calculs
  const testExpenses = [
    { amount: 100, date: '2024-01-15' },
    { amount: 50, date: '2024-01-16' },
    { amount: 75, date: '2024-01-17' }
  ];
  
  const weeklyAvg = ExcelExportEngine.calculateWeeklyAverage(testExpenses);
  const dailyAvg = ExcelExportEngine.calculateDailyAverage(testExpenses);
  const biggest = ExcelExportEngine.getBiggestExpense(testExpenses);
  
  console.log('✅ Calculs:', { weeklyAvg, dailyAvg, biggest });
  
  return true;
}; 