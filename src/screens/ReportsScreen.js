// ReportsScreen.js - Version enrichie
import React, { useState, memo, useMemo } from 'react';
import { ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, AreaChart, Area, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import * as Icons from 'lucide-react';
import Button from '../components/ui/Button';

const ReportsScreen = memo(({ financeManager, theme, t }) => {
  const { state, actions, computedValues, formatCurrency } = financeManager;
  const [reportType, setReportType] = useState('overview');


  // Insights comportementaux avancés
  const getBehavioralInsights = useMemo(() => {
    const expenses = computedValues.currentMonthExpenses;
    const insights = [];
    
    // Analyse par jour de la semaine
    const dayAnalysis = expenses.reduce((acc, exp) => {
      const day = new Date(exp.date).getDay();
      const dayNames = [t('sun'), t('mon'), t('tue'), t('wed'), t('thu'), t('fri'), t('sat')];
      const dayName = dayNames[day];
      acc[dayName] = (acc[dayName] || 0) + exp.amount;
      return acc;
    }, {});
    
    const mostExpensiveDay = Object.entries(dayAnalysis).reduce((max, [day, amount]) => 
      amount > (max.amount || 0) ? { day, amount } : max, {});
    
    if (mostExpensiveDay.day) {
      insights.push({
        type: 'behavior',
        title: t('preferredSpendingDay'),
        value: mostExpensiveDay.day,
        detail: t('youSpendMostOn', { day: mostExpensiveDay.day, amount: formatCurrency(mostExpensiveDay.amount) }),
        icon: Icons.Calendar
      });
    }
    
    // Analyse des montants récurrents
    const amountFrequency = {};
    expenses.forEach(exp => {
      const rounded = Math.round(exp.amount / 5) * 5;
      amountFrequency[rounded] = (amountFrequency[rounded] || 0) + 1;
    });
    
    const mostFrequent = Object.entries(amountFrequency)
      .sort(([,a], [,b]) => b - a)[0];
    
    if (mostFrequent && mostFrequent[1] > 2) {
      insights.push({
        type: 'pattern',
        title: t('recurringAmount'),
        value: formatCurrency(mostFrequent[0]),
        detail: t('youOftenSpend', { amount: formatCurrency(mostFrequent[0]), count: mostFrequent[1] }),
        icon: Icons.Repeat
      });
    }
    
    // Analyse des catégories dominantes
    const categoryTotals = expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {});
    
    const dominantCategory = Object.entries(categoryTotals)
      .sort(([,a], [,b]) => b - a)[0];
    
    if (dominantCategory) {
      const percentage = (dominantCategory[1] / computedValues.totalSpent) * 100;
      insights.push({
        type: 'category',
        title: t('dominantCategory'),
        value: dominantCategory[0],
        detail: t('representsPercentage', { category: dominantCategory[0], percentage: percentage.toFixed(1) }),
        icon: Icons.PieChart
      });
    }
    
    return insights;
  }, [computedValues.currentMonthExpenses, computedValues.totalSpent, formatCurrency]);

  // Score financier global
  const getFinancialScore = useMemo(() => {
    let score = 0;
    const factors = [];
    
    // Facteur épargne (0-30 points)
    const savingsScore = Math.min(30, (computedValues.savingsRate / 20) * 30);
    score += savingsScore;
    factors.push({ name: t('savingsRate'), score: savingsScore, max: 30 });
    
    // Facteur budget (0-25 points)
    const budgetRespect = computedValues.totalSpent <= computedValues.totalBudget ? 25 : 
                         Math.max(0, 25 - ((computedValues.totalSpent - computedValues.totalBudget) / computedValues.totalBudget) * 25);
    score += budgetRespect;
    factors.push({ name: t('budgetRespect'), score: budgetRespect, max: 25 });
    
    // Facteur dettes (0-20 points)
    const debtScore = computedValues.totalDebt === 0 ? 20 : 
                     Math.max(0, 20 - (computedValues.totalDebt / (state.monthlyIncome * 12)) * 20);
    score += debtScore;
    factors.push({ name: t('debtManagement'), score: debtScore, max: 20 });
    
    // Facteur diversification (0-15 points)
    const activeCategoriesCount = state.categories.filter(cat => 
      computedValues.currentMonthExpenses.some(exp => exp.category === cat.name)
    ).length;
    const diversificationScore = Math.min(15, (activeCategoriesCount / state.categories.length) * 15);
    score += diversificationScore;
    factors.push({ name: t('diversification'), score: diversificationScore, max: 15 });
    
    // Facteur régularité (0-10 points)
    const daysWithExpenses = [...new Set(computedValues.currentMonthExpenses.map(e => e.date))].length;
    const totalDays = new Date().getDate();
    const regularityScore = Math.min(10, (1 - daysWithExpenses / totalDays) * 10); // Moins de jours avec dépenses = mieux
    score += regularityScore;
    factors.push({ name: t('regularity'), score: regularityScore, max: 10 });
    
    return { 
      total: Math.round(score), 
      factors,
      level: score >= 80 ? t('excellent') : score >= 60 ? t('good') : score >= 40 ? t('medium') : t('needsImprovement'),
      color: score >= 80 ? 'green' : score >= 60 ? 'blue' : score >= 40 ? 'yellow' : 'red'
    };
  }, [computedValues, state.categories, state.monthlyIncome]);

  // Projections avancées
  const getAdvancedProjections = useMemo(() => {
    // Simplifié, dans la vraie vie ce serait calculé sur plusieurs mois
    
    return {
      endOfYear: {
        savings: (state.monthlyIncome - computedValues.totalSpent) * 12,
        totalSpent: computedValues.totalSpent * 12,
        goals: state.savingsGoals.map(goal => ({
          ...goal,
          projectedCompletion: goal.currentAmount + ((goal.targetAmount - goal.currentAmount) / 12) * 12
        }))
      },
      nextMonth: {
        predictedSpending: computedValues.totalSpent * 1.05, // +5% inflation
        budgetStatus: computedValues.totalSpent > computedValues.totalBudget ? 'risk' : 'safe',
        recommendations: [
          computedValues.totalSpent > computedValues.totalBudget && t('reduceExpensesNextMonth'),
          computedValues.savingsRate < 10 && t('increaseSavings'),
          t('continueBudgetEfforts')
        ].filter(Boolean)
      }
    };
  }, [computedValues, state.monthlyIncome, state.savingsGoals]);

  // Benchmarks personnels
  const getPersonalBenchmarks = useMemo(() => {
    // Simulation de données historiques (dans une vraie app, cela viendrait de la base de données)
    const currentMonth = computedValues.totalSpent;
    const lastMonth = currentMonth * (0.8 + Math.random() * 0.4); // Simulation
    const bestMonth = Math.min(currentMonth, lastMonth) * 0.7; // Simulation
    const worstMonth = Math.max(currentMonth, lastMonth) * 1.3; // Simulation
    
    return {
      current: currentMonth,
      lastMonth,
      bestMonth,
      worstMonth,
      average: (currentMonth + lastMonth + bestMonth + worstMonth) / 4,
      improvement: ((lastMonth - currentMonth) / lastMonth) * 100
    };
  }, [computedValues.totalSpent]);

  // Données radar pour l'analyse multidimensionnelle
  const getRadarData = useMemo(() => {
    const financialScore = getFinancialScore;
    return financialScore.factors.map(factor => ({
      subject: factor.name,
      score: factor.score,
      fullMark: factor.max
    }));
  }, [getFinancialScore]);

  const insights = getBehavioralInsights;
  const financialScore = getFinancialScore;
  const projections = getAdvancedProjections;
  const benchmarks = getPersonalBenchmarks;
  const radarData = getRadarData;

  return (
    <div className="space-y-6">
      <div className={`${theme.card} rounded-xl border ${theme.border} p-6`}>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 space-y-4 lg:space-y-0">
          <h2 className={`text-2xl font-bold ${theme.text}`}>{t('intelligentFinancialReports')}</h2>
          <div className="flex space-x-2">
            <Button
              variant={reportType === 'overview' ? 'primary' : 'outline'}
              onClick={() => setReportType('overview')}
              size="sm"
            >
              {t('overview')}
            </Button>
            <Button
              variant={reportType === 'behavioral' ? 'primary' : 'outline'}
              onClick={() => setReportType('behavioral')}
              size="sm"
            >
              {t('behavioral')}
            </Button>
            <Button
              variant={reportType === 'projections' ? 'primary' : 'outline'}
              onClick={() => setReportType('projections')}
              size="sm"
            >
              {t('projections')}
            </Button>
            <Button
              variant={reportType === 'benchmarks' ? 'primary' : 'outline'}
              onClick={() => setReportType('benchmarks')}
              size="sm"
            >
              {t('performances')}
            </Button>
          </div>
        </div>

        {reportType === 'overview' && (
          <div className="space-y-6">
            {/* Score financier global */}
            <div className={`p-6 rounded-xl bg-gradient-to-br ${
              financialScore.color === 'green' ? 'from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/30' :
              financialScore.color === 'blue' ? 'from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/30' :
              financialScore.color === 'yellow' ? 'from-yellow-50 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/30' :
              'from-red-50 to-pink-100 dark:from-red-900/20 dark:to-pink-900/30'
            } border ${theme.border}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-xl font-bold ${theme.text}`}>{t('globalFinancialScore')}</h3>
                <div className="flex items-center space-x-2">
                  <div className={`text-4xl font-bold text-${financialScore.color}-600`}>
                    {financialScore.total}
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium text-${financialScore.color}-600`}>/ 100</div>
                    <div className={`text-xs ${theme.textSecondary}`}>{financialScore.level}</div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {financialScore.factors.map((factor, index) => (
                  <div key={index} className={`p-3 rounded-lg ${theme.bg} border ${theme.border}`}>
                    <div className={`text-xs ${theme.textSecondary} mb-1`}>{factor.name}</div>
                    <div className="flex items-center space-x-2">
                      <div className={`text-lg font-bold text-${financialScore.color}-600`}>
                        {Math.round(factor.score)}
                      </div>
                      <div className={`text-xs ${theme.textSecondary}`}>/{factor.max}</div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 mt-2">
                      <div
                        className={`bg-${financialScore.color}-500 h-1 rounded-full`}
                        style={{ width: `${(factor.score / factor.max) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Graphique radar */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className={`${theme.card} border ${theme.border} rounded-lg p-6`}>
                <h3 className={`text-lg font-semibold ${theme.text} mb-4`}>{t('multidimensionalAnalysis')}</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis domain={[0, 'dataMax']} />
                      <Radar
                        name="Score"
                        dataKey="score"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.3}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className={`${theme.card} border ${theme.border} rounded-lg p-6`}>
                <h3 className={`text-lg font-semibold ${theme.text} mb-4`}>{t('detailedMonthlySummary')}</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className={theme.textSecondary}>{t('income')}</span>
                    <span className={`font-bold text-green-600`}>
                      {state.showBalances ? `+${formatCurrency(state.monthlyIncome)}` : '+•••'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={theme.textSecondary}>{t('expenses')}</span>
                    <span className={`font-bold text-red-600`}>
                      {state.showBalances ? `-${formatCurrency(computedValues.totalSpent)}` : '-•••'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={theme.textSecondary}>{t('recurring')}</span>
                    <span className={`font-bold text-orange-600`}>
                      {state.showBalances ? `-${formatCurrency(computedValues.totalRecurring)}` : '-•••'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={theme.textSecondary}>{t('debts')}</span>
                    <span className={`font-bold text-purple-600`}>
                      {state.showBalances ? formatCurrency(computedValues.totalDebt) : '•••'}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-3">
                    <span className={`font-semibold ${theme.text}`}>{t('balance')}</span>
                    <span className={`font-bold ${(state.monthlyIncome - computedValues.totalSpent) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {state.showBalances ? formatCurrency(state.monthlyIncome - computedValues.totalSpent) : '•••'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={theme.textSecondary}>{t('savingsRateLabel')}</span>
                    <span className={`font-medium ${computedValues.savingsRate > 20 ? 'text-green-600' : computedValues.savingsRate > 10 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {computedValues.savingsRate.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {reportType === 'behavioral' && (
          <div className="space-y-6">
            {/* Insights comportementaux */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {insights.map((insight, index) => {
                const Icon = insight.icon;
                return (
                  <div key={index} className={`${theme.card} border ${theme.border} rounded-lg p-4`}>
                    <div className="flex items-center space-x-3 mb-2">
                      <Icon className="h-5 w-5 text-blue-600" />
                      <h4 className={`font-semibold ${theme.text}`}>{insight.title}</h4>
                    </div>
                    <div className={`text-lg font-bold ${theme.text} mb-1`}>{insight.value}</div>
                    <p className={`text-xs ${theme.textSecondary}`}>{insight.detail}</p>
                  </div>
                );
              })}
            </div>

            {/* Analyse par catégorie détaillée */}
            <div className={`${theme.card} border ${theme.border} rounded-lg p-6`}>
              <h3 className={`text-lg font-semibold ${theme.text} mb-4`}>{t('behavioralCategoryDistribution')}</h3>
              <div className="space-y-3">
                {state.categories.map(category => {
                  const spent = computedValues.currentMonthExpenses
                    .filter(e => e.category === category.name)
                    .reduce((sum, e) => sum + e.amount, 0);
                  const percentage = computedValues.totalSpent > 0 ? (spent / computedValues.totalSpent) * 100 : 0;
                  const budgetPercentage = (spent / category.budget) * 100;
                  const transactionCount = computedValues.currentMonthExpenses.filter(e => e.category === category.name).length;
                  const avgTransaction = transactionCount > 0 ? spent / transactionCount : 0;

                  return (
                    <div key={category.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                          <span className={`text-sm font-medium ${theme.text}`}>{category.name}</span>
                        </div>
                        <div className="text-right">
                          <span className={`text-sm font-medium ${theme.text}`}>
                            {state.showBalances ? formatCurrency(spent) : '•••'}
                          </span>
                          <span className={`text-xs ${theme.textSecondary} ml-2`}>
                            ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-xs">
                        <div>
                          <span className={theme.textSecondary}>{t('budgetUsed')}</span>
                          <div className={`font-medium ${budgetPercentage > 100 ? 'text-red-600' : budgetPercentage > 80 ? 'text-yellow-600' : 'text-green-600'}`}>
                            {budgetPercentage.toFixed(1)}%
                          </div>
                        </div>
                        <div>
                          <span className={theme.textSecondary}>{t('transactions')}</span>
                          <div className={theme.text}>{transactionCount}</div>
                        </div>
                        <div>
                          <span className={theme.textSecondary}>{t('avgTransaction')}</span>
                          <div className={theme.text}>{formatCurrency(avgTransaction)}</div>
                        </div>
                      </div>
                      
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            budgetPercentage > 100 ? 'bg-red-500' : 
                            budgetPercentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {reportType === 'projections' && (
          <div className="space-y-6">
            {/* Projections fin d'année */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className={`${theme.card} border ${theme.border} rounded-lg p-6`}>
                <h3 className={`text-lg font-semibold ${theme.text} mb-4 flex items-center`}>
                  <Icons.Calendar className="h-5 w-5 mr-2 text-blue-600" />
                  {t('endOfYearProjections')}
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className={theme.textSecondary}>{t('projectedTotalSavings')}</span>
                    <span className={`font-bold text-green-600`}>
                      {formatCurrency(projections.endOfYear.savings)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={theme.textSecondary}>{t('projectedTotalExpenses')}</span>
                    <span className={`font-bold text-red-600`}>
                      {formatCurrency(projections.endOfYear.totalSpent)}
                    </span>
                  </div>
                  <div className="pt-3 border-t">
                    <h4 className={`font-medium ${theme.text} mb-2`}>{t('savingsGoals')}</h4>
                    {projections.endOfYear.goals.map(goal => (
                      <div key={goal.id} className="flex justify-between text-sm">
                        <span className={theme.textSecondary}>{goal.name}:</span>
                        <span className={`${goal.projectedCompletion >= goal.targetAmount ? 'text-green-600' : 'text-yellow-600'}`}>
                          {((goal.projectedCompletion / goal.targetAmount) * 100).toFixed(0)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className={`${theme.card} border ${theme.border} rounded-lg p-6`}>
                <h3 className={`text-lg font-semibold ${theme.text} mb-4 flex items-center`}>
                  <Icons.TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
                  {t('nextMonthForecasts')}
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className={theme.textSecondary}>{t('predictedExpenses')}</span>
                    <span className={theme.text}>
                      {formatCurrency(projections.nextMonth.predictedSpending)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={theme.textSecondary}>{t('budgetStatus')}</span>
                    <span className={`font-medium ${projections.nextMonth.budgetStatus === 'risk' ? 'text-red-600' : 'text-green-600'}`}>
                      {projections.nextMonth.budgetStatus === 'risk' ? t('atRisk') : t('secure')}
                    </span>
                  </div>
                  <div className="pt-3 border-t">
                    <h4 className={`font-medium ${theme.text} mb-2`}>{t('recommendations')}</h4>
                    <ul className="space-y-1">
                      {projections.nextMonth.recommendations.map((rec, index) => (
                        <li key={index} className={`text-sm ${theme.textSecondary} flex items-center space-x-2`}>
                          <Icons.CheckCircle className="h-3 w-3 text-green-500" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Graphique de tendances */}
            <div className={`${theme.card} border ${theme.border} rounded-lg p-6`}>
              <h3 className={`text-lg font-semibold ${theme.text} mb-4`}>{t('monthlyEvolution')}</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={computedValues.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Area 
                      type="monotone" 
                      dataKey="savings" 
                      stackId="1"
                      stroke="#10b981" 
                      fill="#10b981" 
                      fillOpacity={0.6}
                      name={t('savings')}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="expenses" 
                      stackId="2"
                      stroke="#ef4444" 
                      fill="#ef4444" 
                      fillOpacity={0.6}
                      name={t('expenses')}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {reportType === 'benchmarks' && (
          <div className="space-y-6">
            {/* Benchmarks personnels */}
            <div className={`${theme.card} border ${theme.border} rounded-lg p-6`}>
              <h3 className={`text-lg font-semibold ${theme.text} mb-4 flex items-center`}>
                <Icons.BarChart3 className="h-5 w-5 mr-2 text-indigo-600" />
                {t('historicalPerformance')}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className={`p-4 rounded-lg ${theme.bg} border ${theme.border} text-center`}>
                  <div className={`text-xs ${theme.textSecondary} mb-1`}>{t('thisMonth')}</div>
                  <div className={`text-lg font-bold ${theme.text}`}>
                    {formatCurrency(benchmarks.current)}
                  </div>
                  <div className={`text-xs ${benchmarks.improvement > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {benchmarks.improvement > 0 ? '↓' : '↑'} {Math.abs(benchmarks.improvement).toFixed(1)}%
                  </div>
                </div>
                <div className={`p-4 rounded-lg ${theme.bg} border ${theme.border} text-center`}>
                  <div className={`text-xs ${theme.textSecondary} mb-1`}>{t('lastMonth')}</div>
                  <div className={`text-lg font-bold ${theme.text}`}>
                    {formatCurrency(benchmarks.lastMonth)}
                  </div>
                  <div className={`text-xs ${theme.textSecondary}`}>{t('reference')}</div>
                </div>
                <div className={`p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 text-center`}>
                  <div className={`text-xs text-green-600 mb-1`}>{t('bestMonth')}</div>
                  <div className={`text-lg font-bold text-green-700`}>
                    {formatCurrency(benchmarks.bestMonth)}
                  </div>
                  <div className={`text-xs text-green-600`}>🎯 {t('target')}</div>
                </div>
                <div className={`p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 text-center`}>
                  <div className={`text-xs text-red-600 mb-1`}>{t('worstMonth')}</div>
                  <div className={`text-lg font-bold text-red-700`}>
                    {formatCurrency(benchmarks.worstMonth)}
                  </div>
                  <div className={`text-xs text-red-600`}>⚠️ {t('toAvoid')}</div>
                </div>
              </div>
            </div>

            {/* Analyse comparative */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className={`${theme.card} border ${theme.border} rounded-lg p-6`}>
                <h3 className={`text-lg font-semibold ${theme.text} mb-4`}>{t('comparativeAnalysis')}</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className={theme.textSecondary}>{t('vsPersonalAverage')}</span>
                    <span className={`font-bold ${benchmarks.current < benchmarks.average ? 'text-green-600' : 'text-red-600'}`}>
                      {((benchmarks.current - benchmarks.average) / benchmarks.average * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={theme.textSecondary}>{t('vsBestMonth')}</span>
                    <span className={`font-bold ${benchmarks.current < benchmarks.bestMonth ? 'text-green-600' : 'text-red-600'}`}>
                      {((benchmarks.current - benchmarks.bestMonth) / benchmarks.bestMonth * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={theme.textSecondary}>{t('distanceFromWorst')}</span>
                    <span className={`font-bold text-green-600`}>
                      {((benchmarks.worstMonth - benchmarks.current) / benchmarks.worstMonth * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className={`${theme.card} border ${theme.border} rounded-lg p-6`}>
                <h3 className={`text-lg font-semibold ${theme.text} mb-4`}>{t('trends')}</h3>
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[
                      { name: t('best'), value: benchmarks.bestMonth },
                      { name: t('average'), value: benchmarks.average },
                      { name: t('current'), value: benchmarks.current },
                      { name: t('worst'), value: benchmarks.worstMonth }
                    ]}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default ReportsScreen;