import React, { memo, useState, useRef, useCallback, useEffect } from 'react';
import * as Icons from 'lucide-react';

// Styles personnalisés pour l'interface
const customStyles = `
  @keyframes slide-in-elegant {
    0% { transform: translateY(20px) scale(0.95); opacity: 0; }
    100% { transform: translateY(0) scale(1); opacity: 1; }
  }
  
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  
  .slide-in-elegant { animation: slide-in-elegant 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
  .shimmer-effect {
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
    background-size: 200% 100%;
    animation: shimmer 2s infinite;
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
`;

const QuickExpensePanel = memo(({ financeManager, theme, t }) => {
  const { state, actions, computedValues, formatCurrency } = financeManager;
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [description, setDescription] = useState('');
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Injection des styles CSS
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = customStyles;
    document.head.appendChild(styleSheet);
    return () => document.head.removeChild(styleSheet);
  }, []);

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

  // Sélectionner automatiquement la première catégorie
  useEffect(() => {
    if (state.categories && state.categories.length > 0 && !selectedCategory) {
      setSelectedCategory(state.categories[0].name);
    }
  }, [state.categories, selectedCategory]);

  const handleAddExpense = useCallback(() => {
    if (!amount || !selectedCategory) return;

    const expense = {
      date: new Date().toISOString().split('T')[0],
      category: selectedCategory,
      amount: parseFloat(amount.replace(',', '.')),
      description: description || `Dépense ${selectedCategory}`
    };

    if (actions.addExpense(expense)) {
      setShowSuccess(true);
      setAmount('');
      setDescription('');
      
      // Réinitialiser après 2 secondes
      setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
    }
  }, [amount, selectedCategory, description, actions]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      handleAddExpense();
    }
  }, [handleAddExpense]);

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="relative w-16 h-16 rounded-full bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group overflow-hidden"
          aria-label={t('addQuickExpense')}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 opacity-75 group-hover:opacity-100 transition-opacity"></div>
          <Icons.Plus className="h-6 w-6 relative z-10 group-hover:scale-110 transition-transform duration-300" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse shadow-lg">
            <div className="absolute inset-0.5 bg-green-300 rounded-full"></div>
          </div>
        </button>
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
          {/* Header réduit */}
          <div 
            className="relative px-4 py-3 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white rounded-2xl cursor-grab active:cursor-grabbing"
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
          >
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <Icons.Plus className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">{t('quickExpense')}</h3>
                  <p className="text-xs text-white/80">{t('clickToExpand')}</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setIsMinimized(false)}
                  className="text-white/80 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10 backdrop-blur-sm"
                  aria-label={t('maximizePanel')}
                >
                  <Icons.Maximize2 className="h-3 w-3" />
                </button>
                <button
                  onClick={() => setIsOpen(false)} 
                  className="text-white/80 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10 backdrop-blur-sm"
                  aria-label={t('closePanel')}
                >
                  <Icons.X className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed bottom-4 right-4 w-[380px] max-w-[calc(100vw-2rem)] z-40 slide-in-elegant"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        cursor: isDragging ? 'grabbing' : 'default'
      }}
    >
      <div className="glass-morphism rounded-2xl shadow-xl text-gray-900 dark:text-white flex flex-col overflow-hidden relative">
        {/* Header */}
        <div 
          className="relative px-4 py-4 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white rounded-t-2xl cursor-grab active:cursor-grabbing"
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
        >
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Icons.Plus className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-base">{t('quickExpense')}</h3>
                <p className="text-xs text-white/80">{t('addExpenseQuickly')}</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white/80 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10 backdrop-blur-sm"
                aria-label={t('minimizePanel')}
              >
                <Icons.Minimize2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)} 
                className="text-white/80 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10 backdrop-blur-sm"
                aria-label={t('closePanel')}
              >
                <Icons.X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Contenu du panneau */}
        <div className="p-4 space-y-4">
          {/* Message de succès */}
          {showSuccess && (
            <div className="bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg p-3 flex items-center space-x-2">
              <Icons.CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span className="text-sm text-green-800 dark:text-green-200">{t('expenseAddedSuccessfully')}</span>
            </div>
          )}

          {/* Champ Montant */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('amount')} *
            </label>
            <div className="relative">
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="0.00"
                className="w-full bg-white/80 dark:bg-gray-800/80 px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 outline-none text-lg font-medium rounded-xl border-2 border-gray-200/50 dark:border-gray-700/50 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-300 backdrop-blur-sm"
                autoFocus
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
                €
              </div>
            </div>
          </div>

          {/* Sélecteur de Catégorie */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('category')} *
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-white/80 dark:bg-gray-800/80 px-4 py-3 text-gray-900 dark:text-white outline-none text-base rounded-xl border-2 border-gray-200/50 dark:border-gray-700/50 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-300 backdrop-blur-sm"
            >
              {state.categories?.map((category) => (
                <option key={category.name} value={category.name}>
                  {category.name}
                </option>
              )) || (
                <option value="">{t('noCategories')}</option>
              )}
            </select>
          </div>

          {/* Champ Description (optionnel) */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('description')} ({t('optional')})
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t('expenseDescription')}
              className="w-full bg-white/80 dark:bg-gray-800/80 px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 outline-none text-sm rounded-xl border-2 border-gray-200/50 dark:border-gray-700/50 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-300 backdrop-blur-sm"
            />
          </div>

          {/* Bouton d'ajout */}
          <button
            onClick={handleAddExpense}
            disabled={!amount || !selectedCategory}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 px-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 group overflow-hidden"
          >
            <div className="flex items-center justify-center space-x-2">
              <Icons.Plus className="h-5 w-5" />
              <span>{t('addExpense')}</span>
            </div>
          </button>

          {/* Raccourcis rapides */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('quickAmounts')}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[5, 10, 15, 20, 25, 50].map((quickAmount) => (
                <button
                  key={quickAmount}
                  onClick={() => setAmount(quickAmount.toString())}
                  className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                >
                  {quickAmount}€
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default QuickExpensePanel; 