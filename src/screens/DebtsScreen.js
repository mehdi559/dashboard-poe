// DebtsScreen.js - Version enrichie
import React, { memo, useMemo, useState } from 'react';
import * as Icons from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const DebtsScreen = memo(({ financeManager, theme, t }) => {
  const { state, actions, computedValues, formatCurrency } = financeManager;
  const [selectedStrategy, setSelectedStrategy] = useState('snowball');
  const [simulationAmount, setSimulationAmount] = useState('');

  // Stratégies de remboursement
  const getRepaymentStrategies = useMemo(() => {
    const debts = [...state.debts].filter(debt => debt.balance > 0);
    
    // Stratégie boule de neige (plus petit solde d'abord)
    const snowball = debts.sort((a, b) => a.balance - b.balance);
    
    // Stratégie avalanche (plus haut taux d'abord)
    const avalanche = debts.sort((a, b) => b.rate - a.rate);
    
    // Calcul du temps et coût total pour chaque stratégie
    const calculateStrategy = (sortedDebts) => {
      let totalTime = 0;
      let totalInterest = 0;
      let extraPayment = parseFloat(simulationAmount) || 0;
      
      sortedDebts.forEach((debt, index) => {
        const monthlyPayment = debt.minPayment + (index === 0 ? extraPayment : 0);
        const monthsToPayOff = Math.ceil(debt.balance / monthlyPayment);
        const interestPaid = (monthlyPayment * monthsToPayOff) - debt.balance;
        
        totalTime = Math.max(totalTime, monthsToPayOff);
        totalInterest += interestPaid;
      });
      
      return { totalTime, totalInterest };
    };
    
    return {
      snowball: {
        name: t('snowball'),
        description: t('snowballDescription'),
        order: snowball,
        ...calculateStrategy(snowball),
        pros: [t('psychologicalMotivation'), t('quickWins'), t('simplification')],
        cons: [t('moreExpensiveInterest'), t('longer')],
        icon: Icons.Snowflake
      },
      avalanche: {
        name: t('avalanche'),
        description: t('avalancheDescription'),
        order: avalanche,
        ...calculateStrategy(avalanche),
        pros: [t('savesMostMoney'), t('faster'), t('mathematicallyOptimal')],
        cons: [t('lessMotivating'), t('slowerResults')],
        icon: Icons.Mountain
      }
    };
  }, [state.debts, simulationAmount, t]);

  // Simulateur avancé de remboursement
  const getAdvancedSimulation = useMemo(() => {
    if (!simulationAmount || simulationAmount <= 0) return null;
    
    const extraPayment = parseFloat(simulationAmount);
    const results = state.debts.map(debt => {
      if (debt.balance <= 0) return null;
      
      // Sans paiement supplémentaire
      const normalMonths = Math.ceil(debt.balance / debt.minPayment);
      const normalInterest = (debt.minPayment * normalMonths) - debt.balance;
      
      // Avec paiement supplémentaire
      const enhancedPayment = debt.minPayment + extraPayment;
      const enhancedMonths = Math.ceil(debt.balance / enhancedPayment);
      const enhancedInterest = (enhancedPayment * enhancedMonths) - debt.balance;
      
      const timeSaved = normalMonths - enhancedMonths;
      const interestSaved = normalInterest - enhancedInterest;
      
      return {
        ...debt,
        normalMonths,
        normalInterest,
        enhancedMonths,
        enhancedInterest,
        timeSaved,
        interestSaved
      };
    }).filter(Boolean);
    
    return results;
  }, [state.debts, simulationAmount]);

  // Score de santé des dettes
  const getDebtHealthScore = useMemo(() => {
    if (state.debts.length === 0) return { score: 100, level: 'excellent', color: 'green' };
    
    const totalDebt = computedValues.totalDebt;
    const monthlyIncome = state.monthlyIncome;
    const debtToIncomeRatio = (totalDebt / (monthlyIncome * 12)) * 100;
    
    let score = 100;
    let level = 'excellent';
    let color = 'green';
    
    // Pénalités basées sur différents facteurs
    if (debtToIncomeRatio > 36) score -= 30; // Ratio dette/revenu élevé
    if (debtToIncomeRatio > 20) score -= 20;
    
    // Pénalité pour taux élevés
    const avgRate = state.debts.reduce((sum, debt) => sum + debt.rate, 0) / state.debts.length;
    if (avgRate > 15) score -= 20;
    if (avgRate > 10) score -= 10;
    
    // Pénalité pour nombre de dettes
    if (state.debts.length > 5) score -= 15;
    if (state.debts.length > 3) score -= 10;
    
    score = Math.max(0, score);
    
    if (score >= 80) { level = 'excellent'; color = 'green'; }
    else if (score >= 60) { level = 'bon'; color = 'yellow'; }
    else if (score >= 40) { level = 'moyen'; color = 'orange'; }
    else { level = 'critique'; color = 'red'; }
    
    return { score, level, color, debtToIncomeRatio };
  }, [state.debts, computedValues.totalDebt, state.monthlyIncome]);

  // Conseils personnalisés de gestion des dettes
  const getPersonalizedAdvice = useMemo(() => {
    const advice = [];
    const healthScore = getDebtHealthScore;
    
    if (healthScore.debtToIncomeRatio > 36) {
      advice.push({
        type: 'critical',
        title: t('criticalDebtToIncomeRatio'),
        message: t('criticalRatioMessage'),
        icon: Icons.AlertTriangle
      });
    }
    
    const highRateDebts = state.debts.filter(debt => debt.rate > 15);
    if (highRateDebts.length > 0) {
      advice.push({
        type: 'warning',
        title: t('highInterestRatesDetected'),
        message: t('highRateMessage', { count: highRateDebts.length }),
        icon: Icons.TrendingUp
      });
    }
    
    const strategies = getRepaymentStrategies;
    const bestStrategy = strategies.avalanche.totalInterest < strategies.snowball.totalInterest ? 'avalanche' : 'snowball';
    advice.push({
      type: 'info',
      title: t('recommendedStrategy'),
      message: t('strategyMessage', { strategy: strategies[bestStrategy].name }),
      icon: Icons.Lightbulb
    });
    
    return advice;
  }, [state.debts, getDebtHealthScore, getRepaymentStrategies, t]);

  const healthScore = getDebtHealthScore;
  const strategies = getRepaymentStrategies;
  const simulation = getAdvancedSimulation;
  const advice = getPersonalizedAdvice;

  return (
    <div className="space-y-6 mt-[80px]">
      {/* Section principale - Gestion des dettes */}
      <div className={`${theme.card} rounded-xl border ${theme.border} p-6`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-2xl font-bold ${theme.text}`}>{t('debtManagement')}</h2>
          <div className="text-right">
            <p className={`text-2xl font-bold text-red-600`}>
              {state.showBalances ? formatCurrency(computedValues.totalDebt) : '•••'}
            </p>
            <p className={`text-sm ${theme.textSecondary}`}>{t('totalDebts')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <h3 className={`text-lg font-semibold ${theme.text} mb-4`}>{t('newDebt')}</h3>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (actions.addDebt(state.newDebt)) {
                  actions.resetForm('newDebt');
                }
              }}
              className="space-y-4"
            >
              <Input
                label={t('debtName')}
                type="text"
                value={state.newDebt.name}
                onChange={(value) => actions.updateForm('newDebt', { name: value })}
                error={state.errors.name}
                required
                minLength={2}
                maxLength={50}
              />
              <Input
                label={t('currentBalance')}
                type="number"
                step="0.01"
                min="0"
                value={state.newDebt.balance}
                onChange={(value) => actions.updateForm('newDebt', { balance: value })}
                error={state.errors.balance}
                required
              />
              <Input
                label={t('minimumPayment')}
                type="number"
                step="0.01"
                min="0"
                value={state.newDebt.minPayment}
                onChange={(value) => actions.updateForm('newDebt', { minPayment: value })}
                error={state.errors.minPayment}
                required
              />
              <Input
                label={t('interestRate')}
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={state.newDebt.rate}
                onChange={(value) => actions.updateForm('newDebt', { rate: value })}
                error={state.errors.rate}
                required
              />
              <Button
                type="submit"
                variant="danger"
                className="w-full"
                disabled={state.loading}
                loading={state.loading}
              >
                {t('addDebt')}
              </Button>
            </form>
          </div>
          <div className="lg:col-span-2">
            <h3 className={`text-lg font-semibold ${theme.text} mb-4`}>{t('yourDebtsWithAnalysis')}</h3>
            <div className="space-y-4">
              {state.debts.map(debt => {
                const monthsToPayOff = Math.ceil(debt.balance / debt.minPayment);
                const totalInterest = debt.balance * (debt.rate / 100 / 12) * monthsToPayOff;
                const progress = debt.balance > 0 ? ((debt.originalBalance || debt.balance) - debt.balance) / (debt.originalBalance || debt.balance) * 100 : 100;
                return (
                  <div key={debt.id} className={`${theme.card} border ${theme.border} rounded-lg p-4`}>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-3">
                        <h4 className={`font-semibold ${theme.text}`}>{debt.name}</h4>
                        {debt.autoDebit && (
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full flex items-center">
                            <Icons.CreditCard className="h-3 w-3 mr-1" />
                            {t('autoDebit')}
                          </span>
                        )}
                        {debt.rate > 15 && (
                          <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                            {t('highRate')}
                          </span>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            actions.setEditingItem(debt);
                            actions.toggleModal('editDebt', true);
                          }}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <Icons.Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => actions.toggleAutoDebit(debt.id)}
                          className={`${debt.autoDebit ? 'text-green-600 hover:text-green-800' : 'text-gray-500 hover:text-gray-700'}`}
                          title={debt.autoDebit ? t('disableAutoDebit') : t('enableAutoDebit')}
                        >
                          <Icons.CreditCard className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => actions.deleteDebt(debt.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Icons.Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Progression visuelle */}
                    {progress > 0 && (
                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span className={theme.textSecondary}>{t('repaymentProgress')}</span>
                          <span className={`font-medium text-green-600`}>{progress.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full transition-all"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className={`text-sm ${theme.textSecondary}`}>{t('balance')}</p>
                        <p className={`font-bold text-red-600`}>
                          {state.showBalances ? formatCurrency(debt.balance) : '•••'}
                        </p>
                      </div>
                      <div>
                        <p className={`text-sm ${theme.textSecondary}`}>{t('paymentMin')}</p>
                        <p className={`font-medium ${theme.text}`}>
                          {state.showBalances ? formatCurrency(debt.minPayment) : '•••'}
                        </p>
                      </div>
                      <div>
                        <p className={`text-sm ${theme.textSecondary}`}>{t('rate')}</p>
                        <p className={`font-medium ${debt.rate > 15 ? 'text-red-600' : debt.rate > 10 ? 'text-yellow-600' : 'text-green-600'}`}>
                          {debt.rate}%
                        </p>
                      </div>
                      <div>
                        <p className={`text-sm ${theme.textSecondary}`}>{t('remainingDuration')}</p>
                        <p className={`font-medium ${monthsToPayOff > 24 ? 'text-red-600' : 'text-green-600'}`}>
                          {monthsToPayOff} {t('months')}
                        </p>
                      </div>
                    </div>
                    
                    {state.showBalances && (
                      <div className={`mb-3 p-3 rounded-lg ${theme.bg} border ${theme.border}`}>
                        <p className={`text-xs ${theme.textSecondary} mb-1`}>{t('projectionWithMinimumPayments')}</p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className={theme.textSecondary}>{t('totalInterest')}</span>
                            <span className="font-medium text-red-600 ml-2">{formatCurrency(totalInterest)}</span>
                          </div>
                          <div>
                            <span className={theme.textSecondary}>{t('totalCost')}</span>
                            <span className="font-medium ml-2">{formatCurrency(debt.balance + totalInterest)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex space-x-2">
                      <Button
                        variant="success"
                        className="flex-1"
                        onClick={() => {
                          actions.setEditingItem(debt);
                          actions.toggleModal('payment', true);
                        }}
                      >
                        <Icons.CreditCard className="h-4 w-4 mr-2" />
                        {t('recordPayment')}
                      </Button>
                      {debt.balance > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // Calculer un paiement optimal (10% du solde)
                            const optimalPayment = Math.min(debt.balance, debt.balance * 0.1);
                            actions.recordPayment(debt.id, optimalPayment);
                          }}
                          title={t('suggestedPayment')}
                        >
                          <Icons.Zap className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    {debt.paymentHistory && debt.paymentHistory.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <p className={`text-sm font-medium ${theme.text} mb-2`}>{t('recentHistory')}</p>
                        <div className="space-y-1">
                          {debt.paymentHistory.slice(-3).map((payment, index) => (
                            <div key={payment.id || index} className="flex justify-between items-center text-xs">
                              <span className={theme.textSecondary}>
                                {new Date(payment.date).toLocaleDateString('fr-FR')}
                              </span>
                              <span className={`font-medium text-green-600`}>
                                -{state.showBalances ? formatCurrency(payment.amount) : '•••'}
                              </span>
                              <button
                                type="button"
                                className="ml-2 p-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900/20"
                                title={t('edit')}
                                onClick={() => {
                                  actions.setEditingPayment({ debtId: debt.id, payment });
                                  actions.toggleModal('editPayment', true);
                                }}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.828l-4.243 1.414 1.414-4.243a4 4 0 01.828-1.414z" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              
              {state.debts.length === 0 && (
                <div className={`text-center ${theme.textSecondary} py-8 border rounded-lg ${theme.border}`}>
                  <Icons.CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
                  <p className="text-lg font-medium text-green-600">{t('congratulations')}</p>
                  <p>{t('noDebtsRecorded')}</p>
                  <p className="text-xs mt-2">{t('maintainExcellentSituation')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Score de santé des dettes */}
      <div className={`${theme.card} rounded-xl border ${theme.border} p-6`}>
        <h3 className={`text-xl font-bold ${theme.text} mb-4 flex items-center`}>
          <Icons.Heart className="h-6 w-6 mr-2 text-red-500" />
          {t('debtHealthScore')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center justify-center">
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="none" className="text-gray-200 dark:text-gray-700" />
                <circle
                  cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="none"
                  strokeDasharray={`${healthScore.score * 2.51} 251`}
                  className={`text-${healthScore.color}-500`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-2xl font-bold text-${healthScore.color}-600`}>{healthScore.score}</span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <span className={theme.textSecondary}>{t('level')}</span>
              <div className={`font-bold text-${healthScore.color}-600 capitalize`}>{healthScore.level}</div>
            </div>
            <div>
              <span className={theme.textSecondary}>{t('debtToIncomeRatio')}</span>
              <div className={`font-bold ${healthScore.debtToIncomeRatio > 36 ? 'text-red-600' : 'text-green-600'}`}>
                {healthScore.debtToIncomeRatio.toFixed(1)}%
              </div>
            </div>
            <div>
              <span className={theme.textSecondary}>{t('numberOfDebts')}</span>
              <div className={theme.text}>{state.debts.length}</div>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className={`font-semibold ${theme.text}`}>{t('recommendations')}</h4>
            <ul className="text-sm space-y-1">
              {healthScore.score < 60 && (
                <li className="flex items-center space-x-2">
                  <Icons.AlertCircle className="h-3 w-3 text-red-500" />
                  <span>{t('consolidationRecommended')}</span>
                </li>
              )}
              {healthScore.debtToIncomeRatio > 20 && (
                <li className="flex items-center space-x-2">
                  <Icons.TrendingDown className="h-3 w-3 text-orange-500" />
                  <span>{t('reduceDebtToIncomeRatio')}</span>
                </li>
              )}
              <li className="flex items-center space-x-2">
                <Icons.Target className="h-3 w-3 text-blue-500" />
                <span>{t('targetRatio')}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Conseils personnalisés */}
      {advice.length > 0 && (
        <div className={`${theme.card} rounded-xl border ${theme.border} p-4`}>
          <h3 className={`text-lg font-semibold ${theme.text} mb-3 flex items-center`}>
            <Icons.MessageCircle className="h-5 w-5 mr-2 text-blue-600" />
            {t('personalizedAdvice')}
          </h3>
          <div className="space-y-3">
            {advice.map((tip, index) => {
              const Icon = tip.icon;
              return (
                <div key={index} className={`p-3 rounded-lg border ${
                  tip.type === 'critical' ? 'border-red-200 bg-red-50 dark:bg-red-900/20' :
                  tip.type === 'warning' ? 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20' :
                  'border-blue-200 bg-blue-50 dark:bg-blue-900/20'
                }`}>
                  <div className="flex items-start space-x-3">
                    <Icon className={`h-5 w-5 mt-0.5 ${
                      tip.type === 'critical' ? 'text-red-600' :
                      tip.type === 'warning' ? 'text-yellow-600' : 'text-blue-600'
                    }`} />
                    <div>
                      <h4 className={`font-medium ${theme.text}`}>{tip.title}</h4>
                      <p className={`text-sm ${theme.textSecondary} mt-1`}>{tip.message}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Stratégies de remboursement */}
      <div className={`${theme.card} rounded-xl border ${theme.border} p-6`}>
        <h3 className={`text-xl font-bold ${theme.text} mb-4 flex items-center`}>
          <Icons.Target className="h-6 w-6 mr-2 text-purple-600" />
          {t('repaymentStrategies')}
        </h3>
        
        {/* Simulateur de paiement supplémentaire */}
        <div className={`mb-6 p-4 rounded-lg ${theme.bg} border ${theme.border}`}>
          <h4 className={`font-semibold ${theme.text} mb-3`}>{t('paymentSimulator')}</h4>
          <div className="flex items-center space-x-4">
            <Input
              label={t('additionalMonthlyAmount')}
              type="number"
              step="10"
              min="0"
              value={simulationAmount}
              onChange={setSimulationAmount}
              className="flex-1"
              placeholder="ex: 100"
            />
            <Button
              onClick={() => setSimulationAmount('100')}
              variant="outline"
              size="sm"
            >
              100€
            </Button>
            <Button
              onClick={() => setSimulationAmount('200')}
              variant="outline"
              size="sm"
            >
              200€
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Object.entries(strategies).map(([key, strategy]) => {
            const Icon = strategy.icon;
            return (
              <div key={key} className={`p-4 rounded-lg border-2 ${
                selectedStrategy === key ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : `border-gray-200 dark:border-gray-700 ${theme.bg}`
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Icon className={`h-5 w-5 ${selectedStrategy === key ? 'text-blue-600' : 'text-gray-600'}`} />
                    <h4 className={`font-bold ${theme.text}`}>{strategy.name}</h4>
                  </div>
                  <Button
                    variant={selectedStrategy === key ? "primary" : "outline"}
                    size="sm"
                    onClick={() => setSelectedStrategy(key)}
                  >
                    {selectedStrategy === key ? t('selected') : t('choose')}
                  </Button>
                </div>
                <p className={`text-sm ${theme.textSecondary} mb-4`}>{strategy.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className={theme.textSecondary}>{t('totalTime')}</span>
                    <span className={theme.text}>{strategy.totalTime} {t('months')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={theme.textSecondary}>{t('totalInterest')}</span>
                    <span className={theme.text}>{formatCurrency(strategy.totalInterest)}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <h5 className={`font-medium ${theme.text} mb-1`}>{t('advantages')}</h5>
                    <ul className="space-y-1">
                      {strategy.pros.map((pro, index) => (
                        <li key={index} className="flex items-center space-x-1">
                          <Icons.Check className="h-3 w-3 text-green-500" />
                          <span className={theme.textSecondary}>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className={`font-medium ${theme.text} mb-1`}>{t('disadvantages')}</h5>
                    <ul className="space-y-1">
                      {strategy.cons.map((con, index) => (
                        <li key={index} className="flex items-center space-x-1">
                          <Icons.X className="h-3 w-3 text-red-500" />
                          <span className={theme.textSecondary}>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Résultats de simulation */}
      {simulation && (
        <div className={`${theme.card} rounded-xl border ${theme.border} p-6`}>
          <h3 className={`text-xl font-bold ${theme.text} mb-4 flex items-center`}>
            <Icons.Calculator className="h-6 w-6 mr-2 text-green-600" />
            {t('simulation', { amount: formatCurrency(simulationAmount) })}
          </h3>
          <div className="space-y-4">
            {simulation.map(debt => (
              <div key={debt.id} className={`p-4 rounded-lg ${theme.bg} border ${theme.border}`}>
                <h4 className={`font-semibold ${theme.text} mb-3`}>{debt.name}</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className={theme.textSecondary}>{t('timeSaved')}</span>
                    <div className={`font-bold text-green-600`}>{debt.timeSaved} {t('months')}</div>
                  </div>
                  <div>
                    <span className={theme.textSecondary}>{t('interestSaved')}</span>
                    <div className={`font-bold text-green-600`}>{formatCurrency(debt.interestSaved)}</div>
                  </div>
                  <div>
                    <span className={theme.textSecondary}>{t('newDeadline')}</span>
                    <div className={theme.text}>{debt.enhancedMonths} {t('months')}</div>
                  </div>
                  <div>
                    <span className={theme.textSecondary}>{t('newInterest')}</span>
                    <div className={theme.text}>{formatCurrency(debt.enhancedInterest)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

export default DebtsScreen;