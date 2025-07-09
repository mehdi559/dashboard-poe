import React, { memo, useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';

// Dashboard Header Component - Design futuriste
const DashboardHeader = memo(({ 
  financeManager,
  theme, 
  t
}) => {
  const { state, actions, getCurrentCurrency, formatCurrency } = financeManager;
  const [showSettings, setShowSettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications] = useState([
    { id: 1, type: 'success', message: t('budgetUpdated'), time: '2 min' },
    { id: 2, type: 'warning', message: t('largeExpenseDetected'), time: '5 min' },
    { id: 3, type: 'info', message: t('monthlySavingsReminder'), time: '1h' }
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return t('greeting.morning');
    if (hour < 18) return t('greeting.afternoon');
    return t('greeting.evening');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 backdrop-blur-2xl bg-gradient-to-r from-slate-900/95 via-gray-900/95 to-slate-800/95 border-b border-gray-700/50 shadow-2xl">
      <div className="ml-16 lg:ml-64 transition-all duration-500 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Dynamic Welcome Section */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              {/* Avatar animé */}
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl \
                  flex items-center justify-center shadow-lg shadow-purple-500/25 animate-pulse">
                  <span className="text-white font-bold text-lg">
                    {(state.userName || 'U')[0].toUpperCase()}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-900 animate-ping"></div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-900"></div>
              </div>
              
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                  {getGreeting()}, {state.userName || t('user')} 
                </h1>
                <div className="flex items-center space-x-4 mt-1">
                  <p className="text-sm text-gray-400">
                    {t('manageFinancesSmart')}
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Icons.Clock className="h-3 w-3" />
                    <span>{currentTime.toLocaleTimeString(state.language === 'fr' ? 'fr-FR' : state.language === 'es' ? 'es-ES' : 'en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Center: Search Bar futuriste */}
          {/* SUPPRIMÉ : Barre de recherche et icône */}
          
          {/* Right: Enhanced Actions */}
          <div className="flex items-center space-x-4">
            {/* Income Display avec animation */}
            <div className="hidden lg:flex items-center space-x-4 px-6 py-3 bg-gradient-to-r from-emerald-900/30 to-green-900/30 \
              backdrop-blur-sm rounded-2xl border border-emerald-500/20 shadow-lg group hover:shadow-emerald-500/25 transition-all duration-300">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Icons.TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
              </div>
              <div>
                <p className="text-xs font-medium text-emerald-400 uppercase tracking-wider">
                  {t('monthlyIncome')}
                </p>
                <button
                  onClick={() => actions.toggleModal('income', true)}
                  className="text-lg font-bold text-white hover:text-emerald-300 transition-colors group-hover:scale-105 transform duration-200"
                >
                  {state.showBalances ? formatCurrency(state.monthlyIncome) : `•••${getCurrentCurrency().symbol}`}
                </button>
              </div>
            </div>

            {/* Quick Actions avec effets */}
            <div className="flex items-center space-x-3">
              {/* Notifications */}
              {/* SUPPRIMÉ : Bouton notification cloche */}

              {/* Toggle Balance */}
              <button
                onClick={() => actions.setShowBalances(!state.showBalances)}
                className={`p-3 rounded-xl transition-all duration-300 hover:scale-110 group ${
                  state.showBalances 
                    ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 shadow-lg shadow-blue-500/25' 
                    : 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-blue-400'
                }`}
                title={state.showBalances ? t('hideAmounts') : t('showAmounts')}
              >
                {state.showBalances ? 
                  <Icons.Eye className="h-5 w-5 group-hover:scale-110 transition-transform" /> : 
                  <Icons.EyeOff className="h-5 w-5 group-hover:scale-110 transition-transform" />
                }
              </button>

              {/* Dark Mode Toggle */}
              <button
                onClick={() => actions.setDarkMode(!state.darkMode)}
                className={`p-3 rounded-xl transition-all duration-300 hover:scale-110 group ${
                  state.darkMode 
                    ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 shadow-lg shadow-yellow-500/25' 
                    : 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-yellow-400'
                }`}
                title={state.darkMode ? t('lightMode') : t('darkMode')}
              >
                {state.darkMode ? 
                  <Icons.Sun className="h-5 w-5 group-hover:rotate-180 transition-transform duration-500" /> : 
                  <Icons.Moon className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                }
              </button>

              {/* Langue - menu déroulant */}
              <div className="relative">
                <button
                  onClick={e => {
                    e.stopPropagation();
                    setShowSettings(showSettings === 'lang' ? false : 'lang');
                  }}
                  className="p-3 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-blue-400 transition-all duration-300 hover:scale-110 group flex items-center"
                  title={t('changeLanguage')}
                >
                  <Icons.Globe className="h-5 w-5" />
                  <span className="ml-2 uppercase text-xs">{state.language}</span>
                </button>
                {showSettings === 'lang' && (
                  <div className="absolute right-0 top-full mt-2 w-36 rounded-xl shadow-2xl border border-gray-700/50 bg-gradient-to-b from-gray-900 to-slate-900 backdrop-blur-xl z-50 overflow-hidden">
                    <button
                      onClick={() => { actions.setLanguage('fr'); setShowSettings(false); }}
                      className={`w-full flex items-center px-4 py-3 text-sm hover:bg-gray-800/50 transition-all duration-200 ${state.language === 'fr' ? 'text-blue-400 font-bold' : 'text-gray-300'}`}
                    >
                      <span className="mr-2">🇫🇷</span> Français
                    </button>
                    <button
                      onClick={() => { actions.setLanguage('en'); setShowSettings(false); }}
                      className={`w-full flex items-center px-4 py-3 text-sm hover:bg-gray-800/50 transition-all duration-200 ${state.language === 'en' ? 'text-blue-400 font-bold' : 'text-gray-300'}`}
                    >
                      <span className="mr-2">🇬🇧</span> English
                    </button>
                    <button
                      onClick={() => { actions.setLanguage('es'); setShowSettings(false); }}
                      className={`w-full flex items-center px-4 py-3 text-sm hover:bg-gray-800/50 transition-all duration-200 ${state.language === 'es' ? 'text-blue-400 font-bold' : 'text-gray-300'}`}
                    >
                      <span className="mr-2">🇪🇸</span> Español
                    </button>
                  </div>
                )}
              </div>

              {/* Settings Menu amélioré */}
              <div className="relative">
                <button
                  onClick={e => {
                    e.stopPropagation();
                    setShowSettings(showSettings === 'settings' ? false : 'settings');
                  }}
                  className={`p-3 rounded-xl transition-all duration-300 hover:scale-110 group ${
                    showSettings === 'settings' 
                      ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 shadow-lg shadow-purple-500/25' 
                      : 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-purple-400'
                  }`}
                  title="Paramètres avancés"
                >
                  <Icons.Settings className={`h-5 w-5 transition-transform duration-300 ${
                    showSettings === 'settings' ? 'rotate-180' : 'group-hover:rotate-90'
                  }`} />
                </button>

                {showSettings === 'settings' && (
                  <>
                    <div 
                      className="fixed inset-0 z-10"
                      onClick={() => setShowSettings(false)}
                    />
                    <div className="absolute right-0 top-full mt-3 w-64 rounded-2xl shadow-2xl border border-gray-700/50 \
                      bg-gradient-to-b from-gray-900 to-slate-900 backdrop-blur-xl z-20 overflow-hidden">
                      <div className="p-2 space-y-1">
                        <div className="px-4 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider border-b border-gray-700/50">
                          {t('settings')}
                        </div>
                        
                        <button
                          onClick={() => {
                            actions.toggleModal('currency', true);
                            setShowSettings(false);
                          }}
                          className="w-full text-left px-4 py-3 rounded-xl text-sm hover:bg-gray-800/50 text-gray-300 \
                            hover:text-white transition-all duration-200 group flex items-center space-x-3"
                        >
                          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                            <Icons.DollarSign className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <div className="font-medium">{t('currency')}</div>
                            <div className="text-xs text-gray-500">{t('manageCurrencies')}</div>
                          </div>
                        </button>
                        
                        <button
                          onClick={() => {
                            actions.toggleModal('import', true);
                            setShowSettings(false);
                          }}
                          className="w-full text-left px-4 py-3 rounded-xl text-sm hover:bg-gray-800/50 text-gray-300 \
                            hover:text-white transition-all duration-200 group flex items-center space-x-3"
                        >
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <Icons.Download className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <div className="font-medium">{t('importExport')}</div>
                            <div className="text-xs text-gray-500">{t('saveData')}</div>
                          </div>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
});

export default DashboardHeader; 