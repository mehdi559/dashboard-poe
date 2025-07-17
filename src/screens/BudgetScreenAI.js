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
    
    // Analyse des jours de dépense
    const spendingByDay = this.calculateWeeklyTrends(expenses);
    const highestSpendingDay = spendingByDay.reduce((max, day, index) => 
      day.total > spendingByDay[max].total ? index : max, 0);
    
    insights.push({
      type: 'behavioral',
      category: 'timing',
      message: `Vos dépenses sont ${['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'][highestSpendingDay]} sont les plus élevées`,
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
}

// Widget d'analyse prédictive
const PredictiveAnalysis = memo(({ expenses, categories, theme, t, formatCurrency }) => {
  const analysis = useMemo(() => 
    BudgetAIEngine.analyzeSpendingPatterns(expenses, categories), 
    [expenses, categories]
  );

  return (
    <div className={`${theme.card} rounded-xl border ${theme.border} p-6 ai-glow`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold ${theme.text} flex items-center`}>
          <Icons.Brain className="h-5 w-5 mr-2 text-indigo-500" />
          {t('aiPredictiveAnalysis')}
        </h3>
        <div className="flex items-center space-x-2 text-xs text-indigo-500">
          <Icons.Zap className="h-3 w-3" />
          <span>{t('aiPowered')}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {Object.entries(analysis.predictedOverspend).map(([category, prediction]) => (
          <div key={category} className={`p-4 rounded-lg ${theme.bg} border ${theme.border}`}>
            <div className="flex justify-between items-center mb-2">
              <span className={`font-medium ${theme.text}`}>{t(category)}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                prediction.overSpendRisk > 20 ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                prediction.overSpendRisk > 10 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
              }`}>
                {prediction.overSpendRisk > 0 ? `+${prediction.overSpendRisk.toFixed(1)}%` : t('onTrack')}
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className={theme.textSecondary}>{t('current')}</span>
                <span className={theme.text}>{formatCurrency(prediction.current)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className={theme.textSecondary}>{t('projected')}</span>
                <span className={`font-medium ${prediction.projected > prediction.budget ? 'text-red-600' : 'text-green-600'}`}>
                  {formatCurrency(prediction.projected)}
                </span>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="relative h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${Math.min((prediction.current / prediction.budget) * 100, 100)}%` }}
                  />
                  <div 
                    className="prediction-bar h-2 rounded-full absolute top-0"
                    style={{ 
                      width: `${Math.min((prediction.projected / prediction.budget) * 100, 100)}%`,
                      left: `${Math.min((prediction.current / prediction.budget) * 100, 100)}%`
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Insights comportementaux */}
      <div className="space-y-3">
        <h4 className={`font-medium ${theme.text} flex items-center`}>
          <Icons.Lightbulb className="h-4 w-4 mr-2 text-yellow-500" />
          {t('behavioralInsights')}
        </h4>
        {analysis.behavioralInsights.map((insight, index) => (
          <div key={index} className={`p-3 rounded-lg ${
            insight.impact === 'high' ? 'bg-red-50 border-red-200 dark:bg-red-900/20' :
            insight.impact === 'medium' ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20' :
            'bg-blue-50 border-blue-200 dark:bg-blue-900/20'
          } border`}>
            <p className="text-sm font-medium">{insight.message}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{insight.suggestion}</p>
          </div>
        ))}
      </div>
    </div>
  );
});

// Widget de recommandations intelligentes
const SmartRecommendations = memo(({ expenses, categories, theme, t, formatCurrency }) => {
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);
  
  const recommendations = useMemo(() => {
    const analysis = BudgetAIEngine.analyzeSpendingPatterns(expenses, categories);
    return analysis.optimizationSuggestions;
  }, [expenses, categories]);

  const applyRecommendation = (recommendation) => {
    // Ici vous pourriez appliquer automatiquement la recommandation
    console.log('Applying recommendation:', recommendation);
    setSelectedRecommendation(recommendation);
  };

  return (
    <div className={`${theme.card} rounded-xl border ${theme.border} p-6`}>
      <h3 className={`text-lg font-semibold ${theme.text} mb-4 flex items-center`}>
        <Icons.Target className="h-5 w-5 mr-2 text-green-500" />
        {t('smartRecommendations')}
      </h3>

      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <div key={index} className={`p-4 rounded-lg border ${theme.border} hover:shadow-md transition-shadow`}>
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  rec.type === 'critical' ? 'bg-red-500' :
                  rec.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                }`} />
                <span className="font-medium text-sm">{rec.category}</span>
              </div>
              <span className="text-xs text-green-600 font-medium">
                -{formatCurrency(rec.potential_savings)} {t('potentialSavings')}
              </span>
            </div>
            
            <p className={`text-sm ${theme.text} mb-3`}>{rec.message}</p>
            
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => applyRecommendation(rec)}
                className="text-xs"
              >
                {t('applyRecommendation')}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-xs"
              >
                {t('learnMore')}
              </Button>
            </div>
          </div>
        ))}
        
        {recommendations.length === 0 && (
          <div className="text-center py-8">
            <Icons.CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
            <p className={`${theme.textSecondary} text-sm`}>{t('budgetOptimized')}</p>
          </div>
        )}
      </div>
    </div>
  );
});

// Widget de détection d'anomalies
const AnomalyDetection = memo(({ expenses, theme, t, formatCurrency }) => {
  const anomalies = useMemo(() => 
    BudgetAIEngine.detectImpulseSpending(expenses), 
    [expenses]
  );

  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className={`${theme.card} rounded-xl border ${theme.border} p-6`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold ${theme.text} flex items-center`}>
          <Icons.Shield className="h-5 w-5 mr-2 text-red-500" />
          {t('anomalyDetection')}
        </h3>
        {anomalies.length > 0 && (
          <div className="flex items-center space-x-2 text-red-500 smart-alert">
            <Icons.AlertTriangle className="h-4 w-4" />
            <span className="text-sm font-medium">{anomalies.length} {t('anomaliesDetected')}</span>
          </div>
        )}
      </div>

      {anomalies.length > 0 ? (
        <div className="space-y-3">
          {anomalies.slice(0, showDetails ? anomalies.length : 3).map((anomaly, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-red-50 border border-red-200 dark:bg-red-900/20">
              <div>
                <p className="font-medium text-sm">{anomaly.description}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {new Date(anomaly.date).toLocaleDateString()} • {anomaly.category}
                </p>
                <p className="text-xs text-red-600">
                  {t('severityLevel')}: {anomaly.severity}σ {t('aboveAverage')}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-red-600">{formatCurrency(anomaly.amount)}</p>
              </div>
            </div>
          ))}
          
          {anomalies.length > 3 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="w-full"
            >
              {showDetails ? t('showLess') : `${t('showMore')} (${anomalies.length - 3})`}
            </Button>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <Icons.Shield className="h-12 w-12 text-green-500 mx-auto mb-2" />
          <p className={`${theme.textSecondary} text-sm`}>{t('noAnomaliesDetected')}</p>
          <p className={`${theme.textSecondary} text-xs mt-1`}>{t('spendingPatternsNormal')}</p>
        </div>
      )}
    </div>
  );
});

// Simulateur de scénarios
const ScenarioSimulator = memo(({ categories, expenses, theme, t, formatCurrency }) => {
  const [scenario, setScenario] = useState({
    incomeChange: 0,
    categoryChanges: {},
    timeframe: 3
  });
  
  const [simulation, setSimulation] = useState(null);

  const runSimulation = () => {
    const totalBudget = categories.reduce((sum, cat) => sum + cat.budget, 0);
    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    
    const newBudget = totalBudget * (1 + scenario.incomeChange / 100);
    const projectedSavings = (newBudget - totalSpent) * scenario.timeframe;
    
    setSimulation({
      originalBudget: totalBudget,
      newBudget,
      projectedSavings,
      timeframe: scenario.timeframe
    });
  };

  return (
    <div className={`${theme.card} rounded-xl border ${theme.border} p-6`}>
      <h3 className={`text-lg font-semibold ${theme.text} mb-4 flex items-center`}>
        <Icons.Calculator className="h-5 w-5 mr-2 text-purple-500" />
        {t('scenarioSimulator')}
      </h3>

      <div className="space-y-4">
        <div>
          <label className={`block text-sm font-medium ${theme.text} mb-2`}>
            {t('incomeChangePercent')}
          </label>
          <input
            type="range"
            min="-50"
            max="50"
            value={scenario.incomeChange}
            onChange={(e) => setScenario(prev => ({ ...prev, incomeChange: parseInt(e.target.value) }))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>-50%</span>
            <span className="font-medium">{scenario.incomeChange}%</span>
            <span>+50%</span>
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium ${theme.text} mb-2`}>
            {t('timeframe')} ({t('months')})
          </label>
          <select
            value={scenario.timeframe}
            onChange={(e) => setScenario(prev => ({ ...prev, timeframe: parseInt(e.target.value) }))}
            className={`w-full p-2 rounded border ${theme.border} ${theme.input}`}
          >
            <option value={1}>1 {t('month')}</option>
            <option value={3}>3 {t('months')}</option>
            <option value={6}>6 {t('months')}</option>
            <option value={12}>1 {t('year')}</option>
          </select>
        </div>

        <Button onClick={runSimulation} className="w-full">
          <Icons.Play className="h-4 w-4 mr-2" />
          {t('runSimulation')}
        </Button>

        {simulation && (
          <div className="mt-6 p-4 rounded-lg bg-purple-50 border border-purple-200 dark:bg-purple-900/20">
            <h4 className="font-medium mb-3">{t('simulationResults')}</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>{t('currentBudget')}:</span>
                <span className="font-medium">{formatCurrency(simulation.originalBudget)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('newBudget')}:</span>
                <span className="font-medium">{formatCurrency(simulation.newBudget)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('projectedSavings')} ({simulation.timeframe} {t('months')}):</span>
                <span className="font-bold text-green-600">{formatCurrency(simulation.projectedSavings)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

// Composant principal amélioré
const BudgetScreen = memo(({ financeManager, theme, t }) => {
  const { state, actions, computedValues, formatCurrency } = financeManager;
  const [activeWidget, setActiveWidget] = useState('overview');
  const [aiInsights, setAiInsights] = useState(null);

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
    predictions: { icon: Icons.Brain, label: t('aiPredictions') },
    recommendations: { icon: Icons.Target, label: t('recommendations') },
    anomalies: { icon: Icons.Shield, label: t('anomalies') },
    simulator: { icon: Icons.Calculator, label: t('simulator') }
  };

  return (
    <div className="space-y-6">
      {/* Navigation des widgets */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(widgets).map(([key, widget]) => (
          <Button
            key={key}
            variant={activeWidget === key ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveWidget(key)}
            className="flex items-center space-x-2"
          >
            <widget.icon className="h-4 w-4" />
            <span>{widget.label}</span>
          </Button>
        ))}
      </div>

      {/* Contenu des widgets */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {activeWidget === 'overview' && (
          <>
            {/* Vue d'ensemble classique améliorée */}
            <div className={`${theme.card} rounded-xl border ${theme.border} p-6 col-span-full`}>
              <h2 className={`text-2xl font-bold ${theme.text} mb-6`}>{t('budgetOverview')}</h2>
              
              {/* Graphique des budgets */}
              <div className="space-y-4">
                {state.categories.map(category => {
                  const spent = computedValues.currentMonthExpenses
                    .filter(e => e.category === category.name)
                    .reduce((sum, e) => sum + e.amount, 0);
                  const percentage = (spent / category.budget) * 100;
                  
                  return (
                    <div key={category.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className={`font-medium ${theme.text}`}>{t(category.name)}</span>
                        <span className={`text-sm font-medium ${percentage > 100 ? 'text-red-600' : theme.text}`}>
                          {formatCurrency(spent)} / {formatCurrency(category.budget)}
                        </span>
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
                        <span className={theme.textSecondary}>{percentage.toFixed(1)}% {t('used')}</span>
                        <span className={theme.textSecondary}>
                          {formatCurrency(Math.max(0, category.budget - spent))} {t('remaining')}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {activeWidget === 'predictions' && (
          <PredictiveAnalysis
            expenses={computedValues.currentMonthExpenses}
            categories={state.categories}
            theme={theme}
            t={t}
            formatCurrency={formatCurrency}
          />
        )}

        {activeWidget === 'recommendations' && (
          <SmartRecommendations
            expenses={computedValues.currentMonthExpenses}
            categories={state.categories}
            theme={theme}
            t={t}
            formatCurrency={formatCurrency}
          />
        )}

        {activeWidget === 'anomalies' && (
          <AnomalyDetection
            expenses={computedValues.currentMonthExpenses}
            theme={theme}
            t={t}
            formatCurrency={formatCurrency}
          />
        )}

        {activeWidget === 'simulator' && (
          <ScenarioSimulator
            categories={state.categories}
            expenses={computedValues.currentMonthExpenses}
            theme={theme}
            t={t}
            formatCurrency={formatCurrency}
          />
        )}
      </div>

      {/* Résumé IA global */}
      {aiInsights && (
        <div className={`${theme.card} rounded-xl border ${theme.border} p-6 ai-insight text-white`}>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Icons.Sparkles className="h-5 w-5 mr-2" />
            {t('aiFinancialSummary')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <Icons.TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-80" />
              <p className="text-sm opacity-90">{t('spendingTrend')}</p>
              <p className="font-semibold">{t('moderate')}</p>
            </div>
            <div className="text-center">
              <Icons.Target className="h-8 w-8 mx-auto mb-2 opacity-80" />
              <p className="text-sm opacity-90">{t('budgetHealth')}</p>
              <p className="font-semibold">{aiInsights.impulseSpending.length === 0 ? t('excellent') : t('needsAttention')}</p>
            </div>
            <div className="text-center">
              <Icons.Lightbulb className="h-8 w-8 mx-auto mb-2 opacity-80" />
              <p className="text-sm opacity-90">{t('optimizationPotential')}</p>
              <p className="font-semibold">{aiInsights.optimizationSuggestions.length} {t('suggestions')}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default BudgetScreen;