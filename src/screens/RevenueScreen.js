import React, { memo, useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import * as Icons from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Search } from 'lucide-react';

// Déclaration de WidgetCard avec la prop theme
const WidgetCard = memo(({ title, icon: Icon, children, color = 'blue', className = '', theme }) => (
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

const RevenueScreen = memo(({ financeManager, theme, t }) => {
  const { state, actions, computedValues, formatCurrency } = financeManager;
  const [activeTab, setActiveTab] = useState('overview');
  const [editingRevenueId, setEditingRevenueId] = useState(null);
  const [editRevenueForm, setEditRevenueForm] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [searchTermList, setSearchTermList] = useState('');
  const [expandedSavings, setExpandedSavings] = useState(new Set());

  // Synchroniser le formulaire d'édition avec la source sélectionnée
  React.useEffect(() => {
    if (editingRevenueId) {
      const rev = state.revenues.find(r => r.id === editingRevenueId);
      if (rev) setEditRevenueForm({ ...rev });
    } else {
      setEditRevenueForm(null);
    }
  }, [editingRevenueId, state.revenues]);

  // Calculer le solde actuel basé sur les revenus, dépenses ET solde initial
  const getCurrentBalance = useMemo(() => {
    const totalRevenue = state.revenues?.reduce((sum, rev) => sum + rev.amount, 0) || state.monthlyIncome;
    const totalExpenses = computedValues.totalSpent;
    const totalRecurring = computedValues.totalRecurring || 0;
    const initialBalance = state.initialBalance || 0;
    return {
      current: initialBalance + totalRevenue - totalExpenses - totalRecurring,
      totalRevenue,
      projectedEndMonth: initialBalance + totalRevenue - (totalExpenses * 1.2) - totalRecurring,
      savingsThisMonth: totalRevenue - totalExpenses
    };
  }, [state.revenues, state.monthlyIncome, computedValues.totalSpent, computedValues.totalRecurring, state.initialBalance]);

  // Analyse de stabilité des revenus
  const getRevenueStability = useMemo(() => {
    const revenues = state.revenues || [];
    const fixedRevenues = revenues.filter(r => r.type === 'fixed');
    const variableRevenues = revenues.filter(r => r.type === 'variable');
    
    const fixedTotal = fixedRevenues.reduce((sum, r) => sum + r.amount, 0);
    const variableTotal = variableRevenues.reduce((sum, r) => sum + r.amount, 0);
    const total = fixedTotal + variableTotal;
    
    const stabilityScore = total > 0 ? Math.round((fixedTotal / total) * 100) : 0;
    
    return {
      stabilityScore,
      fixedPercentage: total > 0 ? (fixedTotal / total) * 100 : 0,
      variablePercentage: total > 0 ? (variableTotal / total) * 100 : 0,
      level: stabilityScore > 80 ? 'high' : stabilityScore > 50 ? 'medium' : 'low'
    };
  }, [state.revenues]);

  // Données pour le graphique d'évolution des revenus
  const getRevenueEvolution = useMemo(() => {
    // Simulation de données sur 12 mois (à remplacer par de vraies données)
    const months = [];
    const currentMonth = new Date().getMonth();
    
    for (let i = 11; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      const monthNames = {
        fr: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
        en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        es: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
      };
      
      const monthName = monthNames[state.language][monthIndex];
      const baseRevenue = state.monthlyIncome;
      
      months.push({
        month: monthName,
        revenue: baseRevenue + (Math.random() - 0.5) * baseRevenue * 0.3,
        expenses: computedValues.totalSpent + (Math.random() - 0.5) * computedValues.totalSpent * 0.4,
        savings: 0
      });
    }
    
    // Calculer les épargnes
    months.forEach(month => {
      month.savings = Math.max(0, month.revenue - month.expenses);
    });
    
    return months;
  }, [state.monthlyIncome, computedValues.totalSpent, state.language]);

  // Sources de revenus par défaut
  const getDefaultRevenueSources = () => {
    const sources = {
      fr: [
        { name: 'Salaire Principal', type: 'fixed', frequency: 'monthly' },
        { name: 'Freelance', type: 'variable', frequency: 'irregular' },
        { name: 'Investissements', type: 'variable', frequency: 'monthly' },
        { name: 'Allocations', type: 'fixed', frequency: 'monthly' }
      ],
      en: [
        { name: 'Main Salary', type: 'fixed', frequency: 'monthly' },
        { name: 'Freelance', type: 'variable', frequency: 'irregular' },
        { name: 'Investments', type: 'variable', frequency: 'monthly' },
        { name: 'Benefits', type: 'fixed', frequency: 'monthly' }
      ],
      es: [
        { name: 'Salario Principal', type: 'fixed', frequency: 'monthly' },
        { name: 'Freelance', type: 'variable', frequency: 'irregular' },
        { name: 'Inversiones', type: 'variable', frequency: 'monthly' },
        { name: 'Beneficios', type: 'fixed', frequency: 'monthly' }
      ]
    };
    
    return sources[state.language] || sources.fr;
  };

  // Calculateur d'impôts simplifié
  const getTaxEstimation = useCallback((revenue) => {
    // Simulation simple d'impôts (à adapter selon les pays)
    const taxBrackets = [
      { min: 0, max: 10000, rate: 0 },
      { min: 10000, max: 25000, rate: 0.11 },
      { min: 25000, max: 75000, rate: 0.30 },
      { min: 75000, max: Infinity, rate: 0.41 }
    ];
    
    let tax = 0;
    let remaining = revenue;
    
    for (const bracket of taxBrackets) {
      if (remaining <= 0) break;
      
      const taxableInBracket = Math.min(remaining, bracket.max - bracket.min);
      tax += taxableInBracket * bracket.rate;
      remaining -= taxableInBracket;
    }
    
    return {
      grossRevenue: revenue,
      tax: Math.round(tax),
      netRevenue: Math.round(revenue - tax),
      taxRate: (tax / revenue) * 100
    };
  }, []);

  const balance = getCurrentBalance;
  const stability = getRevenueStability;
  const evolution = getRevenueEvolution;
  const defaultSources = getDefaultRevenueSources();

  // Composant RevenueItem optimisé
  const RevenueItem = memo(function RevenueItem({ revenue, theme, state, formatCurrency, t, setEditingRevenueId, actions }) {
    return (
      <div className={`p-4 rounded-lg border ${theme.border} ${theme.bg}`}>
        <div className="flex justify-between items-start mb-2">
          <div>
            <h4 className={`font-semibold ${theme.text}`}>{revenue.name}</h4>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`px-2 py-1 text-xs rounded-full ${
                revenue.type === 'fixed' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
              }`}>
                {t(revenue.type)}
              </span>
              <span className={`text-xs ${theme.textSecondary}`}>{t(revenue.frequency)}</span>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-lg font-bold text-green-600`}>
              {state.showBalances ? formatCurrency(revenue.amount) : '•••'}
            </div>
            <div className="flex items-center space-x-1 mt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingRevenueId(revenue.id)}
              >
                <Icons.Edit2 className="h-3 w-3" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => actions.deleteRevenue(revenue.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Icons.Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
        
        {revenue.description && (
          <p className={`text-sm ${theme.textSecondary} mt-2`}>{revenue.description}</p>
        )}
      </div>
    );
  });

  const revenueItems = useMemo(() => (state.revenues || []).map(revenue => (
    <RevenueItem
      key={revenue.id}
      revenue={revenue}
      theme={theme}
      state={state}
      formatCurrency={formatCurrency}
      t={t}
      setEditingRevenueId={setEditingRevenueId}
      actions={actions}
    />
  )), [state.revenues, theme, state, formatCurrency, t, setEditingRevenueId, actions]);

  const ITEMS_PER_LOAD = 20;
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD);
  const listRef = useRef(null);

  // Remise à zéro du scroll et du nombre d'éléments visibles lors d'un changement de filtre
  useEffect(() => {
    setVisibleCount(ITEMS_PER_LOAD);
    if (listRef.current) listRef.current.scrollTop = 0;
  }, [state.revenues]);

  // Gestion du scroll pour charger plus d'éléments
  const handleScroll = useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
      setVisibleCount((prev) => Math.min(prev + ITEMS_PER_LOAD, (state.revenues || []).length));
    }
  }, [state.revenues]);

  // Liste des revenus à afficher
  const visibleRevenues = useMemo(() => (state.revenues || []).slice(0, visibleCount), [state.revenues, visibleCount]);

  return (
    <div className={`min-h-screen ${theme.bg} transition-colors duration-500`}>
      <div className={`${theme.card} border-b ${theme.border} sticky top-0 z-10 backdrop-blur-lg bg-opacity-90 mt-6`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              {t('revenueManagement')}
            </h1>
            
            <div className="flex items-center space-x-2">
              {/* Bouton 'Ajouter des revenus' supprimé */}
            </div>
          </div>
          
          <div className="flex items-center space-x-1 mt-4 overflow-x-auto">
            {[
              { id: 'overview', label: t('overview'), icon: Icons.LayoutDashboard },
              { id: 'sources', label: t('revenueSources'), icon: Icons.DollarSign },
              { id: 'savings', label: t('savingsAllocation'), icon: Icons.PiggyBank },
              { id: 'analysis', label: t('analysis'), icon: Icons.TrendingUp }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                  activeTab === tab.id 
                    ? `bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400` 
                    : `${theme.text} hover:bg-gray-100 dark:hover:bg-gray-800`
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <WidgetCard title={t('totalRevenue')} icon={Icons.TrendingUp} color="green" theme={theme}>
                <div className="bg-green-600 rounded-xl p-4 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{t('totalRevenue')}</span>
                    <Icons.TrendingUp className="h-5 w-5 opacity-80" />
                  </div>
                  <div className="text-2xl font-bold">
                    {state.showBalances ? formatCurrency(balance.totalRevenue) : '•••'}
                  </div>
                  <div className="text-xs opacity-75">{t('thisMonth')}</div>
                </div>
              </WidgetCard>

              <WidgetCard title={t('currentBalance')} icon={Icons.Wallet} color="blue" theme={theme}>
                <div className="bg-blue-600 rounded-xl p-4 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{t('currentBalance')}</span>
                    <Icons.Wallet className="h-5 w-5 opacity-80" />
                  </div>
                  <div className="text-2xl font-bold">
                    {state.showBalances ? formatCurrency(balance.current) : '•••'}
                  </div>
                  <div className="text-xs opacity-75">{t('available')}</div>
                </div>
              </WidgetCard>

              <WidgetCard title={t('monthlySavings')} icon={Icons.PiggyBank} color="purple" theme={theme}>
                <div className="bg-purple-600 rounded-xl p-4 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{t('monthlySavings')}</span>
                    <Icons.PiggyBank className="h-5 w-5 opacity-80" />
                  </div>
                  <div className="text-2xl font-bold">
                    {state.showBalances ? formatCurrency(balance.savingsThisMonth) : '•••'}
                  </div>
                  <div className="text-xs opacity-75">
                    {((balance.savingsThisMonth / balance.totalRevenue) * 100).toFixed(1)}%
                  </div>
                </div>
              </WidgetCard>

              <WidgetCard title={t('stabilityScore')} icon={Icons.Shield} color="orange" theme={theme}>
                <div className="bg-orange-600 rounded-xl p-4 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{t('stabilityScore')}</span>
                    <Icons.Shield className="h-5 w-5 opacity-80" />
                  </div>
                  <div className="text-2xl font-bold">{stability.stabilityScore}%</div>
                  <div className="text-xs opacity-75">
                    {stability.level === 'high' ? t('high') : 
                     stability.level === 'medium' ? t('medium') : t('low')}
                  </div>
                </div>
              </WidgetCard>
            </div>

            {/* Graphiques principaux */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WidgetCard title={t('revenueEvolution')} icon={Icons.TrendingUp} color="green" theme={theme}>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={evolution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Area type="monotone" dataKey="revenue" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name={t('revenue')} />
                      <Area type="monotone" dataKey="expenses" stackId="2" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} name={t('expenses')} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </WidgetCard>

              <WidgetCard title={t('revenueStability')} icon={Icons.Shield} color="blue" theme={theme}>
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <div className="relative w-24 h-24">
                      <svg className="w-24 h-24 transform -rotate-90">
                        <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="none" className="text-gray-200 dark:text-gray-700" />
                        <circle
                          cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="none"
                          strokeDasharray={`${stability.stabilityScore * 2.51} 251`}
                          className={`${stability.level === 'high' ? 'text-green-500' : stability.level === 'medium' ? 'text-yellow-500' : 'text-red-500'}`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-lg font-bold ${theme.text}`}>{stability.stabilityScore}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className={theme.textSecondary}>{t('fixedRevenue')}:</span>
                      <span className={`font-medium text-green-600`}>{stability.fixedPercentage.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={theme.textSecondary}>{t('variableRevenue')}:</span>
                      <span className={`font-medium text-yellow-600`}>{stability.variablePercentage.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </WidgetCard>
            </div>

            {/* Allocation automatique - SUPPRIMÉ */}
          </div>
        )}

        {activeTab === 'sources' && (
          <div className="space-y-6">
            {/* Champ solde de départ */}
            <WidgetCard title={t('initialBalance') || 'Solde de départ'} icon={Icons.Wallet} color="blue" theme={theme}>
              <div className="flex flex-col items-center space-y-2">
                <div className="text-3xl font-bold">
                  {state.showBalances ? formatCurrency(state.initialBalance || 0) : '•••'}
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={state.initialBalance || ''}
                    onChange={v => actions.setInitialBalance(v)}
                    className="w-32"
                  />
                  <Button size="sm" onClick={actions.confirmInitialBalance}>
                    {t('save') || 'Valider'}
                  </Button>
                </div>
              </div>
            </WidgetCard>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <WidgetCard title={t('addRevenueSource')} icon={Icons.Plus} color="green" theme={theme}>
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (actions.addRevenue && actions.addRevenue(state.newRevenue)) {
                        actions.resetForm('newRevenue');
                      }
                    }}
                    className="space-y-4"
                  >
                    <Input
                      label={t('sourceName')}
                      type="text"
                      value={state.newRevenue?.name || ''}
                      onChange={(value) => actions.updateForm('newRevenue', { name: value })}
                      required
                    />
                    
                    <Input
                      label={t('amount')}
                      type="number"
                      step="0.01"
                      min="0"
                      value={state.newRevenue?.amount || ''}
                      onChange={(value) => actions.updateForm('newRevenue', { amount: value })}
                      required
                    />
                    
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('revenueType')}
                      </label>
                      <select
                        value={state.newRevenue?.type || 'fixed'}
                        onChange={(e) => actions.updateForm('newRevenue', { type: e.target.value })}
                        className={`w-full px-3 py-2 text-base border rounded-lg ${theme.input}`}
                      >
                        <option value="fixed">{t('fixed')}</option>
                        <option value="variable">{t('variable')}</option>
                      </select>
                    </div>

                    {/* Champ jour du mois, visible uniquement si type = 'fixed' */}
                    {state.newRevenue?.type === 'fixed' && (
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          {t('incomeDayOfMonth') || 'Jour d\'entrée d\'argent'}
                        </label>
                        <select
                          value={state.newRevenue?.dayOfMonth || '1'}
                          onChange={e => actions.updateForm('newRevenue', { dayOfMonth: e.target.value })}
                          className={`w-full px-3 py-2 text-base border rounded-lg ${theme.input}`}
                        >
                          {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                            <option key={day} value={day}>{day}</option>
                          ))}
                        </select>
                        <p className="text-xs text-gray-500">{t('chooseDayOfMonthForFixedIncome') || 'Le jour du mois où ce revenu est reçu (ex : 1 pour le 1er du mois)'}</p>
                      </div>
                    )}
                    
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('frequency')}
                      </label>
                      <select
                        value={state.newRevenue?.frequency || 'monthly'}
                        onChange={(e) => actions.updateForm('newRevenue', { frequency: e.target.value })}
                        className={`w-full px-3 py-2 text-base border rounded-lg ${theme.input}`}
                      >
                        <option value="weekly">{t('weekly')}</option>
                        <option value="biweekly">{t('biweekly')}</option>
                        <option value="monthly">{t('monthly')}</option>
                        <option value="quarterly">{t('quarterly')}</option>
                        <option value="annually">{t('annually')}</option>
                        <option value="irregular">{t('irregular')}</option>
                      </select>
                    </div>
                    
                    <Button
                      type="submit"
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      {t('addSource')}
                    </Button>
                  </form>
                </WidgetCard>

                {/* Templates rapides */}
                <WidgetCard title={t('quickTemplates')} icon={Icons.Zap} color="blue" className="mt-4" theme={theme}>
                  <div className="space-y-2">
                    {defaultSources.map((source, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          if (actions.updateForm) {
                            actions.updateForm('newRevenue', {
                              name: source.name,
                              type: source.type,
                              frequency: source.frequency,
                              amount: ''
                            });
                          }
                        }}
                        className={`w-full p-2 text-left rounded-lg border ${theme.border} hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors`}
                      >
                        <div className={`text-sm font-medium ${theme.text}`}>{source.name}</div>
                        <div className={`text-xs ${theme.textSecondary}`}>
                          {t(source.type)} • {t(source.frequency)}
                        </div>
                      </button>
                    ))}
                  </div>
                </WidgetCard>
              </div>

              <div className="lg:col-span-2">
                <WidgetCard title={t('currentRevenueSources')} icon={Icons.List} color="green" theme={theme}>
                  <div
                    className="space-y-3 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                    ref={listRef}
                    onScroll={handleScroll}
                  >
                    {visibleRevenues.length === 0 ? (
                      <div className="text-center py-8">
                        <Icons.DollarSign className={`h-12 w-12 mx-auto mb-3 ${theme.textSecondary} opacity-50`} />
                        <p className={theme.textSecondary}>{t('noRevenueSources')}</p>
                        <p className={`text-xs ${theme.textSecondary} mt-2`}>{t('addFirstRevenueSource')}</p>
                      </div>
                    ) : (
                      <>{visibleRevenues.map(revenue => (
                        <RevenueItem
                          key={revenue.id}
                          revenue={revenue}
                          theme={theme}
                          state={state}
                          formatCurrency={formatCurrency}
                          t={t}
                          setEditingRevenueId={setEditingRevenueId}
                          actions={actions}
                        />
                      ))}</>
                    )}
                  </div>
                </WidgetCard>
              </div>
            </div>
          </div>
        )}



        {activeTab === 'savings' && (
          <div className="space-y-6">
            {/* Section principale - Objectifs d'épargne */}
            <div className={`${theme.card} rounded-xl border ${theme.border} p-6`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-2xl font-bold ${theme.text}`}>{t('savingsGoals')}</h2>
                <div className="text-right">
                  <p className={`text-2xl font-bold ${theme.text}`}>
                    {state.showBalances ? formatCurrency(computedValues.totalSavings) : '•••'}
                  </p>
                  <p className={`text-sm ${theme.textSecondary}`}>{t('totalSaved')}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <h3 className={`text-lg font-semibold ${theme.text} mb-4`}>{t('newGoal')}</h3>
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (actions.addSavingsGoal(state.newGoal)) {
                        actions.resetForm('newGoal');
                      }
                    }}
                    className="space-y-4"
                  >
                    <Input
                      label={t('goalName')}
                      type="text"
                      value={state.newGoal.name}
                      onChange={(value) => actions.updateForm('newGoal', { name: value })}
                      error={state.errors.name}
                      required
                      minLength={2}
                      maxLength={50}
                    />
                    <Input
                      label={t('targetAmount')}
                      type="number"
                      step="0.01"
                      min="0"
                      value={state.newGoal.targetAmount}
                      onChange={(value) => actions.updateForm('newGoal', { targetAmount: value })}
                      error={state.errors.targetAmount}
                      required
                    />
                    <Input
                      label={t('currentAmount')}
                      type="number"
                      step="0.01"
                      min="0"
                      value={state.newGoal.currentAmount}
                      onChange={(value) => actions.updateForm('newGoal', { currentAmount: value })}
                      error={state.errors.currentAmount}
                    />
                    <Button
                      type="submit"
                      variant="success"
                      className="w-full"
                      disabled={state.loading}
                      loading={state.loading}
                    >
                      {t('createGoal')}
                    </Button>
                  </form>
                </div>
                <div className="lg:col-span-2">
                  <h3 className={`text-lg font-semibold ${theme.text} mb-4`}>{t('goalsWithImpact')}</h3>
                  {/* Barre de recherche stylée */}
                  <form
                    className="flex items-center gap-2 mb-4"
                    onSubmit={e => {
                      e.preventDefault();
                      setSearchTermList(searchInput);
                    }}
                  >
                    <input
                      type="text"
                      value={searchInput}
                      onChange={e => {
                        setSearchInput(e.target.value);
                        setSearchTermList(e.target.value); // Recherche en temps réel
                      }}
                      placeholder=""
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full"
                      style={{maxWidth: 300}}
                    />
                    <button
                      type="submit"
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Search className="h-4 w-4 mr-2" />
                      {t('search')}
                    </button>
                  </form>
                  <div className="max-h-[35rem] overflow-y-auto space-y-4">
                    {computedValues.savingsForSelectedMonth
                      .filter(goal => goal.name.toLowerCase().includes(searchTermList.toLowerCase()))
                      .map(goal => {
                      const progress = (goal.currentAmount / goal.targetAmount) * 100;
                      const segments = 10;
                      const filledSegments = Math.floor((progress / 100) * segments);
                      const open = false; // Pas de système d'ouverture dans RevenueScreen
                      return (
                        <div key={goal.id} className={`${theme.card} border ${theme.border} rounded-lg p-4`}>
                          <div className="flex justify-between items-center mb-3">
                            <div>
                              <div className="flex items-center space-x-2">
                                <h4 className={`font-semibold ${theme.text}`}>{goal.name}</h4>
                                {goal.autoDebit && (
                                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full flex items-center">
                                    <Icons.CreditCard className="h-3 w-3 mr-1" />
                                    {t('autoDebit')}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className={`font-medium ${theme.text}`}>{state.showBalances 
                                  ? `${formatCurrency(goal.cumulativeAmount)} / ${formatCurrency(goal.targetAmount)}`
                                  : '••• / •••'
                                }</span>
                                <span className={`text-xs ${theme.textSecondary}`}>{goal.cumulativeProgress.toFixed(1)}% {t('reached')}</span>
                              </div>
                              {/* Affichage de la progression du mois */}
                              {goal.monthAmount > 0 && (
                                <div className="flex items-center space-x-2 mt-1">
                                  <span className={`text-xs text-green-600 font-medium`}>
                                    +{formatCurrency(goal.monthAmount)} {t('thisMonth')}
                                  </span>
                                  <span className={`text-xs ${theme.textSecondary}`}>
                                    ({goal.monthProgress.toFixed(1)}% {t('progressThisMonth')})
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  actions.setEditingItem(goal);
                                  actions.toggleModal('editSaving', true);
                                }}
                                title={t('edit')}
                              >
                                <Icons.Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => actions.toggleSavingsAutoDebit(goal.id, goal.autoDebitAmount || 100)}
                                className={`${goal.autoDebit ? 'text-green-600 hover:text-green-800' : 'text-gray-500 hover:text-gray-700'}`}
                                title={goal.autoDebit ? t('disableAutoDebit') : t('enableAutoDebit')}
                              >
                                <Icons.CreditCard className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-500 hover:text-red-700"
                                onClick={() => {
                                  if (window.confirm(t('confirmDeleteGoal') || 'Supprimer cet objectif ?')) {
                                    actions.deleteSavingsGoal(goal.id);
                                  }
                                }}
                                title={t('delete')}
                              >
                                <Icons.Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          {/* Progression visuelle */}
                          <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                              <span className={theme.textSecondary}>{t('progression')}</span>
                              <span className={`font-medium ${theme.text}`}>{state.showBalances 
                                ? `${formatCurrency(goal.cumulativeAmount)} / ${formatCurrency(goal.targetAmount)}`
                                : '••• / •••'
                              }</span>
                            </div>
                            {/* Barre de progression segmentée */}
                            <div className="flex space-x-1">
                              {Array.from({ length: segments }).map((_, index) => (
                                <div
                                  key={index}
                                  className={`flex-1 h-3 rounded ${
                                    index < filledSegments ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                                  }`}
                                />
                              ))}
                            </div>
                            <p className={`text-xs ${theme.textSecondary}`}>
                              {goal.cumulativeProgress.toFixed(1)}% {t('reached')}
                              {goal.cumulativeProgress >= 100 && <span className="text-green-500 ml-2">{t('goalReached')}</span>}
                            </p>
                          </div>
                          
                          {/* Contenu détaillé (masqué par défaut) */}
                                                      {expandedSavings.has(goal.id) && (
                              <div className="space-y-2 mt-2">
                              {/* Progression du mois en cours - version compacte */}
                              {goal.monthAmount > 0 && (
                                <div className={`p-2 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800`}>
                                  <div className="flex justify-between items-center mb-1">
                                    <span className={`text-xs font-medium ${theme.text}`}>{t('progressThisMonth')}</span>
                                    <span className={`text-xs font-bold text-green-600`}>+{formatCurrency(goal.monthAmount)}</span>
                                  </div>
                                  <div className="w-full bg-green-200 dark:bg-green-800 rounded-full h-1.5">
                                    <div 
                                      className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                                      style={{ width: `${Math.min(goal.monthProgress, 100)}%` }}
                                    />
                                  </div>
                                  <p className={`text-xs ${theme.textSecondary} mt-1`}>
                                    {goal.monthProgress.toFixed(1)}% {t('ofTargetThisMonth')}
                                  </p>
                                </div>
                              )}
                              
                              {/* Calculateur d'impact - version compacte */}
                              <div className={`p-2 rounded-lg ${theme.bg} border ${theme.border}`}>
                                <h5 className={`text-xs font-medium ${theme.text} mb-2`}>{t('impactCalculator')}</h5>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                  <div>
                                    <span className={theme.textSecondary}>{t('remainingToSave')}</span>
                                    <div className={`font-bold ${theme.text}`}>{formatCurrency(goal.targetAmount - goal.cumulativeAmount)}</div>
                                  </div>
                                  <div>
                                    <span className={theme.textSecondary}>{t('perMonth')}</span>
                                    <div className={`font-bold text-blue-600`}>{formatCurrency((goal.targetAmount - goal.cumulativeAmount) / 12)}</div>
                                  </div>
                                  <div>
                                    <span className={theme.textSecondary}>{t('perWeek')}</span>
                                    <div className={`font-bold text-purple-600`}>{formatCurrency((goal.targetAmount - goal.cumulativeAmount) / 52)}</div>
                                  </div>
                                  <div>
                                    <span className={theme.textSecondary}>{t('perDay')}</span>
                                    <div className={`font-bold text-orange-600`}>{formatCurrency((goal.targetAmount - goal.cumulativeAmount) / 365)}</div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Historique des transactions - version compacte */}
                              <div className={`p-2 rounded-lg ${theme.bg} border ${theme.border}`}>
                                <h5 className={`text-xs font-medium ${theme.text} mb-2`}>
                                  <span>{t('transactions') || 'Historique'}</span>
                                </h5>
                                
                                {goal.transactions && goal.transactions.length > 0 ? (
                                  <div className="space-y-2 max-h-40 overflow-y-auto">
                                    {goal.transactions
                                      .sort((a, b) => new Date(b.date) - new Date(a.date))
                                      .slice(0, 8)
                                      .map((transaction, index) => (
                                        <div key={transaction.id} className={`flex items-center justify-between p-2 rounded text-xs border-2 ${
                                          transaction.type === 'add' 
                                            ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 shadow-sm' 
                                            : 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700 shadow-sm'
                                        }`}>
                                          <div className="flex items-center space-x-2">
                                            <Icons.Circle className={`h-2 w-2 ${
                                              transaction.type === 'add' ? 'text-green-500' : 'text-red-500'
                                            }`} />
                                            <span className={`font-medium ${
                                              transaction.type === 'add' ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
                                            }`}>
                                              {transaction.type === 'add' ? '+' : '-'}{formatCurrency(transaction.amount)}
                                            </span>
                                          </div>
                                          <div className="flex items-center space-x-1">
                                            <div className="text-right mr-2">
                                              <div className={`text-xs ${theme.textSecondary}`}>
                                                {new Date(transaction.date).toLocaleDateString(state.language === 'fr' ? 'fr-FR' : state.language === 'es' ? 'es-ES' : 'en-US', {
                                                  day: '2-digit',
                                                  month: '2-digit'
                                                })}
                                              </div>
                                              {transaction.description && (
                                                <div className={`text-xs ${theme.textSecondary} truncate max-w-20`} title={transaction.description}>
                                                  {transaction.description}
                                                </div>
                                              )}
                                            </div>
                                            <div className="flex space-x-1">
                                              <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => {
                                                  actions.setEditingItem({ ...goal, editingTransaction: transaction });
                                                  actions.toggleModal('editSaving', true);
                                                }}
                                                className="text-xs px-1 py-1 h-6 w-6"
                                                title={t('edit')}
                                              >
                                                <Icons.Edit2 className="h-3 w-3" />
                                              </Button>
                                              <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => {
                                                  if (window.confirm(t('confirmDeleteGoal') || 'Supprimer cette transaction ?')) {
                                                    actions.deleteSavingsTransaction(goal.id, transaction.id);
                                                  }
                                                }}
                                                className="text-xs px-1 py-1 h-6 w-6 text-red-500 hover:text-red-700"
                                                title={t('delete')}
                                              >
                                                <Icons.Trash2 className="h-3 w-3" />
                                              </Button>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                  </div>
                                ) : (
                                  <div className={`text-center py-4 ${theme.textSecondary}`}>
                                    <Icons.History className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                    <p className="text-xs">{t('noOperationsThisMonth') || 'Aucune opération'}</p>
                                  </div>
                                )}
                                
                                {goal.transactions && goal.transactions.length > 8 && (
                                  <div className="text-center mt-2">
                                    <span className={`text-xs ${theme.textSecondary}`}>
                                      +{goal.transactions.length - 8} {t('more') || 'autres'}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {/* Bouton showDetails/hideDetails - toujours en bas */}
                          <button
                            onClick={() => {
                              const newExpanded = new Set(expandedSavings);
                              if (newExpanded.has(goal.id)) {
                                newExpanded.delete(goal.id);
                              } else {
                                newExpanded.add(goal.id);
                              }
                              setExpandedSavings(newExpanded);
                            }}
                            className={`flex items-center space-x-1 text-xs font-medium transition-colors mt-3 ${
                              expandedSavings.has(goal.id) 
                                ? 'text-blue-600 hover:text-blue-800' 
                                : 'text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
                            }`}
                            title={expandedSavings.has(goal.id) ? t('hideDetails') : t('showDetails')}
                          >
                            <Icons.ChevronDown className={`h-3 w-3 transition-transform ${expandedSavings.has(goal.id) ? 'rotate-180' : ''}`} />
                            <span className="ml-1 text-xs">{expandedSavings.has(goal.id) ? t('hideDetails') : t('showDetails')}</span>
                                                    </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Défis d'épargne */}
            <div className={`${theme.card} rounded-xl border ${theme.border} p-6`}>
              <h3 className={`text-xl font-bold ${theme.text} mb-4 flex items-center`}>
                <Icons.Trophy className="h-6 w-6 mr-2 text-yellow-500" />
                {t('savingsChallenges')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    name: t('challenge365Days'),
                    description: t('challenge365Description'),
                    targetAmount: 66795,
                    duration: t('days365'),
                    dailyAmount: t('variable1to365'),
                    difficulty: t('difficult'),
                    color: "red"
                  },
                  {
                    name: t('challenge52Weeks'),
                    description: t('challenge52Description'),
                    targetAmount: 1378,
                    duration: t('weeks52'),
                    dailyAmount: t('variableWeekly'),
                    difficulty: t('medium'),
                    color: "yellow"
                  },
                  {
                    name: t('rule5PerDay'),
                    description: t('rule5Description'),
                    targetAmount: 1825,
                    duration: t('year1'),
                    dailyAmount: t('amount5'),
                    difficulty: t('easy'),
                    color: "green"
                  },
                  {
                    name: t('coinSavings'),
                    description: t('coinDescription'),
                    targetAmount: 365,
                    duration: t('year1'),
                    dailyAmount: t('variable'),
                    difficulty: t('veryEasy'),
                    color: "blue"
                  }
                ].map((challenge, index) => (
                  <div key={index} className={`p-4 rounded-lg border-2 border-${challenge.color}-200 bg-${challenge.color}-50 dark:bg-${challenge.color}-900/20 hover:shadow-lg transition-shadow cursor-pointer`}>
                    <h4 className={`font-bold ${theme.text} mb-2`}>{challenge.name}</h4>
                    <p className={`text-xs ${theme.textSecondary} mb-3`}>{challenge.description}</p>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className={theme.textSecondary}>{t('target')}:</span>
                        <span className={`font-medium text-${challenge.color}-600`}>{formatCurrency(challenge.targetAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={theme.textSecondary}>{t('duration')}:</span>
                        <span className={theme.text}>{challenge.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={theme.textSecondary}>{t('difficulty')}:</span>
                        <span className={`font-medium text-${challenge.color}-600`}>{challenge.difficulty}</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className={`w-full mt-3 bg-${challenge.color}-500 hover:bg-${challenge.color}-600`}
                      onClick={() => {
                        const newGoal = {
                          name: challenge.name,
                          targetAmount: challenge.targetAmount,
                          currentAmount: 0,
                          transactions: []
                        };
                        if (actions.addSavingsGoal(newGoal)) {
                          financeManager.showNotification(t('challengeCreated', { name: challenge.name }), 'success');
                        }
                      }}
                    >
                      {t('start')}
                    </Button>
                  </div>
                ))}
              </div>
            </div>


            
            {state.savingsGoals.length === 0 && (
              <div className={`text-center ${theme.textSecondary} py-8 border rounded-lg ${theme.border}`}>
                <Icons.PiggyBank className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>{t('noSavingsGoals')}</p>
                <p className="text-xs mt-2">{t('startWithChallenge')}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <WidgetCard title={t('revenueAnalysis')} icon={Icons.BarChart3} color="blue" theme={theme}>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className={`text-2xl font-bold text-green-600`}>
                        {((balance.totalRevenue / 1000)).toFixed(1)}K
                      </div>
                      <div className={`text-xs ${theme.textSecondary}`}>{t('monthlyRevenue')}</div>
                    </div>
                    <div>
                      <div className={`text-2xl font-bold ${stability.level === 'high' ? 'text-green-600' : 'text-yellow-600'}`}>
                        {stability.stabilityScore}%
                      </div>
                      <div className={`text-xs ${theme.textSecondary}`}>{t('stability')}</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className={theme.textSecondary}>{t('growthTrend')}:</span>
                      <span className="text-green-600 font-medium">+2.3%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={theme.textSecondary}>{t('diversificationScore')}:</span>
                      <span className="text-blue-600 font-medium">75%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={theme.textSecondary}>{t('seasonalityRisk')}:</span>
                      <span className="text-yellow-600 font-medium">{t('low')}</span>
                    </div>
                  </div>
                </div>
              </WidgetCard>

              <WidgetCard title={t('financialHealthIndicators')} icon={Icons.Activity} color="green" theme={theme}>
                <div className="space-y-3">
                  {[
                    { label: t('incomeStability'), value: stability.stabilityScore, max: 100, color: 'green' },
                    { label: t('savingsRate'), value: (balance.savingsThisMonth / balance.totalRevenue) * 100, max: 100, color: 'blue' },
                    { label: t('expenseControl'), value: 75, max: 100, color: 'purple' },
                    { label: t('debtRatio'), value: 25, max: 100, color: 'orange', invert: true }
                  ].map((indicator, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className={theme.textSecondary}>{indicator.label}</span>
                        <span className={`font-medium text-${indicator.color}-600`}>
                          {indicator.value.toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`bg-${indicator.color}-500 h-2 rounded-full transition-all`}
                          style={{ width: `${Math.min(indicator.value, indicator.max)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </WidgetCard>
            </div>

            <WidgetCard title={t('revenueProjections')} icon={Icons.TrendingUp} color="purple" theme={theme}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className={`font-semibold ${theme.text} mb-4`}>{t('next12Months')}</h4>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={evolution}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                        <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div>
                  <h4 className={`font-semibold ${theme.text} mb-4`}>{t('scenarioAnalysis')}</h4>
                  <div className="space-y-3">
                    {[
                      { 
                        name: t('conservativeScenario'), 
                        change: -10, 
                        projected: balance.totalRevenue * 0.9 * 12,
                        color: 'red' 
                      },
                      { 
                        name: t('currentTrend'), 
                        change: 0, 
                        projected: balance.totalRevenue * 12,
                        color: 'blue' 
                      },
                      { 
                        name: t('optimisticScenario'), 
                        change: 15, 
                        projected: balance.totalRevenue * 1.15 * 12,
                        color: 'green' 
                      }
                    ].map((scenario, index) => (
                      <div key={index} className={`p-3 rounded-lg border ${theme.border} ${theme.bg}`}>
                        <div className="flex justify-between items-center">
                          <span className={`font-medium ${theme.text}`}>{scenario.name}</span>
                          <div className="text-right">
                            <div className={`font-bold text-${scenario.color}-600`}>
                              {formatCurrency(scenario.projected)}
                            </div>
                            <div className={`text-xs ${scenario.change === 0 ? theme.textSecondary : `text-${scenario.color}-600`}`}>
                              {scenario.change > 0 ? '+' : ''}{scenario.change}%
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </WidgetCard>
          </div>
        )}


      </div>
      {/* Formulaire d'édition de revenu */}
      {editingRevenueId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className={`w-full max-w-md p-6 rounded-xl shadow-lg ${theme.card} border ${theme.border}`}>
            <h3 className={`text-lg font-semibold mb-4 ${theme.text}`}>{t('edit')} {t('revenueSource') || t('sourceName')}</h3>
            <form
              onSubmit={e => {
                e.preventDefault();
                const rev = state.revenues.find(r => r.id === editingRevenueId);
                if (actions.updateRevenue && rev) {
                  actions.updateRevenue(editingRevenueId, editRevenueForm);
                  setEditingRevenueId(null);
                }
              }}
              className="space-y-4"
            >
              <Input
                label={t('sourceName')}
                type="text"
                value={editRevenueForm?.name || ''}
                onChange={value => setEditRevenueForm(f => ({ ...f, name: value }))}
                required
              />
              <Input
                label={t('amount')}
                type="number"
                step="0.01"
                min="0"
                value={editRevenueForm?.amount || ''}
                onChange={value => setEditRevenueForm(f => ({ ...f, amount: value }))}
                required
              />
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('revenueType')}
                </label>
                <select
                  value={editRevenueForm?.type || 'fixed'}
                  onChange={e => setEditRevenueForm(f => ({ ...f, type: e.target.value }))}
                  className={`w-full px-3 py-2 text-base border rounded-lg ${theme.input}`}
                >
                  <option value="fixed">{t('fixed')}</option>
                  <option value="variable">{t('variable')}</option>
                </select>
              </div>
              {/* Champ jour du mois, visible uniquement si type = 'fixed' */}
              {editRevenueForm?.type === 'fixed' && (
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('incomeDayOfMonth') || 'Jour d\'entrée d\'argent'}
                  </label>
                  <select
                    value={editRevenueForm?.dayOfMonth || '1'}
                    onChange={e => setEditRevenueForm(f => ({ ...f, dayOfMonth: e.target.value }))}
                    className={`w-full px-3 py-2 text-base border rounded-lg ${theme.input}`}
                  >
                    {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500">{t('chooseDayOfMonthForFixedIncome') || 'Le jour du mois où ce revenu est reçu (ex : 1 pour le 1er du mois)'}</p>
                </div>
              )}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('frequency')}
                </label>
                <select
                  value={editRevenueForm?.frequency || 'monthly'}
                  onChange={e => setEditRevenueForm(f => ({ ...f, frequency: e.target.value }))}
                  className={`w-full px-3 py-2 text-base border rounded-lg ${theme.input}`}
                >
                  <option value="weekly">{t('weekly')}</option>
                  <option value="biweekly">{t('biweekly')}</option>
                  <option value="monthly">{t('monthly')}</option>
                  <option value="quarterly">{t('quarterly')}</option>
                  <option value="annually">{t('annually')}</option>
                  <option value="irregular">{t('irregular')}</option>
                </select>
              </div>
              <Input
                label={t('description')}
                type="text"
                value={editRevenueForm?.description || ''}
                onChange={value => setEditRevenueForm(f => ({ ...f, description: value }))}
              />
              <div className="flex space-x-2 pt-4">
                <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">{t('save')}</Button>
                <Button variant="outline" onClick={() => setEditingRevenueId(null)} className="flex-1">{t('cancel')}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
});

export default RevenueScreen;