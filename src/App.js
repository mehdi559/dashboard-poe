import React, { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import * as Icons from 'lucide-react';
import './App.css';

// Import des utilitaires extraits
import { validators } from './utils/validators';
import { dateUtils } from './utils/dateUtils';
import translations from './i18n/translations';
import { THEMES } from './store/financeReducer';
import useFinanceManager from './features/dashboard/hooks/useFinanceManager';
import LoadingSpinner from './components/ui/LoadingSpinner';
import Input from './components/ui/Input';
import Button from './components/ui/Button';
import Modal from './components/ui/Modal';
import NotificationContainer from './components/ui/NotificationContainer';
import SearchAndFilter from './components/ui/SearchAndFilter';
import Pagination from './components/ui/Pagination';
import DashboardHeader from './components/layout/DashboardHeader';
import Navigation from './components/layout/Navigation';
import ThemeSelector from './components/ui/ThemeSelector';

// Import des écrans
import DashboardScreen from './screens/DashboardScreen';
import BudgetScreen from './screens/BudgetScreen';
import ReportsScreen from './screens/ReportsScreen';
import ExpensesScreen from './screens/ExpensesScreen';
import SavingsScreen from './screens/SavingsScreen';
import RecurringScreen from './screens/RecurringScreen';
import DebtsScreen from './screens/DebtsScreen';
import RevenueScreen from './screens/RevenueScreen';
import ToolsScreen from './screens/ToolsScreen';
import CalendarScreenAI from './screens/CalendarScreenAI';

// Import des modals
import IncomeModal from './components/modals/IncomeModal';
import CurrencyModal from './components/modals/CurrencyModal';
import CategoryModal from './components/modals/CategoryModal';
import EditExpenseModal from './components/modals/EditExpenseModal';
import EditSavingModal from './components/modals/EditSavingModal';
import PaymentModal from './components/modals/PaymentModal';
import EditDebtModal from './components/modals/EditDebtModal';
import ExportModal from './components/modals/ExportModal';

// Import du chatbot
import Chatbot from './components/Chatbot';

// ============================================================================
// SYSTÈME DE TRADUCTION COMPLET
// ============================================================================



// ============================================================================
// COMPOSANTS UTILITAIRES OPTIMISÉS
// ============================================================================














// ============================================================================
// COMPOSANT HEADER OPTIMISÉ
// ============================================================================



// ============================================================================
// COMPOSANT NAVIGATION OPTIMISÉ
// ============================================================================



// ============================================================================
// COMPOSANTS D'ÉCRAN OPTIMISÉS
// ============================================================================

// Dashboard Screen - Maintenant importé depuis DashboardScreen.js

// Budget Screen - Maintenant importé depuis BudgetScreen.js

// Expenses Screen - Maintenant importé depuis ExpensesScreen.js

// Savings Screen - Maintenant importé depuis SavingsScreen.js

// Calendar Screen - Maintenant importé depuis CalendarScreen.js

// Recurring Screen - Maintenant importé depuis RecurringScreen.js

// Debts Screen - Maintenant importé depuis DebtsScreen.js

// Reports Screen - Maintenant importé depuis ReportsScreen.js



// ============================================================================
// COMPOSANT PRINCIPAL
// ============================================================================

const App = () => {
  const financeManager = useFinanceManager();
  const { state, actions } = financeManager;

  // Helper pour les traductions
  const t = useCallback((key, params = {}) => {
    // Logique améliorée pour la sélection de traduction
    let translation;
    if (translations[state.language] && translations[state.language][key]) {
      translation = translations[state.language][key];
    } else if (translations.fr && translations.fr[key]) {
      translation = translations.fr[key];
    } else {
      translation = key; // Fallback sur la clé elle-même
    }
    
    // Gestion des interpolations
    if (params && typeof params === 'object') {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        translation = translation.replace(new RegExp(`{{${paramKey}}}`, 'g'), paramValue);
      });
    }
    
    return translation;
  }, [state.language]);

  // Passer t à financeManager après sa création
  React.useEffect(() => {
    if (financeManager.setTranslation) {
      financeManager.setTranslation(t);
    }
  }, [t, financeManager]);

  // Gestion du thème
  useEffect(() => {
    const currentTheme = THEMES[state.theme];
    if (currentTheme) {
      // Appliquer les classes CSS du thème
      document.documentElement.className = currentTheme.name === 'dark' ? 'dark' : '';
    }
  }, [state.theme]);

  // Styles thématiques
  const theme = useMemo(() => {
    const currentTheme = THEMES[state.theme] || THEMES.light;
    return {
      ...currentTheme,
      darkMode: state.theme === 'dark' // Pour la compatibilité
    };
  }, [state.theme]);

  // Rendu conditionnel des écrans
  const renderScreen = useCallback(() => {
    const screenProps = { financeManager, theme, t };
    
    switch (state.activeTab) {
      case 'dashboard':
        return <DashboardScreen {...screenProps} />;
      case 'budget':
        return <BudgetScreen {...screenProps} />;
      case 'expenses':
        return <ExpensesScreen {...screenProps} />;
      case 'savings':
        return <SavingsScreen {...screenProps} />;
      case 'calendar':
        return <CalendarScreenAI {...screenProps} />;
      case 'recurring':
        return <RecurringScreen {...screenProps} />;
      case 'debts':
        return <DebtsScreen {...screenProps} />;
      case 'reports':
        return <ReportsScreen {...screenProps} />;
      case 'revenue':
        return <RevenueScreen {...screenProps} />;
      case 'tools':
        return <ToolsScreen {...screenProps} />;
      default:
        return <DashboardScreen {...screenProps} />;
    }
  }, [state.activeTab, financeManager, theme, t]);

  return (
    <div className={`min-h-screen ${theme.bg} transition-colors duration-300`}>
      {/* Loading Overlay */}
      {state.loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 flex items-center space-x-3">
            <LoadingSpinner size="lg" />
            <span className={`text-lg ${theme.text}`}>{t('loading')}</span>
          </div>
        </div>
      )}

      {/* Notifications */}
      <NotificationContainer notifications={state.notifications} />

      {/* Navigation Sidebar */}
      <Navigation financeManager={financeManager} theme={theme} t={t} />

      {/* Header */}
      <DashboardHeader financeManager={financeManager} theme={theme} t={t} />

      {/* Main Content */}
      <main className={`${state.sidebarCollapsed ? 'ml-16' : 'ml-64'} pt-20 px-8 lg:px-12 py-8 transition-all duration-500`}>
        <div className="max-w-7xl mx-auto">
          {renderScreen()}
        </div>
      </main>

      {/* Modals - Rendu conditionnel pour optimiser les performances */}
      {state.modals.income && <IncomeModal financeManager={financeManager} theme={theme} t={t} />}
      {state.modals.currency && <CurrencyModal financeManager={financeManager} theme={theme} t={t} />}
      {state.modals.category && <CategoryModal financeManager={financeManager} theme={theme} t={t} />}
      {state.modals.editExpense && <EditExpenseModal financeManager={financeManager} theme={theme} t={t} />}
      {state.modals.editSaving && <EditSavingModal financeManager={financeManager} theme={theme} t={t} />}
      {state.modals.payment && <PaymentModal financeManager={financeManager} theme={theme} t={t} />}
      {state.modals.editDebt && <EditDebtModal financeManager={financeManager} theme={theme} t={t} />}
      
      {/* Export Modal */}
      {state.modals.export && <ExportModal financeManager={financeManager} theme={theme} t={t} />}

      {/* Chatbot IA */}
      <Chatbot financeManager={financeManager} theme={theme} t={t} />
    </div>
  );
};

export default App;
