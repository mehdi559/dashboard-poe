import React, { memo } from 'react';
import * as Icons from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';

// Dashboard Header Component
const DashboardHeader = memo(({ 
  financeManager,
  theme, 
  t
}) => {
  const { state, actions, getCurrentCurrency, formatCurrency } = financeManager;

  return (
    <header className={`${theme.card} shadow-xl border-b ${theme.border} bg-gradient-to-r ${state.darkMode ? 'from-gray-900 via-gray-800 to-gray-900' : 'from-white via-gray-50 to-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-6">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Icons.TrendingUp className="h-7 w-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h1 className={`text-xl sm:text-2xl font-bold ${theme.text} leading-tight`}>
                  <span className="hidden lg:inline">{t('title')}</span>
                  <span className="lg:hidden">Finance Pro</span>
                </h1>
                <p className={`text-sm ${theme.textSecondary}`}>
                  Tableau de bord personnel
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className={`flex items-center space-x-2 px-4 py-2 ${state.darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-xl border ${theme.border}`}>
                <Icons.User className="h-4 w-4 text-indigo-600" />
                <Input
                  value={state.userName}
                  onChange={actions.setUserName}
                  placeholder={t('userName')}
                  className="bg-transparent border-none outline-none text-sm w-28 sm:w-32"
                  aria-label="Nom d'utilisateur"
                />
              </div>
              {state.userName && (
                <div className={`px-3 py-1 ${state.darkMode ? 'bg-indigo-900/30' : 'bg-indigo-50'} rounded-lg border border-indigo-200 dark:border-indigo-700`}>
                  <p className={`text-xs font-medium ${state.darkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>
                    Bonjour, {state.userName}! 👋
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <Icons.Globe className="h-4 w-4 text-gray-500" />
                <select
                  value={state.language}
                  onChange={(e) => actions.setLanguage(e.target.value)}
                  className={`px-3 py-2 border rounded-lg text-sm font-medium ${theme.input} min-w-[120px] cursor-pointer transition-all hover:border-indigo-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200`}
                  aria-label="Sélectionner la langue"
                >
                  <option value="fr">🇫🇷 Français</option>
                  <option value="en">🇺🇸 English</option>
                </select>
              </div>

              <div className="flex items-center space-x-1">
                <Icons.DollarSign className="h-4 w-4 text-gray-500" />
                <Button
                  variant="outline"
                  onClick={() => actions.toggleModal('currency', true)}
                  className="flex items-center space-x-2 min-w-[100px]"
                  aria-label="Sélectionner la devise"
                >
                  <span>{getCurrentCurrency().symbol} {state.selectedCurrency}</span>
                  <Icons.ChevronDown className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <Button
              onClick={() => actions.toggleModal('income', true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              aria-label="Modifier les revenus mensuels"
            >
              <Icons.Wallet className="h-4 w-4" />
              <div className="text-left">
                <p className="text-xs opacity-90">{t('income')}</p>
                <p className="text-sm font-bold">
                  {state.showBalances ? formatCurrency(state.monthlyIncome) : `•••${getCurrentCurrency().symbol}`}
                </p>
              </div>
              <Icons.Edit2 className="h-3 w-3 opacity-75" />
            </Button>

            <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => actions.setDarkMode(!state.darkMode)}
                className={`p-2 rounded-md transition-all ${state.darkMode ? 'bg-gray-600 text-yellow-400' : 'bg-white text-gray-600 shadow-sm'}`}
                title={state.darkMode ? 'Mode clair' : 'Mode sombre'}
                aria-label={state.darkMode ? 'Activer le mode clair' : 'Activer le mode sombre'}
              >
                {state.darkMode ? <Icons.Sun className="h-4 w-4" /> : <Icons.Moon className="h-4 w-4" />}
              </button>

              <button
                onClick={() => actions.setShowBalances(!state.showBalances)}
                className={`p-2 rounded-md transition-all ${!state.showBalances ? 'bg-gray-600 text-blue-400' : 'bg-white text-gray-600 shadow-sm'}`}
                title={state.showBalances ? 'Masquer les montants' : 'Afficher les montants'}
                aria-label={state.showBalances ? 'Masquer les montants' : 'Afficher les montants'}
              >
                {state.showBalances ? <Icons.Eye className="h-4 w-4" /> : <Icons.EyeOff className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
});

export default DashboardHeader; 