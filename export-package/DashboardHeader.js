import React, { memo, useMemo, useState } from 'react';
import * as Icons from 'lucide-react';

const DashboardHeader = memo(({ financeManager, theme, t }) => {
  const { state, actions, getMonthNavigation, getMonthDisplayName } = financeManager;
  const [showSettings, setShowSettings] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [newUserName, setNewUserName] = useState(state.userName || '');
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const monthNav = getMonthNavigation();
  const currentTime = new Date();
  const greeting = useMemo(() => {
    const hour = currentTime.getHours();
    if (hour >= 6 && hour < 17) return t('greetingMorning');
    return t('greetingEvening');
  }, [t]);

  // Fonction pour obtenir l'initiale du nom d'utilisateur
  const getUserInitial = () => {
    if (state.userName && state.userName.trim()) {
      return state.userName.trim()[0].toUpperCase();
    }
    return 'U';
  };

  // Fonction pour sauvegarder le nom d'utilisateur
  const saveUserName = () => {
    console.log('saveUserName appelée avec:', newUserName);
    if (newUserName.trim()) {
      console.log('Sauvegarde du nom:', newUserName.trim());
      actions.setUserName(newUserName.trim());
      localStorage.setItem('userName', newUserName.trim());
      setShowNameModal(false);
    }
  };

  // Fonction pour réinitialiser le nom
  const resetUserName = () => {
    console.log('resetUserName appelée');
    actions.setUserName('');
    localStorage.removeItem('userName');
    setNewUserName('');
    setShowNameModal(false);
  };

  return (
    <>
      <header className={`fixed top-0 left-16 lg:left-64 right-0 h-16 z-20 backdrop-blur-xl ${
        state.darkMode 
          ? 'bg-gradient-to-r from-slate-900/95 via-gray-900/95 to-slate-800/95 border-gray-700/50' 
          : 'bg-gradient-to-r from-white/95 via-gray-50/95 to-gray-100/95 border-gray-200/50'
      } border-b shadow-lg`}>
        <div className="flex items-center justify-between h-full px-6">
          {/* Section gauche - Salutation et navigation temporelle */}
          <div className="flex items-center space-x-6">
            {/* Avatar et salutation */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-white font-semibold text-sm">
                    {getUserInitial()}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              
              <div className="group relative">
                <h1 className={`text-base font-semibold ${
                  state.darkMode 
                    ? 'text-white'
                    : 'text-gray-800'
                }`}>
                  {greeting}, {state.userName || 'Utilisateur'} !
                </h1>
                <p className={`text-xs ${state.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Gérez vos finances intelligemment
                </p>
                
                {/* Bouton d'édition du nom (visible au hover) */}
                <button
                  onClick={() => setShowNameModal(true)}
                  className="absolute -right-6 top-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                  title="Modifier votre nom"
                >
                  <Icons.Edit3 className="h-3 w-3 text-gray-500" />
                </button>
              </div>
            </div>
            
            {/* Navigation temporelle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => actions.setSelectedMonth(monthNav.previous)}
                className={`p-1.5 rounded-lg ${
                  state.darkMode 
                    ? 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-blue-400' 
                    : 'bg-gray-100/50 hover:bg-gray-200/50 text-gray-600 hover:text-blue-600'
                } transition-all duration-200 hover:scale-105`}
                title="Mois précédent"
              >
                <Icons.ChevronLeft className="h-4 w-4" />
              </button>
              
              <div className={`px-4 py-2 rounded-lg border shadow-sm ${
                state.darkMode 
                  ? 'bg-gray-800/50 border-gray-600/50' 
                  : 'bg-white/80 border-gray-200/50'
              }`}>
                <div className={`text-sm font-medium ${
                  state.darkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  {getMonthDisplayName(state.selectedMonth)}
                </div>
                <div className={`text-xs mt-0.5 ${
                  state.darkMode ? 'text-blue-300' : 'text-blue-600'
                }`}>
                  {monthNav.isCurrentMonth ? 'Mois actuel' : 
                   monthNav.isPastMonth ? 'Mois passé' : 'Mois futur'}
                </div>
              </div>
              
              <button
                onClick={() => actions.setSelectedMonth(monthNav.next)}
                disabled={monthNav.isFutureMonth}
                className={`p-1.5 rounded-lg ${
                  state.darkMode 
                    ? 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-blue-400' 
                    : 'bg-gray-100/50 hover:bg-gray-200/50 text-gray-600 hover:text-blue-600'
                } transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
                title="Mois suivant"
              >
                <Icons.ChevronRight className="h-4 w-4" />
              </button>
              
              {!monthNav.isCurrentMonth && (
                <button
                  onClick={() => actions.setSelectedMonth(new Date().toISOString().slice(0, 7))}
                  className="px-3 py-1.5 text-xs rounded-lg bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700 transition-all duration-200 hover:scale-105 shadow-sm"
                  title="Aller au mois actuel"
                >
                  <Icons.Home className="h-3 w-3 inline mr-1" />
                  Aujourd'hui
                </button>
              )}
            </div>
          </div>

          {/* Section droite - Contrôles */}
          <div className="flex items-center space-x-3">
            {/* Affichage des montants */}
            <button
              onClick={() => actions.setShowBalances(!state.showBalances)}
              className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                state.showBalances 
                  ? 'bg-blue-500/20 text-blue-600 shadow-sm' 
                  : state.darkMode 
                    ? 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-blue-400'
                    : 'bg-gray-100/50 hover:bg-gray-200/50 text-gray-600 hover:text-blue-600'
              }`}
              title={state.showBalances ? 'Masquer les montants' : 'Afficher les montants'}
            >
              {state.showBalances ? 
                <Icons.Eye className="h-4 w-4" /> : 
                <Icons.EyeOff className="h-4 w-4" />
              }
            </button>

            {/* Mode sombre/clair */}
            <button
              onClick={() => actions.setDarkMode(!state.darkMode)}
              className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                state.darkMode 
                  ? 'bg-yellow-500/20 text-yellow-400 shadow-sm' 
                  : 'bg-gray-100/50 hover:bg-gray-200/50 text-gray-600 hover:text-yellow-600'
              }`}
              title={state.darkMode ? 'Mode clair' : 'Mode sombre'}
            >
              {state.darkMode ? 
                <Icons.Sun className="h-4 w-4" /> : 
                <Icons.Moon className="h-4 w-4" />
              }
            </button>

            {/* Menu utilisateur */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                  showUserMenu 
                    ? 'bg-purple-500/20 text-purple-600 shadow-sm' 
                    : state.darkMode 
                      ? 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-purple-400'
                      : 'bg-gray-100/50 hover:bg-gray-200/50 text-gray-600 hover:text-purple-600'
                }`}
                title="Profil utilisateur"
              >
                <Icons.User className="h-4 w-4" />
              </button>

              {showUserMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-10"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-72 rounded-xl shadow-xl border border-gray-200 bg-white backdrop-blur-xl z-20 overflow-hidden">
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
                          <span className="text-white font-semibold text-lg">
                            {getUserInitial()}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">
                            {state.userName || 'Utilisateur'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {greeting} ! 👋
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-2 space-y-1">
                      <button
                        onClick={() => { 
                          console.log('Clic sur Modifier le nom');
                          setShowNameModal(true); 
                          setShowUserMenu(false); 
                        }}
                        className="w-full text-left px-4 py-3 rounded-lg text-sm hover:bg-gray-50 text-gray-700 transition-all duration-200 group flex items-center space-x-3"
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <Icons.Edit3 className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <div className="font-medium">Modifier le nom</div>
                          <div className="text-xs text-gray-500">
                            Personnaliser votre profil
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Menu des paramètres */}
            <div className="relative">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                  showSettings 
                    ? 'bg-purple-500/20 text-purple-600 shadow-sm' 
                    : state.darkMode 
                      ? 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-purple-400'
                      : 'bg-gray-100/50 hover:bg-gray-200/50 text-gray-600 hover:text-purple-600'
                }`}
                title="Paramètres"
              >
                <Icons.Settings className={`h-4 w-4 transition-transform duration-200 ${
                  showSettings ? 'rotate-90' : ''
                }`} />
              </button>

              {showSettings && (
                <>
                  <div 
                    className="fixed inset-0 z-10"
                    onClick={() => setShowSettings(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-64 rounded-xl shadow-xl border border-gray-200 bg-white backdrop-blur-xl z-20 overflow-hidden">
                    <div className="p-2 space-y-1">
                      <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-100">
                        Paramètres
                      </div>
                      
                      {/* Langue */}
                      <div className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-700 mb-2">Changer la langue</div>
                        <div className="flex space-x-2">
                          {['fr', 'en', 'es'].map(lang => (
                            <button
                              key={lang}
                              onClick={() => { actions.setLanguage(lang); setShowSettings(false); }}
                              className={`px-3 py-1 text-sm rounded-lg transition-all duration-200 ${
                                state.language === lang 
                                  ? 'bg-blue-500 text-white shadow-sm' 
                                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
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
                        className="w-full text-left px-4 py-3 rounded-lg text-sm hover:bg-gray-50 text-gray-700 transition-all duration-200 group flex items-center space-x-3"
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                          <Icons.DollarSign className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <div className="font-medium">Devise</div>
                          <div className="text-xs text-gray-500">Gérer les devises</div>
                        </div>
                      </button>

                      {/* Export */}
                      <button
                        onClick={() => { actions.toggleModal('import', true); setShowSettings(false); }}
                        className="w-full text-left px-4 py-3 rounded-lg text-sm hover:bg-gray-50 text-gray-700 transition-all duration-200 group flex items-center space-x-3"
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <Icons.Download className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <div className="font-medium">Exporter les données</div>
                          <div className="text-xs text-gray-500">Sauvegarder vos données</div>
                        </div>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Heure actuelle */}
            <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm ${
              state.darkMode 
                ? 'bg-gray-800/50 text-gray-300' 
                : 'bg-gray-100/50 text-gray-600'
            }">
              <Icons.Clock className="h-3 w-3" />
              <span>
                {currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Modal pour modifier le nom d'utilisateur */}
      {showNameModal && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setShowNameModal(false)}
          />
          <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 rounded-xl shadow-2xl z-50 p-6 ${
            state.darkMode 
              ? 'bg-gray-800 border border-gray-700' 
              : 'bg-white border border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${
                state.darkMode ? 'text-white' : 'text-gray-800'
              }`}>
                Modifier votre nom
              </h3>
              <button
                onClick={() => setShowNameModal(false)}
                className={`p-1 rounded-lg transition-colors ${
                  state.darkMode 
                    ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                    : 'hover:bg-gray-100 text-gray-500'
                }`}
              >
                <Icons.X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  state.darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Votre prénom ou nom
                </label>
                <input
                  type="text"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="Entrez votre nom..."
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    state.darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  autoFocus
                  onKeyPress={(e) => e.key === 'Enter' && saveUserName()}
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={saveUserName}
                  disabled={!newUserName.trim()}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Sauvegarder
                </button>
                <button
                  onClick={resetUserName}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    state.darkMode 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Réinitialiser
                </button>
              </div>
              
              <p className={`text-xs ${
                state.darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Votre nom sera sauvegardé localement et apparaîtra dans les salutations.
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
});

export default DashboardHeader; 