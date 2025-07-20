import React, { memo, useState, useRef, useCallback, useEffect } from 'react';
import * as Icons from 'lucide-react';

// Styles personnalisés pour l'interface unique
const customStyles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-10px) rotate(2deg); }
  }
  
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 30px rgba(147, 51, 234, 0.4), 0 0 60px rgba(59, 130, 246, 0.2); }
    50% { box-shadow: 0 0 50px rgba(147, 51, 234, 0.7), 0 0 100px rgba(59, 130, 246, 0.4); }
  }
  
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  
  @keyframes bubble-float {
    0% { transform: translateY(100vh) scale(0) rotate(0deg); opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { transform: translateY(-100px) scale(1) rotate(180deg); opacity: 0; }
  }
  
  @keyframes typing-indicator {
    0%, 60%, 100% { transform: scale(1) translateY(0); opacity: 0.4; }
    30% { transform: scale(1.2) translateY(-10px); opacity: 1; }
  }
  
  @keyframes slide-in-elegant {
    0% { transform: translateY(20px) scale(0.95); opacity: 0; }
    100% { transform: translateY(0) scale(1); opacity: 1; }
  }
  
  @keyframes gradient-shift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  .float-animation { animation: float 6s ease-in-out infinite; }
  .pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
  .shimmer-effect {
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
    background-size: 200% 100%;
    animation: shimmer 2s infinite;
  }
  .bubble-float { animation: bubble-float 8s ease-in-out infinite; }
  .typing-dot { animation: typing-indicator 1.5s ease-in-out infinite; }
  .slide-in-elegant { animation: slide-in-elegant 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
  .gradient-animate {
    background-size: 200% 200%;
    animation: gradient-shift 4s ease infinite;
  }
  
  .glass-morphism {
    background: rgba(255, 255, 255, 0.98);
    border: 1px solid rgba(255, 255, 255, 0.5);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  }
  
  .dark .glass-morphism {
    background: rgba(20, 20, 20, 0.98);
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  }
  
  .message-bubble-user {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    position: relative;
    overflow: hidden;
  }
  
  .message-bubble-user::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
    transform: rotate(45deg);
    animation: shimmer 3s infinite;
  }
  
  .message-bubble-bot {
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    border: 1px solid rgba(0,0,0,0.1);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }
  
  .dark .message-bubble-bot {
    background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
    border: 1px solid rgba(255,255,255,0.2);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  }
  
  .floating-particles {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
    pointer-events: none;
  }
  
  .particle {
    position: absolute;
    background: radial-gradient(circle, rgba(147,51,234,0.6) 0%, rgba(59,130,246,0.4) 50%, transparent 100%);
    border-radius: 50%;
  }
`;

// Composant de particules flottantes
const FloatingParticles = () => {
  const particles = Array.from({ length: 15 }, (_, i) => (
    <div
      key={i}
      className="particle bubble-float"
      style={{
        left: `${Math.random() * 100}%`,
        width: `${4 + Math.random() * 8}px`,
        height: `${4 + Math.random() * 8}px`,
        animationDelay: `${Math.random() * 8}s`,
        animationDuration: `${6 + Math.random() * 4}s`
      }}
    />
  ));

  return <div className="floating-particles">{particles}</div>;
};

// Composant d'indicateur de frappe amélioré
const TypingIndicator = ({ t }) => (
  <div className="flex justify-start mb-4">
    <div className="message-bubble-bot rounded-3xl px-6 py-4 shadow-2xl relative overflow-hidden">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
          <Icons.Brain className="h-5 w-5 text-white" />
        </div>
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full typing-dot"></div>
          <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full typing-dot" style={{animationDelay: '0.3s'}}></div>
          <div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-red-500 rounded-full typing-dot" style={{animationDelay: '0.6s'}}></div>
        </div>
        <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">{t('chatbot.assistantThinking')}</span>
      </div>
    </div>
  </div>
);

const Chatbot = memo(({ financeManager, theme, t }) => {
  const { state, actions, computedValues, formatCurrency } = financeManager;
  
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  
  // États du chatbot pour suivre le contexte
  const [chatState, setChatState] = useState('welcome');
  const [contextData, setContextData] = useState(null);

  const messagesEndRef = useRef(null);

  // Injection des styles CSS
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = customStyles;
    document.head.appendChild(styleSheet);
    return () => document.head.removeChild(styleSheet);
  }, []);

  // Configuration du thème sombre
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    }
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
      if (event.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    });
  }, []);

  // Initialiser les messages avec le message de bienvenue
  useEffect(() => {
    setMessages([{
      id: 1,
      from: 'bot',
      text: getWelcomeMessage(),
      suggestions: getMainSuggestions()
    }]);
  }, [t]);

  // Auto-scroll
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      // Délai pour éviter les conflits avec les animations
      setTimeout(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    }
  }, [messages, isOpen]);

  // Ajuster la position sur les petits écrans
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setPosition({ x: -50, y: 0 });
      } else {
        setPosition({ x: 0, y: 0 });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // SYSTÈME D'ÉTATS ET DE MESSAGES
  
  // Messages de bienvenue contextuels
  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    let greetingKey = 'greetingEvening';
    if (hour < 12) greetingKey = 'greetingMorning';
    else if (hour < 18) greetingKey = 'greetingAfternoon';
    return t('chatbot.welcomeMessage', {
      greeting: t(`chatbot.${greetingKey}`),
      assistantName: t('chatbot.assistantName')
    });
  };

  // Suggestions principales
  const getMainSuggestions = () => [
    { text: t('chatbot.suggestionExpenses'), action: 'goto_expenses', icon: 'CreditCard', color: 'from-red-500 to-pink-500' },
    { text: t('chatbot.suggestionSavings'), action: 'goto_savings', icon: 'PiggyBank', color: 'from-green-500 to-emerald-500' },
    { text: t('chatbot.suggestionIncome'), action: 'goto_income', icon: 'DollarSign', color: 'from-yellow-500 to-orange-500' },
    { text: t('chatbot.suggestionAnalysis'), action: 'goto_analysis', icon: 'BarChart3', color: 'from-blue-500 to-cyan-500' }
  ];

  // Suggestions pour les dépenses
  const getExpensesSuggestions = () => [
    { text: t('chatbot.suggestionAddExpense'), action: 'add_expense', icon: 'Plus', color: 'from-green-500 to-emerald-500' },
    { text: t('chatbot.suggestionViewExpenses'), action: 'view_expenses', icon: 'List', color: 'from-blue-500 to-cyan-500' },
    { text: t('chatbot.suggestionManageCategories'), action: 'manage_categories', icon: 'FolderPlus', color: 'from-purple-500 to-violet-500' },
    { text: t('chatbot.suggestionAnalyzeExpenses'), action: 'analyze_expenses', icon: 'TrendingUp', color: 'from-orange-500 to-red-500' },
    { text: t('chatbot.suggestionMainMenu'), action: 'goto_main', icon: 'Home', color: 'from-gray-500 to-slate-500' }
  ];

  // Suggestions pour l'épargne
  const getSavingsSuggestions = () => [
    { text: t('chatbot.suggestionViewGoals'), action: 'view_goals', icon: 'Target', color: 'from-indigo-500 to-blue-500' },
    { text: t('chatbot.suggestionAddGoal'), action: 'add_goal', icon: 'Plus', color: 'from-green-500 to-emerald-500' },
    { text: t('chatbot.suggestionAddSavings'), action: 'add_savings', icon: 'PiggyBank', color: 'from-emerald-500 to-green-500' },
    { text: t('chatbot.suggestionSavingsProgress'), action: 'savings_progress', icon: 'TrendingUp', color: 'from-purple-500 to-violet-500' },
    { text: t('chatbot.suggestionMainMenu'), action: 'goto_main', icon: 'Home', color: 'from-gray-500 to-slate-500' }
  ];

  // Suggestions pour les revenus
  const getIncomeSuggestions = () => [
    { text: t('chatbot.suggestionViewIncome'), action: 'view_income', icon: 'DollarSign', color: 'from-yellow-500 to-orange-500' },
    { text: t('chatbot.suggestionAddIncomeSource'), action: 'add_income_source', icon: 'Plus', color: 'from-green-500 to-emerald-500' },
    { text: t('chatbot.suggestionIncomeEvolution'), action: 'income_evolution', icon: 'TrendingUp', color: 'from-purple-500 to-violet-500' },
    { text: t('chatbot.suggestionMainMenu'), action: 'goto_main', icon: 'Home', color: 'from-gray-500 to-slate-500' }
  ];

  // Suggestions pour l'analyse
  const getAnalysisSuggestions = () => [
    { text: t('chatbot.suggestionFullAnalysis'), action: 'full_analysis', icon: 'BarChart3', color: 'from-blue-500 to-cyan-500' },
    { text: t('chatbot.suggestionPredictions'), action: 'predictions', icon: 'Crystal', color: 'from-purple-500 to-violet-500' },
    { text: t('chatbot.suggestionAdvice'), action: 'get_advice', icon: 'Lightbulb', color: 'from-yellow-500 to-orange-500' },
    { text: t('chatbot.suggestionTrends'), action: 'view_trends', icon: 'TrendingUp', color: 'from-green-500 to-emerald-500' },
    { text: t('chatbot.suggestionMainMenu'), action: 'goto_main', icon: 'Home', color: 'from-gray-500 to-slate-500' }
  ];

  // FONCTIONS D'ANALYSE DES DONNÉES

  const analyzeExpenses = () => {
    const totalSpent = computedValues?.totalSpent || 0;
    const totalBudget = computedValues?.totalBudget || 1;
    const pieData = computedValues?.pieChartData || [];
    const biggestCategory = pieData.reduce((a, b) => (a.value > b.value ? a : b), { name: t('chatbot.none'), value: 0 });
    
    let analysis = t('chatbot.expensesAnalysisTitle') + '\n\n';
    analysis += t('chatbot.expensesTotal', { amount: formatCurrency(totalSpent) }) + '\n';
    analysis += t('chatbot.expensesBudgetUsed', { percent: ((totalSpent / totalBudget) * 100).toFixed(1) }) + '\n';
    
    if (biggestCategory.name !== t('chatbot.none')) {
      const percentage = ((biggestCategory.value / totalSpent) * 100).toFixed(1);
      analysis += t('chatbot.expensesBiggestCategory', { name: biggestCategory.name, amount: formatCurrency(biggestCategory.value), percent: percentage }) + '\n\n';
    }
    
    if (pieData.length > 0) {
      analysis += t('chatbot.expensesBreakdown') + '\n';
      pieData.forEach(cat => {
        const percentage = ((cat.value / totalSpent) * 100).toFixed(1);
        analysis += t('chatbot.expensesCategoryItem', { name: cat.name, amount: formatCurrency(cat.value), percent: percentage }) + '\n';
      });
    }
    
    if (totalSpent > totalBudget) {
      analysis += '\n' + t('chatbot.expensesOverBudget', { amount: formatCurrency(totalSpent - totalBudget) });
    } else {
      analysis += '\n' + t('chatbot.expensesUnderBudget', { amount: formatCurrency(totalBudget - totalSpent) });
    }
    
    return analysis;
  };
  
  const analyzeSavings = () => {
    const savingsRate = computedValues?.savingsRate || 0;
    const totalSavings = computedValues?.totalSavings || 0;
    const goals = state.savingsGoals || [];
    
    let analysis = t('chatbot.savingsAnalysisTitle') + '\n\n';
    analysis += t('chatbot.savingsRate', { rate: savingsRate.toFixed(1) }) + '\n';
    analysis += t('chatbot.totalSavings', { amount: formatCurrency(totalSavings) }) + '\n';
    analysis += t('chatbot.goalsNumber', { count: goals.length }) + '\n\n';
    
    if (goals.length > 0) {
      analysis += t('chatbot.yourGoals') + '\n';
      goals.forEach(goal => {
        const progress = ((goal.currentAmount / goal.targetAmount) * 100).toFixed(1);
        analysis += t('chatbot.goalProgress', { 
          name: goal.name, 
          progress: progress, 
          current: formatCurrency(goal.currentAmount), 
          target: formatCurrency(goal.targetAmount) 
        }) + '\n';
      });
    }
    
    // Conseils
    if (savingsRate < 10) {
      analysis += '\n' + t('chatbot.savingsAdviceLow');
    } else if (savingsRate >= 20) {
      analysis += '\n' + t('chatbot.savingsAdviceGood');
    }
    
    return analysis;
  };

  const generateFullAnalysis = () => {
    const totalSpent = computedValues?.totalSpent || 0;
    const totalBudget = computedValues?.totalBudget || 1;
    const savingsRate = computedValues?.savingsRate || 0;
    const monthlyIncome = state.monthlyIncome || 0;
    const currentSavings = monthlyIncome - totalSpent;
    
    let analysis = t('chatbot.fullAnalysisTitle') + '\n\n';
    analysis += t('chatbot.income') + ': ' + formatCurrency(monthlyIncome) + '\n';
    analysis += t('chatbot.expenses') + ': ' + formatCurrency(totalSpent) + ' (' + ((totalSpent / totalBudget) * 100).toFixed(1) + t('chatbot.percentBudget') + ')\n';
    analysis += t('chatbot.savings') + ': ' + formatCurrency(currentSavings) + ' (' + savingsRate.toFixed(1) + '%)\n\n';
    
    // Évaluation globale
    let evaluation = '';
    if (savingsRate >= 20) {
      evaluation = t('chatbot.excellentFinances');
    } else if (savingsRate >= 10) {
      evaluation = t('chatbot.goodFinances');
    } else if (savingsRate >= 0) {
      evaluation = t('chatbot.warningFinances');
    } else {
      evaluation = t('chatbot.alertFinances');
    }
    
    analysis += evaluation;
    
    return analysis;
  };
  
  const generatePredictions = () => {
    const totalSpent = computedValues?.totalSpent || 0;
    const monthlyIncome = state.monthlyIncome || 0;
    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    const currentDay = new Date().getDate();
    const remainingDays = daysInMonth - currentDay;
    
    const averageDailySpending = totalSpent / currentDay;
    const projectedSpending = totalSpent + (averageDailySpending * remainingDays);
    const projectedSavings = monthlyIncome - projectedSpending;
    
    let prediction = t('chatbot.predictionsTitle') + '\n\n';
    prediction += t('chatbot.remainingDays', { days: remainingDays }) + '\n';
    prediction += t('chatbot.projectedSpending', { amount: formatCurrency(projectedSpending) }) + '\n';
    prediction += t('chatbot.projectedSavings', { amount: formatCurrency(projectedSavings) }) + '\n\n';
    
    if (projectedSavings > 0) {
      prediction += t('chatbot.positiveProjection');
    } else {
      prediction += t('chatbot.warningProjection');
    }
    
    return prediction;
  };
  
  const generateAdvice = () => {
    const savingsRate = computedValues?.savingsRate || 0;
    const totalSpent = computedValues?.totalSpent || 0;
    const totalBudget = computedValues?.totalBudget || 1;
    const budgetUsage = (totalSpent / totalBudget) * 100;
    
    let advice = t('chatbot.adviceTitle') + '\n\n';
    
    if (budgetUsage > 100) {
      advice += t('chatbot.urgentAdvice') + '\n\n';
    }
    
    if (savingsRate < 10) {
      advice += t('chatbot.savingsAdvice') + '\n\n';
    }
    
    if (savingsRate >= 20) {
      advice += t('chatbot.excellentAdvice') + '\n\n';
    }
    
    advice += t('chatbot.generalAdvice');
    
    return advice;
  };

  // GESTION DES ACTIONS

  const executeAction = async (action, data = null) => {
    console.log('🔍 EXECUTE_ACTION - Début:', { action, data });
    let response = '';
    let newSuggestions = [];
    let newState = chatState;
    let newContextData = contextData;

    try {
      switch (action) {
        // Navigation principale
        case 'goto_main':
          console.log('🔄 Action: goto_main');
          response = getWelcomeMessage();
          newSuggestions = getMainSuggestions();
          newState = 'welcome';
          newContextData = null;
        break;
      
        case 'goto_expenses':
          console.log('🔄 Action: goto_expenses');
          response = t('chatbot.expensesMenu');
          newSuggestions = getExpensesSuggestions();
          newState = 'expenses';
        break;
      
        case 'goto_savings':
          console.log('🔄 Action: goto_savings');
          response = t('chatbot.savingsMenu');
          newSuggestions = getSavingsSuggestions();
          newState = 'savings';
        break;
      
        case 'goto_income':
          console.log('🔄 Action: goto_income');
          response = t('chatbot.incomeMenu');
          newSuggestions = getIncomeSuggestions();
          newState = 'income';
        break;
      
        case 'goto_analysis':
          console.log('🔄 Action: goto_analysis');
          response = t('chatbot.analysisMenu');
          newSuggestions = getAnalysisSuggestions();
          newState = 'analysis';
        break;
      
        // Actions des dépenses
      case 'add_expense':
          console.log('🔄 Action: add_expense');
          response = t('chatbot.addExpensePrompt');
          
          // Utiliser les catégories existantes ou des catégories par défaut
          const availableCategories = (state.categories || []).length > 0 
            ? state.categories 
            : [
                { id: 1, name: t('chatbot.categoryFood'), budget: 400, color: '#10B981' },
                { id: 2, name: t('chatbot.categoryTransport'), budget: 200, color: '#F59E0B' },
                { id: 3, name: t('chatbot.categoryEntertainment'), budget: 150, color: '#8B5CF6' },
                { id: 4, name: t('chatbot.categoryHealth'), budget: 100, color: '#EF4444' }
              ];
          
          newSuggestions = [
            ...availableCategories.slice(0, 4).map(cat => ({
              text: `💳 ${cat.name}`,
              action: 'select_category',
              data: cat,
            icon: 'CreditCard',
            color: 'from-blue-500 to-cyan-500'
          })),
            { text: t('chatbot.back'), action: 'goto_expenses', icon: 'ArrowLeft', color: 'from-gray-500 to-slate-500' }
          ];
          newState = 'adding_expense';
        break;
      
        case 'select_category':
          console.log('🔄 Action: select_category', data);
          newContextData = data;
          response = t('chatbot.selectCategoryPrompt', { category: data.name });
          
        newSuggestions = [
            { text: '💶 10€', action: 'quick_amount', data: { amount: 10, category: data }, icon: 'Euro', color: 'from-green-500 to-emerald-500' },
            { text: '💶 25€', action: 'quick_amount', data: { amount: 25, category: data }, icon: 'Euro', color: 'from-blue-500 to-cyan-500' },
            { text: '💶 50€', action: 'quick_amount', data: { amount: 50, category: data }, icon: 'Euro', color: 'from-purple-500 to-violet-500' },
            { text: '💶 100€', action: 'quick_amount', data: { amount: 100, category: data }, icon: 'Euro', color: 'from-orange-500 to-red-500' },
            { text: t('chatbot.customAmount'), action: 'custom_amount', data: { category: data }, icon: 'Edit', color: 'from-gray-500 to-slate-500' },
            { text: t('chatbot.back'), action: 'add_expense', icon: 'ArrowLeft', color: 'from-gray-500 to-slate-500' }
          ];
          newState = 'selecting_amount';
        break;
      
        case 'quick_amount':
          console.log('🔄 Action: quick_amount', data);
          const { amount: expenseAmount, category } = data;
          const expense = {
            date: new Date().toISOString().split('T')[0],
            category: category.name,
            amount: expenseAmount,
            description: t('chatbot.expenseDescription', { category: category.name, amount: formatCurrency(expenseAmount) })
          };
          
          console.log('📝 Tentative d\'ajout de dépense:', expense);
          const success = actions.addExpense(expense);
          console.log('✅ Résultat ajout dépense:', success);
          
          if (success) {
            response = t('chatbot.expenseAddedSuccess', { 
              amount: formatCurrency(expenseAmount), 
              category: category.name, 
              date: new Date().toLocaleDateString(t('chatbot.locale'))
            });
        newSuggestions = [
              { text: t('chatbot.addAnother'), action: 'add_expense', icon: 'Plus', color: 'from-green-500 to-emerald-500' },
              { text: t('chatbot.viewExpenses'), action: 'view_expenses', icon: 'List', color: 'from-blue-500 to-cyan-500' },
              { text: t('chatbot.home'), action: 'goto_main', icon: 'Home', color: 'from-gray-500 to-slate-500' }
            ];
          } else {
            response = t('chatbot.expenseAddedError');
        newSuggestions = [
              { text: t('chatbot.retry'), action: 'add_expense', icon: 'RotateCcw', color: 'from-blue-500 to-cyan-500' },
              { text: t('chatbot.back'), action: 'goto_expenses', icon: 'ArrowLeft', color: 'from-gray-500 to-slate-500' }
            ];
          }
          newState = 'expenses';
          newContextData = null;
        break;
      
        case 'custom_amount':
          newContextData = data;
          response = t('chatbot.customAmountPrompt');
          
        newSuggestions = [
            { text: t('chatbot.back'), action: 'select_category', data: data, icon: 'ArrowLeft', color: 'from-gray-500 to-slate-500' }
        ];
          newState = 'custom_amount_input';
        break;
      
        case 'add_expense_with_description':
          const { amount: customAmount, category: customCategory, description } = data;
          const expenseWithDesc = {
            date: new Date().toISOString().split('T')[0],
            category: customCategory.name,
            amount: customAmount,
            description: description || t('chatbot.expenseDescription', { category: customCategory.name, amount: formatCurrency(customAmount) })
          };
          
          if (actions.addExpense(expenseWithDesc)) {
            response = t('chatbot.expenseAddedSuccessWithDesc', { 
              amount: formatCurrency(customAmount), 
              category: customCategory.name, 
              description: description || t('chatbot.expenseDescription', { category: customCategory.name, amount: formatCurrency(customAmount) }),
              date: new Date().toLocaleDateString(t('chatbot.locale'))
            });
        newSuggestions = [
              { text: t('chatbot.addAnother'), action: 'add_expense', icon: 'Plus', color: 'from-green-500 to-emerald-500' },
              { text: t('chatbot.viewExpenses'), action: 'view_expenses', icon: 'List', color: 'from-blue-500 to-cyan-500' },
              { text: t('chatbot.home'), action: 'goto_main', icon: 'Home', color: 'from-gray-500 to-slate-500' }
            ];
          } else {
            response = t('chatbot.expenseAddedError');
        newSuggestions = [
              { text: t('chatbot.retry'), action: 'add_expense', icon: 'RotateCcw', color: 'from-blue-500 to-cyan-500' },
              { text: t('chatbot.back'), action: 'goto_expenses', icon: 'ArrowLeft', color: 'from-gray-500 to-slate-500' }
        ];
          }
          newState = 'expenses';
          newContextData = null;
        break;
      
        case 'view_expenses':
          const currentExpenses = computedValues?.currentMonthExpenses || [];
          const totalSpent = computedValues?.totalSpent || 0;
          
          response = t('chatbot.viewExpensesTitle') + '\n\n' + 
                    t('chatbot.viewExpensesTotal', { amount: formatCurrency(totalSpent) }) + '\n' +
                    t('chatbot.viewExpensesCount', { count: currentExpenses.length }) + '\n\n';
          
          if (currentExpenses.length > 0) {
            response += t('chatbot.viewExpensesRecent') + '\n';
            currentExpenses.slice(-5).forEach(exp => {
              response += t('chatbot.expenseItem', { 
                description: exp.description, 
                amount: formatCurrency(exp.amount), 
                category: exp.category 
              }) + '\n';
            });
        } else {
            response += t('chatbot.noExpenses');
        }
          
          newSuggestions = getExpensesSuggestions();
        break;
      
        case 'analyze_expenses':
          response = analyzeExpenses();
          newSuggestions = getExpensesSuggestions();
        break;
      
        case 'manage_categories':
          console.log('🔄 Action: manage_categories');
          const categories = state.categories || [];
          response = t('chatbot.manageCategoriesTitle') + '\n\n' + 
                    t('chatbot.categoriesCount', { count: categories.length }) + '\n\n';
          
          if (categories.length > 0) {
            response += t('chatbot.currentCategories') + '\n';
            categories.forEach(cat => {
              response += t('chatbot.categoryItem', { name: cat.name, budget: formatCurrency(cat.budget) }) + '\n';
            });
          } else {
            response += t('chatbot.noCategories');
          }
          
          newSuggestions = [
            { text: t('chatbot.newCategory'), action: 'add_category', icon: 'Plus', color: 'from-green-500 to-emerald-500' },
            { text: t('chatbot.editCategory'), action: 'edit_category', icon: 'Edit', color: 'from-blue-500 to-cyan-500' },
            { text: t('chatbot.deleteCategory'), action: 'delete_category', icon: 'Trash2', color: 'from-red-500 to-pink-500' },
            { text: t('chatbot.back'), action: 'goto_expenses', icon: 'ArrowLeft', color: 'from-gray-500 to-slate-500' }
          ];
          newState = 'managing_categories';
        break;
      
        case 'add_category':
          console.log('🔄 Action: add_category');
          response = t('chatbot.addCategoryPrompt');
          newSuggestions = [
            { text: t('chatbot.back'), action: 'manage_categories', icon: 'ArrowLeft', color: 'from-gray-500 to-slate-500' }
          ];
          newState = 'adding_category';
        break;
      
        case 'create_preset_category':
          console.log('🔄 Action: create_preset_category', data);
          const { name: categoryName, budget: categoryBudget } = data;
          const categoryData = {
            name: categoryName,
            budget: categoryBudget
          };
          
          if (actions.addCategory(categoryData)) {
            response = t('chatbot.categoryCreatedSuccess', { name: categoryName, budget: formatCurrency(categoryBudget) });
            newSuggestions = [
              { text: t('chatbot.addAnother'), action: 'add_category', icon: 'Plus', color: 'from-green-500 to-emerald-500' },
              { text: t('chatbot.manageCategories'), action: 'manage_categories', icon: 'FolderPlus', color: 'from-blue-500 to-cyan-500' },
              { text: t('chatbot.home'), action: 'goto_main', icon: 'Home', color: 'from-gray-500 to-slate-500' }
            ];
          } else {
            response = t('chatbot.categoryCreatedError');
            newSuggestions = [
              { text: t('chatbot.retry'), action: 'add_category', icon: 'RotateCcw', color: 'from-blue-500 to-cyan-500' },
              { text: t('chatbot.back'), action: 'manage_categories', icon: 'ArrowLeft', color: 'from-gray-500 to-slate-500' }
            ];
          }
          newState = 'managing_categories';
        break;
      
        // Actions de l'épargne
        case 'view_goals':
          const goals = state.savingsGoals || [];
          response = t('chatbot.viewGoalsTitle') + '\n\n' + 
                    t('chatbot.goalsCount', { count: goals.length }) + '\n\n';
          
          if (goals.length > 0) {
            goals.forEach(goal => {
              const progress = ((goal.currentAmount / goal.targetAmount) * 100).toFixed(1);
              response += t('chatbot.goalItem', { 
                name: goal.name, 
                current: formatCurrency(goal.currentAmount), 
                target: formatCurrency(goal.targetAmount), 
                progress: progress 
              }) + '\n\n';
            });
        } else {
            response += t('chatbot.noGoals');
        }
          
          newSuggestions = getSavingsSuggestions();
          newState = 'savings';
        break;
      
        case 'add_goal':
          response = t('chatbot.addGoalPrompt');
          newSuggestions = [
            { text: t('chatbot.back'), action: 'goto_savings', icon: 'ArrowLeft', color: 'from-gray-500 to-slate-500' }
          ];
          newState = 'adding_goal';
        break;
      
        case 'create_preset_goal':
          const { name, amount: goalAmount } = data;
          const goalData = {
            name: name,
            targetAmount: goalAmount,
            currentAmount: 0
          };
          
          if (actions.addSavingsGoal(goalData)) {
            response = t('chatbot.goalCreatedSuccess', { name: name, amount: formatCurrency(goalAmount) });
            newSuggestions = [
              { text: t('chatbot.yes'), action: 'add_savings', icon: 'Plus', color: 'from-green-500 to-emerald-500' },
              { text: t('chatbot.no'), action: 'view_goals', icon: 'Target', color: 'from-blue-500 to-cyan-500' }
            ];
            newState = 'goal_created';
          } else {
            response = t('chatbot.goalCreatedError');
            newSuggestions = [
              { text: t('chatbot.retry'), action: 'add_goal', icon: 'RotateCcw', color: 'from-blue-500 to-cyan-500' },
              { text: t('chatbot.back'), action: 'goto_savings', icon: 'ArrowLeft', color: 'from-gray-500 to-slate-500' }
            ];
            newState = 'savings';
          }
        break;
      
        case 'add_savings':
          const availableGoals = state.savingsGoals || [];
          if (availableGoals.length === 0) {
            response = t('chatbot.noGoalsForSavings');
        newSuggestions = [
              { text: t('chatbot.createGoal'), action: 'add_goal', icon: 'Target', color: 'from-green-500 to-emerald-500' },
              { text: t('chatbot.back'), action: 'goto_savings', icon: 'ArrowLeft', color: 'from-gray-500 to-slate-500' }
            ];
          } else {
            response = t('chatbot.selectGoalPrompt');
        newSuggestions = [
              ...availableGoals.map(goal => ({
                text: `🎯 ${goal.name}`,
                action: 'select_goal_for_savings',
                data: goal,
                icon: 'Target',
                color: 'from-green-500 to-emerald-500'
              })),
              { text: t('chatbot.back'), action: 'goto_savings', icon: 'ArrowLeft', color: 'from-gray-500 to-slate-500' }
            ];
          }
          newState = 'selecting_goal';
        break;
      
        case 'select_goal_for_savings':
          newContextData = data;
          const remaining = data.targetAmount - data.currentAmount;
          response = t('chatbot.goalSelectedPrompt', { 
            name: data.name, 
            current: formatCurrency(data.currentAmount), 
            target: formatCurrency(data.targetAmount), 
            remaining: formatCurrency(remaining) 
          });
          
        newSuggestions = [
            { text: '💶 50€', action: 'add_to_goal', data: { goal: data, amount: 50 }, icon: 'Euro', color: 'from-green-500 to-emerald-500' },
            { text: '💶 100€', action: 'add_to_goal', data: { goal: data, amount: 100 }, icon: 'Euro', color: 'from-blue-500 to-cyan-500' },
            { text: '💶 200€', action: 'add_to_goal', data: { goal: data, amount: 200 }, icon: 'Euro', color: 'from-purple-500 to-violet-500' },
            { text: '💶 500€', action: 'add_to_goal', data: { goal: data, amount: 500 }, icon: 'Euro', color: 'from-orange-500 to-red-500' },
            { text: t('chatbot.back'), action: 'add_savings', icon: 'ArrowLeft', color: 'from-gray-500 to-slate-500' }
          ];
          newState = 'adding_to_goal';
        break;
      
        case 'add_to_goal':
          const { goal, amount: savingsAmount } = data;
          const transactionData = {
            amount: savingsAmount,
            description: t('chatbot.savingsDescription', { amount: formatCurrency(savingsAmount) }),
            type: 'add',
            date: new Date().toISOString().split('T')[0]
          };
          
          if (actions.addSavingsTransaction(goal.id, transactionData)) {
            const newTotal = Math.min(goal.currentAmount + savingsAmount, goal.targetAmount);
            const newProgress = ((newTotal / goal.targetAmount) * 100).toFixed(1);
            
            response = t('chatbot.savingsAddedSuccess', { 
              goal: goal.name, 
              amount: formatCurrency(savingsAmount), 
              total: formatCurrency(newTotal), 
              target: formatCurrency(goal.targetAmount), 
              progress: newProgress 
            });
            
        newSuggestions = [
              { text: t('chatbot.addMore'), action: 'add_savings', icon: 'Plus', color: 'from-green-500 to-emerald-500' },
              { text: t('chatbot.viewGoals'), action: 'view_goals', icon: 'Target', color: 'from-blue-500 to-cyan-500' },
              { text: t('chatbot.home'), action: 'goto_main', icon: 'Home', color: 'from-gray-500 to-slate-500' }
            ];
          } else {
            response = t('chatbot.savingsAddedError');
        newSuggestions = [
              { text: t('chatbot.retry'), action: 'add_savings', icon: 'RotateCcw', color: 'from-blue-500 to-cyan-500' },
              { text: t('chatbot.back'), action: 'goto_savings', icon: 'ArrowLeft', color: 'from-gray-500 to-slate-500' }
        ];
          }
          newState = 'savings';
          newContextData = null;
        break;
      
        case 'savings_progress':
          response = analyzeSavings();
          newSuggestions = getSavingsSuggestions();
        break;
      
        // Actions des revenus
        case 'view_income':
          const monthlyIncome = state.monthlyIncome || 0;
          const revenues = state.revenues || [];
          const totalRevenues = revenues.reduce((sum, rev) => sum + rev.amount, 0);
          
          response = t('chatbot.viewIncomeTitle') + '\n\n' + 
                    t('chatbot.monthlyIncome', { amount: formatCurrency(monthlyIncome) }) + '\n' +
                    t('chatbot.activeSources', { count: revenues.filter(r => r.active).length }) + '\n' +
                    t('chatbot.totalSources', { amount: formatCurrency(totalRevenues) }) + '\n\n';
          
          if (revenues.length > 0) {
            response += t('chatbot.incomeSources') + '\n';
            revenues.forEach(rev => {
              const status = rev.active ? '✅' : '❌';
              response += t('chatbot.incomeSourceItem', { 
                status: status, 
                name: rev.name, 
                amount: formatCurrency(rev.amount), 
                frequency: rev.frequency 
              }) + '\n';
            });
        } else {
            response += t('chatbot.noIncomeSources');
          }
          
          newSuggestions = getIncomeSuggestions();
        break;
      
        case 'set_monthly_income':
          response = t('chatbot.setIncomePrompt', { current: formatCurrency(state.monthlyIncome || 0) });
          
        newSuggestions = [
            { text: '💶 2000€', action: 'set_income_amount', data: 2000, icon: 'Euro', color: 'from-green-500 to-emerald-500' },
            { text: '💶 3000€', action: 'set_income_amount', data: 3000, icon: 'Euro', color: 'from-blue-500 to-cyan-500' },
            { text: '💶 4000€', action: 'set_income_amount', data: 4000, icon: 'Euro', color: 'from-purple-500 to-violet-500' },
            { text: '💶 5000€', action: 'set_income_amount', data: 5000, icon: 'Euro', color: 'from-orange-500 to-red-500' },
            { text: t('chatbot.back'), action: 'goto_income', icon: 'ArrowLeft', color: 'from-gray-500 to-slate-500' }
          ];
          newState = 'setting_income';
        break;
      
        case 'set_income_amount':
          const newIncome = data;
          actions.setMonthlyIncome(newIncome);
          response = t('chatbot.incomeUpdatedSuccess', { amount: formatCurrency(newIncome) });
          
        newSuggestions = [
            { text: t('chatbot.viewIncome'), action: 'view_income', icon: 'DollarSign', color: 'from-yellow-500 to-orange-500' },
            { text: t('chatbot.fullAnalysis'), action: 'full_analysis', icon: 'BarChart3', color: 'from-blue-500 to-cyan-500' },
            { text: t('chatbot.home'), action: 'goto_main', icon: 'Home', color: 'from-gray-500 to-slate-500' }
        ];
          newState = 'income';
        break;
      
        // Actions d'analyse
        case 'full_analysis':
          response = generateFullAnalysis();
          newSuggestions = getAnalysisSuggestions();
        break;
      
        case 'predictions':
          response = generatePredictions();
          newSuggestions = getAnalysisSuggestions();
        break;
      
        case 'get_advice':
          response = generateAdvice();
          newSuggestions = getAnalysisSuggestions();
        break;
      
        case 'view_trends':
          const monthlyData = computedValues?.monthlyData || [];
          response = t('chatbot.trendsTitle') + '\n\n' + t('chatbot.evolutionSixMonths') + '\n\n';
          
          monthlyData.forEach(month => {
            response += t('chatbot.monthData', { 
              month: month.month, 
              income: formatCurrency(month.income), 
              expenses: formatCurrency(month.expenses) 
            }) + '\n';
          });
          
          response += '\n' + t('chatbot.trendsAdvice');
          newSuggestions = getAnalysisSuggestions();
        break;
      
        case 'delete_category':
          const categoriesToDelete = state.categories || [];
          if (categoriesToDelete.length === 0) {
            response = t('chatbot.noCategoriesDelete');
            newSuggestions = [
              { text: t('chatbot.back'), action: 'manage_categories', icon: 'ArrowLeft', color: 'from-gray-500 to-slate-500' }
            ];
          } else {
            response = t('chatbot.deleteCategoryPrompt');
            newSuggestions = [
              ...categoriesToDelete.map(cat => ({
                text: `🗑️ ${cat.name}`,
                action: 'ask_confirm_delete_category',
                data: cat,
                icon: 'Trash2',
                color: 'from-red-500 to-pink-500'
              })),
              { text: t('chatbot.back'), action: 'manage_categories', icon: 'ArrowLeft', color: 'from-gray-500 to-slate-500' }
            ];
          }
          newState = 'deleting_category';
        break;

        case 'ask_confirm_delete_category':
          response = t('chatbot.confirmDeleteCategory', { name: data.name });
          newSuggestions = [
            { text: t('chatbot.confirm'), action: 'confirm_delete_category', data: data, icon: 'Check', color: 'from-green-500 to-emerald-500' },
            { text: t('chatbot.cancel'), action: 'delete_category', icon: 'X', color: 'from-gray-500 to-slate-500' }
          ];
          newState = 'confirming_delete_category';
        break;

        case 'confirm_delete_category':
          if (actions.deleteCategory(data.id) !== false) {
            response = t('chatbot.categoryDeletedSuccess', { name: data.name });
          } else {
            response = t('chatbot.categoryDeletedError');
          }
          newSuggestions = [
            { text: t('chatbot.manageCategories'), action: 'manage_categories', icon: 'FolderPlus', color: 'from-blue-500 to-cyan-500' },
            { text: t('chatbot.home'), action: 'goto_main', icon: 'Home', color: 'from-gray-500 to-slate-500' }
          ];
          newState = 'managing_categories';
        break;
      
        case 'add_income_source':
          response = t('chatbot.addIncomeSourcePrompt');
          newSuggestions = [
            { text: t('chatbot.back'), action: 'goto_income', icon: 'ArrowLeft', color: 'from-gray-500 to-slate-500' }
          ];
          newState = 'adding_income_source';
        break;
      
        case 'create_income_source':
          if (actions.addRevenue && actions.addRevenue({
            name: data.name,
            amount: data.amount,
            type: 'fixed',
            frequency: 'monthly',
            description: ''
          })) {
            response = t('chatbot.incomeSourceCreatedSuccess', { name: data.name, amount: formatCurrency(data.amount) });
            newSuggestions = getIncomeSuggestions();
            newState = 'income';
          } else {
            response = t('chatbot.incomeSourceCreatedError');
            newSuggestions = [
              { text: t('chatbot.retry'), action: 'add_income_source', icon: 'RotateCcw', color: 'from-blue-500 to-cyan-500' },
              { text: t('chatbot.back'), action: 'goto_income', icon: 'ArrowLeft', color: 'from-gray-500 to-slate-500' }
            ];
            newState = 'income';
          }
        break;
      
        case 'income_evolution':
          response = t('chatbot.incomeEvolutionMessage');
          newSuggestions = getIncomeSuggestions();
          newState = 'income';
        break;
      
      default:
          response = t('chatbot.actionNotRecognized');
          newSuggestions = getMainSuggestions();
          newState = 'welcome';
        break;
      }
    } catch (error) {
      console.error('Erreur lors de l\'exécution de l\'action:', error);
      response = t('chatbot.errorOccurred');
      newSuggestions = getMainSuggestions();
      newState = 'welcome';
    }

    setChatState(newState);
    setContextData(newContextData);
    return { response, suggestions: newSuggestions };
  };

  // GESTION DES MESSAGES TEXTE

  const parseTextMessage = (text) => {
    const lowerText = text.toLowerCase().trim();
    
    // Reconnaissance d'ajout de dépense avec montant
    const expenseMatch = text.match(/^(\d+(?:\.\d{2})?)\s+(\w+)\s+(.+)$/);
    if (expenseMatch && chatState === 'adding_expense') {
      const [, amount, categoryName, description] = expenseMatch;
      const category = state.categories?.find(cat => 
        cat.name.toLowerCase().includes(categoryName.toLowerCase())
      );
          
          if (category) {
        return {
          action: 'quick_amount',
          data: {
            amount: parseFloat(amount),
            category: category,
            description: description
          }
        };
      }
    }

    // Reconnaissance d'ajout avec catégorie sélectionnée
    const amountDescMatch = text.match(/^(\d+(?:\.\d{2})?)\s+(.+)$/);
    if (amountDescMatch && chatState === 'selecting_amount' && contextData) {
      const [, amount, description] = amountDescMatch;
      return {
        action: 'add_expense_with_description',
        data: {
          amount: parseFloat(amount),
          category: contextData,
          description: description
        }
      };
    }

    // Reconnaissance de montant personnalisé pour dépense
    if (chatState === 'custom_amount_input' && contextData && /^\d+(\.\d{2})?$/.test(text)) {
      return {
        action: 'add_expense_with_description',
        data: {
          amount: parseFloat(text),
          category: contextData.category,
          description: t('chatbot.expenseDescription', { category: contextData.category.name, amount: formatCurrency(parseFloat(text)) })
        }
      };
    }

    // Reconnaissance de montant pour épargne
    if (chatState === 'adding_to_goal' && contextData && /^\d+(\.\d{2})?$/.test(text)) {
      return {
        action: 'add_to_goal',
        data: {
          goal: contextData,
          amount: parseFloat(text)
        }
      };
    }

    // Reconnaissance d'objectif d'épargne
    const goalMatch = text.match(/^(.+?)\s+(\d+)$/);
    if (goalMatch && chatState === 'adding_goal') {
      const [, name, amount] = goalMatch;
      return {
        action: 'create_preset_goal',
        data: {
          name: name.trim(),
          amount: parseInt(amount)
        }
      };
    }

    // Reconnaissance de revenu mensuel
    if (chatState === 'setting_income' && /^\d+$/.test(text)) {
      return {
        action: 'set_income_amount',
        data: parseInt(text)
      };
    }

    // Reconnaissance de création de catégorie
    const categoryMatch = text.match(/^(.+?)\s+(\d+)$/);
    if (categoryMatch && chatState === 'adding_category') {
      const [, name, budget] = categoryMatch;
      return {
        action: 'create_preset_category',
        data: {
          name: name.trim(),
          budget: parseInt(budget)
        }
      };
    }

    // Messages génériques avec traduction
    if (lowerText.includes(t('chatbot.helloKeywords')) || lowerText.includes('hello')) {
      return { action: 'goto_main' };
    }

    if (lowerText.includes(t('chatbot.expenseKeywords'))) {
      return { action: 'goto_expenses' };
    }

    if (lowerText.includes(t('chatbot.savingsKeywords'))) {
      return { action: 'goto_savings' };
    }

    if (lowerText.includes(t('chatbot.incomeKeywords'))) {
      return { action: 'goto_income' };
    }

    if (lowerText.includes(t('chatbot.analysisKeywords'))) {
      return { action: 'full_analysis' };
    }

    // Reconnaissance de 'oui' ou 'yes' après création d'un objectif
    if (chatState === 'goal_created' && (lowerText === t('chatbot.yesKeyword') || lowerText === 'yes')) {
      return { action: 'add_savings' };
    }

    // Reconnaissance d'ajout de source de revenu
    const incomeSourceMatch = text.match(/^(.+?)\s+(\d+)$/);
    if (incomeSourceMatch && chatState === 'adding_income_source') {
      const [, name, amount] = incomeSourceMatch;
      return {
        action: 'create_income_source',
        data: {
          name: name.trim(),
          amount: parseInt(amount)
        }
      };
    }

    // Retour au menu par défaut
    return { action: 'goto_main' };
  };

  // Action spéciale pour ajouter une dépense avec description
  const handleAddExpenseWithDescription = async (data) => {
    const { amount, category, description } = data;
    const expense = {
      date: new Date().toISOString().split('T')[0],
      category: category.name,
      amount: amount,
      description: description || t('chatbot.expenseDescription', { category: category.name, amount: formatCurrency(amount) })
    };
    
    if (actions.addExpense(expense)) {
      return {
        response: t('chatbot.expenseAddedSuccessWithDesc', { 
          amount: formatCurrency(amount), 
          category: category.name, 
          description: description,
          date: new Date().toLocaleDateString(t('chatbot.locale'))
        }),
        suggestions: [
          { text: t('chatbot.addAnother'), action: 'add_expense', icon: 'Plus', color: 'from-green-500 to-emerald-500' },
          { text: t('chatbot.viewExpenses'), action: 'view_expenses', icon: 'List', color: 'from-blue-500 to-cyan-500' },
          { text: t('chatbot.home'), action: 'goto_main', icon: 'Home', color: 'from-gray-500 to-slate-500' }
        ]
      };
    } else {
      return {
        response: t('chatbot.expenseAddedError'),
        suggestions: [
          { text: t('chatbot.retry'), action: 'add_expense', icon: 'RotateCcw', color: 'from-blue-500 to-cyan-500' },
          { text: t('chatbot.back'), action: 'goto_expenses', icon: 'ArrowLeft', color: 'from-gray-500 to-slate-500' }
        ]
      };
    }
  };

  // GESTION DES SUGGESTIONS

  const handleSuggestionClick = useCallback(async (suggestion) => {
    console.log('🎯 CLICK_SUGGESTION - Début:', suggestion);
    let result;
    
    if (suggestion.action === 'add_expense_with_description') {
      console.log('📝 Gestion add_expense_with_description');
      result = await handleAddExpenseWithDescription(suggestion.data);
    } else {
      console.log('⚡ Exécution action:', suggestion.action);
      result = await executeAction(suggestion.action, suggestion.data);
    }
    
    console.log('📤 Résultat action:', result);
    
    const newMessage = {
      id: Date.now(),
      from: 'bot',
      text: result.response,
      suggestions: result.suggestions
    };
    
    console.log('💬 Nouveau message:', newMessage);
    setMessages(prev => [...prev, newMessage]);
  }, [chatState, contextData, state, actions, formatCurrency]);

  // GESTION DES MESSAGES UTILISATEUR

  const simulateTyping = useCallback(async (result) => {
    console.log('⌨️ SIMULATE_TYPING - Début');
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    setIsTyping(false);
    
    const botMessage = {
      id: Date.now() + 1,
      from: 'bot',
      text: result.response,
      suggestions: result.suggestions
    };
    
    console.log('🤖 Message bot créé:', botMessage);
    setMessages(prev => [...prev, botMessage]);
  }, []);

  const handleSend = useCallback(async () => {
    if (!input.trim()) return;
    
    console.log('📤 HANDLE_SEND - Début avec input:', input);
    const userMessage = { id: Date.now(), from: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    
    const parsedMessage = parseTextMessage(input);
    console.log('🔍 Message parsé:', parsedMessage);
    setInput('');
    
    let result;
    if (parsedMessage.action === 'add_expense_with_description') {
      console.log('📝 Gestion add_expense_with_description via texte');
      result = await handleAddExpenseWithDescription(parsedMessage.data);
    } else {
      console.log('⚡ Exécution action via texte:', parsedMessage.action);
      result = await executeAction(parsedMessage.action, parsedMessage.data);
    }
    
    console.log('📤 Résultat action texte:', result);
    await simulateTyping(result);
  }, [input, chatState, contextData, parseTextMessage, handleAddExpenseWithDescription, executeAction, simulateTyping]);

  // INTERFACE UTILISATEUR

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="relative w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group overflow-hidden"
          aria-label={t('chatbot.openAssistant')}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 gradient-animate opacity-75 group-hover:opacity-100 transition-opacity"></div>
          <Icons.Bot className="h-6 w-6 relative z-10 group-hover:scale-110 transition-transform duration-300" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse shadow-lg">
            <div className="absolute inset-0.5 bg-green-300 rounded-full"></div>
          </div>
          <div className="absolute inset-0 rounded-full shimmer-effect"></div>
        </button>
        <FloatingParticles />
      </div>
    );
  }

  if (isMinimized) {
    return (
      <div 
        className="fixed bottom-4 right-4 z-40 slide-in-elegant"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          cursor: isDragging ? 'grabbing' : 'default'
        }}
      >
        <div className="glass-morphism rounded-2xl shadow-lg text-gray-900 dark:text-white overflow-hidden relative max-w-xs">
          <FloatingParticles />
          
          <div 
            className="relative px-4 py-3 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 gradient-animate text-white rounded-2xl cursor-grab active:cursor-grabbing"
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
          >
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm float-animation">
                  <Icons.Bot className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">{t('chatbot.aiAssistant')}</h3>
                  <p className="text-xs text-white/80">{t('chatbot.clickToExpand')}</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setIsMinimized(false)}
                  className="text-white/80 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10 backdrop-blur-sm"
                  aria-label={t('chatbot.expandAssistant')}
                >
                  <Icons.Maximize2 className="h-3 w-3" />
                </button>
                <button
                  onClick={() => setIsOpen(false)} 
                  className="text-white/80 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10 backdrop-blur-sm"
                  aria-label={t('chatbot.closeAssistant')}
                >
                  <Icons.X className="h-3 w-3" />
                </button>
              </div>
            </div>
            <div className="absolute inset-0 shimmer-effect rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed bottom-4 right-4 w-[380px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)] z-40 slide-in-elegant"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        cursor: isDragging ? 'grabbing' : 'default'
      }}
    >
      <div className="glass-morphism rounded-2xl shadow-xl text-gray-900 dark:text-white flex flex-col overflow-hidden relative h-[700px] max-h-[calc(100vh-2rem)]">
        <FloatingParticles />
        
        {/* Header */}
        <div 
          className="relative px-4 py-4 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 gradient-animate text-white rounded-t-2xl cursor-grab active:cursor-grabbing"
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
        >
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm float-animation">
                <Icons.Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-base">{t('chatbot.aiAssistant')}</h3>
                <p className="text-xs text-white/80">{t('chatbot.onlineStatus')}</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white/80 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10 backdrop-blur-sm"
                aria-label={t('chatbot.minimizeAssistant')}
              >
                <Icons.Minimize2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)} 
                className="text-white/80 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10 backdrop-blur-sm"
                aria-label={t('chatbot.closeAssistant')}
              >
                <Icons.X className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="absolute inset-0 shimmer-effect rounded-t-2xl"></div>
        </div>
        
        {/* Suggestions fixes en haut */}
        {messages.length > 0 && messages[messages.length - 1].suggestions && !isTyping && chatState !== 'goal_created' && (
          <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 border-b border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400 font-medium text-center mb-2">
              ✨ {t('chatbot.quickActions')}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {messages[messages.length - 1].suggestions.map((suggestion, index) => {
                const IconComponent = Icons[suggestion.icon] || Icons.MessageCircle;
                return (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={`group relative overflow-hidden rounded-xl p-3 text-xs font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg bg-gradient-to-r ${suggestion.color || 'from-blue-500 to-purple-500'} text-white shadow-md hover:shadow-xl`}
                  >
                    <div className="flex items-center justify-center mb-1">
                      <IconComponent className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="text-xs leading-tight">{suggestion.text}</div>
                    <div className="absolute inset-0 shimmer-effect rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth min-h-0">
          {messages.map((msg, index) => (
            <div key={msg.id} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'} slide-in-elegant`} style={{animationDelay: `${index * 0.1}s`}}>
              <div className={`rounded-2xl px-4 py-3 text-sm max-w-[85%] shadow-md relative overflow-hidden ${
                msg.from === 'user' 
                  ? 'message-bubble-user text-white ml-auto' 
                  : 'message-bubble-bot text-gray-900 dark:text-gray-100'
              }`}>
                {msg.from === 'bot' && (
                  <div className="flex items-center mb-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mr-2">
                      <Icons.Brain className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{t('chatbot.aiAssistant')}</span>
                  </div>
                )}
                
                <div className="relative z-10 whitespace-pre-wrap">
                  {msg.text.split('\n').map((line, index) => (
                    <div key={index} className="leading-relaxed mb-1">
                      {line.startsWith('**') && line.endsWith('**') ? (
                        <strong className="text-purple-600 dark:text-purple-400 text-sm">{line.slice(2, -2)}</strong>
                      ) : line.startsWith('•') ? (
                        <div className="ml-3 flex items-start">
                          <span className="text-purple-500 mr-2 font-bold">•</span>
                          <span>{line.slice(1)}</span>
                        </div>
                      ) : (
                        line
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Suggestions inline pour l'état goal_created */}
                {msg.from === 'bot' && msg.suggestions && chatState === 'goal_created' && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-2">
                      {t('chatbot.respond')}:
                    </div>
                    <div className="flex space-x-2">
                      {msg.suggestions.map((suggestion, index) => {
                        const IconComponent = Icons[suggestion.icon] || Icons.MessageCircle;
                        return (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className={`flex-1 group relative overflow-hidden rounded-lg p-2 text-xs font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg bg-gradient-to-r ${suggestion.color || 'from-blue-500 to-purple-500'} text-white shadow-md hover:shadow-xl`}
                          >
                            <div className="flex items-center justify-center space-x-1">
                              <IconComponent className="h-3 w-3 group-hover:scale-110 transition-transform duration-300" />
                              <span>{suggestion.text}</span>
                            </div>
                            <div className="absolute inset-0 shimmer-effect rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isTyping && <TypingIndicator t={t} />}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input */}
        <form 
          className="relative px-4 py-4 bg-gradient-to-r from-gray-50 via-white to-blue-50 dark:from-gray-800 dark:via-gray-900 dark:to-blue-900/20 rounded-b-2xl border-t border-gray-200 dark:border-gray-700 flex-shrink-0"
          onSubmit={e => { e.preventDefault(); handleSend(); }}
        >
          <div className="flex items-center space-x-3 relative">
            <div className="flex-1 relative">
              <input
                className="w-full bg-white/80 dark:bg-gray-800/80 px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 outline-none text-sm rounded-xl border-2 border-gray-200/50 dark:border-gray-700/50 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 backdrop-blur-sm"
                placeholder={t('chatbot.typeMessage')}
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={isTyping}
                autoFocus
              />
              {isTyping && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full typing-dot"></div>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full typing-dot" style={{animationDelay: '0.3s'}}></div>
                    <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full typing-dot" style={{animationDelay: '0.6s'}}></div>
                  </div>
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="relative p-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 group overflow-hidden"
              aria-label={t('chatbot.sendMessage')}
            >
              <Icons.Send className="h-4 w-4 group-hover:scale-110 group-hover:translate-x-1 transition-transform duration-300 relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 shimmer-effect rounded-xl"></div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

export default Chatbot;