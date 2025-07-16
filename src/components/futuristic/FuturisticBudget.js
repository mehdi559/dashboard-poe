import React, { useState } from 'react';

const FuturisticBudget = ({ totalBudget, categories, onEditBudget, onDeleteCategory }) => {
  const [editingId, setEditingId] = useState(null);
  const [editedBudget, setEditedBudget] = useState('');

  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0);
  const overallPercentage = (totalSpent / totalBudget) * 100;
  const remainingBudget = totalBudget - totalSpent;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(Math.abs(amount));
  };

  const createProgressRing = (percentage, color) => {
    const size = 200;
    const strokeWidth = 12;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;
    return (
      <svg className="budget-ring" width={size} height={size}>
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          className="budget-ring-progress"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
    );
  };

  return (
    <div className="futuristic-budget">
      <div className="cyber-grid"></div>
      <div className="hologram-effects"></div>
      <div className="budget-header">
        <h1 className="budget-title">CYBER BUDGET</h1>
        <p className="neon-text" style={{ fontSize: '1.2rem', opacity: 0.8 }}>
          Interface Financière Avancée
        </p>
      </div>
      <div className="total-budget-display">
        <div className="budget-ring-container">
          {createProgressRing(overallPercentage, overallPercentage > 100 ? '#ff4757' : '#667eea')}
          <div className="budget-center-text">
            <div className="budget-amount">{formatCurrency(remainingBudget)}</div>
            <div className="budget-percentage">{Math.round(overallPercentage)}%</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>restant</div>
          </div>
        </div>
      </div>
      <div className="categories-grid">
        {categories.map((category, idx) => {
          const percentage = (category.spent / category.budget) * 100;
          const remaining = category.budget - category.spent;
          const isOverBudget = percentage > 100;
          const isEditing = editingId === category.id;
          return (
            <div
              key={category.id || idx}
              className="glass-card category-card"
              style={{ '--category-color': category.color }}
            >
              <div className="category-header">
                <div style={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                  <span className="category-icon">{category.icon}</span>
                  <span className="category-name">{category.name}</span>
                </div>
                <div className="category-amount" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {isEditing ? (
                    <>
                      <input
                        type="number"
                        min="0"
                        className="w-20 px-2 py-1 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        value={editedBudget}
                        onChange={e => setEditedBudget(e.target.value)}
                        style={{ marginRight: 4 }}
                      />
                      <button
                        className="text-green-500 hover:text-green-700 mr-1"
                        title="Valider"
                        onClick={() => {
                          onEditBudget(category.id, Number(editedBudget));
                          setEditingId(null);
                        }}
                      >
                        ✓
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700"
                        title="Annuler"
                        onClick={() => setEditingId(null)}
                      >
                        ✗
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="spent-amount">{formatCurrency(category.spent)}</span>
                      <span style={{ opacity: 0.6 }}> / </span>
                      <span>{formatCurrency(category.budget)}</span>
                      <button
                        className="ml-2 text-blue-400 hover:text-blue-600"
                        title="Éditer le budget"
                        onClick={() => {
                          setEditingId(category.id);
                          setEditedBudget(category.budget);
                        }}
                      >
                        ✎
                      </button>
                      <button
                        className="ml-2 text-red-400 hover:text-red-600"
                        title="Supprimer la catégorie"
                        onClick={() => onDeleteCategory(category.id)}
                      >
                        🗑️
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div className="progress-container">
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${Math.min(percentage, 100)}%`,
                      background: `linear-gradient(90deg, ${category.color}, rgba(255,255,255,0.8))`,
                    }}
                  ></div>
                  {isOverBudget && <div className="danger-indicator"></div>}
                </div>
              </div>
              <div className="spending-details">
                <span className={isOverBudget ? 'over-budget' : 'remaining-amount'}>
                  {isOverBudget
                    ? `Dépassement: ${formatCurrency(Math.abs(remaining))}`
                    : `Restant: ${formatCurrency(remaining)}`}
                </span>
                <span style={{ color: 'rgba(255,255,255,0.7)' }}>{Math.round(percentage)}%</span>
              </div>
            </div>
          );
        })}
      </div>
      <style>{`
        .futuristic-budget { background: linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%); min-height: 100vh; padding: 20px; position: relative; overflow: hidden; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }
        .cyber-grid { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-image: linear-gradient(rgba(102, 126, 234, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(102, 126, 234, 0.1) 1px, transparent 1px); background-size: 50px 50px; animation: gridMove 20s linear infinite; pointer-events: none; }
        @keyframes gridMove { 0% { transform: translate(0, 0); } 100% { transform: translate(50px, 50px); } }
        .hologram-effects { position: absolute; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none; background: linear-gradient(45deg, rgba(102, 126, 234, 0.05) 0%, transparent 25%, rgba(118, 75, 162, 0.05) 50%, transparent 75%, rgba(102, 126, 234, 0.05) 100%); background-size: 200% 200%; animation: hologramShift 6s ease-in-out infinite; }
        @keyframes hologramShift { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        .budget-header { text-align: center; margin-bottom: 40px; position: relative; z-index: 10; }
        .budget-title { font-size: 3rem; font-weight: 800; background: linear-gradient(45deg, #667eea, #764ba2, #f093fb); background-size: 200% 200%; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; animation: gradientFlow 3s ease-in-out infinite; margin-bottom: 10px; }
        @keyframes gradientFlow { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        .neon-text { color: #fff; text-shadow: 0 0 10px rgba(102, 126, 234, 0.8); font-weight: 600; }
        .total-budget-display { display: flex; justify-content: center; align-items: center; margin: 30px 0; position: relative; }
        .budget-ring-container { position: relative; width: 200px; height: 200px; }
        .budget-ring { transform: rotate(-90deg); filter: drop-shadow(0 0 20px rgba(102, 126, 234, 0.6)); }
        .budget-ring-progress { transition: stroke-dashoffset 2s cubic-bezier(0.4, 0, 0.2, 1); filter: url(#glow); }
        .budget-center-text { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; color: white; }
        .budget-amount { font-size: 1.8rem; font-weight: 700; margin-bottom: 5px; text-shadow: 0 0 10px rgba(102, 126, 234, 0.8); }
        .budget-percentage { font-size: 2.5rem; font-weight: 800; background: linear-gradient(45deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .categories-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 25px; margin-top: 40px; position: relative; z-index: 10; }
        .glass-card { background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px; box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); position: relative; overflow: hidden; }
        .glass-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent); }
        .glass-card:hover { transform: translateY(-5px); box-shadow: 0 35px 70px rgba(102, 126, 234, 0.3); border-color: rgba(102, 126, 234, 0.4); }
        .category-header { display: flex; justify-content: between; align-items: center; margin-bottom: 20px; }
        .category-icon { font-size: 2rem; margin-right: 15px; filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3)); }
        .category-name { font-size: 1.2rem; font-weight: 600; color: white; flex-grow: 1; }
        .category-amount { font-size: 1rem; font-weight: 500; color: rgba(255, 255, 255, 0.8); }
        .progress-container { position: relative; margin: 20px 0; }
        .progress-track { width: 100%; height: 8px; background: rgba(255, 255, 255, 0.1); border-radius: 10px; overflow: hidden; position: relative; }
        .progress-fill { height: 100%; border-radius: 10px; position: relative; transition: width 1.5s cubic-bezier(0.4, 0, 0.2, 1); background: linear-gradient(90deg, var(--category-color), rgba(255, 255, 255, 0.8)); box-shadow: 0 0 20px var(--category-color); }
        .danger-indicator { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); width: 10px; height: 10px; background: #ff4757; border-radius: 50%; animation: pulse 2s infinite; box-shadow: 0 0 15px #ff4757; }
        @keyframes pulse { 0%, 100% { opacity: 1; transform: translateY(-50%) scale(1); } 50% { opacity: 0.7; transform: translateY(-50%) scale(1.2); } }
        .spending-details { display: flex; justify-content: space-between; margin-top: 15px; font-size: 0.9rem; }
        .spent-amount { color: #ff6b6b; font-weight: 600; }
        .remaining-amount { color: #51cf66; font-weight: 600; }
        .over-budget { color: #ff4757 !important; font-weight: 700; text-shadow: 0 0 10px #ff4757; }
        @media (max-width: 768px) { .budget-title { font-size: 2rem; } .categories-grid { grid-template-columns: 1fr; } .budget-ring-container { width: 150px; height: 150px; } .budget-amount { font-size: 1.4rem; } .budget-percentage { font-size: 2rem; } }
      `}</style>
    </div>
  );
};

export default FuturisticBudget; 
