import React from 'react';
import { THEMES } from '../../store/financeReducer';

const ThemeSelector = ({ currentTheme, onThemeChange, t }) => {
  const themes = Object.values(THEMES);

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">{t('selectTheme') || 'Sélectionner un thème'}</h3>
      <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-2">
        {themes.map((theme) => (
          <button
            key={theme.name}
            onClick={() => onThemeChange(theme.name)}
            className={`
              p-4 rounded-lg border-2 transition-all duration-200
              ${currentTheme === theme.name 
                ? 'border-blue-500 shadow-lg scale-105' 
                : 'border-gray-200 hover:border-gray-300'
              }
              ${theme.bg}
            `}
          >
            <div className="flex items-center space-x-3">
              {/* Preview du thème */}
              <div className="flex-1">
                <div className={`h-8 rounded ${theme.card.split(' ')[0]} ${theme.border.split(' ')[0]}`}>
                  <div className="flex items-center justify-between p-2">
                    <div className={`w-2 h-2 rounded-full ${theme.primary}`}></div>
                    <div className={`w-2 h-2 rounded-full ${theme.secondary}`}></div>
                    <div className={`w-2 h-2 rounded-full ${theme.success}`}></div>
                  </div>
                </div>
              </div>
              
              {/* Nom du thème */}
              <div className="flex-1">
                <div className={`font-medium ${theme.text}`}>
                  {t(theme.name) || theme.displayName}
                </div>
                <div className={`text-xs ${theme.textSecondary}`}>
                  {currentTheme === theme.name ? t('current') || 'Actuel' : t('clickToApply') || 'Cliquer pour appliquer'}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector; 