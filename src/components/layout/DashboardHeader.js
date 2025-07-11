import React, { memo, useMemo, useState } from 'react';
import * as Icons from 'lucide-react';

const DashboardHeader = memo(({ financeManager, theme, t }) => {
  const { state, actions, getMonthNavigation, getMonthDisplayName } = financeManager;
  const [showSettings, setShowSettings] = useState(false);
  // Hooks pour l'édition du nom utilisateur
  const [showUserEdit, setShowUserEdit] = useState(false);
  const [userInput, setUserInput] = useState(state.userName || '');
  // Fonction pour forcer la majuscule sur la première lettre
  const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
  
  const monthNav = getMonthNavigation();
  const currentTime = new Date();
  const greeting = useMemo(() => {
    const hour = currentTime.getHours();
    if (hour < 12) return t('greeting.morning');
    if (hour < 18) return t('greeting.afternoon');
    return t('greeting.evening');
  }, [t]);

  return (
    <header className={`fixed top-0 left-16 lg:left-64 right-0 h-20 z-20 backdrop-blur-xl ${
      state.darkMode 
        ? 'bg-gradient-to-r from-slate-900/95 via-gray-900/95 to-slate-800/95 border-gray-700/50' 
        : 'bg-gradient-to-r from-white/95 via-gray-50/95 to-gray-100/95 border-gray-200/50'
    } border-b shadow-2xl`}>
      <div className="flex items-center justify-between h-full px-8">
        {/* Section gauche - Salutation et navigation temporelle */}
        <div className="flex items-center space-x-8">
          {/* Avatar et salutation */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                <span className="text-white font-bold text-lg">
                  {(state.userName || 'U')[0].toUpperCase()}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-900"></div>
            </div>
            
            <div>
              <h1 className={`text-xl font-bold ${
                state.darkMode 
                  ? 'bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent'
                  : 'bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600 bg-clip-text text-transparent'
              }`}>
                {greeting}, {state.userName || t('user')} !
              </h1>
              <p className={`text-sm ${state.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t('manageFinancesSmart')}</p>
            </div>
          </div>
          
          {/* Navigation temporelle élégante */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => actions.setSelectedMonth(monthNav.previous)}
              className={`p-2 rounded-xl ${
                state.darkMode 
                  ? 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-blue-400' 
                  : 'bg-gray-100/50 hover:bg-gray-200/50 text-gray-600 hover:text-blue-600'
              } transition-all duration-300 hover:scale-110 group`}
              title={t('previousMonth')}
            >
              <Icons.ChevronLeft className="h-5 w-5 group-hover:scale-110 transition-transform" />
            </button>
            
            <div className={`px-6 py-3 backdrop-blur-sm rounded-2xl border shadow-lg group hover:shadow-blue-500/25 transition-all duration-300 ${
              state.darkMode 
                ? 'bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-500/20' 
                : 'bg-gradient-to-r from-blue-50/80 to-purple-50/80 border-blue-300/30'
            }`}>
              <div className={`text-sm font-bold group-hover:scale-105 transform duration-200 ${
                state.darkMode ? 'text-white' : 'text-gray-800'
              }`}>
                {/* Mois avec majuscule */}
                {(() => {
                  const month = getMonthDisplayName(state.selectedMonth);
                  return month.charAt(0).toUpperCase() + month.slice(1);
                })()}
              </div>
              <div className={`text-xs mt-1 ${
                state.darkMode ? 'text-blue-300' : 'text-blue-600'
              }`}>
                {monthNav.isCurrentMonth ? t('currentMonth') : 
                 monthNav.isPastMonth ? t('pastMonth') : t('futureMonth')}
              </div>
            </div>
            
            <button
              onClick={() => actions.setSelectedMonth(monthNav.next)}
              disabled={monthNav.isFutureMonth}
              className={`p-2 rounded-xl ${
                state.darkMode 
                  ? 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-blue-400' 
                  : 'bg-gray-100/50 hover:bg-gray-200/50 text-gray-600 hover:text-blue-600'
              } transition-all duration-300 hover:scale-110 group disabled:opacity-50 disabled:cursor-not-allowed`}
              title={t('nextMonth')}
            >
              <Icons.ChevronRight className="h-5 w-5 group-hover:scale-110 transition-transform" />
            </button>
            
            {!monthNav.isCurrentMonth && (
              <button
                onClick={() => actions.setSelectedMonth(new Date().toISOString().slice(0, 7))}
                className="px-4 py-2 text-sm rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700 transition-all duration-300 hover:scale-105 shadow-lg shadow-emerald-500/25"
                title={t('goToCurrentMonth')}
              >
                <Icons.Home className="h-4 w-4 inline mr-2" />
                {t('today')}
              </button>
            )}
          </div>
        </div>

        {/* Section droite - Contrôles élégants */}
        <div className="flex items-center space-x-4">
          {/* Affichage des montants */}
          <button
            onClick={() => actions.setShowBalances(!state.showBalances)}
            className={`p-3 rounded-xl transition-all duration-300 hover:scale-110 group ${
              state.showBalances 
                ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 shadow-lg shadow-blue-500/25' 
                : state.darkMode 
                  ? 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-blue-400'
                  : 'bg-gray-100/50 hover:bg-gray-200/50 text-gray-600 hover:text-blue-600'
            }`}
            title={state.showBalances ? t('hideAmounts') : t('showAmounts')}
          >
            {state.showBalances ? 
              <Icons.Eye className="h-5 w-5 group-hover:scale-110 transition-transform" /> : 
              <Icons.EyeOff className="h-5 w-5 group-hover:scale-110 transition-transform" />
            }
          </button>

          {/* Mode sombre/clair */}
          <button
            onClick={() => actions.setDarkMode(!state.darkMode)}
            className={`p-3 rounded-xl transition-all duration-300 hover:scale-110 group ${
              state.darkMode 
                ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 shadow-lg shadow-yellow-500/25' 
                : 'bg-gray-100/50 hover:bg-gray-200/50 text-gray-600 hover:text-yellow-600'
            }`}
            title={state.darkMode ? t('lightMode') : t('darkMode')}
          >
            {state.darkMode ? 
              <Icons.Sun className="h-5 w-5 group-hover:rotate-180 transition-transform duration-500" /> : 
              <Icons.Moon className="h-5 w-5 group-hover:rotate-12 transition-transform" />
            }
          </button>

          {/* Import/Export + Paramètres */}
          <div className="relative flex items-center space-x-2">
            {/* Import/Export */}
            <button
              onClick={() => actions.toggleModal('import', true)}
              className={`p-3 rounded-xl transition-all duration-300 hover:scale-110 group bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 shadow-lg shadow-blue-500/25`}
              title={t('importExport')}
            >
              <Icons.Download className="h-5 w-5 group-hover:scale-110 transition-transform" />
            </button>
            {/* Paramètres */}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-3 rounded-xl transition-all duration-300 hover:scale-110 group ${
                showSettings 
                  ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 shadow-lg shadow-purple-500/25' 
                  : state.darkMode 
                    ? 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-purple-400'
                    : 'bg-gray-100/50 hover:bg-gray-200/50 text-gray-600 hover:text-purple-600'
              }`}
              title={t('settings')}
            >
              <Icons.Settings className={`h-5 w-5 transition-transform duration-300 ${
                showSettings ? 'rotate-180' : 'group-hover:rotate-90'
              }`} />
            </button>
            {/* Menu déroulant des paramètres (inchangé) */}
            {showSettings && (
              <>
                <div 
                  className="fixed inset-0 z-10"
                  onClick={() => setShowSettings(false)}
                />
                <div className="absolute right-0 top-full mt-3 w-72 rounded-2xl shadow-2xl border border-gray-700/50 bg-gradient-to-b from-gray-900 to-slate-900 backdrop-blur-xl z-20 overflow-hidden">
                  <div className="p-2 space-y-1">
                    <div className="px-4 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider border-b border-gray-700/50">
                      {t('settings')}
                    </div>
                    {/* Langue */}
                    <div className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-300 mb-2">{t('changeLanguage')}</div>
                      <div className="flex space-x-2">
                        {['fr', 'en', 'es'].map(lang => (
                          <button
                            key={lang}
                            onClick={() => { actions.setLanguage(lang); setShowSettings(false); }}
                            className={`px-3 py-1 text-sm rounded-lg transition-all duration-200 ${
                              state.language === lang 
                                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' 
                                : 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white'
                            }`}
                          >
                            {lang.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Devise */}
                    <button
                      onClick={() => { actions.toggleModal('currency', true); setShowSettings(false); }}
                      className="w-full text-left px-4 py-3 rounded-xl text-sm hover:bg-gray-800/50 text-gray-300 hover:text-white transition-all duration-200 group flex items-center space-x-3"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                        <Icons.DollarSign className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium">{t('currency')}</div>
                        <div className="text-xs text-gray-500">{t('manageCurrencies')}</div>
                      </div>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Icône utilisateur + popover édition */}
          <div className="relative">
            <button
              onClick={() => setShowUserEdit((v) => !v)}
              className="p-3 rounded-xl transition-all duration-300 hover:scale-110 group bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-400 shadow-lg shadow-pink-500/25"
              title={t('edit')}
            >
              <Icons.User className="h-5 w-5" />
            </button>
            {showUserEdit && (
              <div className="absolute right-0 top-full mt-3 w-64 rounded-2xl shadow-2xl border border-gray-700/50 bg-white dark:bg-gray-900 z-20 overflow-hidden p-4 flex flex-col space-y-2">
                <label className="text-xs text-gray-500 dark:text-gray-300 mb-1">{t('user')}</label>
                <input
                  type="text"
                  value={capitalize(userInput)}
                  onChange={e => setUserInput(capitalize(e.target.value))}
                  className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                  placeholder={t('user')}
                  maxLength={32}
                />
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={() => {
                      actions.setUserName(userInput.trim());
                      setShowUserEdit(false);
                    }}
                    className="flex-1 px-3 py-1 rounded-lg bg-blue-500 text-white hover:bg-blue-600 text-sm font-medium"
                    disabled={!userInput.trim()}
                  >OK</button>
                  <button
                    onClick={() => setShowUserEdit(false)}
                    className="flex-1 px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 text-sm font-medium"
                  >{t('cancel')}</button>
                </div>
              </div>
            )}
          </div>

          {/* Heure actuelle */}
          <div className={`hidden lg:flex items-center space-x-2 px-4 py-2 rounded-xl transition-colors duration-200 ${
            state.darkMode ? 'bg-gray-800/50 text-blue-200' : 'bg-gray-100/50 text-gray-600'
          }`}>
            <Icons.Clock className="h-4 w-4" />
            <span className="text-sm">
              {currentTime.toLocaleTimeString(state.language === 'fr' ? 'fr-FR' : state.language === 'es' ? 'es-ES' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
});

export default DashboardHeader; 