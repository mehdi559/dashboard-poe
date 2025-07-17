import React, { memo, useCallback, useState } from 'react';
import * as Icons from 'lucide-react';
import Button from './Button';
import Input from './Input';

// Déclaration de WidgetCard avec la prop theme
const WidgetCard = memo(({ title, icon: Icon, children, color = 'blue', className = '', theme }) => (
  <div className={`${theme.card} rounded-xl border ${theme.border} overflow-hidden ${className}`}>
    <div className={`p-4 bg-gradient-to-r from-${color}-500/10 to-${color}-600/10 border-b ${theme.border}`}>
      <div className="flex items-center space-x-3">
        <Icon className={`h-5 w-5 text-${color}-600`} />
        <h3 className={`font-semibold ${theme.text}`}>{title}</h3>
      </div>
    </div>
    <div className="p-4">{children}</div>
  </div>
));

const FinancialTools = memo(({ financeManager, theme, t }) => {
  const { state, actions, computedValues, formatCurrency } = financeManager;
  
  console.log('FinancialTools rendered', { state, theme, t });

  // Calculateur d'impôts simplifié
  const getTaxEstimation = useCallback((revenue) => {
    // Simulation simple d'impôts (à adapter selon les pays)
    const taxBrackets = [
      { min: 0, max: 10000, rate: 0 },
      { min: 10000, max: 25000, rate: 0.11 },
      { min: 25000, max: 75000, rate: 0.30 },
      { min: 75000, max: Infinity, rate: 0.41 }
    ];
    
    let tax = 0;
    let remaining = revenue;
    
    for (const bracket of taxBrackets) {
      if (remaining <= 0) break;
      
      const taxableInBracket = Math.min(remaining, bracket.max - bracket.min);
      tax += taxableInBracket * bracket.rate;
      remaining -= taxableInBracket;
    }
    
    return {
      grossRevenue: revenue,
      tax: Math.round(tax),
      netRevenue: Math.round(revenue - tax),
      taxRate: (tax / revenue) * 100
    };
  }, []);

  // Calculer le solde actuel basé sur les revenus, dépenses ET solde initial
  const getCurrentBalance = React.useMemo(() => {
    const totalRevenue = state.revenues?.reduce((sum, rev) => sum + rev.amount, 0) || state.monthlyIncome;
    const totalExpenses = computedValues.totalSpent;
    const totalRecurring = computedValues.totalRecurring || 0;
    const initialBalance = state.initialBalance || 0;
    return {
      current: initialBalance + totalRevenue - totalExpenses - totalRecurring,
      totalRevenue,
      projectedEndMonth: initialBalance + totalRevenue - (totalExpenses * 1.2) - totalRecurring,
      savingsThisMonth: totalRevenue - totalExpenses
    };
  }, [state.revenues, state.monthlyIncome, computedValues.totalSpent, computedValues.totalRecurring, state.initialBalance]);

  const balance = getCurrentBalance;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <WidgetCard title={t('taxCalculator')} icon={Icons.Calculator} color="orange" theme={theme}>
          <div className="space-y-4">
            <Input
              label={t('annualGrossIncome')}
              type="number"
              value={state.taxCalculator?.grossIncome || balance.totalRevenue * 12}
              onChange={(value) => actions.updateForm && actions.updateForm('taxCalculator', { grossIncome: value })}
            />
            
            {(() => {
              const taxData = getTaxEstimation(state.taxCalculator?.grossIncome || balance.totalRevenue * 12);
              return (
                <div className={`p-4 rounded-lg ${theme.bg} border ${theme.border}`}>
                  <h5 className={`font-semibold ${theme.text} mb-3`}>{t('taxEstimation')}</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className={theme.textSecondary}>{t('grossIncome')}:</span>
                      <span className={theme.text}>{formatCurrency(taxData.grossRevenue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={theme.textSecondary}>{t('estimatedTax')}:</span>
                      <span className="text-red-600">{formatCurrency(taxData.tax)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={theme.textSecondary}>{t('netIncome')}:</span>
                      <span className="text-green-600 font-semibold">{formatCurrency(taxData.netRevenue)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className={theme.textSecondary}>{t('effectiveTaxRate')}:</span>
                      <span className={theme.text}>{taxData.taxRate.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </WidgetCard>

        <WidgetCard title={t('netGrossConverter')} icon={Icons.ArrowLeftRight} color="blue" theme={theme}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label={t('grossAmount')}
                type="number"
                value={state.converter?.gross || ''}
                onChange={(value) => {
                  actions.updateForm && actions.updateForm('converter', { 
                    gross: value,
                    net: value * 0.7 // Estimation simple
                  });
                }}
              />
              <Input
                label={t('netAmount')}
                type="number"
                value={state.converter?.net || ''}
                onChange={(value) => {
                  actions.updateForm && actions.updateForm('converter', { 
                    net: value,
                    gross: value / 0.7 // Estimation simple
                  });
                }}
              />
            </div>
            
            <div className={`p-3 rounded-lg ${theme.bg} border ${theme.border} text-center`}>
              <div className={`text-xs ${theme.textSecondary} mb-1`}>{t('conversionRate')}</div>
              <div className={`text-lg font-bold ${theme.text}`}>~70%</div>
              <div className={`text-xs ${theme.textSecondary}`}>{t('approximateAfterTaxes')}</div>
            </div>
          </div>
        </WidgetCard>

        <WidgetCard title={t('savingsSimulator')} icon={Icons.TrendingUp} color="green" theme={theme}>
          <div className="space-y-4">
            <Input
              label={t('monthlySavings')}
              type="number"
              value={state.savingsSimulator?.monthly || ''}
              onChange={(value) => actions.updateForm && actions.updateForm('savingsSimulator', { monthly: value })}
            />
            
            <Input
              label={t('interestRate')} 
              type="number"
              step="0.1"
              value={state.savingsSimulator?.rate || 3}
              onChange={(value) => actions.updateForm && actions.updateForm('savingsSimulator', { rate: value })}
            />
            
            <Input
              label={t('timeHorizonYears')}
              type="number"
              value={state.savingsSimulator?.years || 10}
              onChange={(value) => actions.updateForm && actions.updateForm('savingsSimulator', { years: value })}
            />
            
            {(() => {
              const monthly = parseFloat(state.savingsSimulator?.monthly || 0);
              const rate = parseFloat(state.savingsSimulator?.rate || 3) / 100 / 12;
              const years = parseFloat(state.savingsSimulator?.years || 10);
              const months = years * 12;
              
              const futureValue = monthly * (((1 + rate) ** months - 1) / rate);
              const totalContributions = monthly * months;
              const interest = futureValue - totalContributions;
              
              return (
                <div className={`p-4 rounded-lg ${theme.bg} border ${theme.border}`}>
                  <h5 className={`font-semibold ${theme.text} mb-3`}>{t('projectedResults')}</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className={theme.textSecondary}>{t('totalContributions')}:</span>
                      <span className={theme.text}>{formatCurrency(totalContributions)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={theme.textSecondary}>{t('interestEarned')}:</span>
                      <span className="text-green-600">{formatCurrency(interest)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className={`font-semibold ${theme.text}`}>{t('finalAmount')}:</span>
                      <span className="text-green-600 font-bold">{formatCurrency(futureValue)}</span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </WidgetCard>

        <WidgetCard title={t('financialRatios')} icon={Icons.BarChart} color="purple" theme={theme}>
          <div className="space-y-3">
            {[
              { 
                name: t('savingsRatio'), 
                value: (balance.savingsThisMonth / balance.totalRevenue) * 100,
                target: 20,
                unit: '%'
              },
              { 
                name: t('expenseRatio'), 
                value: (computedValues.totalSpent / balance.totalRevenue) * 100,
                target: 80,
                unit: '%',
                invert: true
              },
              { 
                name: t('emergencyFundRatio'), 
                value: (computedValues.totalSavings / computedValues.totalSpent) * 100,
                target: 300,
                unit: '%'
              }
            ].map((ratio, index) => (
              <div key={index} className={`p-3 rounded-lg border ${theme.border} ${theme.bg}`}>
                <div className="flex justify-between items-center mb-2">
                  <span className={`font-medium ${theme.text}`}>{ratio.name}</span>
                  <span className={`font-bold ${
                    ratio.invert 
                      ? (ratio.value <= ratio.target ? 'text-green-600' : 'text-red-600')
                      : (ratio.value >= ratio.target ? 'text-green-600' : 'text-yellow-600')
                  }`}>
                    {ratio.value.toFixed(1)}{ratio.unit}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className={theme.textSecondary}>{t('target')}: {ratio.target}{ratio.unit}</span>
                  <span className={`${
                    ratio.invert 
                      ? (ratio.value <= ratio.target ? 'text-green-600' : 'text-red-600')
                      : (ratio.value >= ratio.target ? 'text-green-600' : 'text-yellow-600')
                  }`}>
                    {ratio.invert 
                      ? (ratio.value <= ratio.target ? t('good') : t('high'))
                      : (ratio.value >= ratio.target ? t('achieved') : t('belowTarget'))
                    }
                  </span>
                </div>
              </div>
            ))}
          </div>
        </WidgetCard>

        {/* Simulateur de scénarios budgétaires */}
        <WidgetCard title="Simulateur de Scénarios" icon={Icons.Calculator} color="indigo" theme={theme}>
          <ScenarioSimulator 
            categories={state.categories}
            expenses={computedValues.currentMonthExpenses}
            theme={theme}
            t={t}
            formatCurrency={formatCurrency}
          />
        </WidgetCard>
      </div>
    </div>
  );
});

// Composant simulateur de scénarios
const ScenarioSimulator = memo(({ categories, expenses, theme, t, formatCurrency }) => {
  const [scenario, setScenario] = useState({
    incomeChange: 0,
    categoryChanges: {},
    timeframe: 3
  });
  
  const [simulation, setSimulation] = useState(null);

  const runSimulation = () => {
    const totalBudget = categories.reduce((sum, cat) => sum + cat.budget, 0);
    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    
    const newBudget = totalBudget * (1 + scenario.incomeChange / 100);
    const projectedSavings = (newBudget - totalSpent) * scenario.timeframe;
    
    setSimulation({
      originalBudget: totalBudget,
      newBudget,
      projectedSavings,
      timeframe: scenario.timeframe
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className={`block text-sm font-medium ${theme.text} mb-2`}>
          Changement de Revenu (%)
        </label>
        <input
          type="range"
          min="-50"
          max="50"
          value={scenario.incomeChange}
          onChange={(e) => setScenario(prev => ({ ...prev, incomeChange: parseInt(e.target.value) }))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>-50%</span>
          <span className="font-medium">{scenario.incomeChange}%</span>
          <span>+50%</span>
        </div>
      </div>

      <div>
        <label className={`block text-sm font-medium ${theme.text} mb-2`}>
          Période (Mois)
        </label>
        <select
          value={scenario.timeframe}
          onChange={(e) => setScenario(prev => ({ ...prev, timeframe: parseInt(e.target.value) }))}
          className={`w-full p-2 rounded border ${theme.border} ${theme.input} text-black dark:text-white bg-white dark:bg-gray-800`}
        >
          <option value={1}>1 Mois</option>
          <option value={3}>3 Mois</option>
          <option value={6}>6 Mois</option>
          <option value={12}>1 Année</option>
        </select>
      </div>

      <Button onClick={runSimulation} className="w-full">
        <Icons.Play className="h-4 w-4 mr-2" />
        Lancer la Simulation
      </Button>

      {simulation && (
        <div className="mt-6 p-4 rounded-lg bg-purple-50 border border-purple-200 dark:bg-purple-900/20">
          <h4 className="font-medium mb-3">Résultats de la Simulation</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Budget Actuel:</span>
              <span className="font-medium">{formatCurrency(simulation.originalBudget)}</span>
            </div>
            <div className="flex justify-between">
              <span>Nouveau Budget:</span>
              <span className="font-medium">{formatCurrency(simulation.newBudget)}</span>
            </div>
            <div className="flex justify-between">
              <span>Épargne Prévue ({simulation.timeframe} Mois):</span>
              <span className="font-bold text-green-600">{formatCurrency(simulation.projectedSavings)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default FinancialTools; 