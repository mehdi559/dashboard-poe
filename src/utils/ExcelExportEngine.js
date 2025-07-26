// components/ExcelExportEngine.jsx - MOTEUR D'EXPORT EXCEL DYNAMIQUE v3.0
import React, { useState, useCallback, useMemo } from 'react';
import ExcelJS from 'exceljs';
import translations from '../i18n/translations';

// =============================================================================
// 🎨 TEMPLATE MANAGER - SYSTÈME DE TEMPLATES DYNAMIQUES
// =============================================================================
class TemplateManager {
  static getAvailableTemplates() {
    return {
      'comprehensive': {
        name: '📊 Rapport Complet',
        description: 'Analyse complète avec toutes les métriques',
        sheets: ['Dashboard', 'Analysis', 'Charts', 'Recommendations', 'Raw Data'],
        features: ['IA Insights', 'Métriques avancées', 'Recommandations personnalisées'],
        preview: '📈 Rapport enterprise complet',
        difficulty: 'Avancé',
        popular: false
      }
    };
  }

  static async generateTemplate(templateType, workbook, data, options) {
    const { language, theme, chartTypes } = options;

    switch (templateType) {
      case 'comprehensive':
        await ExcelExportEngine.createDashboardSheet(workbook, data, language, theme);
        await ExcelExportEngine.createAnalysisSheet(workbook, data, language, theme);
        await ExcelExportEngine.createAnalyticsDashboard(workbook, data, language, theme, chartTypes);
        await ExcelExportEngine.createRecommendationsSheet(workbook, data, language, theme);
        await ExcelExportEngine.createRawDataSheet(workbook, data, language, theme);
        break;
      default:
        console.warn(`Template non reconnu: ${templateType}`);
        break;
    }
  }
}

// =============================================================================
// 🧠 ANALYSEUR FINANCIER INTELLIGENT
// =============================================================================
class FinancialAnalyzer {
  constructor(data) {
    this.data = data;
    this.expenses = data.expenses || [];
    this.categories = data.categories || [];
    this.monthlyIncome = data.monthlyIncome || 0;
  }

  analyzeSpendingPatterns() {
    return {
      weekdayVsWeekend: this.compareWeekdayWeekendSpending(),
      monthlyTrend: this.analyzeMonthlyCurve(),
      categorySeasonality: this.findSeasonalPatterns(),
      unusualTransactions: this.detectAnomalies(),
      spendingVelocity: this.calculateSpendingVelocity()
    };
  }

  compareWeekdayWeekendSpending() {
    const weekdaySpending = this.expenses
      .filter(e => {
        const day = new Date(e.date).getDay();
        return day >= 1 && day <= 5;
      })
      .reduce((sum, e) => sum + e.amount, 0);

    const weekendSpending = this.expenses
      .filter(e => {
        const day = new Date(e.date).getDay();
        return day === 0 || day === 6;
      })
      .reduce((sum, e) => sum + e.amount, 0);

    const ratio = weekdaySpending > 0 ? weekendSpending / weekdaySpending : 0;

    return {
      weekdayTotal: weekdaySpending,
      weekendTotal: weekendSpending,
      weekdayAverage: weekdaySpending / 5,
      weekendAverage: weekendSpending / 2,
      ratio,
      insight: ratio > 1.5 ? 
        'weekendExpensesHigh' :
        ratio < 0.5 ?
        'excellentWeekendControl' :
        'balancedWeekendWeek'
    };
  }

  calculateSpendingVelocity() {
    if (this.expenses.length < 2) return { trend: 'insufficient_data', velocity: 0 };

    const sortedExpenses = this.expenses.sort((a, b) => new Date(a.date) - new Date(b.date));
    const firstHalf = sortedExpenses.slice(0, Math.floor(sortedExpenses.length / 2));
    const secondHalf = sortedExpenses.slice(Math.floor(sortedExpenses.length / 2));

    const firstHalfTotal = firstHalf.reduce((sum, e) => sum + e.amount, 0);
    const secondHalfTotal = secondHalf.reduce((sum, e) => sum + e.amount, 0);

    const velocity = secondHalfTotal - firstHalfTotal;
    const percentageChange = firstHalfTotal > 0 ? (velocity / firstHalfTotal) * 100 : 0;

    return {
      velocity,
      percentageChange,
      trend: velocity > 0 ? 'accelerating' : velocity < 0 ? 'decelerating' : 'stable',
      insight: Math.abs(percentageChange) > 20 ? 
        'spendingChangeWarning' :
        'stableSpending'
    };
  }

  analyzeMonthlyCurve() {
    const spendingByWeek = [];
    const expensesByWeek = new Map();

    this.expenses.forEach(expense => {
      const date = new Date(expense.date);
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const daysSinceStart = Math.floor((date - startOfMonth) / (1000 * 60 * 60 * 24));
      const weekNumber = Math.floor(daysSinceStart / 7) + 1;

      if (!expensesByWeek.has(weekNumber)) {
        expensesByWeek.set(weekNumber, 0);
      }
      expensesByWeek.set(weekNumber, expensesByWeek.get(weekNumber) + expense.amount);
    });

    for (let week = 1; week <= 5; week++) {
      spendingByWeek.push(expensesByWeek.get(week) || 0);
    }

    const trend = this.calculateTrendDirection(spendingByWeek);
    const peakWeek = spendingByWeek.indexOf(Math.max(...spendingByWeek)) + 1;

    return {
      weeklySpending: spendingByWeek,
      trend,
      peakWeek,
      insight: trend === 'increasing' ? 
        'increasingSpendingWarning' :
        trend === 'decreasing' ? 
        'decreasingSpendingExcellent' :
        'stableSpendingMonth'
    };
  }

  findSeasonalPatterns() {
    const categoryByDay = {};
    
    this.expenses.forEach(expense => {
      const dayOfWeek = new Date(expense.date).getDay();
      if (!categoryByDay[expense.category]) {
        categoryByDay[expense.category] = Array(7).fill(0);
      }
      categoryByDay[expense.category][dayOfWeek] += expense.amount;
    });

    const patterns = {};
    Object.entries(categoryByDay).forEach(([category, dailyAmounts]) => {
      const total = dailyAmounts.reduce((a, b) => a + b, 0);
      if (total > 0) {
        const maxDay = dailyAmounts.indexOf(Math.max(...dailyAmounts));
        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        patterns[category] = {
          peakDay: dayNames[maxDay],
          concentration: Math.max(...dailyAmounts) / total,
          recommendation: Math.max(...dailyAmounts) / total > 0.4 ? 
            'concentrateOptimize' : 
            'balancedDistribution'
        };
      }
    });

    return patterns;
  }

  detectAnomalies() {
    if (this.expenses.length < 5) return [];

    const amounts = this.expenses.map(e => e.amount).sort((a, b) => a - b);
    const q1 = amounts[Math.floor(amounts.length * 0.25)];
    const q3 = amounts[Math.floor(amounts.length * 0.75)];
    const iqr = q3 - q1;
    const threshold = q3 + 1.5 * iqr;

    return this.expenses
      .filter(e => e.amount > threshold)
      .map(e => ({
        ...e,
        anomalyType: 'unusually_high',
        severity: e.amount > threshold * 2 ? 'critical' : 'warning',
        deviationFactor: (e.amount / threshold).toFixed(2)
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5); // Top 5 anomalies
  }

  calculateTrendDirection(values) {
    if (values.length < 2) return 'stable';
    
    let increases = 0;
    let decreases = 0;
    
    for (let i = 1; i < values.length; i++) {
      if (values[i] > values[i-1]) increases++;
      else if (values[i] < values[i-1]) decreases++;
    }
    
    if (increases > decreases) return 'increasing';
    if (decreases > increases) return 'decreasing';
    return 'stable';
  }

  predictNextMonth() {
    if (this.expenses.length < 10) return { prediction: 0, confidence: 'low' };

    const velocity = this.calculateSpendingVelocity();
    const currentTotal = this.expenses.reduce((sum, e) => sum + e.amount, 0);
    
    // Prédiction simple basée sur la tendance
    let prediction = currentTotal;
    if (velocity.trend === 'accelerating') {
      prediction *= (1 + Math.abs(velocity.percentageChange) / 100);
    } else if (velocity.trend === 'decelerating') {
      prediction *= (1 - Math.abs(velocity.percentageChange) / 100);
    }

    const confidence = Math.abs(velocity.percentageChange) < 10 ? 'high' : 
                      Math.abs(velocity.percentageChange) < 25 ? 'medium' : 'low';

    return {
      prediction: Math.round(prediction),
      confidence,
      trend: velocity.trend,
      factors: this.getPredictionFactors()
    };
  }

  getPredictionFactors() {
    const patterns = this.analyzeSpendingPatterns();
    const factors = [];

    if (patterns.weekdayVsWeekend.ratio > 1.5) {
      factors.push('Dépenses weekend élevées');
    }

    if (patterns.spendingVelocity.trend === 'accelerating') {
      factors.push('Tendance d\'accélération des dépenses');
    }

    const anomalies = patterns.unusualTransactions;
    if (anomalies.length > 0) {
      factors.push(`${anomalies.length} transaction(s) inhabituelle(s) détectée(s)`);
    }

    return factors.length > 0 ? factors : ['Patterns de dépenses normaux'];
  }
}

// =============================================================================
// 🏭 MOTEUR D'EXPORT EXCEL ENTERPRISE v3.0
// =============================================================================
class ExcelExportEngine {
  static _cache = new Map();
  static _cacheExpiry = 5 * 60 * 1000; // 5 minutes

  static CONFIG = {
    SAVINGS_TARGET: 20,
    BUDGET_WARNING_THRESHOLD: 80,
    DEBT_CRITICAL_RATIO: 50,
    MAX_EXPORT_TIME: 30000,
    CACHE_ENABLED: true,
    CHART_COLORS: {
      primary: ['2E7D32', '1976D2', '7B1FA2', 'D84315', 'F57C00'],
      etsy: ['C8A882', '8FBC8F', 'DDA0DD', 'F0E68C', 'FFB6C1']
    }
  };

  // ==========================================================================
  // 🚀 MÉTHODE D'EXPORT PRINCIPALE REFACTORISÉE
  // ==========================================================================
  static async exportProfessionalBudget(data, options = {}) {
    const startTime = Date.now();
    
    try {
      const {
        template = 'comprehensive',
        chartTypes = ['pie', 'column', 'line'],
        theme = 'green',
        language = 'fr',
        enableCache = this.CONFIG.CACHE_ENABLED
      } = options;

      // 🔍 DEBUG: Log des options reçues
      console.log('🔍 DEBUG ExcelExportEngine - Options reçues:', {
        template,
        chartTypes,
        theme,
        language,
        enableCache
      });

      console.log(`🚀 Démarrage export template: ${template}`);

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Export timeout - opération trop longue')), this.CONFIG.MAX_EXPORT_TIME)
      );

      const exportPromise = this._performExport(data, {
        template, chartTypes, theme, language, enableCache
      });

      const result = await Promise.race([exportPromise, timeoutPromise]);
      
      const executionTime = Date.now() - startTime;
      console.log(`✅ Export terminé en ${executionTime}ms`);
      
      return {
        ...result,
        performance: {
          executionTime,
          template,
          cacheHit: result.cacheHit || false
        }
      };

    } catch (error) {
      console.error('❌ Erreur export Excel:', error);
      return {
        success: false,
        error: error.message,
        details: error.stack,
        performance: {
          executionTime: Date.now() - startTime,
          failed: true
        }
      };
    }
  }

  static async _performExport(data, options) {
    const { template, chartTypes, theme, language, enableCache } = options;

    // Validation stricte
    const validationResult = this.validateData(data);
    if (!validationResult.isValid) {
      throw new Error(`Données invalides: ${validationResult.errors.join(', ')}`);
    }

    // Nettoyage des données
    const cleanData = this.sanitizeData(data);

    // Cache check
    const cacheKey = enableCache ? this._generateCacheKey(cleanData, options) : null;
    if (cacheKey) {
      const cached = this._getCachedResult(cacheKey);
      if (cached) {
        // Re-télécharger le fichier depuis le cache
        this.downloadFile(cached.buffer, cached.fileName);
        return { ...cached.result, cacheHit: true };
      }
    }

    // Création du workbook ExcelJS
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'ExcelExportEngine v3.0';
    workbook.created = new Date();
    workbook.modified = new Date();
    workbook.company = 'Budget Manager Pro';

    console.log(`📊 Génération template: ${template}`);

    // 🔍 DEBUG: Log avant génération du template
    console.log('🔍 DEBUG ExcelExportEngine - Avant génération template:', {
      template,
      language,
      theme,
      chartTypes
    });

    // Génération du template sélectionné
    await TemplateManager.generateTemplate(template, workbook, cleanData, {
      language,
      theme,
      chartTypes
    });

    // Export du fichier
    const timestamp = new Date().toISOString().split('T')[0];
    const templateInfo = TemplateManager.getAvailableTemplates()[template];
    const t = this.getTranslations(language);
    // Utilise une clé de traduction pour le nom du template
    const templateNameKey = `template${template.charAt(0).toUpperCase() + template.slice(1)}Name`;
    const templateName = t[templateNameKey] || templateInfo.name;
    const fileName = `${templateName.replace(/[^a-zA-Z0-9]/g, '-')}-${cleanData.selectedMonth || 'current'}-${timestamp}.xlsx`;
    
    const buffer = await workbook.xlsx.writeBuffer();
    // Ne pas télécharger automatiquement, laisser l'appelant décider
    // this.downloadFile(buffer, fileName);

    const result = {
      success: true,
      fileName,
      buffer, // Ajouter le buffer pour le chiffrement
      warnings: validationResult.warnings,
      fileSize: buffer.byteLength,
      template,
      sheetsGenerated: workbook.worksheets.length
    };

    // Mettre en cache si activé
    if (cacheKey) {
      this._setCachedResult(cacheKey, { result, buffer, fileName });
    }

    return result;
  }

  // ==========================================================================
  // 🎨 TEMPLATES ETSY DYNAMIQUES
  // ==========================================================================
  static async createEtsyDynamicTemplate(workbook, data, language, theme) {
    // 🔍 DEBUG: Log de la langue dans createEtsyDynamicTemplate
    console.log('🔍 DEBUG createEtsyDynamicTemplate - Langue reçue:', language);
    const t = this.getTranslations(language);
    const worksheet = workbook.addWorksheet(t.budgetPlannerSheet || 'Budget Planner');
    
    // === HEADER STYLE ETSY ===
    worksheet.mergeCells('A1:F1');
    const budgetReportVal = t.budgetReport || 'budgetReport';
    if (!t.budgetReport) console.warn('Traduction manquante:', 'budgetReport');
    worksheet.getCell('A1').value = budgetReportVal;
    worksheet.getCell('A1').font = { size: 20, bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getCell('A1').fill = { 
      type: 'pattern', 
      pattern: 'solid', 
      fgColor: { argb: this.getThemeColor(theme, 'primary') } 
    };
    worksheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getRow(1).height = 40;

    // === INFORMATIONS UTILISATEUR ===
    const userVal = t.user || 'user';
    if (!t.user) console.warn('Traduction manquante:', 'user');
    worksheet.getCell('A2').value = `${userVal} ${data.userName || userVal}`;
    worksheet.getCell('A2').font = { size: 14, bold: true };
    const dateVal = t.date || 'date';
    if (!t.date) console.warn('Traduction manquante:', 'date');
    worksheet.getCell('D2').value = `${dateVal} ${data.selectedMonth || new Date().toLocaleDateString()}`;
    worksheet.getCell('D2').font = { size: 12 };

    // === REVENUS SECTION ===
    const incomeVal = t.income || 'income';
    if (!t.income) console.warn('Traduction manquante:', 'income');
    worksheet.getCell('A4').value = incomeVal;
    worksheet.getCell('A4').font = { size: 14, bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getCell('A4').fill = { 
      type: 'pattern', 
      pattern: 'solid', 
      fgColor: { argb: this.getThemeColor(theme, 'secondary') } 
    };
    worksheet.mergeCells('A4:B4');

    // Headers revenus
    const incomeHeaders = ['source', 'budgetedAmount', 'realAmount', 'difference'].map(key => {
      const val = t[key] || key;
      if (!t[key]) console.warn('Traduction manquante:', key);
      return val;
    });
    incomeHeaders.forEach((header, index) => {
      const cell = worksheet.getCell(5, index + 1);
      cell.value = header;
      cell.font = { bold: true, size: 11 };
      cell.fill = { 
        type: 'pattern', 
        pattern: 'solid', 
        fgColor: { argb: this.getThemeColor(theme, 'accent') } 
      };
      cell.border = this.getAllBorders();
      
    });

    // Données revenus avec formules
    worksheet.getCell('A6').value = t.mainSalary;
    worksheet.getCell('B6').value = data.monthlyIncome || 0;
    worksheet.getCell('C6').value = data.monthlyIncome || 0;
    worksheet.getCell('D6').value = { formula: 'C6-B6' };

    // === DÉPENSES SECTION ===
    const expenseStartRow = 9;
    const expensesVal = t.expenses || 'expenses';
    if (!t.expenses) console.warn('Traduction manquante:', 'expenses');
    worksheet.getCell('A8').value = expensesVal;
    worksheet.getCell('A8').font = { size: 14, bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getCell('A8').fill = { 
      type: 'pattern', 
      pattern: 'solid', 
      fgColor: { argb: this.getThemeColor(theme, 'primary') } 
    };
    worksheet.mergeCells('A8:E8');

    // Headers dépenses
    const expenseHeaders = ['category', 'budget', 'spent', 'remaining', 'percentageUsed'].map(key => {
      const val = t[key] || key;
      if (!t[key]) console.warn('Traduction manquante:', key);
      return val;
    });
    expenseHeaders.forEach((header, index) => {
      const cell = worksheet.getCell(expenseStartRow, index + 1);
      cell.value = header;
      cell.font = { bold: true, size: 11 };
      cell.fill = { 
        type: 'pattern', 
        pattern: 'solid', 
        fgColor: { argb: this.getThemeColor(theme, 'accent') } 
      };
      cell.border = this.getAllBorders();
    });

    // Données dépenses avec formules dynamiques
    data.categories.forEach((category, index) => {
      const row = expenseStartRow + 1 + index;
      const actualSpent = data.expenses
        .filter(e => e.category === category.name)
        .reduce((sum, e) => sum + e.amount, 0);

      worksheet.getCell(`A${row}`).value = category.name;
      worksheet.getCell(`B${row}`).value = category.budget;
      worksheet.getCell(`C${row}`).value = actualSpent;
      worksheet.getCell(`D${row}`).value = { formula: `B${row}-C${row}` };
      worksheet.getCell(`E${row}`).value = { formula: `IF(B${row}>0,C${row}/B${row},0)` };
      worksheet.getCell(`E${row}`).numFmt = '0.0%';

      // Styling conditionnel
      const bgColor = this.getThemeColor(theme, 'background');
      
      for (let col = 1; col <= 5; col++) {
        const cell = worksheet.getCell(row, col);
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
        cell.border = this.getAllBorders();
      }
    });

    // === TOTAUX AVEC FORMULES AUTOMATIQUES ===
    const totalRow = expenseStartRow + data.categories.length + 2;
    const totalVal = t.total || 'total';
    if (!t.total) console.warn('Traduction manquante:', 'total');
    worksheet.getCell(`A${totalRow}`).value = totalVal;
    worksheet.getCell(`A${totalRow}`).font = { bold: true, size: 12 };

    worksheet.getCell(`B${totalRow}`).value = { formula: `SUM(B${expenseStartRow + 1}:B${expenseStartRow + data.categories.length})` };
    worksheet.getCell(`C${totalRow}`).value = { formula: `SUM(C${expenseStartRow + 1}:C${expenseStartRow + data.categories.length})` };
    worksheet.getCell(`D${totalRow}`).value = { formula: `B${totalRow}-C${totalRow}` };

    // === RÉSUMÉ FINANCIER ===
    const summaryStartRow = totalRow + 3;
    const financialSummaryVal = t.financialSummary || 'financialSummary';
    if (!t.financialSummary) console.warn('Traduction manquante:', 'financialSummary');
    worksheet.getCell(`A${summaryStartRow}`).value = financialSummaryVal;
    worksheet.getCell(`A${summaryStartRow}`).font = { size: 14, bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getCell(`A${summaryStartRow}`).fill = { 
      type: 'pattern', 
      pattern: 'solid', 
      fgColor: { argb: this.getThemeColor(theme, 'secondary') } 
    };
    worksheet.mergeCells(`A${summaryStartRow}:B${summaryStartRow}`);

    const summaryItems = [
      [t.totalIncome || 'totalIncome', `C6`],
      [`${t.totalExpenses || 'totalExpenses'} ${t.total || 'total'}`, `C${totalRow}`],
      [`${t.savings || 'savings'} ${t.total || 'total'}`, `C6-C${totalRow}`],
      [`${t.savingsRate || 'savingsRate'} ${t.total || 'total'}`, `IF(C6>0,(C6-C${totalRow})/C6,0)`]
    ];

    summaryItems.forEach((item, index) => {
      const row = summaryStartRow + 1 + index;
      worksheet.getCell(`A${row}`).value = item[0];
      worksheet.getCell(`B${row}`).value = { formula: item[1] };
      if (typeof item[0] === 'string' && item[0].includes('savingsRate')) {
        worksheet.getCell(`B${row}`).numFmt = '0.0%';
      } else {
        worksheet.getCell(`B${row}`).numFmt = '#,##0.00 "€"';
      }
      // Appliquer le fond theme.background
      const bgColor = this.getThemeColor(theme, 'background');
      worksheet.getCell(`A${row}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
      worksheet.getCell(`B${row}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
    });

    // === STYLING GLOBAL ===
    this.applyEtsyStyling(worksheet, theme, data.categories.length);
    
    // Largeurs des colonnes
    worksheet.columns = [
      { width: 25 }, { width: 15 }, { width: 15 }, { width: 15 }, { width: 12 }
    ];

    console.log('✅ Template Etsy Dynamic créé avec succès');
    // Styliser le tableau des revenus (headers ligne 5, données ligne 6)
this.applyProfessionalTableStyling(worksheet, 5, 6, 6, theme);

// Styliser le tableau des dépenses (headers expenseStartRow, données expenseStartRow+1 à expenseStartRow+data.categories.length)
this.applyProfessionalTableStyling(worksheet, expenseStartRow, expenseStartRow + 1, expenseStartRow + data.categories.length, theme);

    // ... dans createEtsyDynamicTemplate, après avoir rempli la ligne 6 (revenus) ...
    const incomeBgColor = this.getThemeColor(theme, 'background');
    ['A', 'B', 'C', 'D'].forEach(col => {
      worksheet.getCell(`${col}6`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: incomeBgColor } };
    });
    // ...

    // Ajustement automatique de la largeur des colonnes
    worksheet.columns.forEach(column => {
      let maxLength = 10;
      column.eachCell({ includeEmpty: true }, cell => {
        const cellValue = cell.value ? cell.value.toString() : '';
        if (cellValue.length > maxLength) {
          maxLength = cellValue.length;
        }
      });
      column.width = maxLength + 2;
    });
    // ...

    return worksheet;
  }

  static async createEtsyMinimalTemplate(workbook, data, language, theme) {
    const t = this.getTranslations(language);
    const worksheet = workbook.addWorksheet(t.monthlyBudgetSheet || 'Monthly Budget');
    
    // Header minimaliste
    worksheet.mergeCells('A1:D1');
    worksheet.getCell('A1').value = 'MONTHLY BUDGET TRACKER';
    worksheet.getCell('A1').font = { size: 16, bold: true };
    worksheet.getCell('A1').alignment = { horizontal: 'center' };

    // Section simple revenus/dépenses
    const incomeVal = t.income || 'income';
    if (!t.income) console.warn('Traduction manquante:', 'income');
    worksheet.getCell('A3').value = incomeVal;
    worksheet.getCell('B3').value = data.monthlyIncome || 0;

    const expensesVal = t.expenses || 'expenses';
    if (!t.expenses) console.warn('Traduction manquante:', 'expenses');
    worksheet.getCell('A5').value = expensesVal;
    let currentRow = 6;

    data.categories.forEach((category, index) => {
      worksheet.getCell(`A${currentRow}`).value = category.name;
      worksheet.getCell(`B${currentRow}`).value = data.expenses
        .filter(e => e.category === category.name)
        .reduce((sum, e) => sum + e.amount, 0);
      currentRow++;
    });

    const totalExpensesVal = t.totalExpenses || 'totalExpenses';
    if (!t.totalExpenses) console.warn('Traduction manquante:', 'totalExpenses');
    worksheet.getCell(`A${currentRow + 1}`).value = totalExpensesVal;
    worksheet.getCell(`B${currentRow + 1}`).formula = `SUM(B6:B${currentRow - 1})`;

    const remainingVal = t.remaining || 'remaining';
    if (!t.remaining) console.warn('Traduction manquante:', 'remaining');
    worksheet.getCell(`A${currentRow + 2}`).value = remainingVal;
    worksheet.getCell(`B${currentRow + 2}`).formula = `B3-B${currentRow + 1}`;

    // Styling minimal
    worksheet.columns = [{ width: 20 }, { width: 15 }];

    this.applyEtsyStyling(worksheet, theme, data.categories.length);
    return worksheet;
  }


  static async createEtsyAdvancedTemplate(workbook, data, language, theme) {
    const t = this.getTranslations(language);
    const worksheet = workbook.addWorksheet(t.advancedBudgetSheet || 'Advanced Budget');
    const analyzer = new FinancialAnalyzer(data);
    
    // Header avancé
    worksheet.mergeCells('A1:G1');
    const advancedAnalysisVal = t.advancedAnalysis || 'advancedAnalysis';
    if (!t.advancedAnalysis) console.warn('Traduction manquante:', 'advancedAnalysis');
    worksheet.getCell('A1').value = advancedAnalysisVal;
    worksheet.getCell('A1').font = { size: 18, bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getCell('A1').fill = { 
      type: 'pattern', 
      pattern: 'solid', 
      fgColor: { argb: this.getThemeColor(theme, 'primary') } 
    };

    // Prédictions
    const prediction = analyzer.predictNextMonth();
    const nextMonthPredictionVal = t.nextMonthPrediction || 'nextMonthPrediction';
    if (!t.nextMonthPrediction) console.warn('Traduction manquante:', 'nextMonthPrediction');
    worksheet.getCell('A3').value = nextMonthPredictionVal;
    worksheet.getCell('B3').value = this.formatCurrency(prediction.prediction, language);
    const confidenceVal = t.confidence || 'confidence';
    if (!t.confidence) console.warn('Traduction manquante:', 'confidence');
    worksheet.getCell('C3').value = `${confidenceVal}: ${prediction.confidence}`;

    // Patterns de dépenses
    const patterns = analyzer.analyzeSpendingPatterns();
    const financialPatternsVal = t.financialPatterns || 'financialPatterns';
    if (!t.financialPatterns) console.warn('Traduction manquante:', 'financialPatterns');
    worksheet.getCell('A5').value = financialPatternsVal;
    const weekendVsWeekVal = t.weekendVsWeek || 'weekendVsWeek';
    const weekVal = t.week || 'week';
    if (!t.weekendVsWeek) console.warn('Traduction manquante:', 'weekendVsWeek');
    if (!t.week) console.warn('Traduction manquante:', 'week');
    worksheet.getCell('A6').value = `${weekendVsWeekVal} ${weekVal}`;
    worksheet.getCell('B6').value = patterns.weekdayVsWeekend.ratio.toFixed(2);
    const insightKey1 = patterns.weekdayVsWeekend.insight;
    const insightVal1 = t[insightKey1] || insightKey1;
    if (!t[insightKey1]) console.warn('Traduction manquante:', insightKey1);
    worksheet.getCell('C6').value = insightVal1;

    const spendingVelocityVal = t.spendingVelocity || 'spendingVelocity';
    if (!t.spendingVelocity) console.warn('Traduction manquante:', 'spendingVelocity');
    worksheet.getCell('A7').value = spendingVelocityVal;
    worksheet.getCell('B7').value = patterns.spendingVelocity.trend;
    const insightKey2 = patterns.spendingVelocity.insight;
    const insightVal2 = t[insightKey2] || insightKey2;
    if (!t[insightKey2]) console.warn('Traduction manquante:', insightKey2);
    worksheet.getCell('C7').value = insightVal2;

    // Budget classique avec améliorations
    let currentRow = 10;
    const detailedBudgetVal = t.detailedBudget || 'detailedBudget';
    if (!t.detailedBudget) console.warn('Traduction manquante:', 'detailedBudget');
    worksheet.getCell(`A${currentRow}`).value = detailedBudgetVal;
    currentRow += 2;

    const headers = ['category', 'budget', 'spent', 'trend', 'prediction', 'action'].map(key => {
      const val = t[key] || key;
      if (!t[key]) console.warn('Traduction manquante:', key);
      return val;
    });
    headers.forEach((header, index) => {
      const cell = worksheet.getCell(currentRow, index + 1);
      cell.value = header;
      cell.font = { bold: true };
      cell.fill = { 
        type: 'pattern', 
        pattern: 'solid', 
        fgColor: { argb: this.getThemeColor(theme, 'accent') } 
      };
    });

    currentRow++;

    data.categories.forEach((category, index) => {
      const spent = data.expenses
        .filter(e => e.category === category.name)
        .reduce((sum, e) => sum + e.amount, 0);

      const utilizationRate = category.budget > 0 ? spent / category.budget : 0;
      const exceededVal = t.exceeded || 'exceeded';
      const attentionVal = t.attention || 'attention';
      const okVal = t.ok || 'ok';
      if (!t.exceeded) console.warn('Traduction manquante:', 'exceeded');
      if (!t.attention) console.warn('Traduction manquante:', 'attention');
      if (!t.ok) console.warn('Traduction manquante:', 'ok');
      const trend = utilizationRate > 1 ? `📈 ${exceededVal}` : utilizationRate > 0.8 ? `⚠️ ${attentionVal}` : `✅ ${okVal}`;
      const prediction = Math.round(spent * 1.1); // Prédiction simple
      const reduceVal = t.reduce || 'reduce';
      const monitorVal = t.monitor || 'monitor';
      const maintainVal = t.maintain || 'maintain';
      if (!t.reduce) console.warn('Traduction manquante:', 'reduce');
      if (!t.monitor) console.warn('Traduction manquante:', 'monitor');
      if (!t.maintain) console.warn('Traduction manquante:', 'maintain');
      const action = utilizationRate > 1 ? reduceVal : utilizationRate > 0.8 ? monitorVal : maintainVal;

      worksheet.getCell(currentRow, 1).value = category.name;
      worksheet.getCell(currentRow, 2).value = category.budget;
      worksheet.getCell(currentRow, 3).value = spent;
      worksheet.getCell(currentRow, 4).value = trend;
      worksheet.getCell(currentRow, 5).value = prediction;
      worksheet.getCell(currentRow, 6).value = action;

      currentRow++;
    });

    worksheet.columns = [
      { width: 20 }, { width: 12 }, { width: 12 }, 
      { width: 15 }, { width: 12 }, { width: 15 }
    ];

   // Header principal (ligne 1)
worksheet.getRow(1).eachCell(cell => {
  cell.font = { size: 20, bold: true, color: { argb: 'FFFFFF' } };
  cell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: this.getThemeColor(theme, 'primary') }
  };
  cell.alignment = { horizontal: 'center', vertical: 'middle' };
  cell.border = this.getAllBorders();
});
worksheet.getRow(1).height = 40;


// Section Prédiction (ligne 3)
worksheet.getCell('A3').font = { size: 14, bold: true, color: { argb: 'FFFFFF' } };
worksheet.getCell('A3').fill = {
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb: this.getThemeColor(theme, 'secondary') }
};
worksheet.mergeCells('A3:B3');

// Section Patterns (ligne 5)
worksheet.getCell('A5').font = { size: 14, bold: true, color: { argb: 'FFFFFF' } };
worksheet.getCell('A5').fill = {
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb: this.getThemeColor(theme, 'primary') }
};
worksheet.mergeCells('A5:B5');

// Section Tableau détaillé (ligne 10)
worksheet.getCell('A10').font = { size: 14, bold: true, color: { argb: 'FFFFFF' } };
worksheet.getCell('A10').fill = {
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb: this.getThemeColor(theme, 'secondary') }
};
worksheet.mergeCells('A10:F10');

// En-têtes du tableau détaillé (ligne 12)
worksheet.getRow(12).eachCell(cell => {
  cell.font = { bold: true, color: { argb: 'FFFFFF' } };
  cell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: this.getThemeColor(theme, 'accent') }
  };
  cell.alignment = { vertical: 'middle', horizontal: 'center' };
  cell.border = this.getAllBorders();
});

// Bordures sur toutes les cellules du tableau détaillé
for (let row = 13; row < 13 + data.categories.length; row++) {
  worksheet.getRow(row).eachCell(cell => {
    cell.border = this.getAllBorders();
  });
}

// ... dans createEtsyAdvancedTemplate, après avoir rempli les lignes 6 et 7 (Modèles financiers) ...
const patternsBgColor = this.getThemeColor(theme, 'background');
['A', 'B', 'C'].forEach(col => {
  worksheet.getCell(`${col}6`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: patternsBgColor } };
  worksheet.getCell(`${col}7`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: patternsBgColor } };
});
// ...

// ... dans createEtsyAdvancedTemplate, après avoir rempli les lignes du tableau détaillé ...
const detailedStart = currentRow - data.categories.length;
const detailedEnd = currentRow - 1;
const detailedBgColor = this.getThemeColor(theme, 'background');
for (let row = detailedStart; row <= detailedEnd; row++) {
  for (let col = 1; col <= 6; col++) {
    worksheet.getCell(row, col).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: detailedBgColor } };
  }
}
// ...
    return worksheet;
  }

  // ==========================================================================
  // 📊 DASHBOARD ANALYTICS AVEC GRAPHIQUES NATIFS
  // ==========================================================================
  static async createAnalyticsDashboard(workbook, data, language, theme, chartTypes = ['pie', 'column', 'line']) {
    const t = this.getTranslations(language);
    const worksheet = workbook.addWorksheet(t.analyticsDashboardSheet || 'Analytics Dashboard');
    // Header stylé
    worksheet.mergeCells('A1:E1');
    const analyticsDashboardVal = t.analyticsDashboard || 'analyticsDashboard';
    if (!t.analyticsDashboard) console.warn('Traduction manquante:', 'analyticsDashboard');
    worksheet.getCell('A1').value = analyticsDashboardVal;
    worksheet.getCell('A1').font = { size: 16, bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getCell('A1').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: this.getThemeColor(theme, 'primary') }
    };
    worksheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getRow(1).height = 32;

    // En-têtes stylés
    const headers = ['category', 'budget', 'spent', 'percentage', 'status'].map(key => {
      const val = t[key] || key;
      if (!t[key]) console.warn('Traduction manquante:', key);
      return val;
    });
    const headerRow = worksheet.addRow(headers);
    headerRow.eachCell(cell => {
      cell.font = { bold: true, size: 12 };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: this.getThemeColor(theme, 'accent') }
      };
      cell.border = this.getAllBorders();
    });

    const totalSpent = data.expenses.reduce((sum, e) => sum + e.amount, 0);
    data.categories.forEach((category, index) => {
      const spent = data.expenses
        .filter(e => e.category === category.name)
        .reduce((sum, e) => sum + e.amount, 0);
      const percentage = totalSpent > 0 ? spent / totalSpent : 0;
      const exceededVal = t.exceeded || 'exceeded';
      const attentionVal = t.attention || 'attention';
      const okVal = t.ok || 'ok';
      if (!t.exceeded) console.warn('Traduction manquante:', 'exceeded');
      if (!t.attention) console.warn('Traduction manquante:', 'attention');
      if (!t.ok) console.warn('Traduction manquante:', 'ok');
      const status = spent > category.budget ? exceededVal : spent > category.budget * 0.8 ? attentionVal : okVal;
      const row = worksheet.addRow([
        category.name,
        category.budget,
        spent,
        percentage,
        status
      ]);
      row.getCell(4).numFmt = '0.0%';
      row.eachCell(cell => {
        cell.border = this.getAllBorders();
      });
    });

    // Astuce utilisateur
    const tipVal = t.tip || 'tip';
    if (!t.tip) console.warn('Traduction manquante:', 'tip');
    worksheet.getCell('G1').value = tipVal;
    worksheet.getCell('G1').font = { italic: true, color: { argb: '888888' } };

    // Données tendance hebdomadaire
    if (chartTypes.includes('line')) {
      const weeklyData = this.calculateWeeklyBreakdown(data.expenses, data.totalBudget);
      const lineStartRow = data.categories.length + 4;
      const weekVal = t.week || 'week';
      const spentVal = t.spent || 'spent';
      const budgetVal = t.budget || 'budget';
      if (!t.week) console.warn('Traduction manquante:', 'week');
      if (!t.spent) console.warn('Traduction manquante:', 'spent');
      if (!t.budget) console.warn('Traduction manquante:', 'budget');
      worksheet.getCell(lineStartRow, 1).value = `${weekVal} ${weekVal}`;
      worksheet.getCell(lineStartRow, 2).value = spentVal;
      worksheet.getCell(lineStartRow, 3).value = budgetVal;
      for (let col = 1; col <= 3; col++) {
        worksheet.getCell(lineStartRow, col).font = { bold: true };
        worksheet.getCell(lineStartRow, col).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: this.getThemeColor(theme, 'accent') }
        };
        worksheet.getCell(lineStartRow, col).border = this.getAllBorders();
      }
      weeklyData.forEach((week, index) => {
        const row = lineStartRow + 1 + index;
        worksheet.getCell(row, 1).value = `${weekVal} ${index + 1}`;
        worksheet.getCell(row, 2).value = week.spent;
        worksheet.getCell(row, 3).value = week.budget;
        for (let col = 1; col <= 3; col++) {
          worksheet.getCell(row, col).border = this.getAllBorders();
        }
      });
    }

    // Métriques avancées
    const metricsStartRow = data.categories.length + 15;
    const keyMetricsVal = t.keyMetrics || 'keyMetrics';
    if (!t.keyMetrics) console.warn('Traduction manquante:', 'keyMetrics');
    worksheet.getCell(metricsStartRow, 1).value = keyMetricsVal;
    worksheet.getCell(metricsStartRow, 1).font = { bold: true, size: 14, color: { argb: 'FFFFFF' } };
    worksheet.getCell(metricsStartRow, 1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: this.getThemeColor(theme, 'primary') }
    };
    worksheet.getCell(metricsStartRow, 1).alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getRow(metricsStartRow).height = 32;

    const analyzer = new FinancialAnalyzer(data);
    const patterns = analyzer.analyzeSpendingPatterns();
    const averageUtilizationVal = t.averageUtilization || 'averageUtilization';
    const percentageVal = t.percentage || 'percentage';
    const weekendRatioVal = t.weekendRatio || 'weekendRatio';
    const weekendVsWeekVal2 = t.weekendVsWeek || 'weekendVsWeek';
    const monthlyTrendVal = t.monthlyTrend || 'monthlyTrend';
    const trendVal = t.trend || 'trend';
    const detectedAnomaliesVal = t.detectedAnomalies || 'detectedAnomalies';
    const anomaliesVal = t.anomalies || 'anomalies';
    const spendingVelocityVal = t.spendingVelocity || 'spendingVelocity';
    const velocityVal = t.velocity || 'velocity';
    if (!t.averageUtilization) console.warn('Traduction manquante:', 'averageUtilization');
    if (!t.percentage) console.warn('Traduction manquante:', 'percentage');
    if (!t.weekendRatio) console.warn('Traduction manquante:', 'weekendRatio');
    if (!t.weekendVsWeek) console.warn('Traduction manquante:', 'weekendVsWeek');
    if (!t.monthlyTrend) console.warn('Traduction manquante:', 'monthlyTrend');
    if (!t.trend) console.warn('Traduction manquante:', 'trend');
    if (!t.detectedAnomalies) console.warn('Traduction manquante:', 'detectedAnomalies');
    if (!t.anomalies) console.warn('Traduction manquante:', 'anomalies');
    if (!t.spendingVelocity) console.warn('Traduction manquante:', 'spendingVelocity');
    if (!t.velocity) console.warn('Traduction manquante:', 'velocity');
    const metrics = [
      [`${averageUtilizationVal} ${percentageVal}`, `${this.calculateAverageUtilization(data)}%`],
      [`${weekendRatioVal} ${weekendVsWeekVal2}`, patterns.weekdayVsWeekend.ratio.toFixed(2)],
      [`${monthlyTrendVal} ${trendVal}`, patterns.monthlyTrend.trend],
      [`${detectedAnomaliesVal} ${anomaliesVal}`, patterns.unusualTransactions.length],
      [`${spendingVelocityVal} ${velocityVal}`, patterns.spendingVelocity.trend]
    ];
    metrics.forEach((metric, index) => {
      const row = metricsStartRow + 1 + index;
      worksheet.getCell(row, 1).value = metric[0];
      worksheet.getCell(row, 2).value = metric[1];
    });

    worksheet.columns = [
      { width: 20 }, { width: 15 }, { width: 15 }, { width: 15 }, { width: 12 }
    ];
    // Styliser le tableau principal (headers ligne 2, données ligne 3 à 3+data.categories.length-1)
this.applyProfessionalTableStyling(worksheet, 2, 3, 3 + data.categories.length - 1, theme);

    this.applyEtsyStyling(worksheet, theme, data.categories.length);
    console.log(`✅ Dashboard Analytics créé avec graphiques: ${chartTypes.join(', ')}`);

    // ... dans createAnalyticsDashboard, après avoir rempli les lignes du tableau principal ...
    const analyticsBgColor = this.getThemeColor(theme, 'background');
    for (let row = 3; row <= 3 + data.categories.length - 1; row++) {
      for (let col = 1; col <= 5; col++) {
        worksheet.getCell(row, col).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: analyticsBgColor } };
      }
    }
    // ...

    // ... dans createAnalyticsDashboard, après avoir rempli les lignes du tableau des semaines ...
    if (chartTypes.includes('line')) {
      const weeklyData = this.calculateWeeklyBreakdown(data.expenses, data.totalBudget);
      const lineStartRow = data.categories.length + 4;
      // ... (remplissage des données) ...
      // Appliquer le fond theme.background sur le tableau des semaines
      const weekBgColor = this.getThemeColor(theme, 'background');
      for (let row = lineStartRow + 1; row <= lineStartRow + 1 + weeklyData.length - 1; row++) {
        for (let col = 1; col <= 3; col++) {
          worksheet.getCell(row, col).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: weekBgColor } };
        }
      }
    }
    // ...

    // ... dans createAnalyticsDashboard, après avoir rempli les lignes du tableau des métriques ...

    // Utilise les variables metricsStartRow et metrics déjà déclarées
    const metricsBgColor = this.getThemeColor(theme, 'background');
    for (let row = metricsStartRow + 1; row <= metricsStartRow + metrics.length; row++) {
      for (let col = 1; col <= 2; col++) {
        worksheet.getCell(row, col).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: metricsBgColor } };
      }
    }
    // ...

    // Ajustement automatique de la largeur des colonnes
    worksheet.columns.forEach(column => {
      let maxLength = 10;
      column.eachCell({ includeEmpty: true }, cell => {
        const cellValue = cell.value ? cell.value.toString() : '';
        if (cellValue.length > maxLength) {
          maxLength = cellValue.length;
        }
      });
      column.width = maxLength + 2;
    });
    // ...

    return worksheet;
  }

  // ==========================================================================
  // 🔮 FEUILLES SUPPLÉMENTAIRES AVANCÉES
  // ==========================================================================
  static async createPredictionsSheet(workbook, data, language, theme) {
    const t = this.getTranslations(language);
    const predictionsSheet = workbook.addWorksheet(t.predictionsSheet || 'Predictions');
    const analyzer = new FinancialAnalyzer(data);

    predictionsSheet.mergeCells('A1:C1');
    const predictionsVal = t.predictions || 'Prédictions';
    if (!t.predictions) console.warn('Traduction manquante:', 'predictions');
    predictionsSheet.getCell('A1').value = predictionsVal;
    predictionsSheet.getCell('A1').font = { size: 16, bold: true, color: { argb: 'FFFFFF' } };
    predictionsSheet.getCell('A1').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: this.getThemeColor(theme, 'primary') }
    };
    predictionsSheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
    predictionsSheet.getRow(1).height = 28;

    const prediction = analyzer.predictNextMonth();
    const nextMonthPredictionVal = t.nextMonthPrediction || 'nextMonthPrediction';
    if (!t.nextMonthPrediction) console.warn('Traduction manquante:', 'nextMonthPrediction');
    predictionsSheet.getCell('A3').value = nextMonthPredictionVal;
    predictionsSheet.getCell('B3').value = this.formatCurrency(prediction.prediction, language);
    predictionsSheet.getCell('C3').value = prediction.confidence;

    const predictionFactorsVal = t.predictionFactors || 'predictionFactors';
    if (!t.predictionFactors) console.warn('Traduction manquante:', 'predictionFactors');
    predictionsSheet.getCell('A5').value = predictionFactorsVal;
    prediction.factors.forEach((factor, index) => {
      predictionsSheet.getCell(`A${6 + index}`).value = `• ${factor}`;
    });
// Styliser le tableau des facteurs de prédiction si présent (headers ligne 5, données ligne 6 à 6+factorsCount-1)
const factorsCount = data.patterns?.factors?.length || 0;
if (factorsCount > 0) {
  this.applyProfessionalTableStyling(predictionsSheet, 5, 6, 6 + factorsCount - 1, theme);
}
    this.applyEtsyStyling(predictionsSheet, theme, data.categories.length);
    return predictionsSheet;
  }

  static async createSimpleTracker(workbook, data, language, theme) {
    const t = this.getTranslations(language);
    const trackerSheet = workbook.addWorksheet(t.expenseTrackerSheet || 'Expense Tracker');
    trackerSheet.mergeCells('A1:D1');
    const expenseTrackerVal = t.expenseTracker || 'expenseTracker';
    if (!t.expenseTracker) console.warn('Traduction manquante:', 'expenseTracker');
    trackerSheet.getCell('A1').value = expenseTrackerVal;
    trackerSheet.getCell('A1').font = { size: 14, bold: true, color: { argb: 'FFFFFF' } };
    trackerSheet.getCell('A1').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: this.getThemeColor(theme, 'primary') }
    };
    trackerSheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
    trackerSheet.getRow(1).height = 28;

    const headers = ['date', 'category', 'description', 'amount'].map(key => {
      const val = t[key] || key;
      if (!t[key]) console.warn('Traduction manquante:', key);
      return val;
    });
    const headerRow = trackerSheet.addRow(headers);
    headerRow.eachCell(cell => {
      cell.font = { bold: true, size: 12 };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: this.getThemeColor(theme, 'accent') }
      };
      cell.border = this.getAllBorders();
    });

    data.expenses
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .forEach((expense, index) => {
        const row = trackerSheet.addRow([
          expense.date,
          expense.category,
          expense.description,
          expense.amount
        ]);
        row.eachCell(cell => {
          cell.border = this.getAllBorders();
        });
      });
    trackerSheet.columns = [
      { width: 15 }, { width: 18 }, { width: 30 }, { width: 12 }
    ];
    this.applyEtsyStyling(trackerSheet, theme, data.categories.length);
    // ... dans createSimpleTracker, après avoir rempli les lignes du tableau des dépenses ...
    if (data.expenses && data.expenses.length > 0) {
      const trackerBgColor = this.getThemeColor(theme, 'background');
      for (let row = 3; row <= 3 + data.expenses.length - 1; row++) {
        for (let col = 1; col <= 4; col++) {
          trackerSheet.getCell(row, col).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: trackerBgColor } };
        }
      }
    }
    // ...
    return trackerSheet;
  }

  static async createReportsSheet(workbook, data, language, theme) {
    const t = this.getTranslations(language);
    const worksheet = workbook.addWorksheet(t.reportsSheet || 'Reports');
    worksheet.mergeCells('A1:E1');
    const detailedReportVal = t.detailedReport || 'detailedReport';
    if (!t.detailedReport) console.warn('Traduction manquante:', 'detailedReport');
    worksheet.getCell('A1').value = detailedReportVal;
    worksheet.getCell('A1').font = { size: 16, bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getCell('A1').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: this.getThemeColor(theme, 'primary') }
    };
    worksheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getRow(1).height = 32;

    const analysisPatternsVal = t.analysisPatterns || 'analysisPatterns';
    if (!t.analysisPatterns) console.warn('Traduction manquante:', 'analysisPatterns');
    worksheet.getCell('A3').value = analysisPatternsVal;
    worksheet.getCell('A3').font = { bold: true, size: 12, color: { argb: this.getThemeColor(theme, 'primary') } };
    worksheet.getCell('A4').value = data && data.patterns ? (t[data.patterns.weekdayVsWeekend.insight] || data.patterns.weekdayVsWeekend.insight) : '';
    worksheet.getCell('A5').value = data && data.patterns ? (t[data.patterns.monthlyTrend.insight] || data.patterns.monthlyTrend.insight) : '';
    worksheet.getCell('A6').value = data && data.patterns ? (t[data.patterns.spendingVelocity.insight] || data.patterns.spendingVelocity.insight) : '';

    let currentRow = 8;
    const detectedAnomaliesVal = t.detectedAnomalies || 'detectedAnomalies';
    if (!t.detectedAnomalies) console.warn('Traduction manquante:', 'detectedAnomalies');
    worksheet.getCell(`A${currentRow}`).value = detectedAnomaliesVal;
    worksheet.getCell(`A${currentRow}`).font = { bold: true, color: { argb: this.getThemeColor(theme, 'secondary') } };
    currentRow++;
    if (data && data.patterns && data.patterns.unusualTransactions) {
      data.patterns.unusualTransactions.forEach((anomaly, index) => {
        worksheet.getCell(`A${currentRow + index}`).value =
          `${anomaly.date}: ${anomaly.description} - ${this.formatCurrency(anomaly.amount, language)} (${anomaly.severity})`;
      });
    }
    // Styliser le tableau d'anomalies si présent (headers ligne 8, données ligne 9 à 9+anomaliesCount-1)
const anomaliesCount = data.patterns?.unusualTransactions?.length || 0;
if (anomaliesCount > 0) {
  this.applyProfessionalTableStyling(worksheet, 8, 9, 9 + anomaliesCount - 1, theme);
}
    this.applyEtsyStyling(worksheet, theme, data.categories.length);
    return worksheet;
  }

  // ==========================================================================
  // 🎨 MÉTHODES DE STYLING ET UTILITAIRES
  // ==========================================================================
  static getThemeColor(theme, type) {
    const colors = {
      green: { 
        primary: '2E7D32', 
        secondary: '4CAF50', 
        accent: 'C8E6C9',
        background: 'E8F5E8'
      },
      blue: { 
        primary: '1976D2', 
        secondary: '42A5F5', 
        accent: 'BBDEFB',
        background: 'E3F2FD'
      },
      purple: { 
        primary: '7B1FA2', 
        secondary: 'AB47BC', 
        accent: 'E1BEE7',
        background: 'F3E5F5'
      },
      orange: { 
        primary: 'F57C00', 
        secondary: 'FF9800', 
        accent: 'FFE0B2',
        background: 'FFF3E0'
      }
    };

    return colors[theme]?.[type] || colors.green[type];
  }

  static applyEtsyStyling(worksheet, theme, categoryCount) {
    // Styling du header principal
    worksheet.getRow(1).height = 40;
    
    // Styling des sections
    const sectionCells = ['A4', 'A8'];
    sectionCells.forEach(cell => {
      worksheet.getCell(cell).font = { size: 14, bold: true, color: { argb: 'FFFFFF' } };
    });

    // Bordures pour les données
    const dataRange = `A5:E${9 + categoryCount}`;
    const range = worksheet.getCell(dataRange);
    if (range.address) {
      // Appliquer bordures à la plage
      for (let row = 5; row <= 9 + categoryCount; row++) {
        for (let col = 1; col <= 5; col++) {
          worksheet.getCell(row, col).border = this.getAllBorders();
        }
      }
    }

    // Formatage des montants
    for (let row = 6; row <= 9 + categoryCount; row++) {
      ['B', 'C', 'D'].forEach(col => {
        const cell = worksheet.getCell(`${col}${row}`);
        cell.numFmt = '#,##0.00 "€"';
      });
    }
  }

  static getAllBorders() {
    return {
      top: { style: 'thin', color: { argb: 'D1D5DB' } },
      bottom: { style: 'thin', color: { argb: 'D1D5DB' } },
      left: { style: 'thin', color: { argb: 'D1D5DB' } },
      right: { style: 'thin', color: { argb: 'D1D5DB' } }
    };
  }
  static applyProfessionalTableStyling(worksheet, headerRowIndex, dataStartRow, dataEndRow, theme) {
    // Style header
    const headerRow = worksheet.getRow(headerRowIndex);
    headerRow.eachCell(cell => {
      cell.font = { bold: true, color: { argb: 'FFFFFF' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: this.getThemeColor(theme, 'accent') }
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = this.getAllBorders();
    });
    // Bordures sur toutes les cellules du tableau
    for (let row = dataStartRow; row <= dataEndRow; row++) {
      worksheet.getRow(row).eachCell(cell => {
        cell.border = this.getAllBorders();
      });
    }
  }

  static downloadFile(buffer, fileName) {
    const blob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    console.log(`📥 Fichier téléchargé: ${fileName}`);
  }

  // ==========================================================================
  // 🧮 CALCULS ET VALIDATIONS
  // ==========================================================================
  static calculateWeeklyBreakdown(expenses, totalBudget) {
    if (!expenses || expenses.length === 0) {
      return Array(4).fill().map((_, i) => ({
        week: i + 1,
        spent: 0,
        budget: totalBudget / 4,
        variance: -totalBudget / 4,
        count: 0
      }));
    }

    const expensesByWeek = new Map();

    expenses.forEach(expense => {
      const date = new Date(expense.date);
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const daysSinceStart = Math.floor((date - startOfMonth) / (1000 * 60 * 60 * 24));
      const weekNumber = Math.floor(daysSinceStart / 7) + 1;

      if (!expensesByWeek.has(weekNumber)) {
        expensesByWeek.set(weekNumber, []);
      }
      expensesByWeek.get(weekNumber).push(expense);
    });

    const weeksInMonth = Math.max(4, ...Array.from(expensesByWeek.keys()));
    const weeklyBudget = totalBudget / weeksInMonth;

    const weeklyData = [];
    for (let week = 1; week <= weeksInMonth; week++) {
      const weekExpenses = expensesByWeek.get(week) || [];
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

  static calculateAverageUtilization(data) {
    if (!data.categories || data.categories.length === 0) return 0;

    const totalUtilization = data.categories.reduce((sum, category) => {
      const spent = data.expenses
        .filter(e => e.category === category.name)
        .reduce((sum, e) => sum + e.amount, 0);
      
      return sum + (category.budget > 0 ? (spent / category.budget) * 100 : 0);
    }, 0);

    return (totalUtilization / data.categories.length).toFixed(1);
  }

  static validateData(data) {
    const errors = [];
    const warnings = [];

    if (!data) {
      errors.push('Aucune donnée fournie');
      return { isValid: false, errors, warnings };
    }

    if (!Array.isArray(data.expenses)) {
      errors.push('expenses doit être un tableau');
    } else {
      data.expenses.forEach((expense, index) => {
        if (!expense.date || isNaN(new Date(expense.date))) {
          errors.push(`Date invalide pour la dépense ${index + 1}: ${expense.date}`);
        }
        if (typeof expense.amount !== 'number' || expense.amount < 0) {
          errors.push(`Montant invalide pour la dépense ${index + 1}: ${expense.amount}`);
        }
        if (!expense.category || typeof expense.category !== 'string') {
          errors.push(`Catégorie invalide pour la dépense ${index + 1}: ${expense.category}`);
        }
      });
    }

    if (!Array.isArray(data.categories)) {
      errors.push('categories doit être un tableau');
    }

    if (typeof data.totalBudget !== 'number' || data.totalBudget < 0) {
      errors.push(`Budget total invalide: ${data.totalBudget}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  static sanitizeData(data) {
    const sanitized = { ...data };

    if (sanitized.expenses) {
      sanitized.expenses = sanitized.expenses
        .filter(e => e && typeof e === 'object')
        .map(expense => ({
          date: expense.date,
          category: String(expense.category || 'Autre').trim(),
          description: String(expense.description || 'Non spécifié').trim(),
          amount: Number(expense.amount) || 0,
          notes: String(expense.notes || '').trim()
        }))
        .filter(e => e.amount > 0)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    if (sanitized.categories) {
      sanitized.categories = sanitized.categories
        .filter(c => c && typeof c === 'object' && c.name)
        .map(category => ({
          name: String(category.name).trim(),
          budget: Number(category.budget) || 0,
          color: category.color || '#6B7280'
        }));
    }

    sanitized.totalBudget = Number(sanitized.totalBudget) || 0;
    sanitized.totalSpent = Number(sanitized.totalSpent) || 0;
    sanitized.monthlyIncome = Number(sanitized.monthlyIncome) || 0;

    return sanitized;
  }

  static formatCurrency(amount, language = 'fr') {
    const formatters = {
      fr: new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }),
      en: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
    };

    return formatters[language]?.format(amount) || `${amount.toFixed(2)}€`;
  }

  // ==========================================================================
  // 💾 SYSTÈME DE CACHE
  // ==========================================================================
  static _generateCacheKey(data, options) {
    const keyData = {
      expensesHash: this._hashExpenses(data.expenses),
      totalBudget: data.totalBudget,
      totalSpent: data.totalSpent,
      template: options.template,
      theme: options.theme
    };
    return btoa(JSON.stringify(keyData)).slice(0, 20);
  }

  static _hashExpenses(expenses) {
    if (!expenses || expenses.length === 0) return 'empty';
    
    const sortedExpenses = expenses
      .slice()
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(e => `${e.date}-${e.amount}-${e.category}`)
      .join('|');
    
    return btoa(sortedExpenses).slice(0, 20);
  }

  static _getCachedResult(key) {
    if (!this.CONFIG.CACHE_ENABLED) return null;
    
    const cached = this._cache.get(key);
    if (cached && Date.now() - cached.timestamp < this._cacheExpiry) {
      console.log('✅ Cache hit pour export Excel');
      return cached;
    }
    
    if (cached) {
      this._cache.delete(key);
    }
    
    return null;
  }

  static _setCachedResult(key, data) {
    if (!this.CONFIG.CACHE_ENABLED) return;
    
    this._cache.set(key, {
      ...data,
      timestamp: Date.now()
    });

    if (this._cache.size > 10) {
      const oldestKey = this._cache.keys().next().value;
      this._cache.delete(oldestKey);
    }
  }

  // ==========================================================================
  // 🌍 TRADUCTIONS
  // ==========================================================================
  static getTranslations(language) {
    // Fallback sur 'fr' si la langue n'est pas supportée
    // (Suppose que translations est importé depuis src/i18n/translations.js)
    return translations[language] || translations['fr'];
  }

  // Méthodes manquantes pour compatibilité
  static async createDashboardSheet(workbook, data, language, theme) {
    return this.createEtsyDynamicTemplate(workbook, data, language, theme);
  }

  static async createAnalysisSheet(workbook, data, language, theme) {
    return this.createEtsyAdvancedTemplate(workbook, data, language, theme);
  }

  static async createRecommendationsSheet(workbook, data, language, theme) {
    return this.createReportsSheet(workbook, data, language, theme);
  }

  static async createRawDataSheet(workbook, data, language, theme) {
    return this.createSimpleTracker(workbook, data, language, theme);
  }

  static async createExecutiveSummary(workbook, data, language, theme) {
    return this.createEtsyMinimalTemplate(workbook, data, language, theme);
  }

  static async createKeyMetricsSheet(workbook, data, language) {
    const t = this.getTranslations(language);
    const worksheet = workbook.addWorksheet(t.keyMetricsSheet || 'Key Metrics');
    
    const keyMetricsVal = t.keyMetrics || 'keyMetrics';
    if (!t.keyMetrics) console.warn('Traduction manquante:', 'keyMetrics');
    worksheet.getCell('A1').value = keyMetricsVal;
    worksheet.getCell('A1').font = { size: 16, bold: true };

    const totalSpent = data.expenses.reduce((sum, e) => sum + e.amount, 0);
    const utilizationRate = data.totalBudget > 0 ? (totalSpent / data.totalBudget) * 100 : 0;
    const savingsRate = data.monthlyIncome > 0 ? ((data.monthlyIncome - totalSpent) / data.monthlyIncome) * 100 : 0;

    const totalSpentVal = t.totalSpent || 'totalSpent';
    const totalVal = t.total || 'total';
    const utilizationRateVal = t.utilizationRate || 'utilizationRate';
    const percentageVal = t.percentage || 'percentage';
    const savingsRateVal = t.savingsRate || 'savingsRate';
    const numberOfTransactionsVal = t.numberOfTransactions || 'numberOfTransactions';
    const transactionsVal = t.transactions || 'transactions';
    const activeCategoriesVal = t.activeCategories || 'activeCategories';
    const categoriesVal = t.categories || 'categories';
    if (!t.totalSpent) console.warn('Traduction manquante:', 'totalSpent');
    if (!t.total) console.warn('Traduction manquante:', 'total');
    if (!t.utilizationRate) console.warn('Traduction manquante:', 'utilizationRate');
    if (!t.percentage) console.warn('Traduction manquante:', 'percentage');
    if (!t.savingsRate) console.warn('Traduction manquante:', 'savingsRate');
    if (!t.numberOfTransactions) console.warn('Traduction manquante:', 'numberOfTransactions');
    if (!t.transactions) console.warn('Traduction manquante:', 'transactions');
    if (!t.activeCategories) console.warn('Traduction manquante:', 'activeCategories');
    if (!t.categories) console.warn('Traduction manquante:', 'categories');

    const metrics = [
      [`${totalSpentVal} ${totalVal}`, this.formatCurrency(totalSpent, language)],
      [`${utilizationRateVal} ${percentageVal}`, `${utilizationRate.toFixed(1)}%`],
      [`${savingsRateVal} ${percentageVal}`, `${savingsRate.toFixed(1)}%`],
      [`${numberOfTransactionsVal} ${transactionsVal}`, data.expenses.length],
      [`${activeCategoriesVal} ${categoriesVal}`, data.categories.length]
    ];

    metrics.forEach((metric, index) => {
      const row = 3 + index;
      worksheet.getCell(row, 1).value = metric[0];
      worksheet.getCell(row, 2).value = metric[1];
    });

// Styliser le tableau des métriques (headers ligne 1, données ligne 3 à 7)
this.applyProfessionalTableStyling(worksheet, 1, 3, 7, 'green');

    this.applyEtsyStyling(worksheet, 'green', data.categories.length);
    return worksheet;
  }
}

// =============================================================================
// 🎨 COMPOSANT REACT PRINCIPAL v3.0
// =============================================================================
const ExcelExportComponent = ({ budgetData }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportResult, setExportResult] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState('comprehensive');
  const [exportOptions, setExportOptions] = useState({
    template: 'comprehensive',
    chartTypes: ['pie', 'column', 'line'],
    theme: 'green',
    language: 'fr',
    enableCache: true
  });

  const availableTemplates = TemplateManager.getAvailableTemplates();

  // Validation des données en temps réel
  const validationResult = useMemo(() => {
    if (!budgetData) return { isValid: false, errors: ['Aucune donnée'] };
    return ExcelExportEngine.validateData(budgetData);
  }, [budgetData]);

  // Gestionnaire d'export
  const handleExport = useCallback(async () => {
    if (!validationResult.isValid) {
      setExportResult({
        success: false,
        error: 'Données invalides: ' + validationResult.errors.join(', ')
      });
      return;
    }

    setIsExporting(true);
    setExportResult(null);

    try {
      const result = await ExcelExportEngine.exportProfessionalBudget(
        budgetData, 
        exportOptions
      );
      setExportResult(result);
    } catch (error) {
      setExportResult({
        success: false,
        error: error.message
      });
    } finally {
      setIsExporting(false);
    }
  }, [budgetData, exportOptions, validationResult]);

  const handleTemplateChange = (template) => {
    setSelectedTemplate(template);
    setExportOptions({...exportOptions, template});
  };

  const handleChartTypeChange = (chartType, checked) => {
    const newChartTypes = checked 
      ? [...exportOptions.chartTypes, chartType]
      : exportOptions.chartTypes.filter(t => t !== chartType);
    
    setExportOptions({...exportOptions, chartTypes: newChartTypes});
  };

  // Interface utilisateur moderne v3.0
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            🎨 Excel Templates v3.0
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Templates dynamiques style Etsy avec graphiques natifs
          </p>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium">
          ✨ Templates Etsy
        </div>
      </div>

      {/* Validation Status */}
      <div className={`p-4 rounded-lg ${
        validationResult.isValid 
          ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700'
          : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700'
      }`}>
        <div className="flex items-center gap-2">
          {validationResult.isValid ? (
            <>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-800 dark:text-green-200 font-medium">
                Données validées ✓ Prêt pour l'export
              </span>
            </>
          ) : (
            <>
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-red-800 dark:text-red-200 font-medium">
                Erreurs détectées
              </span>
            </>
          )}
        </div>
        
        {validationResult.errors?.length > 0 && (
          <ul className="mt-2 text-sm text-red-700 dark:text-red-300 space-y-1">
            {validationResult.errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        )}
      </div>

      {/* Sélection de Template */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          🎨 Choisir un Template
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(availableTemplates).map(([key, template]) => (
            <div
              key={key}
              onClick={() => handleTemplateChange(key)}
              className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedTemplate === key
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
              }`}
            >
              {template.popular && (
                <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                  🔥 Populaire
                </div>
              )}
              
              <div className="space-y-2">
                <div className="font-medium text-gray-900 dark:text-white">
                  {template.name}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {template.description}
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-400">
                  {template.preview}
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-500">
                    {template.sheets.length} feuille(s)
                  </div>
                  <div className={`text-xs px-2 py-1 rounded ${
                    template.difficulty === 'Facile' ? 'bg-green-100 text-green-800' :
                    template.difficulty === 'Moyen' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {template.difficulty}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {template.features.slice(0, 2).map((feature, index) => (
                    <span key={index} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                      {feature}
                    </span>
                  ))}
                  {template.features.length > 2 && (
                    <span className="text-xs text-gray-500">
                      +{template.features.length - 2} autres
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Options avancées */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Types de graphiques */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            📊 Types de Graphiques
          </label>
          <div className="space-y-3">
            {[
              { key: 'pie', label: '🥧 Camembert', desc: 'Répartition des dépenses' },
              { key: 'column', label: '📊 Colonnes', desc: 'Comparaison Budget vs Réel' },
              { key: 'line', label: '📈 Lignes', desc: 'Évolution temporelle' }
            ].map(chart => (
              <label key={chart.key} className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                <input
                  type="checkbox"
                  checked={exportOptions.chartTypes.includes(chart.key)}
                  onChange={(e) => handleChartTypeChange(chart.key, e.target.checked)}
                  className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {chart.label}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {chart.desc}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Thème et options */}
        <div className="space-y-4">
          {/* Thème couleur */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              🎨 Thème Couleur
            </label>
            <select
              value={exportOptions.theme}
              onChange={(e) => setExportOptions({...exportOptions, theme: e.target.value})}
              className="w-full text-base p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="green">🟢 Vert (Nature)</option>
              <option value="blue">🔵 Bleu (Professionnel)</option>
              <option value="purple">🟣 Violet (Créatif)</option>
              <option value="orange">🟠 Orange (Dynamique)</option>
            </select>
          </div>

          {/* Langue */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              🌍 Langue
            </label>
            <select
              value={exportOptions.language}
              onChange={(e) => setExportOptions({...exportOptions, language: e.target.value})}
              className="w-full text-base p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="fr">🇫🇷 Français</option>
              <option value="en">🇺🇸 English</option>
              <option value="es">🇪🇸 Español</option>
            </select>
          </div>

          {/* Cache */}
          <div className="flex items-center justify-between p-3 border border-gray-300 dark:border-gray-600 rounded-lg">
            <div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                ⚡ Cache Performance
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Export plus rapide
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={exportOptions.enableCache}
                onChange={(e) => setExportOptions({...exportOptions, enableCache: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Aperçu du template sélectionné */}
      {selectedTemplate && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 dark:text-white mb-2">
            📋 Aperçu: {availableTemplates[selectedTemplate].name}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-gray-500 dark:text-gray-400">Feuilles</div>
              <div className="font-medium">{availableTemplates[selectedTemplate].sheets.join(', ')}</div>
            </div>
            <div>
              <div className="text-gray-500 dark:text-gray-400">Graphiques</div>
              <div className="font-medium">{exportOptions.chartTypes.length} type(s)</div>
            </div>
            <div>
              <div className="text-gray-500 dark:text-gray-400">Thème</div>
              <div className="font-medium capitalize">{exportOptions.theme}</div>
            </div>
            <div>
              <div className="text-gray-500 dark:text-gray-400">Données</div>
              <div className="font-medium">{budgetData?.expenses?.length || 0} transactions</div>
            </div>
          </div>
        </div>
      )}

      {/* Bouton d'export */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {availableTemplates[selectedTemplate]?.features.length} fonctionnalités • {exportOptions.chartTypes.length} graphiques
        </div>
        
        <button
          onClick={handleExport}
          disabled={!validationResult.isValid || isExporting || exportOptions.chartTypes.length === 0}
          className={`flex items-center gap-2 px-8 py-3 rounded-lg font-medium transition-all ${
            !validationResult.isValid || isExporting || exportOptions.chartTypes.length === 0
              ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
          }`}
        >
          {isExporting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Génération Excel...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              ✨ Créer Template Excel
            </>
          )}
        </button>
      </div>

      {/* Résultat de l'export */}
      {exportResult && (
        <div className={`p-4 rounded-lg ${
          exportResult.success
            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700'
            : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700'
        }`}>
          {exportResult.success ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-bold text-lg">🎉 Template Excel créé avec succès !</span>
              </div>
              
              <div className="text-sm text-green-700 dark:text-green-300 space-y-2">
                <div className="font-medium">📄 Fichier: {exportResult.fileName}</div>
                <div>📊 Template: {availableTemplates[exportResult.template]?.name}</div>
                <div>📈 Feuilles générées: {exportResult.sheetsGenerated}</div>
                <div>💾 Taille: {(exportResult.fileSize / 1024).toFixed(1)} KB</div>
                {exportResult.performance && (
                  <div>⚡ Temps: {exportResult.performance.executionTime}ms {exportResult.performance.cacheHit && '(🚀 cache)'}</div>
                )}
              </div>
              
              <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  <div className="font-medium mb-1">✨ Votre template contient :</div>
                  <ul className="space-y-1">
                    <li>• 📊 Graphiques Excel natifs dynamiques</li>
                    <li>• 🔄 Formules automatiques</li>
                    <li>• 🎨 Design moderne style Etsy</li>
                    <li>• 📱 Prêt à utiliser chaque mois</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-red-800 dark:text-red-200">
              <div className="flex items-center gap-2 font-medium mb-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Erreur lors de la création du template
              </div>
              <div className="text-sm">{exportResult.error}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export { ExcelExportEngine, ExcelExportComponent, TemplateManager, FinancialAnalyzer };
export default ExcelExportComponent;