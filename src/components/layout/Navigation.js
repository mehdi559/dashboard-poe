import React, { memo, useMemo } from 'react';
import * as Icons from 'lucide-react';

// Navigation Component
const Navigation = memo(({ financeManager, t }) => {
  const { state, actions } = financeManager;
  
  const tabs = useMemo(() => [
    { id: 'dashboard', name: t('dashboard'), icon: Icons.Home },
    { id: 'budget', name: t('budget'), icon: Icons.Target },
    { id: 'expenses', name: t('expenses'), icon: Icons.CreditCard },
    { id: 'savings', name: t('savings'), icon: Icons.PiggyBank },
    { id: 'calendar', name: t('calendar'), icon: Icons.Calendar },
    { id: 'recurring', name: t('recurring'), icon: Icons.RefreshCw },
    { id: 'debts', name: t('debts'), icon: Icons.AlertCircle },
    { id: 'reports', name: t('reports'), icon: Icons.FileText }
  ], [t]);

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="flex space-x-2 sm:space-x-8 overflow-x-auto scrollbar-hide">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => actions.setActiveTab(tab.id)}
                className={`flex flex-col sm:flex-row items-center px-2 sm:px-3 py-2 sm:py-4 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap min-w-max transition-colors ${
                  state.activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600 dark:text-gray-300 hover:text-blue-500'
                }`}
                aria-label={`Aller à ${tab.name}`}
                aria-current={state.activeTab === tab.id ? 'page' : undefined}
              >
                <Icon className="h-4 w-4 sm:h-4 sm:w-4 sm:mr-2 mb-1 sm:mb-0" />
                <span className="text-xs sm:text-sm">{tab.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
});

export default Navigation; 