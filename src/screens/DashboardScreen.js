import React, { useState, useCallback, memo } from 'react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import * as Icons from 'lucide-react';
import { 
  EnhancedQuickStats, 
  TodaySection,
  RecentActivity, 
  BudgetOverview, 
  WeekComparison,
  RealTimeInsights,
  MonthlyGoals,
  MiniReports,
  InteractiveWidgets 
} from '../components/dashboard/DashboardWidgets';

// Dashboard Screen
const DashboardScreen = memo(({ financeManager, theme, t }) => {
  const { state, actions, computedValues, formatCurrency } = financeManager;
  const [dashboardTab, setDashboardTab] = useState('today');
  
  const QuickStats = memo(() => (
    <EnhancedQuickStats 
      state={state}
      computedValues={computedValues}
      formatCurrency={formatCurrency}
      theme={theme}
    />
  ));

  const WidgetCard = memo(({ title, icon: Icon, children, color = 'blue', className = '' }) => (
    <div className={`${theme.card} rounded-xl border ${theme.border} overflow-hidden ${className}`}>
      <div className={`p-4 bg-gradient-to-r from-${color}-500/10 to-${color}-600/10 border-b ${theme.border}`}>
        <div className="flex items-center space-x-3">
          <Icon className={`h-5 w-5 text-${color}-600`} />
          <h3 className={`font-semibold ${theme.text}`}>{title}</h3>
        </div>
      </div>
      <div className="p-4">{children}</div>
    </div>
  ));

  // Génération d'insights IA basée sur les vraies données
  const generateFinancialInsights = useCallback(() => [
    `Vous avez dépensé ${formatCurrency(computedValues.totalSpent)} ce mois, soit ${computedValues.totalSpent < computedValues.totalBudget ? 'moins' : 'plus'} que votre budget de ${formatCurrency(computedValues.totalBudget)}`,
    `Votre taux d'épargne actuel est de ${computedValues.savingsRate.toFixed(1)}%`,
    `Votre catégorie la plus dépensière est ${computedValues.pieChartData.length > 0 ? computedValues.pieChartData.reduce((a, b) => a.value > b.value ? a : b).name : 'aucune'}`
  ], [computedValues, formatCurrency]);

  const generatePersonalizedRecommendations = useCallback(() => [
    computedValues.totalSpent > computedValues.totalBudget ? 'Réduisez vos dépenses non essentielles ce mois' : 'Excellent contrôle budgétaire !',
    computedValues.savingsRate < 20 ? 'Essayez d\'épargner au moins 20% de vos revenus' : 'Bon taux d\'épargne !',
    'Considérez automatiser vos épargnes pour atteindre vos objectifs plus rapidement'
  ], [computedValues]);

  const predictEndOfMonth = useCallback(() => ({
    projectedEndBalance: state.monthlyIncome - computedValues.totalSpent - (computedValues.totalSpent * 0.3),
    confidence: 85
  }), [state.monthlyIncome, computedValues.totalSpent]);

  const calculateFinancialHealthScore = useCallback(() => {
    const savingsRate = computedValues.savingsRate / 100;
    const budgetRespect = computedValues.totalSpent <= computedValues.totalBudget ? 1 : 0;
    const score = Math.round((savingsRate * 50 + budgetRespect * 50));
    return {
      score: Math.min(100, Math.max(0, score)),
      message: score > 70 ? 'Excellente santé financière' : score > 40 ? 'Bonne gestion' : 'À améliorer'
    };
  }, [computedValues]);

  const insights = generateFinancialInsights();
  const recommendations = generatePersonalizedRecommendations();
  const predictions = predictEndOfMonth();
  const healthScore = calculateFinancialHealthScore();

  return (
    <div className={`min-h-screen ${theme.bg} transition-colors duration-500`}>
      <div className={`${theme.card} border-b ${theme.border} sticky top-0 z-40 backdrop-blur-lg bg-opacity-90`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Dashboard Financier IA
            </h1>
            
            <div className="flex items-center space-x-2">
              <select
                value={state.selectedMonth}
                onChange={(e) => actions.setSelectedMonth(e.target.value)}
                className={`px-3 py-1 rounded-lg ${theme.card} ${theme.text} border ${theme.border} text-sm`}
                aria-label="Sélectionner le mois"
              >
                {Array.from({length: 12}, (_, i) => {
                  const date = new Date(state.selectedYear, i);
                  return (
                    <option key={i} value={`${state.selectedYear}-${String(i + 1).padStart(2, '0')}`}>
                      {date.toLocaleDateString(state.language === 'fr' ? 'fr-FR' : 'en-US', { month: 'long' })}
                    </option>
                  );
                })}
              </select>
              <select
                value={state.selectedYear}
                onChange={(e) => actions.setSelectedYear(parseInt(e.target.value))}
                className={`px-3 py-1 rounded-lg ${theme.card} ${theme.text} border ${theme.border} text-sm`}
                aria-label="Sélectionner l'année"
              >
                {[2023, 2024, 2025, 2026].map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 mt-4 overflow-x-auto">
            {[
              { id: 'overview', label: 'Vue d\'ensemble', icon: Icons.LayoutDashboard },
              { id: 'today', label: 'Aujourd\'hui', icon: Icons.Calendar },
              { id: 'budget', label: 'Budget', icon: Icons.PieChart },
              { id: 'activity', label: 'Activité', icon: Icons.Activity },
              { id: 'insights', label: 'Insights IA', icon: Icons.Brain },
              { id: 'goals', label: 'Objectifs', icon: Icons.Target },
              { id: 'reports', label: 'Rapports', icon: Icons.BarChart },
              { id: 'tools', label: 'Outils', icon: Icons.Settings }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setDashboardTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                  dashboardTab === tab.id 
                    ? `bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400` 
                    : `${theme.text} hover:bg-gray-100 dark:hover:bg-gray-800`
                }`}
                aria-label={`Aller à ${tab.label}`}
              >
                <tab.icon className="h-4 w-4" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {dashboardTab === 'today' && (
          <div className="space-y-6">
            <WidgetCard title="Résumé d'aujourd'hui" icon={Icons.Sun} color="orange">
              <TodaySection 
                computedValues={computedValues}
                formatCurrency={formatCurrency}
                theme={theme}
                state={state}
              />
            </WidgetCard>
          </div>
        )}

        {dashboardTab === 'overview' && (
          <>
            <div className="mb-6">
              <QuickStats />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WidgetCard title="Score de Santé Financière" icon={Icons.Heart} color="green">
                <div className="space-y-3">
                  <div className="flex items-center justify-center">
                    <div className="relative w-16 h-16">
                      <svg className="w-16 h-16 transform -rotate-90">
                        <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="none" className="text-gray-200 dark:text-gray-700" />
                        <circle
                          cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="none"
                          strokeDasharray={`${healthScore.score * 1.76} 176`}
                          className={`${healthScore.score > 70 ? 'text-green-500' : healthScore.score > 40 ? 'text-yellow-500' : 'text-red-500'}`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-lg font-bold ${theme.text}`}>{healthScore.score}</span>
                      </div>
                    </div>
                  </div>
                  <div className={`text-xs ${theme.textSecondary} p-2 rounded-lg ${theme.bg} border ${theme.border}`}>
                    {healthScore.message}
                  </div>
                </div>
              </WidgetCard>

              <WidgetCard title="Prédictions Fin de Mois" icon={Icons.TrendingUp} color="purple">
                <div className="space-y-3">
                  <div className={`text-2xl font-bold ${theme.text}`}>
                    {state.showBalances ? formatCurrency(predictions.projectedEndBalance) : '•••'}
                  </div>
                  <p className={`text-sm ${theme.textSecondary}`}>Solde prévu fin de mois</p>
                  <div className={`p-3 rounded-lg ${theme.bg} border ${theme.border}`}>
                    <p className={`text-xs ${theme.textSecondary}`}>
                      Confiance: {predictions.confidence}%
                    </p>
                  </div>
                </div>
              </WidgetCard>

              <WidgetCard title="Graphique des Dépenses" icon={Icons.PieChart} color="blue">
                <div className="h-40">
                  {computedValues.pieChartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={computedValues.pieChartData}
                          cx="50%"
                          cy="50%"
                          outerRadius={60}
                          fill="#8884d8"
                          dataKey="value"
                          label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {computedValues.pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className={`text-sm ${theme.textSecondary}`}>Aucune dépense ce mois</p>
                    </div>
                  )}
                </div>
              </WidgetCard>

              <WidgetCard title="Comparaison Hebdomadaire" icon={Icons.BarChart3} color="indigo">
                <WeekComparison 
                  computedValues={computedValues}
                  formatCurrency={formatCurrency}
                  theme={theme}
                />
              </WidgetCard>
            </div>
          </>
        )}

        {dashboardTab === 'budget' && (
          <div className="space-y-6">
            <WidgetCard title="Aperçu Budgétaire Détaillé" icon={Icons.Target} color="green">
              <BudgetOverview 
                state={state}
                computedValues={computedValues}
                formatCurrency={formatCurrency}
                theme={theme}
              />
            </WidgetCard>
          </div>
        )}

        {dashboardTab === 'activity' && (
          <div className="space-y-6">
            <WidgetCard title="Activité Récente" icon={Icons.Clock} color="blue">
              <RecentActivity 
                computedValues={computedValues}
                formatCurrency={formatCurrency}
                theme={theme}
              />
            </WidgetCard>
          </div>
        )}

        {dashboardTab === 'insights' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <WidgetCard title="Alertes & Insights Temps Réel" icon={Icons.Zap} color="red">
              <RealTimeInsights 
                state={state}
                computedValues={computedValues}
                formatCurrency={formatCurrency}
                theme={theme}
              />
            </WidgetCard>

            <WidgetCard title="Analyses Financières IA" icon={Icons.Lightbulb} color="blue">
              <div className="space-y-3">
                {insights.map((insight, index) => (
                  <div key={index} className={`p-3 rounded-lg ${theme.bg} border ${theme.border}`}>
                    <p className={`text-sm ${theme.text}`}>{insight}</p>
                  </div>
                ))}
              </div>
            </WidgetCard>

            <WidgetCard title="Recommandations Personnalisées" icon={Icons.Sparkles} color="purple" className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {recommendations.map((rec, index) => (
                  <div key={index} className={`p-3 rounded-lg ${theme.bg} border ${theme.border}`}>
                    <p className={`text-sm ${theme.text}`}>{rec}</p>
                  </div>
                ))}
              </div>
            </WidgetCard>
          </div>
        )}

        {dashboardTab === 'goals' && (
          <div className="space-y-6">
            <WidgetCard title="Objectifs du Mois" icon={Icons.Trophy} color="yellow">
              <MonthlyGoals 
                state={state}
                computedValues={computedValues}
                formatCurrency={formatCurrency}
                theme={theme}
              />
            </WidgetCard>
          </div>
        )}

        {dashboardTab === 'reports' && (
          <div className="space-y-6">
            <MiniReports 
              computedValues={computedValues}
              formatCurrency={formatCurrency}
              theme={theme}
            />
            
            <div className={`${theme.card} rounded-xl border ${theme.border} p-6`}>
              <h3 className={`text-xl font-bold ${theme.text} mb-6`}>Évolution Mensuelle</h3>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={computedValues.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} name="Revenus" />
                    <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} name="Dépenses" />
                    <Line type="monotone" dataKey="savings" stroke="#3b82f6" strokeWidth={2} name="Économies" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {dashboardTab === 'tools' && (
          <div className="space-y-6">
            <h2 className={`text-xl font-bold ${theme.text} mb-4`}>Outils Interactifs</h2>
            <InteractiveWidgets 
              state={state}
              actions={actions}
              formatCurrency={formatCurrency}
              theme={theme}
            />
          </div>
        )}
      </div>
    </div>
  );
});

export default DashboardScreen;