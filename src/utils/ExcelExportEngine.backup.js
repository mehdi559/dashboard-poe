// utils/ExcelExportEngine.js - MOTEUR D'EXPORT EXCEL PROFESSIONNEL
import * as XLSX from 'xlsx';

export class ExcelExportEngine {
  
  // Export Budget Professionnel avec graphiques et design
  static async exportProfessionalBudget(data, options = {}) {
    const {
      expenses = [],
      categories = [],
      totalBudget = 0,
      totalSpent = 0,
      selectedMonth = '',
      userName = 'Utilisateur',
      language = 'fr'
    } = data;

    // Ces variables sont utilisées dans les méthodes de création des feuilles

    const wb = XLSX.utils.book_new();
    
    // === FEUILLE 1: TABLEAU DE BORD EXÉCUTIF ===
    const dashboardSheet = this.createDashboardSheet(data, language);
    XLSX.utils.book_append_sheet(wb, dashboardSheet, this.getSheetName('dashboard', language));
    
    // === FEUILLE 2: ANALYSE DÉTAILLÉE ===
    const analysisSheet = this.createAnalysisSheet(data, language);
    XLSX.utils.book_append_sheet(wb, analysisSheet, this.getSheetName('analysis', language));
    
    // === FEUILLE 3: DONNÉES BRUTES ===
    const rawDataSheet = this.createRawDataSheet(data, language);
    XLSX.utils.book_append_sheet(wb, rawDataSheet, this.getSheetName('rawData', language));
    
    // === FEUILLE 4: GRAPHIQUES ET TENDANCES ===
    const chartsSheet = this.createChartsSheet(data, language);
    XLSX.utils.book_append_sheet(wb, chartsSheet, this.getSheetName('charts', language));
    
    // === FEUILLE 5: RECOMMANDATIONS IA ===
    const recommendationsSheet = this.createRecommendationsSheet(data, language);
    XLSX.utils.book_append_sheet(wb, recommendationsSheet, this.getSheetName('recommendations', language));

    // Nom du fichier avec timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const fileName = `Rapport-Budget-Premium-${selectedMonth}-${timestamp}.xlsx`;
    
    // Télécharger le fichier
    XLSX.writeFile(wb, fileName);
    
    return { success: true, fileName };
  }

  // === FEUILLE TABLEAU DE BORD EXÉCUTIF ===
  static createDashboardSheet(data, language) {
    const { expenses, categories, totalBudget, totalSpent, selectedMonth, userName, monthlyIncome, savingsRate, savingsGoals, debts } = data;
    const t = this.getTranslations(language);
    
    // Calculs avancés pour des métriques plus utiles
    const totalSavings = savingsGoals ? savingsGoals.reduce((sum, s) => sum + s.currentAmount, 0) : 0;
    const totalTarget = savingsGoals ? savingsGoals.reduce((sum, s) => sum + s.targetAmount, 0) : 0;
    const savingsProgress = totalTarget > 0 ? ((totalSavings / totalTarget * 100) || 0).toFixed(1) : '0.0';    
    const totalDebt = debts ? debts.reduce((sum, d) => sum + d.balance, 0) : 0;
    const debtToIncomeRatio = monthlyIncome > 0 ? ((totalDebt / monthlyIncome * 100) || 0).toFixed(1) : '0.0';    
    const biggestExpense = this.getBiggestExpense(expenses);
    const mostActiveCategory = this.getMostActiveCategory(expenses);
    const averageDailySpending = this.calculateDailyAverage(expenses);
    const daysUntilBudgetExhaustion = totalBudget > 0 ? Math.floor((totalBudget - totalSpent) / (averageDailySpending || 1)) : 0;
    
    const worksheetData = [
      // Header avec logo et titre
      ['', '', '', '', '', '', '', ''],
      ['', '💰', `${t.budgetReport} - ${t.executiveDashboard}`, '', '', '', ''],
      ['', '', `${t.generatedFor}: ${userName}`, '', '', '', '', ''],
      ['', '', `${t.period}: ${selectedMonth}`, '', '', '', '', ''],
      ['', '', `${t.generatedOn}: ${new Date().toLocaleDateString()}`, '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      
      // Section KPIs principaux
      ['', `📊 ${t.keyMetrics}`, '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['', t.metric, t.value, t.target, t.variance, t.status, '', ''],
      ['', t.totalSpent, totalSpent, totalBudget, totalSpent - totalBudget, 
       totalSpent > totalBudget ? t.overBudget : t.onTrack, '', ''],
       ['', t.savingsRate, `${savingsRate ? (savingsRate || 0).toFixed(1) : (monthlyIncome > 0 ? (((monthlyIncome - totalSpent) / monthlyIncome * 100) || 0).toFixed(1) : '0.0')}%`,       '20%', `${(((savingsRate || (monthlyIncome > 0 ? ((monthlyIncome - totalSpent) / monthlyIncome * 100) : 0)) - 20) || 0).toFixed(1)}%`,       (savingsRate || (monthlyIncome > 0 ? ((monthlyIncome - totalSpent) / monthlyIncome * 100) : 0)) > 20 ? t.excellent : t.needsImprovement, '', ''],
['', t.budgetUtilization, `${totalBudget > 0 ? ((totalSpent / totalBudget * 100) || 0).toFixed(1) : '0.0'}%`, '80%', `${totalBudget > 0 ? (((totalSpent / totalBudget * 100) - 80) || 0).toFixed(1) : '-80.0'}%`, totalBudget > 0 && totalSpent / totalBudget > 0.9 ? t.warning : t.good, '', ''],
      ['', '', '', '', '', '', '', ''],
      
      // Section métriques avancées
      ['', `🎯 ${t.advancedMetrics}`, '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['', t.savingsProgress, `${savingsProgress}%`, '100%', `${savingsProgress - 100}%`, 
       parseFloat(savingsProgress) >= 100 ? t.completed : parseFloat(savingsProgress) > 50 ? t.good : t.needsImprovement, '', ''],
      ['', t.debtToIncomeRatio, `${debtToIncomeRatio}%`, '30%', `${parseFloat(debtToIncomeRatio) - 30}%`, 
       parseFloat(debtToIncomeRatio) > 50 ? t.critical : parseFloat(debtToIncomeRatio) > 30 ? t.warning : t.good, '', ''],
      ['', t.daysUntilBudgetExhaustion, daysUntilBudgetExhaustion > 0 ? `${daysUntilBudgetExhaustion} ${t.days}` : t.budgetExhausted, '30', 
       daysUntilBudgetExhaustion - 30, daysUntilBudgetExhaustion < 7 ? t.critical : daysUntilBudgetExhaustion < 15 ? t.warning : t.good, '', ''],
      ['', '', '', '', '', '', '', ''],
      
      // Section budget par catégorie
      ['', `🎯 ${t.budgetByCategory}`, '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['', t.category, t.budget, t.spent, t.remaining, t.percentage, t.status, ''],
    ];

    // Ajouter les données de catégorie
    categories.forEach(category => {
      const spent = expenses
        .filter(e => e.category === category.name)
        .reduce((sum, e) => sum + e.amount, 0);
      const remaining = category.budget - spent;
      const percentage = category.budget > 0 ? ((spent / category.budget * 100) || 0).toFixed(1) : '0.0';
      const status = spent > category.budget ? t.exceeded : 
                    category.budget > 0 && spent > category.budget * 0.8 ? t.warning : t.good;
      
      worksheetData.push([
        '', category.name, category.budget, spent, remaining, `${percentage}%`, status, ''
      ]);
    });

  // Ajouter section tendances et insights
worksheetData.push(
  ['', '', '', '', '', '', '', ''],
  ['', `📈 ${t.spendingInsights}`, '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', t.biggestExpense, biggestExpense, '', '', '', '', ''],
  ['', t.mostActiveCategory, mostActiveCategory, '', '', '', '', ''],
  ['', t.averageDailySpending, `${(Number(averageDailySpending) || 0).toFixed(2)} ${t.currency}`, '', '', '', '', ''],
  ['', t.weeklyAverage, `${(Number(this.calculateWeeklyAverage(expenses)) || 0).toFixed(2)} ${t.currency}`, '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', `💡 ${t.recommendations}`, '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '']
);

    // Ajouter recommandations basées sur les données
    const recommendations = this.generateActionableRecommendations(data);
    recommendations.forEach(rec => {
      worksheetData.push(['', `• ${rec}`, '', '', '', '', '', '']);
    });

    const ws = XLSX.utils.aoa_to_sheet(worksheetData);

    // === STYLES PROFESSIONNELS ===
    this.applyProfessionalStyling(ws, worksheetData.length);

    // Largeurs des colonnes
    ws['!cols'] = [
      { wch: 2 },   // Colonne vide pour marge
      { wch: 30 },  // Labels (plus large pour les nouvelles métriques)
      { wch: 18 },  // Valeurs
      { wch: 15 },  // Cibles
      { wch: 15 },  // Variance
      { wch: 15 },  // Status
      { wch: 5 },   // Espace
      { wch: 5 }    // Marge droite
    ];

    return ws;
  }

  // === FEUILLE ANALYSE DÉTAILLÉE ===
  static createAnalysisSheet(data, language) {
    const { expenses, categories } = data; // Utilisées dans la logique de la méthode
    const t = this.getTranslations(language);
    
    const worksheetData = [
      // Header
      ['', `🔍 ${t.detailedAnalysis}`, '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      
      // Analyse temporelle
      ['', `📅 ${t.temporalAnalysis}`, '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['', t.day, t.totalSpent, t.transactions, t.averageAmount, '', '', ''],
    ];

    // Analyse par jour de la semaine
    const dailyAnalysis = this.analyzeDailyPatterns(expenses);
    const daysOfWeek = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    
    dailyAnalysis.forEach((dayData, index) => {
      worksheetData.push([
        '', daysOfWeek[index], dayData.total, dayData.count, 
        dayData.count > 0 ? ((dayData.total / dayData.count) || 0).toFixed(2) : 0, '', '', ''
      ]);
    });

    worksheetData.push(
      ['', '', '', '', '', '', '', ''],
      ['', `💳 ${t.categoryAnalysis}`, '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['', t.category, t.totalSpent, t.transactions, t.averageTransaction, t.percentage, '', '']
    );

    // Analyse par catégorie
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    categories.forEach(category => {
      const categoryExpenses = expenses.filter(e => e.category === category.name);
      const total = categoryExpenses.reduce((sum, e) => sum + e.amount, 0);
      const count = categoryExpenses.length;
      const avg = count > 0 ? total / count : 0;
      const percentage = totalExpenses > 0 ? ((total / totalExpenses * 100) || 0).toFixed(1) : 0;
      
      worksheetData.push([
        '', category.name, total, count, (avg || 0).toFixed(2), `${percentage}%`, '', ''
      ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(worksheetData);
    this.applyAnalysisStyling(ws);
    
    ws['!cols'] = [
      { wch: 2 }, { wch: 20 }, { wch: 15 }, { wch: 12 }, 
      { wch: 15 }, { wch: 12 }, { wch: 5 }, { wch: 5 }
    ];

    return ws;
  }

  // === FEUILLE DONNÉES BRUTES ===
  static createRawDataSheet(data, language) {
    const { expenses } = data;
    const t = this.getTranslations(language);

    const worksheetData = [
      // Header avec style
      ['', `📋 ${t.rawData}`, '', '', '', ''],
      ['', '', '', '', '', ''],
      ['', t.date, t.category, t.description, t.amount, t.notes],
    ];

    // Ajouter toutes les dépenses
    expenses
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .forEach(expense => {
        worksheetData.push([
          '', 
          expense.date,
          expense.category,
          expense.description,
          expense.amount,
          expense.notes || ''
        ]);
      });

    // Ligne de total
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    worksheetData.push(
      ['', '', '', '', '', ''],
      ['', '', '', t.total, total, '']
    );

    const ws = XLSX.utils.aoa_to_sheet(worksheetData);
    this.applyRawDataStyling(ws, expenses.length);

    ws['!cols'] = [
      { wch: 2 }, { wch: 12 }, { wch: 15 }, { wch: 30 }, { wch: 12 }, { wch: 20 }
    ];

    return ws;
  }

  // === FEUILLE GRAPHIQUES ===
  static createChartsSheet(data, language) {
    const { expenses, categories } = data;
    const t = this.getTranslations(language);

    const worksheetData = [
      ['', `📊 ${t.chartsAndTrends}`, '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      
      // Section 1: Répartition par catégorie
      ['', `🥧 ${t.expensesByCategory}`, '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['', t.category, t.amount, t.percentage, '', '', '', ''],
    ];

    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
    
    categories.forEach(category => {
      const categoryTotal = expenses
        .filter(e => e.category === category.name)
        .reduce((sum, e) => sum + e.amount, 0);
      const percentage = totalSpent > 0 ? ((categoryTotal / totalSpent * 100) || 0).toFixed(1) : 0;
      
      worksheetData.push([
        '', category.name, categoryTotal, `${percentage}%`, '', '', '', ''
      ]);
    });

    // Section 2: Évolution mensuelle (données réelles)
    worksheetData.push(
      ['', '', '', '', '', '', '', ''],
      ['', `📈 ${t.monthlyTrend}`, '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['', t.week, t.spent, t.budget, t.variance, t.status, '', '']
    );

    // Calcul des vraies données hebdomadaires
    const weeklyData = this.calculateWeeklyBreakdown(expenses, data.totalBudget);
    weeklyData.forEach((weekData, index) => {
      const status = weekData.spent > weekData.budget ? t.overBudget : 
                    weekData.budget > 0 && weekData.spent > weekData.budget * 0.8 ? t.warning : t.onTrack;
      
      worksheetData.push([
        '', `${t.week} ${index + 1}`, (weekData.spent || 0).toFixed(2), (weekData.budget || 0).toFixed(2), 
        (weekData.variance || 0).toFixed(2), status, '', ''
      ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(worksheetData);
    this.applyChartsStyling(ws);

    ws['!cols'] = [
      { wch: 2 }, { wch: 20 }, { wch: 15 }, { wch: 15 }, 
      { wch: 15 }, { wch: 10 }, { wch: 10 }, { wch: 5 }
    ];

    return ws;
  }

  // === FEUILLE RECOMMANDATIONS IA ===
  static createRecommendationsSheet(data, language) {
    const { expenses, categories, totalBudget, totalSpent } = data; // Utilisées dans generateAIRecommendations
    const t = this.getTranslations(language);

    const recommendations = this.generateAIRecommendations(data);

    const worksheetData = [
      ['', `🤖 ${t.aiRecommendations}`, '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['', `🎯 ${t.personalizedInsights}`, '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['', t.insight, t.impact, t.action, t.potentialSaving, '', '', ''],
    ];

    recommendations.forEach(rec => {
      worksheetData.push([
        '', rec.insight, rec.impact, rec.action, rec.potentialSaving, '', '', ''
      ]);
    });

    worksheetData.push(
      ['', '', '', '', '', '', '', ''],
      ['', `📋 ${t.actionPlan}`, '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['', t.priority, t.task, t.timeline, t.difficulty, '', '', '']
    );

    // Plan d'action
    const actionPlan = this.generateActionPlan(data);
    actionPlan.forEach(action => {
      worksheetData.push([
        '', action.priority, action.task, action.timeline, action.difficulty, '', '', ''
      ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(worksheetData);
    this.applyRecommendationsStyling(ws);

    ws['!cols'] = [
      { wch: 2 }, { wch: 35 }, { wch: 15 }, { wch: 25 }, 
      { wch: 15 }, { wch: 10 }, { wch: 10 }, { wch: 5 }
    ];

    return ws;
  }

  // === MÉTHODES DE STYLE PROFESSIONNEL ===
  static applyProfessionalStyling(ws, rowCount) {
    // Style pour le titre principal - Couleur bleue vive
    this.setCellStyle(ws, 'C2', {
      font: { bold: true, size: 18, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: '1E40AF' } },
      alignment: { horizontal: 'center', vertical: 'center' }
    });

    // Style pour les sous-titres
    ['C3', 'C4', 'C5'].forEach(cell => {
      this.setCellStyle(ws, cell, {
        font: { size: 12, color: { rgb: '6B7280' } },
        alignment: { horizontal: 'center' }
      });
    });

    // Style pour les headers de section - Couleurs vives
    this.setCellStyle(ws, 'B8', {
      font: { bold: true, size: 14, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: '059669' } }
    });

    this.setCellStyle(ws, 'B17', {
      font: { bold: true, size: 14, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: '7C3AED' } }
    });

    // Headers de tableau - Couleur gris foncé
    for (let col = 1; col <= 6; col++) {
      this.setCellStyle(ws, XLSX.utils.encode_cell({ r: 9, c: col }), {
        font: { bold: true, color: { rgb: 'FFFFFF' } },
        fill: { fgColor: { rgb: '374151' } },
        border: this.getAllBorders()
      });

      this.setCellStyle(ws, XLSX.utils.encode_cell({ r: 18, c: col }), {
        font: { bold: true, color: { rgb: 'FFFFFF' } },
        fill: { fgColor: { rgb: '374151' } },
        border: this.getAllBorders()
      });
    }

    // Bordures pour les données avec alternance de couleurs
    for (let row = 10; row < rowCount; row++) {
      const isEvenRow = row % 2 === 0;
      for (let col = 1; col <= 6; col++) {
        this.setCellStyle(ws, XLSX.utils.encode_cell({ r: row, c: col }), {
          fill: { fgColor: { rgb: isEvenRow ? 'F8FAFC' : 'FFFFFF' } },
          border: this.getAllBorders(),
          alignment: { horizontal: 'center' }
        });
      }
    }

    // Styles pour les cellules de statut avec couleurs
    for (let row = 10; row < rowCount; row++) {
      const statusCell = XLSX.utils.encode_cell({ r: row, c: 5 });
      if (ws[statusCell]) {
        const status = ws[statusCell].v;
        if (status && typeof status === 'string') {
          let color = 'FFFFFF';
          if (status.includes('Dépassé') || status.includes('Exceeded')) {
            color = 'FEE2E2'; // Rouge clair
          } else if (status.includes('Attention') || status.includes('Warning')) {
            color = 'FEF3C7'; // Jaune clair
          } else if (status.includes('Bon') || status.includes('Good')) {
            color = 'D1FAE5'; // Vert clair
          } else if (status.includes('Excellent')) {
            color = 'DBEAFE'; // Bleu clair
          }
          this.setCellStyle(ws, statusCell, {
            fill: { fgColor: { rgb: color } },
            border: this.getAllBorders(),
            alignment: { horizontal: 'center' }
          });
        }
      }
    }
  }

  static applyAnalysisStyling(ws) {
    // Style pour le titre - Orange vif
    this.setCellStyle(ws, 'B1', {
      font: { bold: true, size: 16, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: 'D97706' } }
    });

    // Styles pour les sous-sections - Couleurs distinctes
    this.setCellStyle(ws, 'B3', {
      font: { bold: true, size: 14, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: 'F59E0B' } }
    });

    this.setCellStyle(ws, 'B12', {
      font: { bold: true, size: 14, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: '8B5CF6' } }
    });

    // Headers de tableau avec couleurs
    for (let col = 1; col <= 5; col++) {
      this.setCellStyle(ws, XLSX.utils.encode_cell({ r: 5, c: col }), {
        font: { bold: true, color: { rgb: 'FFFFFF' } },
        fill: { fgColor: { rgb: '374151' } },
        border: this.getAllBorders()
      });

      this.setCellStyle(ws, XLSX.utils.encode_cell({ r: 13, c: col }), {
        font: { bold: true, color: { rgb: 'FFFFFF' } },
        fill: { fgColor: { rgb: '374151' } },
        border: this.getAllBorders()
      });
    }

    // Alternance de couleurs pour les données
    for (let row = 6; row <= 11; row++) {
      const isEvenRow = row % 2 === 0;
      for (let col = 1; col <= 5; col++) {
        this.setCellStyle(ws, XLSX.utils.encode_cell({ r: row, c: col }), {
          fill: { fgColor: { rgb: isEvenRow ? 'FEF3C7' : 'FFFFFF' } },
          border: this.getAllBorders(),
          alignment: { horizontal: 'center' }
        });
      }
    }

    for (let row = 14; row <= 20; row++) {
      const isEvenRow = row % 2 === 0;
      for (let col = 1; col <= 5; col++) {
        this.setCellStyle(ws, XLSX.utils.encode_cell({ r: row, c: col }), {
          fill: { fgColor: { rgb: isEvenRow ? 'F3E8FF' : 'FFFFFF' } },
          border: this.getAllBorders(),
          alignment: { horizontal: 'center' }
        });
      }
    }
  }

  static applyRawDataStyling(ws, dataCount) {
    // Table style avec alternance de couleurs
    for (let row = 4; row <= dataCount + 3; row++) {
      const isEvenRow = row % 2 === 0;
      for (let col = 1; col <= 5; col++) {
        this.setCellStyle(ws, XLSX.utils.encode_cell({ r: row, c: col }), {
          fill: { fgColor: { rgb: isEvenRow ? 'F9FAFB' : 'FFFFFF' } },
          border: this.getAllBorders()
        });
      }
    }
  }

  static applyChartsStyling(ws) {
    // Styles colorés pour les graphiques - Violet vif
    this.setCellStyle(ws, 'B1', {
      font: { bold: true, size: 16, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: '7C3AED' } }
    });

    // Sous-sections avec couleurs distinctes
    this.setCellStyle(ws, 'B3', {
      font: { bold: true, size: 14, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: '8B5CF6' } }
    });

    this.setCellStyle(ws, 'B12', {
      font: { bold: true, size: 14, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: 'A855F7' } }
    });

    // Headers de tableau
    for (let col = 1; col <= 4; col++) {
      this.setCellStyle(ws, XLSX.utils.encode_cell({ r: 5, c: col }), {
        font: { bold: true, color: { rgb: 'FFFFFF' } },
        fill: { fgColor: { rgb: '374151' } },
        border: this.getAllBorders()
      });

      this.setCellStyle(ws, XLSX.utils.encode_cell({ r: 14, c: col }), {
        font: { bold: true, color: { rgb: 'FFFFFF' } },
        fill: { fgColor: { rgb: '374151' } },
        border: this.getAllBorders()
      });
    }

    // Alternance de couleurs pour les données
    for (let row = 6; row <= 11; row++) {
      const isEvenRow = row % 2 === 0;
      for (let col = 1; col <= 4; col++) {
        this.setCellStyle(ws, XLSX.utils.encode_cell({ r: row, c: col }), {
          fill: { fgColor: { rgb: isEvenRow ? 'F3E8FF' : 'FFFFFF' } },
          border: this.getAllBorders(),
          alignment: { horizontal: 'center' }
        });
      }
    }

    for (let row = 15; row <= 18; row++) {
      const isEvenRow = row % 2 === 0;
      for (let col = 1; col <= 4; col++) {
        this.setCellStyle(ws, XLSX.utils.encode_cell({ r: row, c: col }), {
          fill: { fgColor: { rgb: isEvenRow ? 'F3E8FF' : 'FFFFFF' } },
          border: this.getAllBorders(),
          alignment: { horizontal: 'center' }
        });
      }
    }
  }

  static applyRecommendationsStyling(ws) {
    // Style futuriste pour l'IA - Bleu vif
    this.setCellStyle(ws, 'B1', {
      font: { bold: true, size: 16, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: '1E40AF' } }
    });

    // Sous-sections avec couleurs distinctes
    this.setCellStyle(ws, 'B3', {
      font: { bold: true, size: 14, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: '3B82F6' } }
    });

    this.setCellStyle(ws, 'B10', {
      font: { bold: true, size: 14, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: '2563EB' } }
    });

    // Headers de tableau
    for (let col = 1; col <= 4; col++) {
      this.setCellStyle(ws, XLSX.utils.encode_cell({ r: 5, c: col }), {
        font: { bold: true, color: { rgb: 'FFFFFF' } },
        fill: { fgColor: { rgb: '374151' } },
        border: this.getAllBorders()
      });

      this.setCellStyle(ws, XLSX.utils.encode_cell({ r: 12, c: col }), {
        font: { bold: true, color: { rgb: 'FFFFFF' } },
        fill: { fgColor: { rgb: '374151' } },
        border: this.getAllBorders()
      });
    }

    // Alternance de couleurs pour les données
    for (let row = 6; row <= 9; row++) {
      const isEvenRow = row % 2 === 0;
      for (let col = 1; col <= 4; col++) {
        this.setCellStyle(ws, XLSX.utils.encode_cell({ r: row, c: col }), {
          fill: { fgColor: { rgb: isEvenRow ? 'DBEAFE' : 'FFFFFF' } },
          border: this.getAllBorders(),
          alignment: { horizontal: 'center' }
        });
      }
    }

    for (let row = 13; row <= 16; row++) {
      const isEvenRow = row % 2 === 0;
      for (let col = 1; col <= 4; col++) {
        this.setCellStyle(ws, XLSX.utils.encode_cell({ r: row, c: col }), {
          fill: { fgColor: { rgb: isEvenRow ? 'DBEAFE' : 'FFFFFF' } },
          border: this.getAllBorders(),
          alignment: { horizontal: 'center' }
        });
      }
    }
  }

  // === MÉTHODES UTILITAIRES ===
  static setCellStyle(ws, cellAddress, style) {
    if (!ws[cellAddress]) ws[cellAddress] = {};
    ws[cellAddress].s = style;
  }

  static getAllBorders() {
    return {
      top: { style: 'thin', color: { rgb: 'D1D5DB' } },
      bottom: { style: 'thin', color: { rgb: 'D1D5DB' } },
      left: { style: 'thin', color: { rgb: 'D1D5DB' } },
      right: { style: 'thin', color: { rgb: 'D1D5DB' } }
    };
  }

  static calculateWeeklyAverage(expenses) {
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    return total > 0 ? ((total / 4) || 0).toFixed(2) : '0.00'; // Protection contre division par zéro
  }

  static calculateDailyAverage(expenses) {
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    const daysWithExpenses = new Set(expenses.map(e => e.date)).size;
    return daysWithExpenses > 0 ? ((total / daysWithExpenses) || 0).toFixed(2) : '0';
  }

  static getBiggestExpense(expenses) {
    if (expenses.length === 0) return 'Aucune';
    const biggest = expenses.reduce((max, e) => e.amount > max.amount ? e : max);
    return `${biggest.description} (${biggest.amount}€)`;
  }

  static getMostActiveCategory(expenses) {
    const categoryCount = {};
    expenses.forEach(e => {
      categoryCount[e.category] = (categoryCount[e.category] || 0) + 1;
    });
    
    const mostActive = Object.entries(categoryCount)
      .reduce((max, [cat, count]) => count > max[1] ? [cat, count] : max, ['', 0]);
    
    return mostActive[0] || 'Aucune';
  }

  static analyzeDailyPatterns(expenses) {
    const dailyData = Array(7).fill().map(() => ({ total: 0, count: 0 }));
    
    expenses.forEach(expense => {
      const dayOfWeek = new Date(expense.date).getDay();
      dailyData[dayOfWeek].total += expense.amount;
      dailyData[dayOfWeek].count++;
    });
    
    return dailyData;
  }

  // ✅ CORRECTION : Calcul des vraies données hebdomadaires
  static calculateWeeklyBreakdown(expenses, totalBudget) {
    const weeklyData = [];
    const weeklyBudget = totalBudget > 0 ? totalBudget / 4 : 0;
    
    // Grouper les dépenses par semaine (logique FINALEMENT corrigée)
    const expensesByWeek = {};
    expenses.forEach(expense => {
      const date = new Date(expense.date);
      const dayOfMonth = date.getDate();
      
      // Logique correcte : Semaine 1 (1-7), Semaine 2 (8-14), Semaine 3 (15-21), Semaine 4 (22-31)
      let weekKey;
      if (dayOfMonth <= 7) weekKey = 1;
      else if (dayOfMonth <= 14) weekKey = 2;
      else if (dayOfMonth <= 21) weekKey = 3;
      else weekKey = 4;
      
      if (!expensesByWeek[weekKey]) {
        expensesByWeek[weekKey] = [];
      }
      expensesByWeek[weekKey].push(expense);
    });
    
    // Calculer les données pour chaque semaine
    for (let week = 1; week <= 4; week++) {
      const weekExpenses = expensesByWeek[week] || [];
      const weekSpent = weekExpenses.reduce((sum, e) => sum + e.amount, 0);
      const variance = weekSpent - weeklyBudget;
      
      weeklyData.push({
        week,
        spent: weekSpent,
        budget: weeklyBudget,
        variance,
        count: weekExpenses.length
      });
    }
    
    return weeklyData;
  }

  static generateAIRecommendations(data) {
    const { expenses, categories, totalBudget, totalSpent, monthlyIncome, savingsRate } = data;
    const recommendations = [];

    // ✅ CORRECTION : Analyse du taux d'épargne basé sur les revenus mensuels
    const actualSavingsRate = savingsRate || (monthlyIncome > 0 ? ((monthlyIncome - totalSpent) / monthlyIncome * 100) : 0);
    if (actualSavingsRate < 20) {
      recommendations.push({
        insight: 'Votre taux d\'épargne est inférieur à 20%',
        impact: 'Élevé',
        action: 'Réduire les dépenses non essentielles',
        potentialSaving: `${((totalSpent * 0.1) || 0).toFixed(2)}€`
      });
    }

    // Analyse des catégories
    categories.forEach(category => {
      const categorySpent = expenses
        .filter(e => e.category === category.name)
        .reduce((sum, e) => sum + e.amount, 0);
      
      if (category.budget > 0 && categorySpent > category.budget * 1.2) {
        recommendations.push({
          insight: `Budget ${category.name} dépassé de 20%+`,
          impact: 'Moyen',
          action: `Limiter les achats en ${category.name}`,
          potentialSaving: `${(category.budget > 0 ? (categorySpent - category.budget) : 0).toFixed(2)}€`
        });
      }
    });

    return recommendations;
  }

  static generateActionableRecommendations(data) {
    const { expenses, categories, totalBudget, totalSpent, monthlyIncome, savingsGoals, debts } = data;
    const recommendations = [];
    
    // Recommandations basées sur le budget
    if (totalSpent > totalBudget) {
      const overspending = totalSpent - totalBudget;
      recommendations.push(`Réduisez vos dépenses de ${overspending.toFixed(2)}€ pour respecter votre budget.`);
    }
    
    // Recommandations basées sur les catégories
    const exceededCategories = categories.filter(cat => {
      const spent = expenses.filter(e => e.category === cat.name).reduce((sum, e) => sum + e.amount, 0);
      return spent > cat.budget;
    });
    
    if (exceededCategories.length > 0) {
      recommendations.push(`Surveillez ${exceededCategories.length} catégorie(s) dépassant le budget.`);
    }
    
    // Recommandations basées sur l'épargne
    if (savingsGoals && savingsGoals.length > 0) {
      const lowProgressGoals = savingsGoals.filter(goal => {
        const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
        return progress < 30;
      });
      
      if (lowProgressGoals.length > 0) {
        recommendations.push(`Accélérez la progression de ${lowProgressGoals.length} objectif(s) d'épargne.`);
      }
    }
    
    // Recommandations basées sur les dettes
    if (debts && debts.length > 0) {
      const totalDebt = debts.reduce((sum, d) => sum + d.balance, 0);
      const debtToIncomeRatio = monthlyIncome > 0 ? totalDebt / monthlyIncome : 0;
      
      if (debtToIncomeRatio > 0.5) {
        recommendations.push('Priorisez le remboursement des dettes - votre ratio dette/revenu est élevé.');
      }
    }
    
    // Recommandations basées sur les habitudes de dépenses
    const averageDailySpending = this.calculateDailyAverage(expenses);
    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    const projectedMonthlySpending = averageDailySpending * daysInMonth;
    
    if (projectedMonthlySpending > monthlyIncome) {
      recommendations.push('Vos dépenses quotidiennes projettent un déficit mensuel. Réduisez vos dépenses quotidiennes.');
    }
    
    // Recommandations positives si tout va bien
    if (recommendations.length === 0) {
      recommendations.push('Excellente gestion financière ! Continuez vos bonnes habitudes.');
    }
    
    return recommendations;
  }

  // ✅ CORRECTION : Plan d'action dynamique basé sur les vraies données
  static generateActionPlan(data) {
    const { expenses, categories, totalBudget, totalSpent, monthlyIncome, savingsRate } = data;
    const actionPlan = [];
    
    // Analyser les catégories dépassées
    const exceededCategories = categories.filter(category => {
      const spent = expenses
        .filter(e => e.category === category.name)
        .reduce((sum, e) => sum + e.amount, 0);
      return category.budget > 0 && spent > category.budget;
    });
    
    // Priorité haute : Catégories dépassées
    exceededCategories.forEach(category => {
      const spent = expenses
        .filter(e => e.category === category.name)
        .reduce((sum, e) => sum + e.amount, 0);
      const overspend = category.budget > 0 ? spent - category.budget : 0;
      
      actionPlan.push({
        priority: '🔴 Haute',
        task: `Réduire les dépenses ${category.name} (dépassé de ${overspend.toFixed(2)}€)`,
        timeline: '1 semaine',
        difficulty: 'Moyen'
      });
    });
    
    // Priorité moyenne : Taux d'épargne faible (utiliser la valeur passée en paramètre)
    const actualSavingsRate = savingsRate || (monthlyIncome > 0 ? ((monthlyIncome - totalSpent) / monthlyIncome * 100) : 0);
    if (actualSavingsRate < 20) {
      actionPlan.push({
        priority: '🟡 Moyenne',
        task: `Augmenter le taux d'épargne (actuel: ${actualSavingsRate.toFixed(1)}%)`,
        timeline: '2 semaines',
        difficulty: 'Facile'
      });
    }
    
    // Priorité basse : Optimisations générales
    if (actionPlan.length < 3) {
      actionPlan.push({
        priority: '🟢 Basse',
        task: 'Analyser les dépenses récurrentes',
        timeline: '1 mois',
        difficulty: 'Facile'
      });
    }
    
    return actionPlan.slice(0, 3); // Limiter à 3 actions
  }

  static getSheetName(type, language) {
    const names = {
      fr: {
        dashboard: 'Tableau de Bord',
        analysis: 'Analyse Détaillée',
        rawData: 'Données Brutes',
        charts: 'Graphiques',
        recommendations: 'Recommandations IA'
      },
      en: {
        dashboard: 'Executive Dashboard',
        analysis: 'Detailed Analysis',
        rawData: 'Raw Data',
        charts: 'Charts & Trends',
        recommendations: 'AI Recommendations'
      },
      es: {
        dashboard: 'Panel Ejecutivo',
        analysis: 'Análisis Detallado',
        rawData: 'Datos Brutos',
        charts: 'Gráficos',
        recommendations: 'Recomendaciones IA'
      }
    };
    
    return names[language]?.[type] || names['fr'][type];
  }

  static getTranslations(language) {
    const translations = {
      fr: {
        budgetReport: 'Rapport Budget Premium',
        executiveDashboard: 'Tableau de Bord Exécutif',
        generatedFor: 'Généré pour',
        period: 'Période',
        generatedOn: 'Généré le',
        keyMetrics: 'Indicateurs Clés',
        metric: 'Indicateur',
        value: 'Valeur',
        target: 'Objectif',
        variance: 'Écart',
        status: 'Statut',
        totalSpent: 'Total Dépensé',
        savingsRate: 'Taux d\'Épargne',
        budgetUtilization: 'Utilisation Budget',
        onTrack: 'Sur la voie',
        overBudget: 'Dépassé',
        excellent: 'Excellent',
        needsImprovement: 'À améliorer',
        warning: 'Attention',
        good: 'Bon',
        budgetByCategory: 'Budget par Catégorie',
        category: 'Catégorie',
        budget: 'Budget',
        spent: 'Dépensé',
        remaining: 'Restant',
        percentage: 'Pourcentage',
        exceeded: 'Dépassé',
        spendingTrends: 'Tendances de Dépenses',
        weeklyAverage: 'Moyenne Hebdomadaire',
        dailyAverage: 'Moyenne Quotidienne',
        biggestExpense: 'Plus Grosse Dépense',
        mostActiveCategory: 'Catégorie la Plus Active',
        detailedAnalysis: 'Analyse Détaillée',
        temporalAnalysis: 'Analyse Temporelle',
        day: 'Jour',
        transactions: 'Transactions',
        averageAmount: 'Montant Moyen',
        categoryAnalysis: 'Analyse par Catégorie',
        averageTransaction: 'Transaction Moyenne',
        rawData: 'Données Brutes',
        date: 'Date',
        description: 'Description',
        amount: 'Montant',
        notes: 'Notes',
        total: 'Total',
        chartsAndTrends: 'Graphiques et Tendances',
        expensesByCategory: 'Dépenses par Catégorie',
        monthlyTrend: 'Tendance Mensuelle',
        week: 'Semaine',
        aiRecommendations: 'Recommandations IA',
        personalizedInsights: 'Insights Personnalisés',
        insight: 'Insight',
        impact: 'Impact',
        action: 'Action',
        potentialSaving: 'Économie Potentielle',
        actionPlan: 'Plan d\'Action',
        priority: 'Priorité',
        task: 'Tâche',
        timeline: 'Délai',
        difficulty: 'Difficulté',
        advancedMetrics: 'Métriques Avancées',
        savingsProgress: 'Progression Épargne',
        debtToIncomeRatio: 'Ratio Dette/Revenu',
        daysUntilBudgetExhaustion: 'Jours jusqu\'à épuisement budget',
        budgetExhausted: 'Budget épuisé',
        days: 'jours',
        currency: '€',
        spendingInsights: 'Insights Dépenses',
        recommendations: 'Recommandations'
      }
      // Ajouter 'en' et 'es' si nécessaire...
    };
    
    return translations[language] || translations['fr'];
  }
}

export default ExcelExportEngine; 