// BudgetScreen.js - Version IA enrichie
import React, { memo, useMemo, useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import Button from '../components/ui/Button';
import { exportExpensesToExcel } from '../utils/ReportGenerator';

// Moteur IA pour l'analyse budgétaire
class BudgetAIEngine {
  static analyzeSpendingPatterns(expenses, categories) {
    return {
      weeklyTrends: this.calculateWeeklyTrends(expenses),
      seasonality: this.detectSeasonality(expenses),
      impulseSpending: this.detectImpulseSpending(expenses),
      categoryCorrelations: this.findCategoryCorrelations(expenses),
      predictedOverspend: this.predictOverspending(expenses, categories),
      behavioralInsights: this.generateBehavioralInsights(expenses),
      optimizationSuggestions: this.generateOptimizationSuggestions(expenses, categories)
    };
  }
  
  static calculateWeeklyTrends(expenses) {
    const weekData = Array(7).fill(0);
    const weekCounts = Array(7).fill(0);
    
    expenses.forEach(expense => {
      const day = new Date(expense.date).getDay();
      weekData[day] += expense.amount;
      weekCounts[day]++;
    });
    
    return weekData.map((total, index) => ({
      day: index,
      total,
      average: weekCounts[index] > 0 ? total / weekCounts[index] : 0,
      frequency: weekCounts[index]
    }));
  }
  
  static detectSeasonality(expenses) {
    const monthlyData = Array(12).fill(0);
    expenses.forEach(expense => {
      const month = new Date(expense.date).getMonth();
      monthlyData[month] += expense.amount;
    });
    
    const avg = monthlyData.reduce((a, b) => a + b, 0) / 12;
    return monthlyData.map((amount, month) => ({
      month,
      amount,
      variance: ((amount - avg) / avg) * 100
    }));
  }
  
  static detectImpulseSpending(expenses) {
    if (expenses.length === 0) return [];
    
    const avgAmount = expenses.reduce((sum, e) => sum + e.amount, 0) / expenses.length;
    const stdDev = Math.sqrt(
      expenses.reduce((sum, e) => sum + Math.pow(e.amount - avgAmount, 2), 0) / expenses.length
    );
    
    return expenses.filter(expense => expense.amount > avgAmount + (2 * stdDev))
      .map(expense => ({
        ...expense,
        severity: ((expense.amount - avgAmount) / stdDev).toFixed(1)
      }));
  }
  
  static predictOverspending(expenses, categories) {
    const predictions = {};
    const currentDate = new Date();
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const daysPassed = currentDate.getDate();
    
    categories.forEach(category => {
      const categoryExpenses = expenses.filter(e => e.category === category.name);
      const currentSpent = categoryExpenses.reduce((sum, e) => sum + e.amount, 0);
      const dailyRate = currentSpent / daysPassed;
      const projectedSpending = dailyRate * daysInMonth;
      
      predictions[category.name] = {
        current: currentSpent,
        projected: projectedSpending,
        budget: category.budget,
        overSpendRisk: projectedSpending > category.budget ? 
          ((projectedSpending - category.budget) / category.budget) * 100 : 0,
        recommendation: this.generateCategoryRecommendation(currentSpent, projectedSpending, category.budget)
      };
    });
    
    return predictions;
  }
  
  static generateBehavioralInsights(expenses) {
    const insights = [];
    
    if (expenses.length === 0) return insights;
    
    // Analyse des jours de dépense
    const spendingByDay = this.calculateWeeklyTrends(expenses);
    const highestSpendingDay = spendingByDay.reduce((max, day, index) => 
      day.total > spendingByDay[max].total ? index : max, 0);
    
    const dayNames = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    
    insights.push({
      type: 'behavioral',
      category: 'timing',
      message: `Vos dépenses sont les plus élevées le ${dayNames[highestSpendingDay]}`,
      impact: 'medium',
      suggestion: 'Planifiez vos achats pour éviter les dépenses impulsives'
    });
    
    // Analyse des montants fréquents
    const amounts = expenses.map(e => Math.round(e.amount / 10) * 10);
    const amountFreq = amounts.reduce((freq, amount) => {
      freq[amount] = (freq[amount] || 0) + 1;
      return freq;
    }, {});
    
    const mostFrequentAmount = Object.keys(amountFreq)
      .reduce((a, b) => amountFreq[a] > amountFreq[b] ? a : b);
    
    if (amountFreq[mostFrequentAmount] > 3) {
      insights.push({
        type: 'pattern',
        category: 'amount',
        message: `Vous dépensez souvent autour de ${mostFrequentAmount}€`,
        impact: 'low',
        suggestion: 'Cette régularité peut indiquer des habitudes de consommation à optimiser'
      });
    }
    
    return insights;
  }
  
  static generateOptimizationSuggestions(expenses, categories) {
    const suggestions = [];
    
    categories.forEach(category => {
      const categoryExpenses = expenses.filter(e => e.category === category.name);
      if (categoryExpenses.length === 0) return;
      
      const avgExpense = categoryExpenses.reduce((sum, e) => sum + e.amount, 0) / categoryExpenses.length;
      const totalSpent = categoryExpenses.reduce((sum, e) => sum + e.amount, 0);
      
      if (totalSpent > category.budget * 0.8) {
        suggestions.push({
          category: category.name,
          type: 'warning',
          message: `Budget ${category.name} à 80% - surveillez vos dépenses`,
          action: 'reduce_spending',
          potential_savings: (totalSpent - category.budget * 0.7).toFixed(2)
        });
      }
      
      if (avgExpense > 50 && categoryExpenses.length > 5) {
        suggestions.push({
          category: category.name,
          type: 'optimization',
          message: `Dépense moyenne élevée en ${category.name}: ${avgExpense.toFixed(2)}€`,
          action: 'bulk_buying',
          potential_savings: (avgExpense * 0.15 * categoryExpenses.length).toFixed(2)
        });
      }
    });
    
    return suggestions;
  }
  
  static generateCategoryRecommendation(current, projected, budget) {
    const usage = (current / budget) * 100;
    const projectedUsage = (projected / budget) * 100;
    
    if (projectedUsage > 120) return { level: 'critical', action: 'immediate_reduction' };
    if (projectedUsage > 100) return { level: 'warning', action: 'careful_monitoring' };
    if (usage < 50) return { level: 'good', action: 'continue_current_pace' };
    return { level: 'moderate', action: 'maintain_awareness' };
  }
  
  static findCategoryCorrelations(expenses) {
    // Analyse simple des corrélations entre catégories
    const categories = [...new Set(expenses.map(e => e.category))];
    const correlations = {};
    
    categories.forEach(cat1 => {
      categories.forEach(cat2 => {
        if (cat1 !== cat2) {
          const cat1Expenses = expenses.filter(e => e.category === cat1);
          const cat2Expenses = expenses.filter(e => e.category === cat2);
          
          if (cat1Expenses.length > 0 && cat2Expenses.length > 0) {
            const avg1 = cat1Expenses.reduce((sum, e) => sum + e.amount, 0) / cat1Expenses.length;
            const avg2 = cat2Expenses.reduce((sum, e) => sum + e.amount, 0) / cat2Expenses.length;
            
            correlations[`${cat1}-${cat2}`] = {
              correlation: Math.abs(avg1 - avg2) < 20 ? 'high' : 'low',
              avg1,
              avg2
            };
          }
        }
      });
    });
    
    return correlations;
  }
}

// Widget IA Insights unifié - Fusion des prédictions, recommandations et anomalies
const AIInsights = memo(({ expenses, categories, theme, t, formatCurrency }) => {
  // Analyse des données réelles
  const totalBudget = categories.reduce((sum, cat) => sum + cat.budget, 0);
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const budgetUtilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  
  // Trouver les catégories les plus dépensées
  const categorySpending = categories.map(cat => {
    const spent = expenses.filter(e => e.category === cat.name).reduce((sum, e) => sum + e.amount, 0);
    const percentage = (spent / cat.budget) * 100;
    return { ...cat, spent, percentage };
  }).sort((a, b) => b.spent - a.spent);
  
  // Trouver les catégories en dépassement
  const overspentCategories = categorySpending.filter(cat => cat.percentage > 100);
  const warningCategories = categorySpending.filter(cat => cat.percentage > 80 && cat.percentage <= 100);
  
  // Calculer les économies potentielles
  const potentialSavings = overspentCategories.reduce((sum, cat) => {
    return sum + (cat.spent - cat.budget);
  }, 0);
  
  // Analyser les tendances de dépenses
  const recentExpenses = expenses
    .filter(e => new Date(e.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  
  const averageDailySpending = recentExpenses.length > 0 
    ? recentExpenses.reduce((sum, e) => sum + e.amount, 0) / 7 
    : 0;

  return (
    <div className={`${theme.card} rounded-xl border ${theme.border} p-6`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-2xl font-semibold ${theme.text} flex items-center`}>
          <Icons.Brain className="h-6 w-6 mr-3 text-indigo-500" />
          {t('aiInsights')}
        </h3>
        <div className="flex items-center space-x-2 text-xs text-indigo-500">
          <Icons.Zap className="h-3 w-3" />
          <span>{t('analyzedInRealtime')}</span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Section Prédictions - Basée sur les vraies données */}
        <div className={`p-4 rounded-lg ${theme.bg} border ${theme.border}`}>
          <h4 className={`text-lg font-semibold ${theme.text} mb-4 flex items-center`}>
            <Icons.TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
            {t('budgetPredictions')}
          </h4>
          <div className="space-y-3">
            <div className={`p-3 rounded-lg border ${theme.border} ${theme.bg}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`font-medium ${theme.text}`}>{t('globalBudgetUsage')}</span>
                <span className={`font-bold ${budgetUtilization > 100 ? 'text-red-600' : budgetUtilization > 80 ? 'text-yellow-600' : 'text-green-600'}`}>{budgetUtilization.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                <div
                  className={`h-2 rounded-full transition-all ${budgetUtilization > 100 ? 'bg-red-500' : budgetUtilization > 80 ? 'bg-yellow-500' : 'bg-green-500'}`}
                  style={{ width: `${Math.min(budgetUtilization, 100)}%` }}
                />
              </div>
              <p className={`text-sm ${theme.textSecondary}`}>
                {budgetUtilization > 100 
                  ? t('budgetExceeded', { amount: formatCurrency(totalSpent - totalBudget) })
                  : budgetUtilization > 80
                  ? t('budgetWarning', { amount: formatCurrency(totalBudget - totalSpent) })
                  : t('budgetExcellent', { amount: formatCurrency(totalBudget - totalSpent) })
                }
              </p>
            </div>

            {averageDailySpending > 0 && (
              <div className={`p-3 rounded-lg border ${theme.border} ${theme.bg}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-medium ${theme.text}`}>{t('averageDailySpending')}</span>
                  <span className={`font-bold ${theme.text}`}>{formatCurrency(averageDailySpending)}</span>
                </div>
                <p className={`text-sm ${theme.textSecondary}`}>{t('basedOnLast7Days')}</p>
              </div>
            )}
          </div>
        </div>

        {/* Section Recommandations - Transformée en insights comportementaux */}
        <div className={`p-4 rounded-lg ${theme.bg} border ${theme.border}`}>
          <h4 className={`text-lg font-semibold ${theme.text} mb-4 flex items-center`}>
            <Icons.Target className="h-5 w-5 mr-2 text-green-500" />
            {t('behavioralInsights')}
          </h4>
          <div className="space-y-3">
            {/* Analyse des habitudes de dépenses */}
            {expenses.length > 0 && (
              <div className={`p-3 rounded-lg border ${theme.border} ${theme.bg}`}>
                <h5 className={`font-medium ${theme.text} mb-3 flex items-center`}>
                  <Icons.Activity className="h-4 w-4 mr-2 text-blue-500" />
                  {t('habitAnalysis')}
                </h5>
                <div className="space-y-2 text-sm">
                  {(() => {
                    // Analyser les jours de dépense
                    const spendingByDay = Array(7).fill(0);
                    const dayNames = [t('sunday'), t('monday'), t('tuesday'), t('wednesday'), t('thursday'), t('friday'), t('saturday')];
                    expenses.forEach(expense => {
                      const day = new Date(expense.date).getDay();
                      spendingByDay[day] += expense.amount;
                    });
                    const maxDay = spendingByDay.indexOf(Math.max(...spendingByDay));
                    const daysWithoutExpenses = spendingByDay
                      .map((amount, index) => ({ amount, day: index, name: dayNames[index] }))
                      .filter(day => day.amount === 0)
                      .map(day => day.name);
                    return (
                      <>
                        <div className="flex justify-between items-center">
                          <span className={theme.textSecondary}>{t('maxSpendingDay')}</span>
                          <span className={`font-medium ${theme.text}`}>{dayNames[maxDay]} ({formatCurrency(spendingByDay[maxDay])})</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className={theme.textSecondary}>{t('daysWithoutSpending')}</span>
                          <span className={`font-medium ${theme.text}`}>{daysWithoutExpenses.length > 0 ? daysWithoutExpenses.slice(0, 3).join(', ') + (daysWithoutExpenses.length > 3 ? '...' : '') : t('none')}</span>
                        </div>
                        {expenses.length > 0 && (
                          <div className="flex justify-between items-center">
                            <span className={theme.textSecondary}>{t('totalSpending')}</span>
                            <span className={`font-medium ${theme.text}`}>{formatCurrency(expenses.reduce((sum, e) => sum + e.amount, 0))}</span>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* Suggestions d'optimisation */}
            <div className={`p-3 rounded-lg border ${theme.border} ${theme.bg}`}>
              <h5 className={`font-medium ${theme.text} mb-3 flex items-center`}>
                <Icons.Lightbulb className="h-4 w-4 mr-2 text-yellow-500" />
                {t('optimizationSuggestions')}
              </h5>
              <div className="space-y-2 text-sm">
                {(() => {
                  const suggestions = [];
                  if (categories.length < 5) {
                    suggestions.push({ icon: Icons.Plus, text: t('addMoreCategories'), color: 'text-blue-600' });
                  }
                  if (recentExpenses.length > 0) {
                    const avgAmount = recentExpenses.reduce((sum, e) => sum + e.amount, 0) / recentExpenses.length;
                    if (avgAmount > 50) {
                      suggestions.push({ icon: Icons.TrendingDown, text: t('highAverageSpending'), color: 'text-orange-600' });
                    }
                  }
                  const usedCategories = [...new Set(expenses.map(e => e.category))];
                  if (usedCategories.length < categories.length * 0.5) {
                    suggestions.push({ icon: Icons.BarChart3, text: t('diversifySpending'), color: 'text-purple-600' });
                  }
                  if (suggestions.length === 0) {
                    suggestions.push({ icon: Icons.CheckCircle, text: t('spendingHabitsBalanced'), color: 'text-green-600' });
                  }
                  return suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <suggestion.icon className={`h-4 w-4 mt-0.5 ${suggestion.color}`} />
                      <span className={`${theme.textSecondary}`}>{suggestion.text}</span>
                    </div>
                  ));
                })()}
              </div>
            </div>

            {/* Objectifs et progrès */}
            <div className={`p-3 rounded-lg border ${theme.border} ${theme.bg}`}>
              <h5 className={`font-medium ${theme.text} mb-3 flex items-center`}>
                <Icons.TrendingUp className="h-4 w-4 mr-2 text-purple-500" />
                {t('trendAnalysis')}
              </h5>
              <div className="space-y-2 text-sm">
                {(() => {
                  const monthlyExpenses = expenses.filter(e => {
                    const expenseDate = new Date(e.date);
                    const currentDate = new Date();
                    return expenseDate.getMonth() === currentDate.getMonth() && expenseDate.getFullYear() === currentDate.getFullYear();
                  });
                  const weeklyExpenses = expenses.filter(e => {
                    const expenseDate = new Date(e.date);
                    const currentDate = new Date();
                    const weekAgo = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
                    return expenseDate >= weekAgo && expenseDate <= currentDate;
                  });
                  const monthlyTotal = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);
                  const weeklyTotal = weeklyExpenses.reduce((sum, e) => sum + e.amount, 0);
                  const avgWeekly = monthlyTotal / 4;
                  return (
                    <>
                      <div className="flex justify-between items-center">
                        <span className={theme.textSecondary}>{t('spendingThisWeek')}</span>
                        <span className={`font-medium ${theme.text}`}>{formatCurrency(weeklyTotal)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={theme.textSecondary}>{t('weeklyAverage')}</span>
                        <span className={`font-medium ${theme.text}`}>{formatCurrency(avgWeekly)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={theme.textSecondary}>{t('trend')}</span>
                        <span className={`font-medium ${weeklyTotal > avgWeekly ? 'text-red-600' : 'text-green-600'}`}>{weeklyTotal > avgWeekly ? t('aboveAverage') : t('belowAverage')}</span>
                      </div>
                      {weeklyTotal > avgWeekly && (
                        <div className="flex items-center space-x-2 text-orange-600">
                          <Icons.AlertCircle className="h-4 w-4" />
                          <span className="text-sm">{t('spendingAboveAverage')}</span>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Conseils personnalisés */}
            <div className={`p-3 rounded-lg border ${theme.border} ${theme.bg}`}>
              <h5 className={`font-medium ${theme.text} mb-3 flex items-center`}>
                <Icons.MessageSquare className="h-4 w-4 mr-2 text-indigo-500" />
                {t('personalizedTips')}
              </h5>
              <div className="space-y-2 text-sm">
                {(() => {
                  const tips = [];
                  if (expenses.length === 0) {
                    tips.push(t('addFirstExpensesTip'));
                  } else if (budgetUtilization > 100) {
                    tips.push(t('prioritizeEssentials'));
                    tips.push(t('reviewBudgets'));
                  } else if (budgetUtilization > 80) {
                    tips.push(t('watchSpendingThisWeek'));
                    tips.push(t('planPurchases'));
                  } else {
                    tips.push(t('excellentControl'));
                    tips.push(t('increaseSavingsGoals'));
                  }
                  return tips.map((tip, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <Icons.CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <span className={theme.textSecondary}>{tip}</span>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>
        </div>

        {/* Section Anomalies - Basée sur les vraies données */}
        <div className={`p-4 rounded-lg ${theme.bg} border ${theme.border}`}>
          <h4 className={`text-lg font-semibold ${theme.text} mb-4 flex items-center`}>
            <Icons.Shield className="h-5 w-5 mr-2 text-red-500" />
            {t('anomalyDetection')}
          </h4>
          <div className="space-y-3">
            {expenses.length === 0 ? (
              <div className="text-center py-6">
                <Icons.Shield className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className={`${theme.textSecondary} text-sm`}>{t('noDataToAnalyze')}</p>
                <p className={`${theme.textSecondary} text-xs mt-1`}>{t('addFirstExpenses')}</p>
              </div>
            ) : (
              <>
                {overspentCategories.length > 0 && (
                  <div className={`p-3 rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/20`}>
                    <div className="flex items-center space-x-2 mb-2">
                      <Icons.AlertTriangle className="h-4 w-4 text-red-600" />
                      <span className="font-medium text-sm text-red-800 dark:text-red-200">
                        {t('overspendingDetected', { count: overspentCategories.length })}
                      </span>
                    </div>
                    <p className={`text-sm ${theme.textSecondary} mb-3`}>{t('categoriesExceededBudget')}</p>
                    
                    {/* Liste des catégories en dépassement */}
                    <div className="space-y-2">
                      {overspentCategories.map((category, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <span className="font-medium text-red-800 dark:text-red-200">
                            {category.name}
                          </span>
                          <div className="text-right">
                            <span className="text-red-800 dark:text-red-200">
                              {formatCurrency(category.spent)} / {formatCurrency(category.budget)}
                            </span>
                            <span className="ml-2 text-xs text-red-600">
                              ({category.percentage.toFixed(1)}%)
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {recentExpenses.length > 0 && (
                  <div className={`p-3 rounded-lg border ${theme.border} ${theme.bg}`}>
                    <h5 className={`font-medium ${theme.text} mb-3 flex items-center`}>
                      <Icons.Activity className="h-4 w-4 mr-2 text-blue-500" />
                      {t('recentActivity')}
                    </h5>
                    <div className="space-y-2 text-sm">
                      {recentExpenses.slice(0, 3).map((expense, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className={theme.text}>{expense.description}</span>
                          <span className={`font-medium ${theme.text}`}>{formatCurrency(expense.amount)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {/* Conseils de prévention */}
                <div className={`p-3 rounded-lg border ${theme.border} ${theme.bg}`}>
                  <h5 className={`font-medium ${theme.text} mb-3 flex items-center`}>
                    <Icons.Lightbulb className="h-4 w-4 mr-2 text-yellow-500" />
                    {t('personalizedTips')}
                  </h5>
                  <div className="space-y-2 text-sm">
                    {budgetUtilization > 100 ? (
                      <>
                        <div className="flex items-start space-x-2">
                          <Icons.CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                          <span className={theme.textSecondary}>{t('reduceSpendingInOverspent')}</span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <Icons.CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                          <span className={theme.textSecondary}>{t('revisitSpendingPriorities')}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-start space-x-2">
                          <Icons.CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                          <span className={theme.textSecondary}>{t('keepMonitoringSpending')}</span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <Icons.CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                          <span className={theme.textSecondary}>{t('planPurchasesInAdvance')}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

// Composant principal amélioré
const BudgetScreen = memo(({ financeManager, theme, t }) => {
  const { state, actions, computedValues, formatCurrency } = financeManager;
  const [activeWidget, setActiveWidget] = useState('overview');
  const [aiInsights, setAiInsights] = useState(null);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editedBudget, setEditedBudget] = useState('');

  // Analyse IA en temps réel
  useEffect(() => {
    const analysis = BudgetAIEngine.analyzeSpendingPatterns(
      computedValues.currentMonthExpenses, 
      state.categories
    );
    setAiInsights(analysis);
  }, [computedValues.currentMonthExpenses, state.categories]);

  const widgets = {
    overview: { icon: Icons.BarChart3, label: t('overview') },
    aiInsights: { icon: Icons.Brain, label: t('aiInsights') }
  };

  return (
    <div className={`min-h-screen ${theme.bg} transition-colors duration-500`}>
      <div className={`${theme.card} border-b ${theme.border} sticky top-0 z-10 backdrop-blur-lg bg-opacity-90 mt-6`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t('budgetOverview')}
            </h1>
          </div>
          <div className="flex items-center space-x-1 mt-4 overflow-x-auto">
            {Object.entries(widgets).map(([key, widget]) => (
              <button
                key={key}
                onClick={() => setActiveWidget(key)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                  activeWidget === key
                    ? `bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400`
                    : `${theme.text} hover:bg-gray-100 dark:hover:bg-gray-800`
                }`}
                aria-label={`Aller à ${widget.label}`}
              >
                <widget.icon className="h-4 w-4" />
                <span className="text-sm font-medium">{widget.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Contenu des widgets */}
        <div className={activeWidget === 'overview' ? 'space-y-6' : 'grid grid-cols-1 xl:grid-cols-2 gap-6'}>
          {activeWidget === 'overview' && (
            <>
              {/* Vue d'ensemble classique améliorée */}
              <div className={`${theme.card} rounded-xl border ${theme.border} p-6`}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className={`text-2xl font-bold ${theme.text}`}>{t('budgetOverview')}</h2>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => actions.toggleModal('category', true)}
                      className="flex items-center space-x-2"
                    >
                      <Icons.Plus className="h-4 w-4" />
                      <span>{t('newCategory')}</span>
                    </Button>
                  </div>
                </div>
                
                {/* Graphique des budgets */}
                <div className="space-y-4">
                  {/* Liste détaillée des budgets (d'abord) */}
                  <div className="max-h-[28rem] overflow-y-auto space-y-4">
                    {state.categories.map(category => {
                      const spent = computedValues.currentMonthExpenses
                        .filter(e => e.category === category.name)
                        .reduce((sum, e) => sum + e.amount, 0);
                      const percentage = category.budget > 0 ? (spent / category.budget) * 100 : 0;
                      
                      return (
                        <div key={category.id} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className={`font-medium ${theme.text}`}>{category.name}</span>
                            <div className="flex items-center space-x-2">
                              {editingCategoryId === category.id ? (
                                <>
                                  <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    className="w-24 px-2 py-1 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 text-black dark:text-white bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400"
                                    style={{
                                      color: 'inherit',
                                      backgroundColor: 'var(--tw-bg-opacity, 1)',
                                    }}
                                    value={editedBudget}
                                    onChange={e => setEditedBudget(e.target.value)}
                                    onKeyPress={e => {
                                      if (e.key === 'Enter') {
                                        actions.updateCategoryBudget(category.id, parseFloat(editedBudget));
                                        setEditingCategoryId(null);
                                        setEditedBudget('');
                                      }
                                    }}
                                  />
                                  <button
                                    className="text-green-600 hover:text-green-800 p-1 rounded transition-colors"
                                    title={t('validate')}
                                    onClick={() => {
                                      actions.updateCategoryBudget(category.id, parseFloat(editedBudget));
                                      setEditingCategoryId(null);
                                      setEditedBudget('');
                                    }}
                                  >
                                    <Icons.Check className="h-4 w-4" />
                                  </button>
                                  <button
                                    className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                                    title={t('cancel')}
                                    onClick={() => {
                                      setEditingCategoryId(null);
                                      setEditedBudget('');
                                    }}
                                  >
                                    <Icons.X className="h-4 w-4" />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <span className={`text-sm font-medium ${percentage > 100 ? 'text-red-600' : theme.text}`}>
                                    {formatCurrency(spent)} / {formatCurrency(category.budget)}
                                  </span>
                                  <button
                                    onClick={() => {
                                      setEditingCategoryId(category.id);
                                      setEditedBudget(category.budget.toString());
                                    }}
                                    className="text-gray-400 hover:text-blue-600 p-1 rounded transition-colors"
                                    title={t('editBudget')}
                                  >
                                    <Icons.Edit className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => actions.deleteCategory(category.id)}
                                    className="text-red-500 hover:text-red-700 p-1 rounded transition-colors"
                                    title={t('deleteCategory')}
                                  >
                                    <Icons.Trash2 className="h-4 w-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 relative">
                            <div
                              className={`h-3 rounded-full transition-all ${
                                percentage > 100 ? 'bg-red-500' : 
                                percentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${Math.min(percentage, 100)}%` }}
                            />
                            {percentage > 100 && (
                              <div className="absolute top-0 right-0 w-2 h-3 bg-red-600 rounded-r-full" />
                            )}
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className={theme.textSecondary}>{typeof percentage === 'number' && !isNaN(percentage) ? percentage.toFixed(1) : '0.0'}% {t('used')}</span>
                            <span className={theme.textSecondary}>
                              {formatCurrency(Math.max(0, category.budget - spent))} {t('remaining')}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Graphique visuel des budgets (en bas) */}
                  <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h3 className={`text-lg font-semibold ${theme.text} mb-4`}>{t('overallBudgetVisual')}</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Graphique en barres amélioré */}
                      <div className={`p-4 rounded-lg ${theme.bg} border ${theme.border}`}>
                        <h4 className={`font-medium ${theme.text} mb-4 flex items-center`}>
                          <Icons.BarChart3 className="h-5 w-5 mr-2 text-blue-500" />
                          {t('budgetUsage')}
                        </h4>
                        <div className="space-y-4">
                          {state.categories.map(category => {
                            const spent = computedValues.currentMonthExpenses
                              .filter(e => e.category === category.name)
                              .reduce((sum, e) => sum + e.amount, 0);
                            const percentage = (spent / category.budget) * 100;
                            const remaining = Math.max(0, category.budget - spent);
                            
                            return (
                              <div key={category.id} className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className={`font-medium text-sm ${theme.text}`}>{category.name}</span>
                                  <div className="flex items-center space-x-2 text-xs">
                                    <span className={theme.textSecondary}>
                                      {formatCurrency(spent)} / {formatCurrency(category.budget)}
                                    </span>
                                    <span className={`font-medium ${percentage > 100 ? 'text-red-600' : percentage > 80 ? 'text-yellow-600' : 'text-green-600'}`}>
                                      {typeof percentage === 'number' && !isNaN(percentage) ? percentage.toFixed(1) : '0.0'}%
                                    </span>
                                  </div>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 relative">
                                  <div
                                    className={`h-3 rounded-full transition-all ${
                                      percentage > 100 ? 'bg-red-500' : 
                                      percentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
                                    }`}
                                    style={{ width: `${Math.min(percentage, 100)}%` }}
                                  />
                                  {percentage > 100 && (
                                    <div className="absolute top-0 right-0 w-1 h-3 bg-red-600 rounded-r-full" />
                                  )}
                                </div>
                                <div className="flex justify-between text-xs">
                                  <span className={theme.textSecondary}>
                                    {t('remaining')}: {formatCurrency(remaining)}
                                  </span>
                                  <span className={`${percentage > 100 ? 'text-red-600' : theme.textSecondary}`}>
                                    {percentage > 100 ? t('exceeded') : percentage > 80 ? t('attention') : t('normal')}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Graphique circulaire amélioré */}
                      <div className={`p-4 rounded-lg ${theme.bg} border ${theme.border}`}>
                        <h4 className={`font-medium ${theme.text} mb-4 flex items-center`}>
                          <Icons.PieChart className="h-5 w-5 mr-2 text-purple-500" />
                          {t('totalDistribution')}
                        </h4>
                        <div className="flex items-center justify-center mb-4">
                          <div className="relative w-40 h-40">
                            {/* Vrai graphique circulaire */}
                            <svg className="w-40 h-40" viewBox="0 0 100 100">
                              {(() => {
                                const totalBudget = state.categories.reduce((sum, cat) => sum + cat.budget, 0);
                                const totalSpent = computedValues.currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
                                const percentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
                                const radius = 35;
                                const circumference = 2 * Math.PI * radius;
                                const strokeDasharray = circumference;
                                const strokeDashoffset = circumference - (percentage / 100) * circumference;
                                
                                return (
                                  <>
                                    {/* Cercle de fond */}
                                    <circle
                                      cx="50"
                                      cy="50"
                                      r={radius}
                                      fill="none"
                                      stroke="#e5e7eb"
                                      strokeWidth="8"
                                      className="dark:stroke-gray-700"
                                    />
                                    {/* Cercle de progression */}
                                    <circle
                                      cx="50"
                                      cy="50"
                                      r={radius}
                                      fill="none"
                                      stroke={percentage > 100 ? '#ef4444' : percentage > 80 ? '#f59e0b' : '#10b981'}
                                      strokeWidth="8"
                                      strokeDasharray={strokeDasharray}
                                      strokeDashoffset={strokeDashoffset}
                                      strokeLinecap="round"
                                      transform="rotate(-90 50 50)"
                                      className="transition-all duration-1000 ease-out"
                                    />
                                  </>
                                );
                              })()}
                            </svg>
                            
                            {/* Centre avec statistiques */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-center">
                                <div className={`text-2xl font-bold ${theme.text}`}>
                                  {(() => {
                                    const totalSpent = computedValues.currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
                                    const totalBudget = state.categories.reduce((sum, cat) => sum + cat.budget, 0);
                                    return totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(1) : '0';
                                  })()}%
                                </div>
                                <div className={`text-xs ${theme.textSecondary}`}>{t('used')}</div>
                                <div className={`text-xs ${theme.textSecondary} mt-1`}>
                                  {(() => {
                                    const totalSpent = computedValues.currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
                                    const totalBudget = state.categories.reduce((sum, cat) => sum + cat.budget, 0);
                                    return formatCurrency(totalSpent) + ' / ' + formatCurrency(totalBudget);
                                  })()}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Légende améliorée */}
                        <div className="grid grid-cols-1 gap-2 text-xs">
                          {state.categories.map((category, index) => {
                            const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];
                            const spent = computedValues.currentMonthExpenses
                              .filter(e => e.category === category.name)
                              .reduce((sum, e) => sum + e.amount, 0);
                            const percentage = (spent / category.budget) * 100;
                            
                            return (
                              <div key={category.id} className="flex items-center justify-between p-2 rounded bg-gray-50 dark:bg-gray-800">
                                <div className="flex items-center space-x-2">
                                  <div 
                                    className="w-3 h-3 rounded-full" 
                                    style={{ backgroundColor: colors[index % colors.length] }}
                                  />
                                  <span className={`font-medium ${theme.text}`}>{category.name}</span>
                                </div>
                                <div className="text-right">
                                  <div className={`font-medium ${percentage > 100 ? 'text-red-600' : theme.text}`}>
                                    {typeof percentage === 'number' && !isNaN(percentage) ? percentage.toFixed(1) : '0.0'}%
                                  </div>
                                  <div className={`text-xs ${theme.textSecondary}`}>
                                    {formatCurrency(spent)}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeWidget === 'aiInsights' && (
            <div className="xl:col-span-2">
              <AIInsights
                expenses={computedValues.currentMonthExpenses}
                categories={state.categories}
                theme={theme}
                t={t}
                formatCurrency={formatCurrency}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default BudgetScreen;