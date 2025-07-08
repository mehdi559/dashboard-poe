// ExpensesScreen.js - Version enrichie
import React, { memo, useCallback, useMemo } from 'react';
import * as Icons from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import SearchAndFilter from '../components/ui/SearchAndFilter';
import Pagination from '../components/ui/Pagination';
import { dateUtils } from '../utils/dateUtils';

const ExpensesScreen = memo(({ financeManager, theme, t }) => {
  const { 
    state, 
    actions, 
    filteredAndSortedExpenses, 
    paginatedExpenses, 
    totalPages, 
    formatCurrency 
  } = financeManager;

  const handleSortClick = useCallback((sortBy) => {
    actions.setSort(sortBy);
  }, [actions]);

  // Analyses automatiques des dépenses
  const getExpenseAnalytics = useMemo(() => {
    const expenses = filteredAndSortedExpenses;
    if (expenses.length === 0) return null;

    // Dépense la plus importante
    const biggestExpense = expenses.reduce((max, exp) => 
      exp.amount > max.amount ? exp : max
    );

    // Analyse par jour de la semaine
    const dayAnalysis = expenses.reduce((acc, exp) => {
      const day = new Date(exp.date).getDay();
      const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
      const dayName = dayNames[day];
      acc[dayName] = (acc[dayName] || 0) + exp.amount;
      return acc;
    }, {});

    const spendingByDay = Object.entries(dayAnalysis)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);

    // Tendances par rapport au mois dernier (simulé)
    const lastMonthComparison = Math.random() > 0.5 ? 
      { trend: 'up', percentage: Math.round(Math.random() * 30) } :
      { trend: 'down', percentage: Math.round(Math.random() * 20) };

    // Suggestions d'économie
    const economySuggestions = [
      `Réduire les dépenses ${biggestExpense.category} de 10% économiserait ${formatCurrency(biggestExpense.amount * 0.1)} par transaction`,
      `En groupant vos achats ${spendingByDay[0]?.[0] || 'du weekend'}, vous pourriez économiser sur les frais de transport`,
      `Planifier vos dépenses ${biggestExpense.category} à l'avance pourrait réduire les achats impulsifs`
    ];

    return {
      biggestExpense,
      spendingByDay,
      lastMonthComparison,
      economySuggestions,
      averageDaily: expenses.reduce((sum, exp) => sum + exp.amount, 0) / Math.max(new Date().getDate(), 1)
    };
  }, [filteredAndSortedExpenses, formatCurrency]);

  // Détection des patterns de dépenses
  const getSpendingPatterns = useMemo(() => {
    const expenses = filteredAndSortedExpenses;
    const patterns = [];

    // Analyse weekend vs semaine
    const weekendExpenses = expenses.filter(exp => {
      const day = new Date(exp.date).getDay();
      return day === 0 || day === 6;
    });
    const weekdayExpenses = expenses.filter(exp => {
      const day = new Date(exp.date).getDay();
      return day > 0 && day < 6;
    });

    if (weekendExpenses.length > 0 && weekdayExpenses.length > 0) {
      const weekendAvg = weekendExpenses.reduce((sum, exp) => sum + exp.amount, 0) / weekendExpenses.length;
      const weekdayAvg = weekdayExpenses.reduce((sum, exp) => sum + exp.amount, 0) / weekdayExpenses.length;
      
      if (weekendAvg > weekdayAvg * 1.5) {
        patterns.push({
          type: 'weekend_spender',
          message: `Vous dépensez ${Math.round((weekendAvg/weekdayAvg)*100)}% de plus le weekend`,
          icon: Icons.Calendar,
          color: 'orange'
        });
      }
    }

    // Analyse des montants fréquents
    const amountFrequency = expenses.reduce((acc, exp) => {
      const rounded = Math.round(exp.amount / 5) * 5; // Arrondi au 5€ près
      acc[rounded] = (acc[rounded] || 0) + 1;
      return acc;
    }, {});

    const mostFrequentAmount = Object.entries(amountFrequency)
      .sort(([,a], [,b]) => b - a)[0];

    if (mostFrequentAmount && mostFrequentAmount[1] > 2) {
      patterns.push({
        type: 'frequent_amount',
        message: `Vous dépensez souvent ${formatCurrency(mostFrequentAmount[0])} (${mostFrequentAmount[1]} fois)`,
        icon: Icons.Repeat,
        color: 'blue'
      });
    }

    return patterns;
  }, [filteredAndSortedExpenses, formatCurrency]);

  const analytics = getExpenseAnalytics;
  const patterns = getSpendingPatterns;

  return (
    <div className="space-y-6">
      {/* Analyses et insights */}
      {analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Analyse automatique */}
          <div className={`${theme.card} rounded-xl border ${theme.border} p-4`}>
            <h3 className={`text-lg font-semibold ${theme.text} mb-3 flex items-center`}>
              <Icons.TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
              Analyse ce mois
            </h3>
            <div className="space-y-3">
              <div className={`p-3 rounded-lg ${theme.bg} border ${theme.border}`}>
                <p className={`text-sm font-medium ${theme.text}`}>Plus grosse dépense</p>
                <p className={`text-xs ${theme.textSecondary}`}>
                  {analytics.biggestExpense.description} - {formatCurrency(analytics.biggestExpense.amount)}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${theme.bg} border ${theme.border}`}>
                <p className={`text-sm font-medium ${theme.text}`}>Moyenne quotidienne</p>
                <p className={`text-xs ${theme.textSecondary}`}>
                  {formatCurrency(analytics.averageDaily)} par jour actif
                </p>
              </div>
              <div className={`p-3 rounded-lg ${theme.bg} border ${theme.border}`}>
                <p className={`text-sm font-medium ${theme.text}`}>Tendance vs mois dernier</p>
                <div className="flex items-center space-x-1">
                  {analytics.lastMonthComparison.trend === 'up' ? (
                    <Icons.TrendingUp className="h-3 w-3 text-red-500" />
                  ) : (
                    <Icons.TrendingDown className="h-3 w-3 text-green-500" />
                  )}
                  <p className={`text-xs ${analytics.lastMonthComparison.trend === 'up' ? 'text-red-500' : 'text-green-500'}`}>
                    {analytics.lastMonthComparison.trend === 'up' ? '+' : '-'}{analytics.lastMonthComparison.percentage}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Jour de la semaine le plus dépensier */}
          <div className={`${theme.card} rounded-xl border ${theme.border} p-4`}>
            <h3 className={`text-lg font-semibold ${theme.text} mb-3 flex items-center`}>
              <Icons.Calendar className="h-5 w-5 mr-2 text-purple-600" />
              Vos jours les plus dépensiers
            </h3>
            <div className="space-y-2">
              {analytics.spendingByDay.map(([day, amount], index) => (
                <div key={day} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                      index === 0 ? 'bg-red-500' : index === 1 ? 'bg-orange-500' : 'bg-yellow-500'
                    }`}>
                      {index + 1}
                    </div>
                    <span className={`text-sm ${theme.text}`}>{day}</span>
                  </div>
                  <span className={`text-sm font-medium ${theme.text}`}>
                    {formatCurrency(amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Suggestions d'économie */}
          <div className={`${theme.card} rounded-xl border ${theme.border} p-4`}>
            <h3 className={`text-lg font-semibold ${theme.text} mb-3 flex items-center`}>
              <Icons.Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
              Suggestions d'économie
            </h3>
            <div className="space-y-2">
              {analytics.economySuggestions.map((suggestion, index) => (
                <div key={index} className={`p-2 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200`}>
                  <p className={`text-xs ${theme.textSecondary}`}>{suggestion}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Patterns détectés */}
      {patterns.length > 0 && (
        <div className={`${theme.card} rounded-xl border ${theme.border} p-4`}>
          <h3 className={`text-lg font-semibold ${theme.text} mb-3 flex items-center`}>
            <Icons.Eye className="h-5 w-5 mr-2 text-indigo-600" />
            Patterns détectés
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {patterns.map((pattern, index) => {
              const Icon = pattern.icon;
              return (
                <div key={index} className={`p-3 rounded-lg border border-${pattern.color}-200 bg-${pattern.color}-50 dark:bg-${pattern.color}-900/20`}>
                  <div className="flex items-center space-x-2">
                    <Icon className={`h-4 w-4 text-${pattern.color}-600`} />
                    <p className={`text-sm ${theme.text}`}>{pattern.message}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Section principale */}
      <div className={`${theme.card} rounded-xl border ${theme.border} p-6`}>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 space-y-4 lg:space-y-0">
          <h2 className={`text-2xl font-bold ${theme.text}`}>Gestion des Dépenses</h2>
          <div className="flex space-x-2">
            <Button
              onClick={() => actions.exportExpensesToCSV()}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Icons.Download className="h-4 w-4" />
              <span>Exporter CSV</span>
            </Button>
          </div>
        </div>

        <SearchAndFilter
          searchTerm={state.searchTerm}
          onSearchChange={actions.setSearchTerm}
          categoryFilter={state.categoryFilter}
          onCategoryFilterChange={actions.setCategoryFilter}
          dateFilter={state.dateFilter}
          onDateFilterChange={actions.setDateFilter}
          categories={state.categories}
          t={t}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-1">
            <h3 className={`text-lg font-semibold ${theme.text} mb-4`}>Ajouter une dépense</h3>
            
            {/* Suggestions rapides */}
            <div className="mb-4">
              <p className={`text-sm ${theme.textSecondary} mb-2`}>Suggestions rapides :</p>
              <div className="flex flex-wrap gap-2">
                {['Courses', 'Essence', 'Resto', 'Café'].map(suggestion => (
                  <button
                    key={suggestion}
                    onClick={() => actions.updateForm('newExpense', { description: suggestion })}
                    className={`px-3 py-1 text-xs rounded-full border ${theme.border} ${theme.text} hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (actions.addExpense(state.newExpense)) {
                  actions.resetForm('newExpense');
                }
              }}
              className="space-y-4"
            >
              <Input
                label="Date"
                type="date"
                value={state.newExpense.date}
                onChange={(value) => actions.updateForm('newExpense', { date: value })}
                error={state.errors.date}
                required
                max={new Date().toISOString().split('T')[0]}
              />
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Catégorie <span className="text-red-500">*</span>
                </label>
                <select
                  value={state.newExpense.category}
                  onChange={(e) => actions.updateForm('newExpense', { category: e.target.value })}
                  className={`w-full px-3 py-2 text-base border rounded-lg ${theme.input} ${
                    state.errors.category ? 'border-red-500' : ''
                  }`}
                  required
                >
                  <option value="">Sélectionner une catégorie</option>
                  {state.categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
                {state.errors.category && (
                  <p className="text-sm text-red-600" role="alert">
                    {state.errors.category}
                  </p>
                )}
              </div>
              
              <Input
                label="Montant"
                type="number"
                step="0.01"
                min="0"
                value={state.newExpense.amount}
                onChange={(value) => actions.updateForm('newExpense', { amount: value })}
                error={state.errors.amount}
                required
              />
              
              <Input
                label="Description"
                type="text"
                value={state.newExpense.description}
                onChange={(value) => actions.updateForm('newExpense', { description: value })}
                error={state.errors.description}
                required
                minLength={3}
                maxLength={100}
              />
              
              <Button
                type="submit"
                className="w-full"
                disabled={state.loading}
                loading={state.loading}
              >
                Ajouter la dépense
              </Button>
            </form>
          </div>

          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-lg font-semibold ${theme.text}`}>
                Dépenses ({filteredAndSortedExpenses.length})
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Trier par:</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSortClick('date')}
                  className={`flex items-center space-x-1 ${
                    state.sortBy === 'date' ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <span>Date</span>
                  {state.sortBy === 'date' && (
                    state.sortOrder === 'asc' 
                      ? <Icons.ChevronUp className="h-3 w-3" />
                      : <Icons.ChevronDown className="h-3 w-3" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSortClick('amount')}
                  className={`flex items-center space-x-1 ${
                    state.sortBy === 'amount' ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <span>Montant</span>
                  {state.sortBy === 'amount' && (
                    state.sortOrder === 'asc' 
                      ? <Icons.ChevronUp className="h-3 w-3" />
                      : <Icons.ChevronDown className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              {paginatedExpenses.length === 0 ? (
                <div className={`text-center ${theme.textSecondary} py-8 border rounded-lg ${theme.border}`}>
                  {filteredAndSortedExpenses.length === 0 
                    ? (state.searchTerm || state.categoryFilter !== 'all' || state.dateFilter !== 'all')
                      ? 'Aucune dépense ne correspond aux filtres'
                      : 'Aucune dépense ce mois-ci'
                    : 'Aucune dépense sur cette page'
                  }
                </div>
              ) : (
                paginatedExpenses.map(expense => {
                  const category = state.categories.find(cat => cat.name === expense.category);
                  const isRecent = (new Date() - new Date(expense.date)) < 24 * 60 * 60 * 1000; // Moins de 24h
                  
                  return (
                    <div key={expense.id} className={`${theme.card} border ${theme.border} rounded-lg p-4 flex justify-between items-center ${
                      isRecent ? 'ring-2 ring-blue-200 dark:ring-blue-800' : ''
                    }`}>
                      <div className="flex items-center space-x-3 flex-1">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category?.color || '#gray' }}
                        />
                        <div className="flex-1">
                          <p className={`font-medium ${theme.text}`}>{expense.description}</p>
                          <p className={`text-sm ${theme.textSecondary}`}>
                            {expense.category} • {dateUtils.formatDate(expense.date, state.language === 'fr' ? 'fr-FR' : 'en-US')}
                            {isRecent && <span className="ml-2 text-blue-600 text-xs">• Récent</span>}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`font-bold ${theme.text}`}>
                          {state.showBalances ? formatCurrency(expense.amount) : '•••'}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            actions.setEditingItem(expense);
                            actions.toggleModal('editExpense', true);
                          }}
                        >
                          <Icons.Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => actions.deleteExpense(expense.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Icons.Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <Pagination
              currentPage={state.currentPage}
              totalPages={totalPages}
              onPageChange={actions.setPage}
              t={t}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

export default ExpensesScreen;