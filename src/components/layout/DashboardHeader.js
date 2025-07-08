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
    { id: 1, type: 'success', message: 'Budget mis à jour', time: '2 min' },
    { id: 2, type: 'warning', message: 'Dépense importante détectée', time: '5 min' },
    { id: 3, type: 'info', message: 'Rappel: Épargne mensuelle', time: '1h' }
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return '🌅 Bonjour';
    if (hour < 18) return '☀️ Bon après-midi';
    return '🌙 Bonsoir';
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 backdrop-blur-2xl bg-gradient-to-r from-slate-900/95 via-gray-900/95 to-slate-800/95 border-b border-gray-700/50 shadow-2xl">
      <div className="ml-20 lg:ml-72 transition-all duration-500 px-6 py-4">
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
                  {getGreeting()}, {state.userName || 'Utilisateur'} 
                </h1>
                <div className="flex items-center space-x-4 mt-1">
                  <p className="text-sm text-gray-400">
                    Gérez vos finances intelligemment
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Icons.Clock className="h-3 w-3" />
                    <span>{currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Center: Search Bar futuriste */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center">
                <Icons.Search className="absolute left-4 h-5 w-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
                <input
                  type="text"
                  placeholder="Rechercher transactions, budgets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 \
                    rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 \
                    focus:bg-gray-800/70 transition-all duration-300 text-sm"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 text-gray-400 hover:text-white transition-colors"
                  >
                    <Icons.X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

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
                  Revenus mensuels
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
              <div className="relative">
                <button className="p-3 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-yellow-400 \
                  transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-yellow-500/25 group">
                  <Icons.Bell className="h-5 w-5" />
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 \
                    rounded-full flex items-center justify-center text-xs font-bold text-white animate-pulse">
                    {notifications.length}
                  </div>
                </button>
              </div>

              {/* Toggle Balance */}
              <button
                onClick={() => actions.setShowBalances(!state.showBalances)}
                className={`p-3 rounded-xl transition-all duration-300 hover:scale-110 group ${
                  state.showBalances 
                    ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 shadow-lg shadow-blue-500/25' 
                    : 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-blue-400'
                }`}
                title={state.showBalances ? 'Masquer les montants' : 'Afficher les montants'}
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
                title={state.darkMode ? 'Mode clair' : 'Mode sombre'}
              >
                {state.darkMode ? 
                  <Icons.Sun className="h-5 w-5 group-hover:rotate-180 transition-transform duration-500" /> : 
                  <Icons.Moon className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                }
              </button>

              {/* Settings Menu amélioré */}
              <div className="relative">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className={`p-3 rounded-xl transition-all duration-300 hover:scale-110 group ${
                    showSettings 
                      ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 shadow-lg shadow-purple-500/25' 
                      : 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-purple-400'
                  }`}
                  title="Paramètres avancés"
                >
                  <Icons.Settings className={`h-5 w-5 transition-transform duration-300 ${
                    showSettings ? 'rotate-180' : 'group-hover:rotate-90'
                  }`} />
                </button>

                {showSettings && (
                  <>
                    <div 
                      className="fixed inset-0 z-10"
                      onClick={() => setShowSettings(false)}
                    />
                    <div className="absolute right-0 top-full mt-3 w-64 rounded-2xl shadow-2xl border border-gray-700/50 \
                      bg-gradient-to-b from-gray-900 to-slate-900 backdrop-blur-xl z-20 overflow-hidden">
                      <div className="p-2 space-y-1">
                        <div className="px-4 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider border-b border-gray-700/50">
                          Paramètres
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
                            <div className="font-medium">Devise</div>
                            <div className="text-xs text-gray-500">Gérer les devises</div>
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
                            <div className="font-medium">Import/Export</div>
                            <div className="text-xs text-gray-500">Sauvegarder vos données</div>
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