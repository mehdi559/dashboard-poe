import React, { memo, useCallback } from 'react';
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
      </div>
    </div>
  );
});

export default FinancialTools; 