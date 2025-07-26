// Service pour gérer la base de données locale
class DatabaseService {
  constructor() {
    // Utilise localStorage pour le web
  }

  // Gestion des utilisateurs
  async getUser() {
      const userData = localStorage.getItem('userData');
      return userData ? JSON.parse(userData) : {
        name: 'Utilisateur',
        currency: 'EUR',
        monthly_income: 0,
        initial_balance: 0,
        dark_mode: false,
        language: 'fr'
      };
  }

  async updateUser(userData) {
      localStorage.setItem('userData', JSON.stringify(userData));
      return { changes: 1 };
  }

  // Gestion des dépenses
  async getExpenses(month) {
      const expenses = localStorage.getItem('expenses');
      const allExpenses = expenses ? JSON.parse(expenses) : [];
      return allExpenses.filter(expense => expense.date.startsWith(month));
  }

  async addExpense(expense) {
      const expenses = localStorage.getItem('expenses');
      const allExpenses = expenses ? JSON.parse(expenses) : [];
      const newExpense = {
        id: Date.now(),
        ...expense,
        created_at: new Date().toISOString()
      };
      allExpenses.push(newExpense);
      localStorage.setItem('expenses', JSON.stringify(allExpenses));
      return { id: newExpense.id };
  }

  // Gestion des catégories
  async getCategories() {
      const categories = localStorage.getItem('categories');
      return categories ? JSON.parse(categories) : [];
  }

  async addCategory(category) {
      const categories = localStorage.getItem('categories');
      const allCategories = categories ? JSON.parse(categories) : [];
      const newCategory = {
        id: Date.now(),
        ...category
      };
      allCategories.push(newCategory);
      localStorage.setItem('categories', JSON.stringify(allCategories));
      return { id: newCategory.id };
    }

  // Initialisation (pas nécessaire pour localStorage)
  async initDatabase() {
    // Pas d'initialisation nécessaire pour localStorage
  }
}

export default new DatabaseService(); 