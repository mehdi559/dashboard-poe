import React, { memo, useMemo, useState } from 'react';
import * as Icons from 'lucide-react';

// Navigation Component - Sidebar futuriste
const Navigation = memo(({ financeManager, theme, t }) => {
  const { state, actions } = financeManager;
  const [hoveredTab, setHoveredTab] = useState(null);
  
  const tabs = useMemo(() => [
    { id: 'dashboard', name: t('dashboard'), icon: Icons.Home, gradient: 'from-blue-500 to-cyan-500', notifications: 0 },
    { id: 'budget', name: t('budget'), icon: Icons.Target, gradient: 'from-purple-500 to-pink-500', notifications: 0 },
    { id: 'expenses', name: t('expenses'), icon: Icons.CreditCard, gradient: 'from-red-500 to-orange-500', notifications: 3 },
    { id: 'revenue', name: t('revenue'), icon: Icons.DollarSign, gradient: 'from-emerald-500 to-teal-500', notifications: 0 },
    { id: 'calendar', name: t('calendar'), icon: Icons.Calendar, gradient: 'from-indigo-500 to-purple-500', notifications: 1 },
    { id: 'debts', name: t('debts'), icon: Icons.AlertCircle, gradient: 'from-yellow-500 to-red-500', notifications: 2 },
    { id: 'tools', name: t('tools'), icon: Icons.Calculator, gradient: 'from-orange-500 to-red-500', notifications: 0 },
    { id: 'reports', name: t('reports'), icon: Icons.FileText, gradient: 'from-gray-500 to-slate-500', notifications: 0 },
  ], [t]);

  return (
    <nav className={`fixed left-0 top-0 h-full ${state.sidebarCollapsed ? 'w-16' : 'w-64'} 
      ${theme.bg} ${theme.border}
      backdrop-blur-xl border-r shadow-2xl z-30 transition-all duration-500 ease-out
      before:absolute before:inset-0 before:bg-gradient-to-r before:from-blue-600/5 before:to-purple-600/5`}>
      
      <div className="flex flex-col h-full relative">
        {/* Logo/Header avec effet néon */}
        <div className={`p-6 border-b ${theme.border} backdrop-blur-sm`}>
          <div className="flex items-center justify-between">
            <div className={`flex items-center space-x-3 ${state.sidebarCollapsed ? 'justify-center' : ''}`}> 
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <Icons.Zap className="h-6 w-6 text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl blur opacity-50"></div>
              </div>
              {!state.sidebarCollapsed && (
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-pink-500 via-blue-400 to-emerald-400 bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(59,130,246,0.7)]">
                    My Wallet
                  </h1>
                  <p className="text-xs font-semibold bg-gradient-to-r from-emerald-400 via-pink-400 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_6px_rgba(236,72,153,0.7)]">
                    By MM
                  </p>
                </div>
              )}
            </div>
            
            <button
              onClick={() => actions.setSidebarCollapsed(!state.sidebarCollapsed)}
              className={`p-2 rounded-lg ${
                theme.name === 'dark'
                  ? 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-white' 
                  : 'bg-gray-100/50 hover:bg-gray-200/50 text-gray-600 hover:text-gray-800'
              } transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/25`}
              title={state.sidebarCollapsed ? t('expandSidebar') : t('collapseSidebar')}
            >
              <Icons.PanelLeftClose className={`h-4 w-4 transition-transform duration-300 ${state.sidebarCollapsed ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Navigation Links avec animations */}
        <div className="flex-1 px-3 py-6 overflow-hidden">
          <div className="space-y-3">
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              const isActive = state.activeTab === tab.id;
              const isHovered = hoveredTab === tab.id;
              
              return (
                <div
                  key={tab.id}
                  className="relative group"
                  onMouseEnter={() => setHoveredTab(tab.id)}
                  onMouseLeave={() => setHoveredTab(null)}
                >
                  {/* Effet de glow actif */}
                  {isActive && (
                    <div className={`absolute inset-0 bg-gradient-to-r ${tab.gradient} rounded-2xl opacity-20 blur-sm`}></div>
                  )}
                  
                  <button
                    onClick={() => actions.setActiveTab(tab.id)}
                    className={`relative w-full flex items-center ${state.sidebarCollapsed ? 'justify-center px-4' : 'px-4'} py-4 
                      text-sm font-medium rounded-2xl transition-all duration-300 ease-out transform
                      ${isActive 
                        ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg shadow-current/25 scale-105` 
                        : isHovered
                          ? theme.name === 'dark'
                            ? 'bg-gray-800/60 text-white scale-102 shadow-lg'
                            : 'bg-gray-200/60 text-gray-800 scale-102 shadow-lg'
                          : theme.name === 'dark'
                            ? 'text-gray-400 hover:text-gray-300'
                            : 'text-gray-600 hover:text-gray-800'
                      } group-hover:shadow-2xl`}
                    aria-label={`${t('goTo')} ${tab.name}`}
                    style={{
                      animationDelay: `${index * 100}ms`
                    }}
                  >
                    {/* Icône avec animation */}
                    <div className={`relative flex items-center justify-center ${state.sidebarCollapsed ? '' : 'mr-4'}`}>
                      <Icon className={`h-6 w-6 transition-all duration-300 ${
                        isActive ? 'scale-110' : isHovered ? 'scale-105' : ''
                      } ${isActive && tab.icon === Icons.RefreshCw ? 'animate-spin' : ''}`} />
                    </div>
                    
                    {/* Texte avec animation de slide */}
                    {!state.sidebarCollapsed && (
                      <span className={`transition-all duration-300 ${isActive ? 'font-semibold' : ''}`}>
                        {tab.name}
                      </span>
                    )}
                    
                    {/* Indicateur actif */}
                    {isActive && (
                      <div className="absolute right-2 w-2 h-2 bg-white rounded-full shadow-lg animate-pulse"></div>
                    )}
                  </button>
                  
                  {/* Tooltip pour mode collapsed */}
                  {state.sidebarCollapsed && isHovered && (
                    <div className={`absolute left-full ml-4 top-1/2 transform -translate-y-1/2 z-50
                      ${theme.name === 'dark'
                        ? 'bg-gray-900 text-white border-gray-700' 
                        : 'bg-white text-gray-800 border-gray-200'
                      } px-3 py-2 rounded-lg text-sm font-medium shadow-2xl
                      border backdrop-blur-sm`}>
                      {tab.name}
                      <div className={`absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 
                        w-2 h-2 ${theme.name === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border-l border-b rotate-45`}></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer futuriste */}
        <div className={`p-4 border-t ${theme.border} backdrop-blur-sm`}>
          {!state.sidebarCollapsed ? (
            <div className="text-center">
              {/* Suppression de la mention 'Alimenté par IA • v2.0.1' */}
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className={`text-xs font-medium ${theme.name === 'dark' ? 'text-green-400' : 'text-green-600'}`}>{t('systemOperational')}</span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse shadow-lg shadow-green-500/50" title={t('systemOperational')}></div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
});

export default Navigation; 