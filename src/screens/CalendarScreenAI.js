// CalendarScreen.js - Version IA enrichie COMPLÈTE
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import * as Icons from 'lucide-react';

// Moteur IA pour l'analyse du calendrier
class CalendarAIEngine {
  static analyzeSpendingPatterns(expenses, categories) {
    // Ensure expenses and categories are arrays
    const safeExpenses = Array.isArray(expenses) ? expenses : [];
    const safeCategories = Array.isArray(categories) ? categories : [];
    
    return {
      dailyPatterns: this.analyzeDailyPatterns(safeExpenses),
      weeklyTrends: this.analyzeWeeklyTrends(safeExpenses),
      predictiveInsights: this.generatePredictiveInsights(safeExpenses),
      behavioralAnalysis: this.analyzeBehavior(safeExpenses),
      categoryTimeCorrelations: this.analyzeCategoryTiming(safeExpenses, safeCategories)
    };
  }

  static analyzeDailyPatterns(expenses) {
    const patterns = {};
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    
    if (!Array.isArray(expenses)) return patterns;
    
    expenses.forEach(expense => {
      const dayOfWeek = new Date(expense.date).getDay();
      const dayName = dayNames[dayOfWeek];
      if (!patterns[dayName]) {
        patterns[dayName] = { total: 0, count: 0, expenses: [] };
      }
      patterns[dayName].total += expense.amount;
      patterns[dayName].count++;
      patterns[dayName].expenses.push(expense);
    });

    Object.keys(patterns).forEach(day => {
      patterns[day].average = patterns[day].total / patterns[day].count || 0;
      patterns[day].riskLevel = this.calculateRiskLevel(patterns[day].average, patterns[day].count);
    });

    return patterns;
  }

  static generatePredictiveInsights(expenses) {
    const insights = [];
    
    if (!Array.isArray(expenses)) return insights;
    
    const today = new Date();
    const currentMonth = today.getMonth();
    const daysInMonth = new Date(today.getFullYear(), currentMonth + 1, 0).getDate();
    const daysPassed = today.getDate();
    
    if (expenses.length > 0 && daysPassed > 0) {
      const dailyAverage = expenses.reduce((sum, e) => sum + e.amount, 0) / daysPassed;
      const projectedMonthly = dailyAverage * daysInMonth;
      
      insights.push({
        type: 'monthly_projection',
        message: 'projectedMonthlySpending',
        value: projectedMonthly,
        confidence: this.calculateConfidence(expenses.length, daysPassed)
      });

      const dailyTotals = this.getDailyTotals(expenses);
      const dailyValues = Object.values(dailyTotals);
      if (dailyValues.length > 0) {
        const average = dailyValues.reduce((a, b) => a + b, 0) / dailyValues.length;
        const spikes = Object.entries(dailyTotals).filter(([day, amount]) => amount > average * 2);
        
        if (spikes.length > 0) {
          insights.push({
            type: 'spending_spikes',
            message: 'spendingSpikesDetected',
            count: spikes.length,
            averageSpike: spikes.reduce((sum, [, amount]) => sum + amount, 0) / spikes.length
          });
        }
      }
    }

    return insights;
  }

  static analyzeBehavior(expenses) {
    const behavior = {
      impulsiveDays: [],
      consistentDays: [],
      categoryHabits: {}
    };

    if (!Array.isArray(expenses)) return behavior;

    const dailyTotals = this.getDailyTotals(expenses);
    const dailyValues = Object.values(dailyTotals);
    
    if (dailyValues.length > 0) {
      const average = dailyValues.reduce((a, b) => a + b, 0) / dailyValues.length;
      
      Object.entries(dailyTotals).forEach(([day, amount]) => {
        if (amount > average * 1.5) {
          behavior.impulsiveDays.push({ 
            day: parseInt(day), 
            amount, 
            ratio: amount / average 
          });
        }
      });
    }

    return behavior;
  }

  static analyzeCategoryTiming(expenses, categories) {
    const timing = {};
    
    if (!Array.isArray(expenses) || !Array.isArray(categories)) return timing;
    
    categories.forEach(category => {
      const categoryExpenses = expenses.filter(e => e.category === category.name);
      timing[category.name] = {
        preferredDays: this.getPreferredDays(categoryExpenses),
        timeDistribution: this.getTimeDistribution(categoryExpenses),
        seasonality: this.getCategorySeasonality(categoryExpenses)
      };
    });

    return timing;
  }

  // Méthodes utilitaires
  static calculateRiskLevel(average, count) {
    if (average > 100 && count > 5) return 'high';
    if (average > 50 && count > 3) return 'medium';
    return 'low';
  }

  static getDailyTotals(expenses) {
    const totals = {};
    if (!Array.isArray(expenses)) return totals;
    
    expenses.forEach(expense => {
      const day = new Date(expense.date).getDate();
      totals[day] = (totals[day] || 0) + expense.amount;
    });
    return totals;
  }

  static calculateConfidence(dataPoints, timespan) {
    if (dataPoints > 20 && timespan > 15) return 'high';
    if (dataPoints > 10 && timespan > 7) return 'medium';
    return 'low';
  }

  static getPreferredDays(expenses) {
    const dayCount = {};
    if (!Array.isArray(expenses)) return [];
    
    expenses.forEach(expense => {
      const day = new Date(expense.date).getDay();
      dayCount[day] = (dayCount[day] || 0) + 1;
    });
    return Object.entries(dayCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([day, count]) => [parseInt(day), count]);
  }

  static getTimeDistribution(expenses) {
    const distribution = {};
    if (!Array.isArray(expenses)) return distribution;
    
    expenses.forEach(expense => {
      const hour = new Date(expense.date).getHours() || 12;
      distribution[hour] = (distribution[hour] || 0) + 1;
    });
    return distribution;
  }

  static getCategorySeasonality(expenses) {
    const monthly = {};
    if (!Array.isArray(expenses)) return monthly;
    
    expenses.forEach(expense => {
      const month = new Date(expense.date).getMonth();
      monthly[month] = (monthly[month] || 0) + expense.amount;
    });
    return monthly;
  }

  static analyzeWeeklyTrends(expenses) {
    const weeklyData = {};
    if (!Array.isArray(expenses)) return { weeklyData, trends: [] };
    
    expenses.forEach(expense => {
      const date = new Date(expense.date);
      const weekKey = this.getWeekKey(date);
      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = { total: 0, expenses: [] };
      }
      weeklyData[weekKey].total += expense.amount;
      weeklyData[weekKey].expenses.push(expense);
    });

    const weeks = Object.keys(weeklyData).sort();
    const trends = [];
    for (let i = 1; i < weeks.length; i++) {
      const current = weeklyData[weeks[i]].total;
      const previous = weeklyData[weeks[i-1]].total;
      const change = previous > 0 ? ((current - previous) / previous) * 100 : 0;
      trends.push({ week: weeks[i], change, current, previous });
    }

    return { weeklyData, trends };
  }

  static getWeekKey(date) {
    const year = date.getFullYear();
    const week = this.getWeekNumber(date);
    return `${year}-W${week}`;
  }

  static getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  }
}

const CalendarScreenAI = ({ financeManager, theme, t }) => {
  const { state, computedValues, formatCurrency, actions } = financeManager;
  const [selectedDay, setSelectedDay] = useState(null);
  const [activeView, setActiveView] = useState('calendar');
  const [isLoading, setIsLoading] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [plannedExpenses, setPlannedExpenses] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Calcul du nombre de jours dans le mois sélectionné
  const daysInMonth = useMemo(() => {
    return new Date(state.selectedYear, new Date(state.selectedMonth + '-01').getMonth() + 1, 0).getDate();
  }, [state.selectedYear, state.selectedMonth]);

  // Premier jour du mois (0=dimanche, 1=lundi, etc.), ajusté pour commencer par lundi
  const firstDay = useMemo(() => {
    return (new Date(state.selectedMonth + '-01').getDay() + 6) % 7;
  }, [state.selectedMonth]);

  // Génère la liste des jours du mois
  const calendarDays = useMemo(() => Array.from({ length: daysInMonth }, (_, i) => i + 1), [daysInMonth]);

  // Récupère les dépenses d'un jour spécifique
  const getDayExpenses = useCallback((day) => {
    const dateStr = `${state.selectedMonth}-${day.toString().padStart(2, '0')}`;
    return (computedValues.currentMonthExpenses || []).filter(e => e.date === dateStr);
  }, [state.selectedMonth, computedValues.currentMonthExpenses]);

  // Analyse IA
  const aiAnalysis = useMemo(() => {
    const analysis = CalendarAIEngine.analyzeSpendingPatterns(
      computedValues.currentMonthExpenses || [], 
      state.categories || []
    );
    console.log('AI Analysis:', analysis); // Debug
    return analysis;
  }, [computedValues.currentMonthExpenses, state.categories]);

  // Gestion des notifications
  useEffect(() => {
    const newNotifications = [];
    
    // 1. Alertes de projection mensuelle
    if (aiAnalysis.predictiveInsights && aiAnalysis.predictiveInsights.length > 0) {
      const projection = aiAnalysis.predictiveInsights.find(insight => insight.type === 'monthly_projection');
      if (projection && projection.value > 1000) {
        newNotifications.push({
          id: 'monthly-projection',
          type: 'warning',
          title: t('monthlyProjectionHigh'),
          message: t('projectionMessage', { amount: formatCurrency ? formatCurrency(projection.value) : `${projection.value.toFixed(0)}€` }),
          priority: 'high',
          action: t('viewDetails'),
          timestamp: new Date()
        });
      }
    }
    
    // 2. Alertes de jours à risque
    const today = new Date().getDay();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const todayName = dayNames[today];
    
    if (aiAnalysis.dailyPatterns && aiAnalysis.dailyPatterns[todayName] && aiAnalysis.dailyPatterns[todayName].riskLevel === 'high') {
              newNotifications.push({
          id: 'risk-day',
          type: 'danger',
          title: t('riskDayToday'),
          message: t('averageExpenseMessage', { amount: formatCurrency ? formatCurrency(aiAnalysis.dailyPatterns[todayName].average) : `${aiAnalysis.dailyPatterns[todayName].average.toFixed(0)}€` }),
          priority: 'high',
          action: t('viewAlternatives'),
          timestamp: new Date()
        });
    }
    
    // 3. Alertes de catégories
    if (aiAnalysis.categoryTimeCorrelations) {
      const topCategory = Object.entries(aiAnalysis.categoryTimeCorrelations)
        .filter(([, data]) => data.preferredDays && data.preferredDays.length > 0)
        .sort(([, a], [, b]) => b.preferredDays[0][1] - a.preferredDays[0][1])[0];
      
      if (topCategory) {
        const dayNames = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
        const preferredDay = dayNames[topCategory[1].preferredDays[0][0]];
        
        newNotifications.push({
          id: 'category-optimization',
          type: 'success',
          title: t('categoryOptimization'),
          message: t('bestDayForCategory', { 
            category: topCategory[0], 
            day: preferredDay, 
            amount: formatCurrency ? formatCurrency(20) : '20€' 
          }),
          priority: 'medium',
          action: t('planForThisDay'),
          timestamp: new Date()
        });
      }
    }
    
    // 4. Alertes de tendances
    if (aiAnalysis.weeklyTrends && aiAnalysis.weeklyTrends.trends && aiAnalysis.weeklyTrends.trends.length > 0) {
      const trend = aiAnalysis.weeklyTrends.trends[0];
      if (trend.change > 20) {
        newNotifications.push({
          id: 'trend-warning',
          type: 'warning',
          title: t('trendWarning'),
          message: t('expensesIncrease', { percent: trend.change.toFixed(1) }),
          priority: 'medium',
          action: t('analyzeCauses'),
          timestamp: new Date()
        });
      }
    }
    
    // 5. Alertes de comportement impulsif
    if (aiAnalysis.behavioralAnalysis && aiAnalysis.behavioralAnalysis.impulsiveDays && aiAnalysis.behavioralAnalysis.impulsiveDays.length > 0) {
      const impulsiveDay = aiAnalysis.behavioralAnalysis.impulsiveDays[0];
      newNotifications.push({
        id: 'impulsive-spending',
        type: 'warning',
        title: t('impulsiveSpending'),
        message: t('dayExpenseRatio', { 
          day: impulsiveDay.day, 
          ratio: impulsiveDay.ratio.toFixed(1) 
        }),
        priority: 'medium',
        action: t('analyzeCauses'),
        timestamp: new Date()
      });
    }
    
    setNotifications(newNotifications);
  }, [aiAnalysis, formatCurrency, t]);

  // Fonction pour ajouter une dépense
  const addExpense = useCallback((expenseData) => {
    const newExpense = {
      id: Date.now().toString(),
      description: expenseData.description,
      amount: parseFloat(expenseData.amount),
      category: expenseData.category,
      date: expenseData.date,
      type: 'expense'
    };
    
    actions.addExpense(newExpense);
    setShowAddExpenseModal(false);
  }, [actions]);

  // Fonction pour supprimer une dépense
  const deleteExpense = useCallback((expenseId) => {
    actions.deleteExpense(expenseId);
  }, [actions]);

  // Fonction pour modifier une dépense
  const updateExpense = useCallback((expenseId, updatedData) => {
    actions.updateExpense(expenseId, updatedData);
    setEditingExpense(null);
  }, [actions]);

  // Fonction pour ajouter une dépense planifiée
  const addPlannedExpense = useCallback((plannedData) => {
    const newPlannedExpense = {
      id: Date.now().toString(),
      description: plannedData.description,
      amount: parseFloat(plannedData.amount),
      category: plannedData.category,
      plannedDate: plannedData.plannedDate,
      priority: plannedData.priority,
      status: 'planned'
    };
    
    setPlannedExpenses(prev => [...prev, newPlannedExpense]);
  }, []);

  // Fonction pour marquer une dépense planifiée comme payée
  const markPlannedAsPaid = useCallback((plannedExpense) => {
    // Ajouter comme vraie dépense
    const realExpense = {
      id: Date.now().toString(),
      description: plannedExpense.description,
      amount: plannedExpense.amount,
      category: plannedExpense.category,
      date: plannedExpense.plannedDate,
      type: 'expense'
    };
    
    actions.addExpense(realExpense);
    
    // Supprimer de la liste des planifiées
    setPlannedExpenses(prev => prev.filter(exp => exp.id !== plannedExpense.id));
  }, [actions]);

  // Fonction pour supprimer une dépense planifiée
  const deletePlannedExpense = useCallback((plannedExpenseId) => {
    setPlannedExpenses(prev => prev.filter(exp => exp.id !== plannedExpenseId));
  }, []);

  // Définition des vues disponibles
  const views = {
    calendar: { icon: Icons.Calendar, label: t('calendar') },
    predictions: { icon: Icons.Brain, label: t('predictions') },
    planner: { icon: Icons.Target, label: t('planner') }
  };

  return (
    <div className="space-y-4 md:space-y-6 mt-4 md:mt-6 animate-fade-in px-2 md:px-0">
      <h2 className={`text-xl md:text-2xl font-bold ${theme?.text || ''} animate-slide-down text-center md:text-left`}>
        {t('calendarAI')}
      </h2>
      
      {/* Header avec navigation et notifications */}
      <div className="flex items-center justify-between animate-slide-up">
        <div className="flex flex-wrap gap-1 md:gap-2 justify-center md:justify-start">
          {Object.entries(views).map(([key, view], index) => (
            <button
              key={key}
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => {
                  setActiveView(key);
                  setIsLoading(false);
                }, 150);
              }}
              className={`flex items-center space-x-1 md:space-x-2 px-2 md:px-4 py-1 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                activeView === key 
                  ? 'bg-blue-600 text-white shadow-lg scale-105' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <view.icon className="h-3 w-3 md:h-4 md:w-4 transition-transform duration-200 group-hover:rotate-12" />
              <span className="hidden sm:inline">{view.label}</span>
              <span className="sm:hidden">{view.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>
        
        {/* Centre de notifications */}
        <div className="ml-2 md:ml-4">
          <NotificationCenter 
            aiAnalysis={aiAnalysis} 
            state={state} 
            formatCurrency={formatCurrency}
            notifications={notifications}
            setNotifications={setNotifications}
            showNotifications={showNotifications}
            setShowNotifications={setShowNotifications}
            t={t}
          />
        </div>
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 md:p-6 flex items-center space-x-3 mx-4">
            <div className="animate-spin rounded-full h-5 w-5 md:h-6 md:w-6 border-b-2 border-blue-600"></div>
            <span className="text-sm md:text-base text-gray-700 dark:text-gray-300">{t('loading')}</span>
          </div>
        </div>
      )}

      {/* Modal d'ajout de dépense - Responsive */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 md:p-6 w-full max-w-sm md:max-w-md animate-slide-up">
            <h3 className="text-base md:text-lg font-semibold mb-4">{t('addExpense')}</h3>
            <AddExpenseForm 
              onSubmit={addExpense}
              onCancel={() => setShowAddExpenseModal(false)}
              categories={state.categories || []}
              selectedDate={selectedDay ? `${state.selectedMonth}-${selectedDay.toString().padStart(2, '0')}` : null}
              t={t}
            />
          </div>
        </div>
      )}

      {/* Modal de modification de dépense - Responsive */}
      {editingExpense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 md:p-6 w-full max-w-sm md:max-w-md animate-slide-up">
            <h3 className="text-base md:text-lg font-semibold mb-4">{t('editExpense')}</h3>
            <EditExpenseForm 
              expense={editingExpense}
              onSubmit={(updatedData) => updateExpense(editingExpense.id, updatedData)}
              onCancel={() => setEditingExpense(null)}
              categories={state.categories || []}
              t={t}
            />
          </div>
        </div>
      )}

      {/* Contenu des vues avec animations - Responsive */}
      <div className="space-y-4 md:space-y-6">
        {activeView === 'calendar' && (
          <div className="animate-slide-in-left">
            {/* Bouton d'ajout rapide - Responsive */}
            <div className="mb-4 flex justify-center md:justify-end animate-fade-in">
              <button
                onClick={() => setShowAddExpenseModal(true)}
                className="px-3 md:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 text-sm md:text-base"
              >
                <Icons.Plus className="h-4 w-4" />
                <span className="hidden sm:inline">{t('addExpenseQuick')}</span>
                <span className="sm:hidden">{t('add')}</span>
              </button>
            </div>

            {/* En-têtes des jours - Responsive */}
            <div className="grid grid-cols-7 gap-1 mb-2 md:mb-4 animate-slide-down" style={{ animationDelay: '200ms' }}>
              {[t('mon'), t('tue'), t('wed'), t('thu'), t('fri'), t('sat'), t('sun')].map((day, index) => (
                <div key={day} className={`p-1 md:p-2 text-center font-semibold text-xs md:text-sm ${theme?.textSecondary || ''} animate-fade-in`} 
                     style={{ animationDelay: `${300 + index * 50}ms` }}>
                  {day}
                </div>
              ))}
            </div>
            
            {/* Grille du calendrier avec animations - Responsive */}
            <div className="grid grid-cols-7 gap-1 animate-slide-up" style={{ animationDelay: '400ms' }}>
              {Array.from({ length: firstDay }, (_, i) => (
                <div key={`empty-${i}`} className="p-1 md:p-2 min-h-[60px] md:min-h-[100px] animate-fade-in" 
                     style={{ animationDelay: `${500 + i * 20}ms` }}></div>
              ))}
              {calendarDays.map((day, index) => {
                const dayExpenses = getDayExpenses(day);
                const totalAmount = dayExpenses.reduce((sum, e) => sum + e.amount, 0);
                
                return (
                  <div
                    key={day}
                    className={
                      `p-1 md:p-2 min-h-[60px] md:min-h-[100px] border rounded cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-lg ` +
                      `${theme?.border || ''} ` +
                      `${selectedDay === day ? 'bg-blue-100 ring-2 ring-blue-500 scale-105' : theme?.card || ''} ` +
                      `${totalAmount > 0 ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-gray-50'}`
                    }
                    onClick={() => {
                      setSelectedDay(selectedDay === day ? null : day);
                    }}
                    style={{ animationDelay: `${600 + index * 20}ms` }}
                  >
                    <div className={`text-xs md:text-sm font-medium ${theme?.text || ''} mb-1 transition-colors duration-200`}>
                      {day}
                    </div>
                    
                    {/* Affichage des dépenses avec animation - Responsive */}
                    {totalAmount > 0 && (
                      <div className="text-xs text-red-600 font-medium animate-pulse">
                        {formatCurrency ? formatCurrency(totalAmount) : `${totalAmount}€`}
                      </div>
                    )}
                    
                    {/* Nombre de dépenses - Responsive */}
                    {dayExpenses.length > 0 && (
                      <div className="text-xs text-gray-500 mt-1 transition-opacity duration-200 hidden sm:block">
                        {t('expenseCount', { count: dayExpenses.length })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Détails du jour sélectionné avec animation - Responsive */}
            {selectedDay && (
              <div className="mt-4 p-3 md:p-4 rounded border bg-white shadow animate-slide-in-right">
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <h3 className="font-semibold text-sm md:text-base animate-fade-in">
                    {t('day')} {selectedDay} {new Date(state.selectedMonth).toLocaleDateString('fr-FR', { month: 'long' })}
                  </h3>
                  <button
                    onClick={() => setShowAddExpenseModal(true)}
                    className="px-2 md:px-3 py-1 bg-blue-600 text-white rounded text-xs md:text-sm hover:bg-blue-700 transition-colors"
                  >
                    <Icons.Plus className="h-3 w-3 md:h-4 md:w-4" />
                  </button>
                </div>
                
                {(() => {
                  const dayExpenses = getDayExpenses(selectedDay);
                  const totalAmount = dayExpenses.reduce((sum, e) => sum + e.amount, 0);
                  
                  if (dayExpenses.length > 0) {
                    return (
                      <div className="space-y-2 animate-slide-up">
                        <p className="text-sm md:text-base font-medium animate-fade-in">
                          {t('total')} : {formatCurrency ? formatCurrency(totalAmount) : `${totalAmount}€`}
                        </p>
                        <div className="space-y-2">
                          {dayExpenses.map((expense, index) => (
                            <div key={expense.id} className="flex items-center justify-between p-2 bg-gray-50 rounded animate-fade-in"
                                 style={{ animationDelay: `${index * 100}ms` }}>
                              <div className="flex-1 min-w-0">
                                <div className="text-xs md:text-sm font-medium truncate">{expense.description}</div>
                                <div className="text-xs text-gray-600 truncate">{expense.category}</div>
                              </div>
                              <div className="flex items-center space-x-1 md:space-x-2 ml-2">
                                <span className="font-medium text-xs md:text-sm">
                                  {formatCurrency ? formatCurrency(expense.amount) : `${expense.amount}€`}
                                </span>
                                <button
                                  onClick={() => setEditingExpense(expense)}
                                  className="text-blue-600 hover:text-blue-800 p-1"
                                >
                                  <Icons.Edit className="h-3 w-3 md:h-4 md:w-4" />
                                </button>
                                <button
                                  onClick={() => deleteExpense(expense.id)}
                                  className="text-red-600 hover:text-red-800 p-1"
                                >
                                  <Icons.Trash2 className="h-3 w-3 md:h-4 md:w-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div className="text-center py-4 animate-fade-in">
                        <Icons.Calendar className="h-6 w-6 md:h-8 md:w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-xs md:text-sm text-gray-500 mb-2">{t('noExpenseToday')}</p>
                        <button
                          onClick={() => setShowAddExpenseModal(true)}
                          className="px-3 md:px-4 py-1 md:py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-xs md:text-sm"
                        >
                          {t('addExpense')}
                        </button>
                      </div>
                    );
                  }
                })()}
              </div>
            )}
          </div>
        )}

        {activeView === 'predictions' && (
          <div className={`${theme?.card || ''} rounded-xl border ${theme?.border || ''} p-3 md:p-4 animate-slide-in-right`}>
            <h3 className={`text-base md:text-lg font-semibold ${theme?.text || ''} mb-3 md:mb-4 flex items-center`}>
              <Icons.Brain className="h-4 w-4 md:h-5 md:w-5 mr-2 text-indigo-500" />
              <span className="hidden sm:inline">{t('aiPredictiveInsights')}</span>
              <span className="sm:hidden">{t('insights')}</span>
            </h3>
            
            <div className="space-y-4 md:space-y-6">
              {/* Graphique des tendances hebdomadaires */}
              <div className={`p-3 md:p-4 rounded-lg border ${theme?.border || ''} bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20`}>
                <h4 className="font-semibold mb-3 md:mb-4 flex items-center">
                  <Icons.TrendingUp className="h-4 w-4 md:h-5 md:w-5 mr-2 text-blue-600" />
                  <span className="hidden sm:inline">{t('weeklyExpenseEvolution')}</span>
                  <span className="sm:hidden">{t('trends')}</span>
                </h4>
                
                <div className="space-y-3 md:space-y-4">
                  {/* Graphique en barres */}
                  <div className="h-48 flex items-end justify-between space-x-2">
                    {(() => {
                      const weekLabels = [t('week1'), t('week2'), t('week3'), t('week4')];
                      const weekData = aiAnalysis.weeklyTrends && aiAnalysis.weeklyTrends.trends ? aiAnalysis.weeklyTrends.trends.slice(-4) : [];
                      
                      return weekLabels.map((label, index) => {
                        const data = weekData[index] || { current: 0, change: 0 };
                        const height = data.current > 0 ? Math.min((data.current / 500) * 100, 100) : 10;
                        const isPositive = data.change >= 0;
                        
                        return (
                          <div key={label} className="flex-1 flex flex-col items-center">
                            <div className="text-xs text-gray-600 mb-2">{label}</div>
                            <div className="relative w-full flex items-end justify-center">
                              <div 
                                className={`w-full rounded-t transition-all ${
                                  isPositive ? 'bg-green-500' : 'bg-red-500'
                                }`}
                                style={{ height: `${height}%` }}
                              ></div>
                            </div>
                            <div className="flex flex-col items-center mt-2">
                              <span className="text-xs font-medium text-gray-800 dark:text-gray-100">
                                {formatCurrency ? formatCurrency(data.current) : `${data.current.toFixed(0)}€`}
                              </span>
                              <span className={`text-xs ${isPositive ? 'text-green-600' : 'text-red-600'} mt-0.5`}>
                                {isPositive ? '+' : ''}{data.change.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                  
                  {/* Légende du graphique */}
                  <div className="flex items-center justify-center space-x-4 text-xs">
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-green-500 rounded"></div>
                      <span>{t('increase')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-red-500 rounded"></div>
                      <span>{t('decrease')}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Graphique des patterns quotidiens */}
              <div className={`p-3 md:p-4 rounded-lg border ${theme?.border || ''} bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20`}>
                <h4 className="font-semibold mb-3 md:mb-4 flex items-center">
                  <Icons.Activity className="h-4 w-4 md:h-5 md:w-5 mr-2 text-purple-600" />
                  <span className="hidden sm:inline">{t('dailyPatterns')}</span>
                  <span className="sm:hidden">{t('patterns')}</span>
                </h4>
                
                <div className="space-y-3 md:space-y-4">
                  {/* Graphique en ligne */}
                  <div className="h-48 relative">
                    <svg className="w-full h-full" viewBox="0 0 400 200">
                      {(() => {
                        const dayNames = [t('mon'), t('tue'), t('wed'), t('thu'), t('fri'), t('sat'), t('sun')];
                        const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
                        const maxValue = Math.max(...dayKeys.map(key => aiAnalysis.dailyPatterns[key]?.average || 0));
                        
                        const points = dayKeys.map((key, index) => {
                          const data = aiAnalysis.dailyPatterns[key];
                          const x = (index / 6) * 350 + 25;
                          const y = data?.average ? 200 - ((data.average / maxValue) * 150) : 200;
                          return { x, y, data, dayName: dayNames[index] };
                        });
                        
                        // Créer le chemin SVG
                        const pathData = points.map((point, index) => 
                          `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
                        ).join(' ');
                        
                        return (
                          <>
                            {/* Grille de fond */}
                            {Array.from({ length: 5 }, (_, i) => (
                              <line
                                key={i}
                                x1="25"
                                y1={40 + i * 40}
                                x2="375"
                                y2={40 + i * 40}
                                stroke="#e5e7eb"
                                strokeWidth="1"
                              />
                            ))}
                            
                            {/* Ligne de tendance */}
                            <path
                              d={pathData}
                              stroke="#8b5cf6"
                              strokeWidth="3"
                              fill="none"
                            />
                            
                            {/* Points de données */}
                            {points.map((point, index) => (
                              <g key={index}>
                                <circle
                                  cx={point.x}
                                  cy={point.y}
                                  r="6"
                                  fill="#8b5cf6"
                                  className="cursor-pointer hover:r-8 transition-all"
                                />
                                <text
                                  x={point.x}
                                  y={point.y - 10}
                                  textAnchor="middle"
                                  className="text-xs fill-gray-600"
                                >
                                  {point.data?.average ? `${point.data.average.toFixed(0)}€` : '0€'}
                                </text>
                                <text
                                  x={point.x}
                                  y="220"
                                  textAnchor="middle"
                                  className="text-xs fill-gray-500"
                                >
                                  {point.dayName}
                                </text>
                              </g>
                            ))}
                          </>
                        );
                      })()}
                    </svg>
                  </div>
                  
                  {/* Statistiques des patterns */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                    {(() => {
                      const sortedDays = Object.entries(aiAnalysis.dailyPatterns)
                        .filter(([, data]) => data.average > 0)
                        .sort(([, a], [, b]) => b.average - a.average);
                      
                      const topDay = sortedDays[0];
                      const lowDay = sortedDays[sortedDays.length - 1];
                      const avgSpending = sortedDays.reduce((sum, [, data]) => sum + data.average, 0) / sortedDays.length;
                      
                      return (
                        <>
                          <div className="text-center p-2 md:p-3 bg-green-50 rounded-lg">
                            <div className="text-lg font-bold text-green-600">
                              {topDay ? `${topDay[1].average.toFixed(0)}€` : '0€'}
                            </div>
                            <div className="text-xs text-gray-600">{t('mostExpensiveDay')}</div>
                          </div>
                          <div className="text-center p-2 md:p-3 bg-blue-50 rounded-lg">
                            <div className="text-lg font-bold text-blue-600">
                              {avgSpending.toFixed(0)}€
                            </div>
                            <div className="text-xs text-gray-600">{t('dailyAverage')}</div>
                          </div>
                          <div className="text-center p-2 md:p-3 bg-orange-50 rounded-lg">
                            <div className="text-lg font-bold text-orange-600">
                              {lowDay ? `${lowDay[1].average.toFixed(0)}€` : '0€'}
                            </div>
                            <div className="text-xs text-gray-600">{t('leastExpensiveDay')}</div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
              
              {/* Graphique des catégories */}
              <div className={`p-3 md:p-4 rounded-lg border ${theme?.border || ''} bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20`}>
                <h4 className="font-semibold mb-3 md:mb-4 flex items-center">
                  <Icons.PieChart className="h-4 w-4 md:h-5 md:w-5 mr-2 text-yellow-600" />
                  <span className="hidden sm:inline">{t('categoryDistribution')}</span>
                  <span className="sm:hidden">Catégories</span>
                </h4>
                
                <div className="space-y-3 md:space-y-4">
                  {/* Graphique circulaire simplifié */}
                  <div className="flex items-center justify-center">
                    <div className="relative w-28 md:w-32 h-28 md:h-32">
                      {(() => {
                        const categoryData = aiAnalysis.categoryTimeCorrelations ? 
                          Object.entries(aiAnalysis.categoryTimeCorrelations)
                            .filter(([, data]) => data.preferredDays && data.preferredDays.length > 0)
                            .slice(0, 5) : [];
                        
                        const total = categoryData.reduce((sum, [, data]) => sum + (data.preferredDays[0]?.[1] || 0), 0);
                        const colors = ['#3b82f6', '#8b5cf6', '#ef4444', '#f59e0b', '#10b981'];
                        
                        return (
                          <>
                            {categoryData.map(([category, data], index) => {
                              const percentage = total > 0 ? (data.preferredDays[0]?.[1] || 0) / total : 0;
                              const angle = percentage * 360;
                              const radius = 60;
                              const x = radius * Math.cos((index * angle - 90) * Math.PI / 180);
                              const y = radius * Math.sin((index * angle - 90) * Math.PI / 180);
                              
                              return (
                                <div
                                  key={category}
                                  className="absolute w-3 h-3 md:w-4 md:h-4 rounded-full"
                                  style={{
                                    left: `${64 + x}px`,
                                    top: `${64 + y}px`,
                                    backgroundColor: colors[index % colors.length],
                                    transform: 'translate(-50%, -50%)'
                                  }}
                                  title={`${category}: ${(percentage * 100).toFixed(1)}%`}
                                />
                              );
                            })}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-center">
                                <div className="text-lg font-bold">{total}</div>
                                <div className="text-xs text-gray-600">dépenses</div>
                              </div>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                  
                  {/* Légende des catégories */}
                  <div className="grid grid-cols-2 gap-2">
                    {(() => {
                      const categoryData = aiAnalysis.categoryTimeCorrelations ? 
                        Object.entries(aiAnalysis.categoryTimeCorrelations)
                          .filter(([, data]) => data.preferredDays && data.preferredDays.length > 0)
                          .slice(0, 6) : [];
                      const colors = ['#3b82f6', '#8b5cf6', '#ef4444', '#f59e0b', '#10b981', '#f97316'];
                      
                      return categoryData.map(([category, data], index) => (
                        <div key={category} className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: colors[index % colors.length] }}
                          ></div>
                          <span className="text-xs font-medium">{category}</span>
                          <span className="text-xs text-gray-500 ml-auto">
                            {data.preferredDays[0]?.[1] || 0}
                          </span>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              </div>
              
              {/* Insights IA existants */}
              <div className="space-y-3">
                <h4 className="font-semibold mb-3 flex items-center">
                  <Icons.Brain className="h-4 w-4 md:h-5 md:w-5 mr-2 text-indigo-500" />
                  <span className="hidden sm:inline">{t('predictiveInsights')}</span>
                  <span className="sm:hidden">{t('insights')}</span>
                </h4>
                
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    {t('numberOfInsights')}: {aiAnalysis.predictiveInsights ? aiAnalysis.predictiveInsights.length : 0}
                  </p>
                  <p className="text-sm text-gray-600">
                    {t('monthlyExpenses', { count: (computedValues.currentMonthExpenses || []).length })}
                  </p>
                  {aiAnalysis.predictiveInsights && aiAnalysis.predictiveInsights.length > 0 ? (
                    aiAnalysis.predictiveInsights.map((insight, index) => (
                      <div key={index} className={`p-3 md:p-4 rounded-lg border ${theme?.border || ''} ${
                        insight.confidence === 'high' ? 'bg-green-50 dark:bg-green-900/20' :
                        insight.confidence === 'medium' ? 'bg-yellow-50 dark:bg-yellow-900/20' :
                        'bg-gray-50 dark:bg-gray-800'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">
                            {insight.message === 'projectedMonthlySpending' ? t('projectedMonthlySpending') : 
                             insight.message === 'spendingSpikesDetected' ? t('spendingSpikesDetected') : 
                             insight.message}
                          </h4>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            insight.confidence === 'high' ? 'bg-green-100 text-green-800' :
                            insight.confidence === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {t('confidence')}: {insight.confidence === 'high' ? t('high') : 
                                       insight.confidence === 'medium' ? t('medium') : t('low')}
                          </span>
                        </div>
                        {insight.value && (
                          <p className="text-lg font-bold text-indigo-600">
                            {formatCurrency ? formatCurrency(insight.value) : `${insight.value}€`}
                          </p>
                        )}
                        {insight.count && (
                          <p className="text-sm text-gray-600">
                            {t('spikesDetected', { count: insight.count })}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-3 md:p-4 rounded-lg border bg-gray-50">
                      <p className="text-sm text-gray-600">
                        {t('noDataForInsights')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'planner' && (
          <div className={`${theme?.card || ''} rounded-xl border ${theme?.border || ''} p-3 md:p-4 animate-slide-in-right`}>
            <h3 className={`text-base md:text-lg font-semibold ${theme?.text || ''} mb-3 md:mb-4 flex items-center`}>
              <Icons.Target className="h-5 w-5 mr-2 text-green-500" />
              {t('smartPlanner')}
            </h3>
            
            <div className="space-y-4 md:space-y-6">
              {/* Suggestions IA Automatiques */}
              <div className="space-y-3">
                <h5 className="font-medium text-sm flex items-center">
                  <Icons.Zap className="h-4 w-4 mr-2 text-blue-500" />
                  {t('aiSuggestions')}
                </h5>
                
                {(() => {
                  const suggestions = [];
                  
                  // Suggestion basée sur les dépenses récurrentes
                  if (aiAnalysis.behavioralAnalysis && aiAnalysis.behavioralAnalysis.recurringExpenses && aiAnalysis.behavioralAnalysis.recurringExpenses.length > 0) {
                    const mostRecurring = aiAnalysis.behavioralAnalysis.recurringExpenses[0];
                    suggestions.push({
                      id: 'recurring-suggestion',
                      type: 'info',
                      icon: Icons.Repeat,
                      title: t('recurringExpenseDetected'),
                      description: `${mostRecurring.description} - ${formatCurrency ? formatCurrency(mostRecurring.averageAmount) : `${mostRecurring.averageAmount.toFixed(0)}€`}`,
                                              action: t('applyAutomatically'),
                      priority: 'medium'
                    });
                  }
                  
                  // Suggestion basée sur les patterns de catégories
                  if (aiAnalysis.categoryTimeCorrelations) {
                    const topCategory = Object.entries(aiAnalysis.categoryTimeCorrelations)
                      .filter(([, data]) => data.preferredDays && data.preferredDays.length > 0)
                      .sort(([, a], [, b]) => b.preferredDays[0][1] - a.preferredDays[0][1])[0];
                    
                    if (topCategory) {
                      const dayNames = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
                      const preferredDay = dayNames[topCategory[1].preferredDays[0][0]];
                      const avgAmount = topCategory[1].preferredDays[0][1];
                      
                      suggestions.push({
                        id: 'category-suggestion',
                        type: 'success',
                        icon: Icons.Calendar,
                        title: t('categoryOptimization'),
                        description: t('bestDayForCategory', { day: preferredDay, amount: formatCurrency ? formatCurrency(avgAmount) : `${avgAmount.toFixed(0)}€` }),
                        action: t('planForThisDay'),
                        priority: 'high'
                      });
                    }
                  }
                  
                  return suggestions.length > 0 ? (
                    <div className="space-y-2">
                      {suggestions.map((suggestion) => {
                        const Icon = suggestion.icon;
                        return (
                          <div key={suggestion.id} className="p-3 rounded-lg border bg-blue-50 dark:bg-blue-900/20 animate-fade-in">
                            <div className="flex items-start space-x-3">
                              <Icon className="h-4 w-4 mt-0.5 text-blue-500" />
                              <div className="flex-1">
                                <h6 className="font-medium text-sm">{suggestion.title}</h6>
                                <p className="text-xs text-gray-600 mt-1">{suggestion.description}</p>
                                <button className="text-xs text-blue-600 hover:text-blue-800 mt-2 font-medium">
                                  {suggestion.action}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <Icons.Info className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">{t('noSuggestions')}</p>
                      <p className="text-xs text-gray-400">{t('aiAnalyzing')}</p>
                    </div>
                  );
                })()}
              </div>
              
              {/* Planification Intelligente Avancée */}
              <div className={`p-3 md:p-4 rounded-lg border ${theme?.border || ''} bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20`}>
                <h4 className="font-semibold mb-3 md:mb-4 flex items-center">
                  <Icons.Zap className="h-5 w-5 mr-2 text-green-600" />
                  {t('advancedSmartPlanning')}
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Planification automatique */}
                  <div className="space-y-3">
                    <h5 className="font-medium text-sm flex items-center">
                      <Icons.Zap className="h-4 w-4 mr-2 text-blue-500" />
                      {t('automaticPlanning')}
                    </h5>
                    
                    {(() => {
                      const autoPlans = [];
                      
                      // Plan automatique basé sur les patterns
                      if (aiAnalysis.behavioralAnalysis && aiAnalysis.behavioralAnalysis.recurringExpenses && aiAnalysis.behavioralAnalysis.recurringExpenses.length > 0) {
                        const recurring = aiAnalysis.behavioralAnalysis.recurringExpenses[0];
                        autoPlans.push({
                          id: 'recurring-plan',
                          type: 'recurring',
                          amount: recurring.averageAmount,
                          description: recurring.description,
                          frequency: recurring.frequency,
                          priority: 'high'
                        });
                      }
                      
                      // Plan automatique basé sur le budget
                      if (aiAnalysis.predictiveInsights && aiAnalysis.predictiveInsights.length > 0) {
                        const projection = aiAnalysis.predictiveInsights.find(i => i.type === 'monthly_projection');
                        if (projection && projection.value > 1000) {
                          autoPlans.push({
                            id: 'budget-plan',
                            type: 'budget',
                            amount: projection.value * 0.1, // 10% du budget projeté
                            description: t('monthlyReserve'),
                            frequency: 'Mensuel',
                            priority: 'medium'
                          });
                        }
                      }
                      
                      return autoPlans.map((plan, index) => (
                        <div key={plan.id} className="p-3 rounded-lg border bg-green-50 dark:bg-green-900/20 animate-fade-in">
                          <div className="flex items-center justify-between">
                            <div>
                              <h6 className="font-medium text-sm">{plan.description}</h6>
                              <p className="text-xs text-gray-600">{t('frequency')}: {plan.frequency}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-sm">
                                {formatCurrency ? formatCurrency(plan.amount) : `${plan.amount.toFixed(0)}€`}
                              </p>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                plan.priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                              }`}>
                                {plan.priority === 'high' ? t('highPriority') : t('normalPriority')}
                              </span>
                            </div>
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                  
                  {/* Optimisation du budget */}
                  <div className="space-y-3">
                    <h5 className="font-medium text-sm flex items-center">
                      <Icons.TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                      {t('budgetOptimization')}
                    </h5>
                    
                    <div className="space-y-2">
                      {(() => {
                        const optimizations = [];
                        
                        // Optimisation basée sur les catégories
                        const topCategories = Object.entries(aiAnalysis.categoryTimeCorrelations)
                          .filter(([, data]) => data.preferredDays.length > 0)
                          .slice(0, 3);
                        
                        topCategories.forEach(([category, data]) => {
                          const dayNames = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
                          const preferredDay = dayNames[data.preferredDays[0][0]];
                          const estimatedSavings = data.preferredDays[0][1] * 10; // Estimation d'économies
                          
                          optimizations.push({
                            category,
                            day: preferredDay,
                            savings: estimatedSavings,
                            frequency: `${data.preferredDays[0][1]} fois/mois`
                          });
                        });
                        
                        return optimizations.map((opt, index) => (
                          <div key={index} className={`p-2 rounded-lg border ${theme?.border || ''} bg-white dark:bg-gray-800`}>
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="text-sm font-medium">{opt.category}</div>
                                <div className="text-xs text-gray-600">{t('optimalDay')}: {opt.day}</div>
                                <div className="text-xs text-gray-500">{opt.frequency}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-medium text-green-600">
                                  +{formatCurrency ? formatCurrency(opt.savings) : `${opt.savings.toFixed(0)}€`}
                                </div>
                                <div className="text-xs text-gray-500">{t('savings')}</div>
                              </div>
                            </div>
                          </div>
                        ));
                      })()}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Formulaire d'ajout de dépense future amélioré */}
              <div className={`p-3 md:p-4 rounded-lg border ${theme?.border || ''} bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20`}>
                <h4 className="font-semibold mb-3 md:mb-4 flex items-center">
                  <Icons.Plus className="h-5 w-5 mr-2 text-green-600" />
                  {t('addIntelligentFutureExpense')}
                </h4>
                
                <SmartExpenseForm 
                  onSubmit={addPlannedExpense}
                  aiAnalysis={aiAnalysis}
                  categories={state.categories || []}
                  formatCurrency={formatCurrency}
                  t={t}
                />
              </div>
              
              {/* Alertes Intelligentes */}
              <div className="space-y-3">
                <h5 className="font-medium text-sm flex items-center">
                  <Icons.AlertTriangle className="h-4 w-4 mr-2 text-orange-500" />
                  {t('smartAlerts')}
                </h5>
                
                {(() => {
                  const alerts = [];
                  
                  // Alerte de dépenses récurrentes
                  if (aiAnalysis.behavioralAnalysis && aiAnalysis.behavioralAnalysis.recurringExpenses && aiAnalysis.behavioralAnalysis.recurringExpenses.length > 0) {
                    const recurring = aiAnalysis.behavioralAnalysis.recurringExpenses[0];
                    const daysUntilNext = recurring.frequency - (new Date().getDate() % recurring.frequency);
                    
                    if (daysUntilNext <= 3) {
                      alerts.push({
                        id: 'recurring-alert',
                        type: 'warning',
                        title: t('recurringExpenseComing'),
                        message: t('daysUntilNext', { count: daysUntilNext }),
                        amount: recurring.averageAmount,
                        priority: 'high'
                      });
                    }
                  }
                  
                  // Alerte de projection mensuelle
                  if (aiAnalysis.predictiveInsights && aiAnalysis.predictiveInsights.length > 0) {
                    const projection = aiAnalysis.predictiveInsights.find(i => i.type === 'monthly_projection');
                    if (projection && projection.value > 1200) {
                      alerts.push({
                        id: 'budget-alert',
                        type: 'danger',
                        title: t('budgetOverspending'),
                        message: t('projectionMessage', { amount: formatCurrency ? formatCurrency(projection.value) : `${projection.value.toFixed(0)}€` }),
                        amount: projection.value,
                        priority: 'high'
                      });
                    }
                  }
                  
                  // Alerte de catégories
                  if (aiAnalysis.categoryTimeCorrelations) {
                    const topCategory = Object.entries(aiAnalysis.categoryTimeCorrelations)
                      .filter(([, data]) => data.preferredDays && data.preferredDays.length > 0)
                      .sort(([, a], [, b]) => b.preferredDays[0][1] - a.preferredDays[0][1])[0];
                    
                    if (topCategory) {
                      alerts.push({
                        id: 'category-alert',
                        type: 'info',
                        title: t('categoryOptimizationAlert'),
                        message: t('bestDayForCategory', { category: topCategory[0] }),
                        amount: topCategory[1].preferredDays[0][1],
                        priority: 'medium'
                      });
                    }
                  }
                  
                  return alerts.length > 0 ? (
                    <div className="space-y-2">
                      {alerts.map((alert) => (
                        <div key={alert.id} className={`p-3 rounded-lg border ${
                          alert.type === 'danger' ? 'bg-red-50 border-red-200' :
                          alert.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                          'bg-blue-50 border-blue-200'
                        } animate-fade-in`}>
                          <div className="flex items-start space-x-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              alert.type === 'danger' ? 'bg-red-500' :
                              alert.type === 'warning' ? 'bg-yellow-500' :
                              'bg-blue-500'
                            }`}></div>
                            <div className="flex-1">
                              <h6 className="font-medium text-sm">{alert.title}</h6>
                              <p className="text-xs text-gray-600 mt-1">{alert.message}</p>
                              {alert.amount && (
                                <p className="text-xs font-medium mt-1">
                                  {formatCurrency ? formatCurrency(alert.amount) : `${alert.amount.toFixed(0)}€`}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <Icons.CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">{t('noActiveAlerts')}</p>
                      <p className="text-xs text-gray-400">{t('allGood')}</p>
                    </div>
                  );
                })()}
              </div>
              
              {/* Dépenses planifiées avec IA */}
              <div className={`p-3 md:p-4 rounded-lg border ${theme?.border || ''} bg-yellow-50 dark:bg-yellow-900/20`}>
                <h4 className="font-semibold mb-3 md:mb-4 flex items-center">
                  <Icons.Calendar className="h-5 w-5 mr-2 text-yellow-600" />
                  {t('plannedExpenses')}
                </h4>
                
                <div className="space-y-3">
                  {plannedExpenses.length > 0 ? (
                    plannedExpenses.map((expense, index) => (
                      <div key={expense.id} className={`p-3 rounded-lg border ${theme?.border || ''} bg-white dark:bg-gray-800 animate-fade-in`}
                           style={{ animationDelay: `${index * 100}ms` }}>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h5 className="font-medium text-sm">{expense.description}</h5>
                            <p className="text-xs text-gray-600">{t('plannedFor')} {new Date(expense.plannedDate).toLocaleDateString('fr-FR')}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                                {expense.category}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                expense.priority === 'high' ? 'bg-red-100 text-red-800' :
                                expense.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {expense.priority === 'high' ? t('high') : 
                                 expense.priority === 'medium' ? t('medium') : t('low')}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-sm">
                              {formatCurrency ? formatCurrency(expense.amount) : `${expense.amount}€`}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2 mt-3">
                          <button 
                            onClick={() => markPlannedAsPaid(expense)}
                            className="text-xs text-green-600 hover:text-green-800 bg-green-50 hover:bg-green-100 px-2 py-1 rounded transition-colors"
                          >
                            {t('markAsPaid')}
                          </button>
                          <button className="text-xs text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition-colors">
                            {t('modify')}
                          </button>
                          <button 
                            onClick={() => deletePlannedExpense(expense.id)}
                            className="text-xs text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-2 py-1 rounded transition-colors"
                          >
                            {t('delete')}
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <Icons.Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">{t('noPlannedExpenses')}</p>
                      <p className="text-xs text-gray-400 mt-1">{t('useIASuggestions')}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Composant pour le formulaire d'ajout de dépense
const AddExpenseForm = ({ onSubmit, onCancel, categories, selectedDate, t }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    date: selectedDate || new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.description && formData.amount && formData.category) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
      <div>
        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">{t('description')}</label>
        <input
          type="text"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-2 md:px-3 py-1 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-xs md:text-sm"
          placeholder={t('expenseExample')}
          required
        />
      </div>
      
      <div>
        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">{t('amount')}</label>
        <input
          type="number"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          className="w-full px-2 md:px-3 py-1 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-xs md:text-sm"
          placeholder="0.00"
          step="0.01"
          min="0"
          required
        />
      </div>
      
      <div>
        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">{t('category')}</label>
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full px-2 md:px-3 py-1 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-xs md:text-sm"
          required
        >
          <option value="">{t('selectCategory')}</option>
          {(categories || []).map(category => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">{t('date')}</label>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="w-full px-2 md:px-3 py-1 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-xs md:text-sm"
          required
        />
      </div>
      
      <div className="flex space-x-2 md:space-x-3">
        <button
          type="submit"
          className="flex-1 px-3 md:px-4 py-1 md:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs md:text-sm"
        >
          {t('add')}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-3 md:px-4 py-1 md:py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-xs md:text-sm"
        >
          {t('cancel')}
        </button>
      </div>
    </form>
  );
};

// Composant pour le formulaire de modification de dépense
const EditExpenseForm = ({ expense, onSubmit, onCancel, categories, t }) => {
  const [formData, setFormData] = useState({
    description: expense.description,
    amount: expense.amount.toString(),
    category: expense.category,
    date: expense.date
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.description && formData.amount && formData.category) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('description')}</label>
        <input
          type="text"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('amount')}</label>
        <input
          type="number"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          step="0.01"
          min="0"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('category')}</label>
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">{t('selectCategory')}</option>
          {(categories || []).map(category => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('date')}</label>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      
      <div className="flex space-x-3">
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {t('modify')}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {t('cancel')}
        </button>
      </div>
    </form>
  );
};

// Composant pour le formulaire intelligent de planification
const SmartExpenseForm = ({ onSubmit, aiAnalysis, categories, formatCurrency, t }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    plannedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // +7 jours par défaut
    priority: 'medium'
  });

  const [suggestions, setSuggestions] = useState([]);

  // Générer des suggestions intelligentes basées sur l'IA
  useEffect(() => {
    const newSuggestions = [];
    
    // Suggestion de montant basée sur les patterns
    if (aiAnalysis.behavioralAnalysis && aiAnalysis.behavioralAnalysis.recurringExpenses && aiAnalysis.behavioralAnalysis.recurringExpenses.length > 0) {
      const avgAmount = aiAnalysis.behavioralAnalysis.recurringExpenses[0].averageAmount;
      newSuggestions.push({
        type: 'amount',
        label: t('suggestedAmount', { amount: formatCurrency ? formatCurrency(avgAmount) : `${avgAmount.toFixed(0)}€` }),
        value: avgAmount,
        confidence: 'high'
      });
    }
    
    // Suggestion de catégorie basée sur les patterns
    if (aiAnalysis.categoryTimeCorrelations) {
      const topCategory = Object.entries(aiAnalysis.categoryTimeCorrelations)
        .filter(([, data]) => data.preferredDays && data.preferredDays.length > 0)
        .sort(([, a], [, b]) => b.preferredDays[0][1] - a.preferredDays[0][1])[0];
      
      if (topCategory) {
        newSuggestions.push({
          type: 'category',
          label: t('suggestedCategory', { category: topCategory[0] }),
          value: topCategory[0],
          confidence: 'medium'
        });
      }
    }
    
    // Suggestion de date basée sur les meilleurs jours
    if (aiAnalysis.dailyPatterns) {
      const bestDay = Object.entries(aiAnalysis.dailyPatterns)
        .filter(([, pattern]) => pattern.riskLevel === 'low')
        .sort(([, a], [, b]) => b.average - a.average)[0];
      
      if (bestDay) {
        const dayNames = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
        const dayIndex = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].indexOf(bestDay[0]);
        const dayName = dayNames[dayIndex];
        
        // Calculer la prochaine occurrence de ce jour
        const today = new Date();
        const targetDay = dayIndex;
        const daysUntilTarget = (targetDay - today.getDay() + 7) % 7;
        const nextDate = new Date(today.getTime() + daysUntilTarget * 24 * 60 * 60 * 1000);
        
        newSuggestions.push({
          type: 'date',
          label: `Date suggérée: ${nextDate.toLocaleDateString('fr-FR')} (${dayName})`,
          value: nextDate.toISOString().split('T')[0],
          confidence: 'high'
        });
      }
    }
    
    setSuggestions(newSuggestions);
  }, [aiAnalysis, formatCurrency, t]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.description && formData.amount && formData.category) {
      onSubmit(formData);
      setFormData({
        description: '',
        amount: '',
        category: '',
        plannedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        priority: 'medium'
      });
    }
  };

  const applySuggestion = (suggestion) => {
    setFormData(prev => ({
      ...prev,
      [suggestion.type === 'amount' ? 'amount' : 
       suggestion.type === 'category' ? 'category' : 
       suggestion.type === 'date' ? 'plannedDate' : 'amount']: suggestion.value
    }));
  };

  return (
    <div className="space-y-4">
      {/* Suggestions IA */}
      {suggestions.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
          <h5 className="font-medium text-sm mb-2 flex items-center">
            <Icons.Lightbulb className="h-4 w-4 mr-1 text-blue-500" />
            {t('aiSuggestions')}
          </h5>
          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded border">
                <span className="text-xs">{suggestion.label}</span>
                <button
                  onClick={() => applySuggestion(suggestion)}
                  className="text-xs text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition-colors"
                >
                  {t('apply')}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('description')}</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder={t('expenseExample')}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('amount')} (€)</label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('category')}</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="">{t('selectCategory')}</option>
              {(categories || []).map(category => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('plannedDate')}</label>
            <input
              type="date"
              value={formData.plannedDate}
              onChange={(e) => setFormData({ ...formData, plannedDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('priority')}</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="low">{t('low')}</option>
              <option value="medium">{t('medium')}</option>
              <option value="high">{t('high')}</option>
            </select>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            {t('planExpense')}
          </button>
          <button
            type="button"
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {t('cancel')}
          </button>
        </div>
      </form>
    </div>
  );
};

// Composant pour le centre de notifications intelligentes
const NotificationCenter = ({ aiAnalysis, state, formatCurrency, notifications, setNotifications, showNotifications, setShowNotifications, t }) => {
  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'warning': return Icons.AlertTriangle;
      case 'danger': return Icons.AlertCircle;
      case 'info': return Icons.Info;
      case 'success': return Icons.CheckCircle;
      default: return Icons.Bell;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'danger': return 'bg-red-50 border-red-200 text-red-800';
      case 'info': return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'success': return 'bg-green-50 border-green-200 text-green-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const unreadCount = notifications.length;

  return (
    <div className="relative">
      {/* Bouton de notifications */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
      >
        <Icons.Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      
      {/* Panneau de notifications */}
      {showNotifications && (
        <div className="absolute top-full right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 animate-slide-in-down">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-sm">{t('smartNotifications')}</h3>
            <p className="text-xs text-gray-500">{t('basedOnAIAnalysis')}</p>
          </div>
          
          <div className="p-2">
            {notifications.length > 0 ? (
              <div className="space-y-2">
                {notifications.map((notification) => {
                  const Icon = getNotificationIcon(notification.type);
                  return (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg border ${getNotificationColor(notification.type)} animate-fade-in`}
                    >
                      <div className="flex items-start space-x-3">
                        <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm">{notification.title}</h4>
                          <p className="text-xs mt-1">{notification.message}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500">
                              {notification.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <div className="flex space-x-2">
                              <button className="text-xs font-medium hover:underline">
                                {notification.action}
                              </button>
                              <button
                                onClick={() => dismissNotification(notification.id)}
                                className="text-xs text-gray-400 hover:text-gray-600"
                              >
                                ×
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-4">
                <Icons.CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-gray-500">{t('noNotifications')}</p>
                <p className="text-xs text-gray-400">{t('allGood')}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarScreenAI;