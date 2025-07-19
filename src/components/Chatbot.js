import React, { memo, useState, useRef, useCallback, useEffect } from 'react';
import * as Icons from 'lucide-react';
import Button from './ui/Button';
import { chatbotTrainer, evaluateResponseQuality } from '../utils/chatbotTraining';
import ChatbotTrainingStats from './ChatbotTrainingStats';
import CollaborativeTrainingModal from './CollaborativeTrainingModal';
import TrainingAnalyzerModal from './TrainingAnalyzerModal';

const Chatbot = memo(({ financeManager, theme, t }) => {
  const { state, actions, computedValues, formatCurrency } = financeManager;
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, from: 'bot', text: t('chatbotWelcome') }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationContext, setConversationContext] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastResponse, setLastResponse] = useState(null);
  const [showTrainingStats, setShowTrainingStats] = useState(false);
  const [showCollaborativeTraining, setShowCollaborativeTraining] = useState(false);
  const [showTrainingAnalyzer, setShowTrainingAnalyzer] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const normalize = useCallback((str) => {
    return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim();
  }, []);

  const getBotResponse = useCallback((msg) => {
    const m = normalize(msg);
    
    // Analyse d'intention et contexte
    const context = analyzeUserIntent(msg);
    const contextualPrefix = generateContextualResponse(context.intent, context, msg);
    
    // Ajout de dépense intelligent avec contexte
    if ((m.includes('ajoute') || m.includes('ajouter')) && m.includes('depense')) {
      const montantMatch = m.match(/([0-9]+(?:[.,][0-9]+)?)/);
      let categorieMatch = m.match(/en ([a-z ]+)/) || m.match(/pour ([a-z ]+)/) || m.match(/dans ([a-z ]+)/);
      
      if (montantMatch && categorieMatch) {
        const montant = parseFloat(montantMatch[1].replace(',', '.'));
        const categorie = categorieMatch[1].trim();
        
        const categoryExists = state.categories.find(cat => 
          normalize(cat.name).includes(normalize(categorie)) || normalize(categorie).includes(normalize(cat.name))
        );
        
        if (categoryExists) {
          const expense = {
            date: new Date().toISOString().split('T')[0],
            category: categoryExists.name,
            amount: montant,
            description: `Dépense ajoutée via assistant IA - ${categorie}`
          };
          
          if (actions.addExpense(expense)) {
            const percentage = ((computedValues.currentMonthExpenses.filter(e => e.category === categoryExists.name).reduce((sum, e) => sum + e.amount, 0) + montant) / categoryExists.budget * 100).toFixed(1);
            return contextualPrefix + t('expenseAddedSuccess', { amount: formatCurrency(montant), category: categoryExists.name, percentage });
          } else {
            return contextualPrefix + t('expenseAddError');
          }
        } else {
          return contextualPrefix + t('categoryNotFound', { category: categorie, categories: state.categories.map(c => c.name).join(', ') });
        }
      } else if (montantMatch) {
        return contextualPrefix + t('amountSeenButNoCategory', { amount: montantMatch[1] });
      }
    }

    // Création de catégorie
    if (m.includes('cree') && m.includes('categorie')) {
      const nameMatch = m.match(/categorie ([a-z ]+) avec/) || m.match(/categorie ([a-z ]+)/);
      const budgetMatch = m.match(/budget de ([0-9]+(?:[.,][0-9]+)?)/);
      
      if (nameMatch && budgetMatch) {
        const name = nameMatch[1].trim();
        const budget = parseFloat(budgetMatch[1].replace(',', '.'));
        
        const categoryData = { name, budget };
        if (actions.addCategory(categoryData)) {
          return t('categoryCreatedSuccess', { name, budget: formatCurrency(budget) });
        } else {
          return t('categoryExistsError');
        }
      }
    }

    // Analyse financière avancée
    if (m.includes('analyse') || m.includes('bilan') || m.includes('situation')) {
      const savingsRate = computedValues.savingsRate;
      const budgetRatio = (computedValues.totalSpent / computedValues.totalBudget) * 100;
      
      let analysis = `${t('financialAnalysisTitle')}\n\n`;
      analysis += `💰 **${t('income')} :** ${formatCurrency(state.monthlyIncome)}\n`;
      analysis += `💸 **${t('expenses')} :** ${formatCurrency(computedValues.totalSpent)} (${t('budgetPercentage', { percentage: budgetRatio.toFixed(1) })})\n`;
      analysis += `💎 **${t('savings')} :** ${formatCurrency(state.monthlyIncome - computedValues.totalSpent)} (${t('savingsPercentage', { percentage: savingsRate.toFixed(1) })})\n\n`;
      
      if (savingsRate >= 20) {
        analysis += t('excellentSavingsRate', { percentage: savingsRate.toFixed(1) });
      } else if (savingsRate >= 10) {
        analysis += t('goodSavingsRate', { percentage: savingsRate.toFixed(1) });
      } else {
        analysis += t('lowSavingsRate', { percentage: savingsRate.toFixed(1) });
      }
      
      return analysis;
    }

    // Conseils personnalisés
    if (m.includes('conseil') || m.includes('recommandation') || m.includes('aide')) {
      const biggestCategory = computedValues.pieChartData.reduce((a, b) => a.value > b.value ? a : b, { value: 0 });
      
      let advice = `${t('personalizedAdviceTitle')}\n\n`;
      
      if (computedValues.totalSpent > computedValues.totalBudget) {
        advice += t('budgetExceeded', { amount: formatCurrency(computedValues.totalSpent - computedValues.totalBudget) });
      }
      
      if (biggestCategory.name) {
        advice += t('biggestExpense', { category: biggestCategory.name, amount: formatCurrency(biggestCategory.value) });
      }
      
      if (computedValues.savingsRate < 10) {
        advice += t('try503020Rule');
      } else {
        advice += t('continueGoodWork');
      }
      
      return advice;
    }

    // Questions sur les finances
    if (m.includes('budget restant')) {
      const remaining = computedValues.totalBudget - computedValues.totalSpent;
      return t('remainingBudget', { remaining: formatCurrency(remaining), total: formatCurrency(computedValues.totalBudget) });
    }

    if (m.includes('total depenses')) {
      return t('totalExpenses', { amount: formatCurrency(computedValues.totalSpent), percentage: ((computedValues.totalSpent / state.monthlyIncome) * 100).toFixed(1) });
    }

    if (m.includes('epargne')) {
      const currentSavings = state.monthlyIncome - computedValues.totalSpent;
      return `${t('currentSavings', { amount: formatCurrency(currentSavings), percentage: computedValues.savingsRate.toFixed(1) })}\n${t('totalSavingsGoals', { amount: formatCurrency(computedValues.totalSavings) })}`;
    }

    if (m.includes('objectif') && (m.includes('epargne') || m.includes('progression'))) {
      if (state.savingsGoals.length === 0) {
        return t('noSavingsGoals');
      }
      
      let goals = `${t('savingsGoalsTitle')}\n\n`;
      state.savingsGoals.forEach(goal => {
        const progress = (goal.currentAmount / goal.targetAmount) * 100;
        goals += t('goalProgress', { 
          name: goal.name, 
          progress: progress.toFixed(1), 
          current: formatCurrency(goal.currentAmount), 
          target: formatCurrency(goal.targetAmount) 
        }) + '\n';
      });
      
      return goals;
    }

    if (m.includes('dettes')) {
      if (state.debts.length === 0) {
        return t('congratulationsNoDebts');
      }
      
      const totalDebt = computedValues.totalDebt;
      const monthlyPayments = state.debts.reduce((sum, debt) => sum + debt.minPayment, 0);
      
      return `${t('debtSummary')}\n${t('totalDebt', { amount: formatCurrency(totalDebt) })}\n${t('monthlyPayments', { amount: formatCurrency(monthlyPayments) })}\n${t('budgetImpact', { percentage: ((monthlyPayments / state.monthlyIncome) * 100).toFixed(1) })}`;
    }

    // Prédictions
    if (m.includes('prevision') || m.includes('prediction') || m.includes('fin de mois')) {
      const daysLeft = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() - new Date().getDate();
      const dailyAverage = computedValues.totalSpent / new Date().getDate();
      const projectedTotal = computedValues.totalSpent + (dailyAverage * daysLeft);
      const projectedSavings = state.monthlyIncome - projectedTotal;
      
      return `${t('endOfMonthPrediction')}\n${t('projectedExpenses', { amount: formatCurrency(projectedTotal) })}\n${t('projectedSavings', { amount: formatCurrency(projectedSavings) })}\n${t('confidence')}\n\n${projectedSavings > 0 ? t('shouldEndGreen') : t('riskExceedingBudget')}`;
    }

    // Réponses par défaut
    if (m.includes('bonjour') || m.includes('salut')) {
      const hour = new Date().getHours();
      const greeting = hour < 12 ? t('greetingMorning') : hour < 18 ? t('greetingAfternoon') : t('greetingEvening');
      return t('greetingMessage', { greeting });
    }

    if (m.includes('merci')) {
      return t('thankYou');
    }

    return `${t('dontUnderstand')}\n\n${t('analyzeFinances')}\n${t('giveAdvice')}\n${t('addExpenses')}\n${t('trackGoals')}\n${t('makePredictions')}\n\n${t('typeYourQuestion')}`;
  }, [state, actions, computedValues, formatCurrency, normalize, t]);

  // Nouvelle fonction pour l'analyse de sentiment et contexte
  const analyzeUserIntent = useCallback((message) => {
    const normalized = normalize(message);
    const context = {
      intent: null,
      confidence: 0,
      entities: {},
      sentiment: 'neutral'
    };

    // Analyse d'intention avec scoring
    const intentPatterns = {
      addExpense: {
        patterns: ['ajoute', 'ajouter', 'depense', 'gasté', 'payé'],
        score: 0
      },
      financialAnalysis: {
        patterns: ['analyse', 'bilan', 'situation', 'comment va'],
        score: 0
      },
      advice: {
        patterns: ['conseil', 'recommandation', 'aide', 'que faire'],
        score: 0
      },
      prediction: {
        patterns: ['prevision', 'prediction', 'fin de mois', 'va t-il'],
        score: 0
      },
      goals: {
        patterns: ['objectif', 'progression', 'epargne', 'economies'],
        score: 0
      },
      debts: {
        patterns: ['dettes', 'emprunt', 'credit', 'remboursement'],
        score: 0
      }
    };

    // Calcul du score pour chaque intention
    Object.keys(intentPatterns).forEach(intent => {
      intentPatterns[intent].patterns.forEach(pattern => {
        if (normalized.includes(pattern)) {
          intentPatterns[intent].score += 1;
        }
      });
    });

    // Sélection de l'intention avec le score le plus élevé
    let bestIntent = null;
    let bestScore = 0;
    
    Object.keys(intentPatterns).forEach(intent => {
      if (intentPatterns[intent].score > bestScore) {
        bestScore = intentPatterns[intent].score;
        bestIntent = intent;
      }
    });

    context.intent = bestIntent;
    context.confidence = bestScore / 3; // Normalisation

    // Extraction d'entités (montants, catégories, dates)
    const amountMatch = message.match(/([0-9]+(?:[.,][0-9]+)?)\s*(?:€|euros?|dollars?|USD)?/i);
    if (amountMatch) {
      context.entities.amount = parseFloat(amountMatch[1].replace(',', '.'));
    }

    const categoryMatch = message.match(/(?:en|pour|dans|catégorie)\s+([a-zéèêëàâäôöùûüç\s]+)/i);
    if (categoryMatch) {
      context.entities.category = categoryMatch[1].trim();
    }

    // Analyse de sentiment basique
    const positiveWords = ['bien', 'bon', 'excellent', 'super', 'génial', 'parfait'];
    const negativeWords = ['mal', 'mauvais', 'problème', 'difficile', 'stressant', 'inquiet'];
    
    const positiveCount = positiveWords.filter(word => normalized.includes(word)).length;
    const negativeCount = negativeWords.filter(word => normalized.includes(word)).length;
    
    if (positiveCount > negativeCount) context.sentiment = 'positive';
    else if (negativeCount > positiveCount) context.sentiment = 'negative';

    return context;
  }, [normalize]);

  // Fonction pour générer des réponses contextuelles
  const generateContextualResponse = useCallback((intent, context, userMessage) => {
    const responses = {
      addExpense: {
        positive: "Parfait ! Je vais vous aider à ajouter cette dépense. ",
        negative: "Je comprends que ce n'est pas agréable d'ajouter une dépense, mais c'est important de tout tracker. ",
        neutral: "Je vais vous aider à ajouter cette dépense. "
      },
      financialAnalysis: {
        positive: "Excellente idée de faire le point ! ",
        negative: "Ne vous inquiétez pas, analysons ensemble votre situation. ",
        neutral: "Analysons votre situation financière. "
      },
      advice: {
        positive: "Je suis ravi de pouvoir vous conseiller ! ",
        negative: "Je comprends que vous ayez besoin d'aide, je suis là pour vous. ",
        neutral: "Je vais vous donner des conseils personnalisés. "
      }
    };

    const baseResponse = responses[intent]?.[context.sentiment] || responses[intent]?.neutral || "";
    return baseResponse;
  }, []);

  // Fonction pour l'apprentissage conversationnel
  const updateConversationContext = useCallback((userMessage, botResponse, intent) => {
    setConversationContext(prev => {
      const newContext = [...prev, {
        userMessage,
        botResponse,
        intent,
        timestamp: Date.now()
      }];
      
      // Garder seulement les 10 dernières interactions
      return newContext.slice(-10);
    });
  }, []);

  // Fonction pour les suggestions intelligentes basées sur l'historique
  const generateSmartSuggestions = useCallback(() => {
    const suggestions = [];
    
    // Suggestion basée sur le budget restant
    const remainingBudget = computedValues.totalBudget - computedValues.totalSpent;
    if (remainingBudget < computedValues.totalBudget * 0.2) {
      suggestions.push("Voulez-vous que j'analyse vos dépenses pour optimiser votre budget ?");
    }
    
    // Suggestion basée sur les objectifs d'épargne
    if (state.savingsGoals.length > 0) {
      const lowProgressGoals = state.savingsGoals.filter(goal => 
        (goal.currentAmount / goal.targetAmount) < 0.5
      );
      if (lowProgressGoals.length > 0) {
        suggestions.push("Voulez-vous que je vous aide à atteindre vos objectifs d'épargne ?");
      }
    }
    
    // Suggestion basée sur les dettes
    if (state.debts.length > 0) {
      suggestions.push("Souhaitez-vous un plan de remboursement pour vos dettes ?");
    }
    
    // Suggestion basée sur l'heure de la journée
    const hour = new Date().getHours();
    if (hour >= 18 && hour <= 22) {
      suggestions.push("C'est le moment idéal pour faire le point sur vos dépenses de la journée !");
    }
    
    return suggestions.slice(0, 2); // Maximum 2 suggestions
  }, [state, computedValues]);

  // Fonction pour l'analyse prédictive avancée
  const generatePredictiveInsights = useCallback(() => {
    const insights = [];
    
    // Analyse des tendances de dépenses
    const currentDay = new Date().getDate();
    const dailyAverage = computedValues.totalSpent / currentDay;
    const projectedMonthEnd = dailyAverage * new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    
    if (projectedMonthEnd > state.monthlyIncome) {
      insights.push("⚠️ Attention : Au rythme actuel, vous risquez de dépasser votre budget de " + 
        formatCurrency(projectedMonthEnd - state.monthlyIncome) + " ce mois-ci.");
    }
    
    // Analyse des catégories les plus dépensières
    const topCategory = computedValues.pieChartData.reduce((a, b) => a.value > b.value ? a : b, { value: 0 });
    if (topCategory.name && topCategory.value > state.monthlyIncome * 0.3) {
      insights.push("💡 La catégorie '" + topCategory.name + "' représente " + 
        ((topCategory.value / state.monthlyIncome) * 100).toFixed(1) + "% de vos revenus. " +
        "Envisagez-vous de la réduire ?");
    }
    
    // Analyse de l'épargne
    const savingsRate = computedValues.savingsRate;
    if (savingsRate < 10) {
      insights.push("💰 Votre taux d'épargne est de " + savingsRate.toFixed(1) + "%. " +
        "L'objectif recommandé est de 20%. Voulez-vous des conseils pour l'améliorer ?");
    }
    
    return insights;
  }, [state, computedValues, formatCurrency]);

  // Fonction pour l'apprentissage des préférences utilisateur
  const learnUserPreferences = useCallback((userMessage, botResponse, userSatisfaction) => {
    // Stockage des préférences dans localStorage
    const preferences = JSON.parse(localStorage.getItem('chatbotPreferences') || '{}');
    
    // Analyse des patterns d'utilisation
    const patterns = preferences.patterns || {};
    const intent = analyzeUserIntent(userMessage).intent;
    
    if (intent) {
      patterns[intent] = (patterns[intent] || 0) + 1;
    }
    
    // Stockage de la satisfaction utilisateur (basé sur la longueur de la réponse et les mots positifs)
    const satisfaction = userSatisfaction || (botResponse.length > 50 ? 0.8 : 0.5);
    preferences.satisfaction = (preferences.satisfaction || 0.5) * 0.9 + satisfaction * 0.1;
    
    preferences.patterns = patterns;
    localStorage.setItem('chatbotPreferences', JSON.stringify(preferences));
    
    // Ajout aux données d'entraînement
    const responseQuality = evaluateResponseQuality(userMessage, botResponse, intent);
    chatbotTrainer.addTrainingExample(
      userMessage,
      intent,
      botResponse,
      botResponse,
      responseQuality
    );
    chatbotTrainer.saveToLocalStorage();
  }, [analyzeUserIntent]);

  const simulateTyping = useCallback(async (response) => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    setIsTyping(false);
    
    const botResponse = { id: Date.now() + 1, from: 'bot', text: response };
    setMessages(prev => [...prev, botResponse]);
  }, []);

  const handleSend = useCallback(async () => {
    if (!input.trim()) return;
    
    const userMsg = { id: Date.now(), from: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    
    const response = getBotResponse(input);
    setInput('');
    
    // Apprentissage et mise à jour du contexte
    const context = analyzeUserIntent(input);
    updateConversationContext(input, response, context.intent);
    learnUserPreferences(input, response);
    
    // Stockage de la réponse pour le feedback
    setLastResponse({ userInput: input, botResponse: response, intent: context.intent });
    
    await simulateTyping(response);
    
    // Ajout de suggestions intelligentes après un délai
    setTimeout(() => {
      const suggestions = generateSmartSuggestions();
      const insights = generatePredictiveInsights();
      
      if (suggestions.length > 0 || insights.length > 0) {
        let additionalResponse = "";
        if (insights.length > 0) {
          additionalResponse += insights.join('\n\n') + '\n\n';
        }
        if (suggestions.length > 0) {
          additionalResponse += "💡 Suggestions :\n" + suggestions.map(s => "• " + s).join('\n');
        }
        
        if (additionalResponse.trim()) {
          const suggestionMsg = { id: Date.now() + 2, from: 'bot', text: additionalResponse };
          setMessages(prev => [...prev, suggestionMsg]);
        }
      }
    }, 2000);
  }, [input, getBotResponse, simulateTyping, analyzeUserIntent, updateConversationContext, learnUserPreferences, generateSmartSuggestions, generatePredictiveInsights]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-40 hover:scale-110"
        aria-label={t('openAIAssistant')}
      >
        <Icons.MessageCircle className="h-7 w-7" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 max-w-[95vw] bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl shadow-2xl z-50 flex flex-col border border-gray-200 dark:border-gray-700 max-h-[80vh]">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-xl">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <Icons.Brain className="h-4 w-4" />
          </div>
          <span className="font-semibold">{t('aiAssistant')}</span>
        </div>
                  <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowTrainingAnalyzer(true)}
              className="text-white/80 hover:text-white transition-colors p-1"
              title="Analyse après 2 jours"
            >
              <Icons.Target className="h-4 w-4" />
            </button>
            <button
              onClick={() => setShowCollaborativeTraining(true)}
              className="text-white/80 hover:text-white transition-colors p-1"
              title="Entraînement collaboratif"
            >
              <Icons.Users className="h-4 w-4" />
            </button>
            <button
              onClick={() => setShowTrainingStats(true)}
              className="text-white/80 hover:text-white transition-colors p-1"
              title="Statistiques d'entraînement"
            >
              <Icons.BarChart3 className="h-4 w-4" />
            </button>
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-white/80 hover:text-white transition-colors"
              aria-label={t('closeAssistant')}
            >
              <Icons.X className="h-5 w-5" />
            </button>
          </div>
      </div>
      
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3 max-h-80">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`rounded-lg px-3 py-2 text-sm max-w-[85%] ${
              msg.from === 'user' 
                ? 'bg-blue-600 text-white ml-auto' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700'
            }`}>
              {msg.text.split('\n').map((line, index) => (
                <div key={index}>
                  {line.startsWith('**') && line.endsWith('**') ? (
                    <strong>{line.slice(2, -2)}</strong>
                  ) : line.startsWith('•') ? (
                    <div className="ml-2">{line}</div>
                  ) : (
                    line
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 border border-gray-200 dark:border-gray-700">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
        
        {/* Système de feedback */}
        {lastResponse && !showFeedback && (
          <div className="flex justify-center py-2">
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  chatbotTrainer.addUserFeedback(
                    Date.now(),
                    lastResponse.userInput,
                    lastResponse.botResponse,
                    5,
                    "Excellent"
                  );
                  setShowFeedback(true);
                }}
                className="text-green-600 hover:text-green-700 text-sm"
                title="Excellente réponse"
              >
                👍
              </button>
              <button
                onClick={() => {
                  chatbotTrainer.addUserFeedback(
                    Date.now(),
                    lastResponse.userInput,
                    lastResponse.botResponse,
                    3,
                    "Correct"
                  );
                  setShowFeedback(true);
                }}
                className="text-yellow-600 hover:text-yellow-700 text-sm"
                title="Réponse correcte"
              >
                👌
              </button>
              <button
                onClick={() => {
                  chatbotTrainer.addUserFeedback(
                    Date.now(),
                    lastResponse.userInput,
                    lastResponse.botResponse,
                    1,
                    "Incorrect"
                  );
                  setShowFeedback(true);
                }}
                className="text-red-600 hover:text-red-700 text-sm"
                title="Réponse incorrecte"
              >
                👎
              </button>
            </div>
          </div>
        )}
      </div>
      
      <form 
        className="flex items-center border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-b-xl"
        onSubmit={e => { e.preventDefault(); handleSend(); }}
      >
        <input
          className="flex-1 bg-transparent px-3 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 outline-none text-base"
          placeholder={t('askYourQuestion')}
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={isTyping}
          autoFocus
        />
        <Button
          type="submit"
          variant="primary"
          size="sm"
          disabled={!input.trim() || isTyping}
          className="mx-2 bg-blue-600 hover:bg-blue-700"
          aria-label={t('sendMessage')}
        >
          <Icons.Send className="h-4 w-4" />
        </Button>
      </form>
      
      {/* Modal des statistiques d'entraînement */}
      <ChatbotTrainingStats 
        isOpen={showTrainingStats}
        onClose={() => setShowTrainingStats(false)}
      />
      
      {/* Modal d'entraînement collaboratif */}
      <CollaborativeTrainingModal 
        isOpen={showCollaborativeTraining}
        onClose={() => setShowCollaborativeTraining(false)}
        chatbotTrainer={chatbotTrainer}
      />
      
      {/* Modal d'analyse après 2 jours */}
      <TrainingAnalyzerModal 
        isOpen={showTrainingAnalyzer}
        onClose={() => setShowTrainingAnalyzer(false)}
        trainingData={chatbotTrainer.trainingData}
      />
    </div>
  );
});

export default Chatbot; 