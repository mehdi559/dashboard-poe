import React, { useState, useEffect, useRef, useCallback, useMemo, memo, Suspense, lazy } from 'react';
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

// Import des modals
import IncomeModal from './components/modals/IncomeModal';
import CurrencyModal from './components/modals/CurrencyModal';
import CategoryModal from './components/modals/CategoryModal';
import EditExpenseModal from './components/modals/EditExpenseModal';
import EditSavingModal from './components/modals/EditSavingModal';
import PaymentModal from './components/modals/PaymentModal';
import EditPaymentModal from './components/modals/EditPaymentModal';
import EditDebtModal from './components/modals/EditDebtModal';
import ExportModal from './components/modals/ExportModal';

// Import du chatbot
import Chatbot from './components/Chatbot';

// Imports dynamiques (code splitting) - juste après les imports classiques
const DashboardScreen = lazy(() => import('./screens/DashboardScreen'));
const BudgetScreen = lazy(() => import('./screens/BudgetScreen'));
const ReportsScreen = lazy(() => import('./screens/ReportsScreen'));
const ExpensesScreen = lazy(() => import('./screens/ExpensesScreen'));
const SavingsScreen = lazy(() => import('./screens/SavingsScreen'));
const RecurringScreen = lazy(() => import('./screens/RecurringScreen'));
const DebtsScreen = lazy(() => import('./screens/DebtsScreen'));
const RevenueScreen = lazy(() => import('./screens/RevenueScreen'));
const ToolsScreen = lazy(() => import('./screens/ToolsScreen'));
const CalendarScreenAI = lazy(() => import('./screens/CalendarScreenAI'));
const WelcomeScreen = lazy(() => import('./screens/WelcomeScreen'));

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

  // Splash screen state
  const [showWelcome, setShowWelcome] = useState(true);

  // Fonction pour quitter le welcome screen
  const handleStart = () => setShowWelcome(false);

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
        return <Suspense fallback={<LoadingSpinner size="lg" />}> <DashboardScreen {...screenProps} /> </Suspense>;
      case 'budget':
        return <Suspense fallback={<LoadingSpinner size="lg" />}> <BudgetScreen {...screenProps} /> </Suspense>;
      case 'reports':
        return <Suspense fallback={<LoadingSpinner size="lg" />}> <ReportsScreen {...screenProps} /> </Suspense>;
      case 'expenses':
        return <Suspense fallback={<LoadingSpinner size="lg" />}> <ExpensesScreen {...screenProps} /> </Suspense>;
      case 'savings':
        return <Suspense fallback={<LoadingSpinner size="lg" />}> <SavingsScreen {...screenProps} /> </Suspense>;
      case 'recurring':
        return <Suspense fallback={<LoadingSpinner size="lg" />}> <RecurringScreen {...screenProps} /> </Suspense>;
      case 'debts':
        return <Suspense fallback={<LoadingSpinner size="lg" />}> <DebtsScreen {...screenProps} /> </Suspense>;
      case 'revenue':
        return <Suspense fallback={<LoadingSpinner size="lg" />}> <RevenueScreen {...screenProps} /> </Suspense>;
      case 'tools':
        return <Suspense fallback={<LoadingSpinner size="lg" />}> <ToolsScreen {...screenProps} /> </Suspense>;
      case 'calendar':
        return <Suspense fallback={<LoadingSpinner size="lg" />}> <CalendarScreenAI {...screenProps} /> </Suspense>;
      default:
        return <Suspense fallback={<LoadingSpinner size="lg" />}> <DashboardScreen {...screenProps} /> </Suspense>;
    }
  }, [state.activeTab, financeManager, theme, t]);

  if (showWelcome) {
    return (
      <Suspense fallback={<LoadingSpinner size="lg" />}>
        <WelcomeScreen financeManager={financeManager} theme={theme} t={t} onStart={handleStart} />
      </Suspense>
    );
  }

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
      {state.modals.editPayment && <EditPaymentModal financeManager={financeManager} theme={theme} t={t} />}
      {state.modals.editDebt && <EditDebtModal financeManager={financeManager} theme={theme} t={t} />}
      
      {/* Export Modal */}
      {state.modals.export && <ExportModal financeManager={financeManager} theme={theme} t={t} />}

      {/* Chatbot IA */}
      <Chatbot financeManager={financeManager} theme={theme} t={t} />
    </div>
  );
};

export default App;
