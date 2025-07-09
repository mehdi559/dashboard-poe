// Centralized state management for the finance app

export const initialState = {
  // UI State
  loading: false,
  darkMode: false,
  language: 'fr',
  showBalances: true,
  activeTab: 'dashboard',
  selectedMonth: new Date().toISOString().slice(0, 7),
  selectedYear: new Date().getFullYear(),
  // User Data
  userName: 'Utilisateur',
  selectedCurrency: 'EUR',
  monthlyIncome: 3500,
  // Financial Data
  categories: [
    { id: 1, name: 'housing', budget: 800, color: '#3B82F6' },
    { id: 2, name: 'food', budget: 400, color: '#10B981' },
    { id: 3, name: 'transport', budget: 200, color: '#F59E0B' },
    { id: 4, name: 'leisure', budget: 150, color: '#8B5CF6' },
    { id: 5, name: 'health', budget: 100, color: '#EF4444' }
  ],
  expenses: [
    { id: 1, date: '2025-01-15', category: 'food', amount: 45, description: 'Courses Carrefour' },
    { id: 2, date: '2025-01-14', category: 'transport', amount: 15, description: 'Métro' },
    { id: 3, date: '2025-01-13', category: 'leisure', amount: 25, description: 'Cinéma' }
  ],
  savingsGoals: [
    { 
      id: 1, 
      name: 'Vacances d\'été', 
      targetAmount: 2000, 
      currentAmount: 800, 
      color: '#3B82F6',
      transactions: [
        { id: 1, date: '2025-01-10', amount: 500, type: 'add', description: 'Virement initial' },
        { id: 2, date: '2025-01-15', amount: 300, type: 'add', description: 'Épargne mensuelle' }
      ]
    },
    { 
      id: 2, 
      name: 'Fonds d\'urgence', 
      targetAmount: 5000, 
      currentAmount: 2500, 
      color: '#10B981',
      transactions: [
        { id: 3, date: '2025-01-01', amount: 2000, type: 'add', description: 'Épargne initiale' },
        { id: 4, date: '2025-01-12', amount: 500, type: 'add', description: 'Bonus travail' }
      ]
    }
  ],
  recurringExpenses: [
    { id: 1, description: 'Netflix', category: 'leisure', amount: 15, dayOfMonth: 15, active: true },
    { id: 2, description: 'Spotify', category: 'leisure', amount: 10, dayOfMonth: 20, active: true }
  ],
  debts: [
    { id: 1, name: 'Prêt étudiant', balance: 15000, minPayment: 300, rate: 4.5, paymentHistory: [] },
    { id: 2, name: 'Carte de crédit', balance: 3000, minPayment: 150, rate: 18.9, paymentHistory: [] }
  ],
  // UI State for modals and forms
  modals: {
    income: false,
    currency: false,
    editExpense: false,
    editDebt: false,
    payment: false,
    category: false,
    import: false,
    export: false,
    editSaving: false
  },
  editingItem: null,
  // Search and filters
  searchTerm: '',
  categoryFilter: 'all',
  dateFilter: 'all',
  sortBy: 'date',
  sortOrder: 'desc',
  // Pagination
  currentPage: 1,
  itemsPerPage: 10,
  // Notifications
  notifications: [],
  // Error handling
  errors: {},
  // Form states
  newExpense: {
    date: new Date().toISOString().split('T')[0],
    category: '',
    amount: '',
    description: ''
  },
  newCategory: { name: '', budget: '' },
  newGoal: { name: '', targetAmount: '', currentAmount: '' },
  newRecurring: { description: '', category: '', amount: '', dayOfMonth: '' },
  newDebt: { name: '', balance: '', minPayment: '', rate: '' },
  paymentAmount: '',
  savingTransaction: { amount: '', description: '', type: 'add' }
};

export const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_DARK_MODE: 'SET_DARK_MODE',
  SET_LANGUAGE: 'SET_LANGUAGE',
  SET_SHOW_BALANCES: 'SET_SHOW_BALANCES',
  SET_ACTIVE_TAB: 'SET_ACTIVE_TAB',
  SET_SELECTED_MONTH: 'SET_SELECTED_MONTH',
  SET_SELECTED_YEAR: 'SET_SELECTED_YEAR',
  SET_USER_NAME: 'SET_USER_NAME',
  SET_CURRENCY: 'SET_CURRENCY',
  SET_MONTHLY_INCOME: 'SET_MONTHLY_INCOME',
  ADD_EXPENSE: 'ADD_EXPENSE',
  UPDATE_EXPENSE: 'UPDATE_EXPENSE',
  DELETE_EXPENSE: 'DELETE_EXPENSE',
  ADD_CATEGORY: 'ADD_CATEGORY',
  DELETE_CATEGORY: 'DELETE_CATEGORY',
  ADD_SAVINGS_GOAL: 'ADD_SAVINGS_GOAL',
  UPDATE_SAVINGS_GOAL: 'UPDATE_SAVINGS_GOAL',
  DELETE_SAVINGS_GOAL: 'DELETE_SAVINGS_GOAL',
  ADD_SAVINGS_TRANSACTION: 'ADD_SAVINGS_TRANSACTION',
  ADD_RECURRING: 'ADD_RECURRING',
  DELETE_RECURRING: 'DELETE_RECURRING',
  TOGGLE_RECURRING: 'TOGGLE_RECURRING',
  UPDATE_RECURRING: 'UPDATE_RECURRING',
  ADD_RECURRING_WITH_EXPENSE: 'ADD_RECURRING_WITH_EXPENSE',
  PROCESS_RECURRING_EXPENSES: 'PROCESS_RECURRING_EXPENSES',
  ADD_DEBT: 'ADD_DEBT',
  DELETE_DEBT: 'DELETE_DEBT',
  RECORD_PAYMENT: 'RECORD_PAYMENT',
  TOGGLE_MODAL: 'TOGGLE_MODAL',
  SET_EDITING_ITEM: 'SET_EDITING_ITEM',
  SET_SEARCH_TERM: 'SET_SEARCH_TERM',
  SET_CATEGORY_FILTER: 'SET_CATEGORY_FILTER',
  SET_DATE_FILTER: 'SET_DATE_FILTER',
  SET_SORT: 'SET_SORT',
  SET_PAGE: 'SET_PAGE',
  UPDATE_FORM: 'UPDATE_FORM',
  RESET_FORM: 'RESET_FORM',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  IMPORT_DATA: 'IMPORT_DATA',
  RESET_DATA: 'RESET_DATA',
  LOAD_FROM_STORAGE: 'LOAD_FROM_STORAGE',
  OPTIMIZE_BUDGETS: 'OPTIMIZE_BUDGETS',
  UPDATE_CATEGORY_BUDGET: 'UPDATE_CATEGORY_BUDGET'
};

export const financeReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case ACTIONS.SET_DARK_MODE:
      return { ...state, darkMode: action.payload };
    case ACTIONS.SET_LANGUAGE:
      return { ...state, language: action.payload };
    case ACTIONS.SET_SHOW_BALANCES:
      return { ...state, showBalances: action.payload };
    case ACTIONS.SET_ACTIVE_TAB:
      return { ...state, activeTab: action.payload };
    case ACTIONS.SET_SELECTED_MONTH:
      return { ...state, selectedMonth: action.payload };
    case ACTIONS.SET_SELECTED_YEAR:
      return { ...state, selectedYear: action.payload };
    case ACTIONS.SET_USER_NAME:
      return { ...state, userName: action.payload };
    case ACTIONS.SET_CURRENCY:
      return { ...state, selectedCurrency: action.payload };
    case ACTIONS.SET_MONTHLY_INCOME:
      return { ...state, monthlyIncome: action.payload };
    case ACTIONS.ADD_EXPENSE:
      return {
        ...state,
        expenses: [...state.expenses, { ...action.payload, id: Date.now() }]
      };
    case ACTIONS.UPDATE_EXPENSE:
      return {
        ...state,
        expenses: state.expenses.map(expense =>
          expense.id === action.payload.id ? action.payload : expense
        )
      };
    case ACTIONS.DELETE_EXPENSE:
      return {
        ...state,
        expenses: state.expenses.filter(expense => expense.id !== action.payload)
      };
    case ACTIONS.ADD_CATEGORY:
      return {
        ...state,
        categories: [...state.categories, {
          ...action.payload,
          id: Date.now(),
          color: `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`
        }]
      };
    case ACTIONS.DELETE_CATEGORY:
      return {
        ...state,
        categories: state.categories.filter(cat => cat.id !== action.payload),
        expenses: state.expenses.filter(exp => {
          const category = state.categories.find(cat => cat.id === action.payload);
          return exp.category !== category?.name;
        })
      };
    case ACTIONS.ADD_SAVINGS_GOAL:
      return {
        ...state,
        savingsGoals: [...state.savingsGoals, {
          ...action.payload,
          id: Date.now(),
          color: `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`,
          transactions: []
        }]
      };
    case ACTIONS.ADD_SAVINGS_TRANSACTION:
      return {
        ...state,
        savingsGoals: state.savingsGoals.map(goal =>
          goal.id === action.payload.goalId
            ? {
                ...goal,
                currentAmount: action.payload.type === 'add' 
                  ? Math.min(goal.currentAmount + action.payload.amount, goal.targetAmount)
                  : Math.max(0, goal.currentAmount - action.payload.amount),
                transactions: [...(goal.transactions || []), {
                  id: Date.now(),
                  date: new Date().toISOString().split('T')[0],
                  amount: action.payload.amount,
                  type: action.payload.type,
                  description: action.payload.description
                }]
              }
            : goal
        )
      };
    case ACTIONS.UPDATE_SAVINGS_GOAL:
      return {
        ...state,
        savingsGoals: state.savingsGoals.map(goal =>
          goal.id === action.payload.id
            ? { ...goal, currentAmount: Math.max(0, Math.min(goal.currentAmount + action.payload.amount, goal.targetAmount)) }
            : goal
        )
      };
    case ACTIONS.DELETE_SAVINGS_GOAL:
      return {
        ...state,
        savingsGoals: state.savingsGoals.filter(goal => goal.id !== action.payload)
      };
    case ACTIONS.ADD_RECURRING:
      return {
        ...state,
        recurringExpenses: [...state.recurringExpenses, { ...action.payload, id: Date.now(), active: true }]
      };
    case ACTIONS.UPDATE_RECURRING:
      return {
        ...state,
        recurringExpenses: state.recurringExpenses.map(exp =>
          exp.id === action.payload.id ? action.payload : exp
        )
      };
    case ACTIONS.ADD_RECURRING_WITH_EXPENSE:
      const { recurringData, expenseData } = action.payload;
      return {
        ...state,
        recurringExpenses: [...state.recurringExpenses, { 
          ...recurringData, 
          id: Date.now(), 
          active: true,
          lastProcessed: expenseData.date
        }],
        expenses: [...state.expenses, { 
          ...expenseData, 
          id: Date.now() + 1 
        }]
      };
    case ACTIONS.PROCESS_RECURRING_EXPENSES:
      const today = new Date();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();
      const newExpenses = [];
      
      const updatedRecurring = state.recurringExpenses.map(recurring => {
        if (!recurring.active) return recurring;
        
        const targetDate = new Date(currentYear, currentMonth, recurring.dayOfMonth);
        const lastProcessed = recurring.lastProcessed ? new Date(recurring.lastProcessed) : null;
        
        // Vérifier si on doit traiter cette récurrence
        const shouldProcess = !lastProcessed || 
          (targetDate.getMonth() !== lastProcessed.getMonth() || 
           targetDate.getFullYear() !== lastProcessed.getFullYear());
        
        if (shouldProcess && targetDate <= today) {
          newExpenses.push({
            id: Date.now() + Math.random(),
            date: targetDate.toISOString().split('T')[0],
            category: recurring.category,
            amount: recurring.amount,
            description: `${recurring.description} (récurrente)`
          });
          
          return {
            ...recurring,
            lastProcessed: targetDate.toISOString().split('T')[0]
          };
        }
        
        return recurring;
      });
      
      return {
        ...state,
        recurringExpenses: updatedRecurring,
        expenses: [...state.expenses, ...newExpenses]
      };
    case ACTIONS.DELETE_RECURRING:
      return {
        ...state,
        recurringExpenses: state.recurringExpenses.filter(exp => exp.id !== action.payload)
      };
    case ACTIONS.TOGGLE_RECURRING:
      return {
        ...state,
        recurringExpenses: state.recurringExpenses.map(exp =>
          exp.id === action.payload ? { ...exp, active: !exp.active } : exp
        )
      };
    case ACTIONS.ADD_DEBT:
      return {
        ...state,
        debts: [...state.debts, { ...action.payload, id: Date.now(), paymentHistory: [] }]
      };
    case ACTIONS.DELETE_DEBT:
      return {
        ...state,
        debts: state.debts.filter(debt => debt.id !== action.payload)
      };
    case ACTIONS.RECORD_PAYMENT:
      return {
        ...state,
        debts: state.debts.map(debt =>
          debt.id === action.payload.debtId
            ? {
                ...debt,
                balance: Math.max(0, debt.balance - action.payload.amount),
                paymentHistory: [...(debt.paymentHistory || []), {
                  id: Date.now(),
                  date: new Date().toISOString().split('T')[0],
                  amount: action.payload.amount
                }]
              }
            : debt
        )
      };
    case ACTIONS.TOGGLE_MODAL:
      return {
        ...state,
        modals: { ...state.modals, [action.payload.modal]: action.payload.isOpen }
      };
    case ACTIONS.SET_EDITING_ITEM:
      return { ...state, editingItem: action.payload };
    case ACTIONS.SET_SEARCH_TERM:
      return { ...state, searchTerm: action.payload, currentPage: 1 };
    case ACTIONS.SET_CATEGORY_FILTER:
      return { ...state, categoryFilter: action.payload, currentPage: 1 };
    case ACTIONS.SET_DATE_FILTER:
      return { ...state, dateFilter: action.payload, currentPage: 1 };
    case ACTIONS.SET_SORT:
      return {
        ...state,
        sortBy: action.payload.sortBy,
        sortOrder: state.sortBy === action.payload.sortBy
          ? state.sortOrder === 'asc' ? 'desc' : 'asc'
          : action.payload.sortOrder || 'desc'
      };
    case ACTIONS.SET_PAGE:
      return { ...state, currentPage: action.payload };
    case ACTIONS.UPDATE_FORM:
      return {
        ...state,
        [action.payload.form]: { ...state[action.payload.form], ...action.payload.data }
      };
    case ACTIONS.RESET_FORM:
      return {
        ...state,
        [action.payload]: initialState[action.payload]
      };
    case ACTIONS.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, { ...action.payload, id: action.payload.id || Date.now() }]
      };
    case ACTIONS.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(notif => notif.id !== action.payload)
      };
    case ACTIONS.SET_ERROR:
      return {
        ...state,
        errors: { ...state.errors, [action.payload.field]: action.payload.message }
      };
    case ACTIONS.CLEAR_ERROR:
      const newErrors = { ...state.errors };
      delete newErrors[action.payload];
      return { ...state, errors: newErrors };
    case ACTIONS.IMPORT_DATA:
      return { ...state, ...action.payload };
    case ACTIONS.LOAD_FROM_STORAGE:
      return { ...state, ...action.payload };
    case ACTIONS.RESET_DATA:
      return { ...initialState, ...action.payload };
    case ACTIONS.OPTIMIZE_BUDGETS:
      return {
        ...state,
        categories: state.categories.map(cat => ({
          ...cat,
          budget: action.payload[cat.name] !== undefined ? action.payload[cat.name] : cat.budget
        }))
      };
    case ACTIONS.UPDATE_CATEGORY_BUDGET:
      return {
        ...state,
        categories: state.categories.map(cat =>
          cat.id === action.payload.id ? { ...cat, budget: action.payload.budget } : cat
        )
      };
    default:
      return state;
  }
}; 