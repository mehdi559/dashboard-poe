import React, { memo } from 'react';
import FinancialTools from '../components/ui/FinancialTools';

const ToolsScreen = memo(({ financeManager, theme, t }) => {
  return (
    <div className={`min-h-screen ${theme.bg} transition-colors duration-500`}>
      <div className={`${theme.card} border-b ${theme.border} sticky top-0 z-10 backdrop-blur-lg bg-opacity-90 mt-6`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              {t('financialTools')}
            </h1>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <FinancialTools financeManager={financeManager} theme={theme} t={t} />
      </div>
    </div>
  );
});

export default ToolsScreen; 