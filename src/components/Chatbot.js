import React, { memo, useState, useRef, useCallback, useEffect } from 'react';
import * as Icons from 'lucide-react';
import Button from './ui/Button';

const Chatbot = memo(({ financeManager, theme, t }) => {
  const { state, actions, computedValues, formatCurrency } = financeManager;
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, from: 'bot', text: 'Bonjour ! Je suis votre assistant financier IA. Comment puis-je vous aider ?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
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
    
    // Ajout de dépense intelligent
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
            return `✅ Parfait ! J'ai ajouté une dépense de ${formatCurrency(montant)} en catégorie "${categoryExists.name}". Votre budget ${categoryExists.name} est maintenant utilisé à ${((computedValues.currentMonthExpenses.filter(e => e.category === categoryExists.name).reduce((sum, e) => sum + e.amount, 0) + montant) / categoryExists.budget * 100).toFixed(1)}%.`;
          } else {
            return `❌ Désolé, je n'ai pas pu ajouter cette dépense. Vérifiez que tous les champs sont valides.`;
          }
        } else {
          return `❌ Je n'ai pas trouvé la catégorie "${categorie}". Catégories disponibles : ${state.categories.map(c => c.name).join(', ')}. Vous pouvez aussi dire "crée une catégorie [nom] avec un budget de [montant]".`;
        }
      } else if (montantMatch) {
        return `J'ai bien vu le montant de ${montantMatch[1]}€, mais dans quelle catégorie ? Par exemple : "Ajoute une dépense de ${montantMatch[1]}€ en alimentation"`;
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
          return `✅ Catégorie "${name}" créée avec un budget de ${formatCurrency(budget)} !`;
        } else {
          return `❌ Une catégorie avec ce nom existe déjà ou les données sont invalides.`;
        }
      }
    }

    // Analyse financière avancée
    if (m.includes('analyse') || m.includes('bilan') || m.includes('situation')) {
      const savingsRate = computedValues.savingsRate;
      const budgetRatio = (computedValues.totalSpent / computedValues.totalBudget) * 100;
      
      let analysis = `📊 **Analyse de votre situation financière :**\n\n`;
      analysis += `💰 **Revenus :** ${formatCurrency(state.monthlyIncome)}\n`;
      analysis += `💸 **Dépenses :** ${formatCurrency(computedValues.totalSpent)} (${budgetRatio.toFixed(1)}% du budget)\n`;
      analysis += `💎 **Épargne :** ${formatCurrency(state.monthlyIncome - computedValues.totalSpent)} (${savingsRate.toFixed(1)}%)\n\n`;
      
      if (savingsRate >= 20) {
        analysis += `🎉 Excellent ! Votre taux d'épargne de ${savingsRate.toFixed(1)}% est très bon.`;
      } else if (savingsRate >= 10) {
        analysis += `👍 Votre taux d'épargne de ${savingsRate.toFixed(1)}% est correct, mais pourrait être amélioré.`;
      } else {
        analysis += `⚠️ Attention : votre taux d'épargne de ${savingsRate.toFixed(1)}% est faible. Recommandation : réduire les dépenses non essentielles.`;
      }
      
      return analysis;
    }

    // Conseils personnalisés
    if (m.includes('conseil') || m.includes('recommandation') || m.includes('aide')) {
      const biggestCategory = computedValues.pieChartData.reduce((a, b) => a.value > b.value ? a : b, { value: 0 });
      
      let advice = `💡 **Mes conseils personnalisés :**\n\n`;
      
      if (computedValues.totalSpent > computedValues.totalBudget) {
        advice += `🚨 Vous avez dépassé votre budget de ${formatCurrency(computedValues.totalSpent - computedValues.totalBudget)}. `;
      }
      
      if (biggestCategory.name) {
        advice += `📈 Votre plus grosse dépense est "${biggestCategory.name}" (${formatCurrency(biggestCategory.value)}). `;
      }
      
      if (computedValues.savingsRate < 10) {
        advice += `💡 Essayez la règle 50/30/20 : 50% besoins, 30% envies, 20% épargne.`;
      } else {
        advice += `✨ Continuez comme ça ! Pensez à diversifier votre épargne.`;
      }
      
      return advice;
    }

    // Questions sur les finances
    if (m.includes('budget restant')) {
      const remaining = computedValues.totalBudget - computedValues.totalSpent;
      return `Il vous reste ${formatCurrency(remaining)} sur votre budget total de ${formatCurrency(computedValues.totalBudget)} ce mois-ci.`;
    }

    if (m.includes('total depenses')) {
      return `Vous avez dépensé ${formatCurrency(computedValues.totalSpent)} ce mois-ci, soit ${((computedValues.totalSpent / state.monthlyIncome) * 100).toFixed(1)}% de vos revenus.`;
    }

    if (m.includes('epargne')) {
      const currentSavings = state.monthlyIncome - computedValues.totalSpent;
      return `💰 Épargne ce mois : ${formatCurrency(currentSavings)} (${computedValues.savingsRate.toFixed(1)}%)\n💎 Épargne totale objectifs : ${formatCurrency(computedValues.totalSavings)}`;
    }

    if (m.includes('objectif') && (m.includes('epargne') || m.includes('progression'))) {
      if (state.savingsGoals.length === 0) {
        return `Vous n'avez aucun objectif d'épargne défini. Voulez-vous que je vous aide à en créer un ?`;
      }
      
      let goals = `🎯 **Vos objectifs d'épargne :**\n\n`;
      state.savingsGoals.forEach(goal => {
        const progress = (goal.currentAmount / goal.targetAmount) * 100;
        goals += `• ${goal.name}: ${progress.toFixed(1)}% (${formatCurrency(goal.currentAmount)}/${formatCurrency(goal.targetAmount)})\n`;
      });
      
      return goals;
    }

    if (m.includes('dettes')) {
      if (state.debts.length === 0) {
        return `🎉 Félicitations ! Vous n'avez aucune dette enregistrée.`;
      }
      
      const totalDebt = computedValues.totalDebt;
      const monthlyPayments = state.debts.reduce((sum, debt) => sum + debt.minPayment, 0);
      
      return `💳 **Résumé de vos dettes :**\n• Total : ${formatCurrency(totalDebt)}\n• Paiements mensuels minimum : ${formatCurrency(monthlyPayments)}\n• Impact sur budget : ${((monthlyPayments / state.monthlyIncome) * 100).toFixed(1)}% de vos revenus`;
    }

    // Prédictions
    if (m.includes('prevision') || m.includes('prediction') || m.includes('fin de mois')) {
      const daysLeft = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() - new Date().getDate();
      const dailyAverage = computedValues.totalSpent / new Date().getDate();
      const projectedTotal = computedValues.totalSpent + (dailyAverage * daysLeft);
      const projectedSavings = state.monthlyIncome - projectedTotal;
      
      return `🔮 **Prévision fin de mois :**\n• Dépenses projetées : ${formatCurrency(projectedTotal)}\n• Épargne prévue : ${formatCurrency(projectedSavings)}\n• Confiance : 85%\n\n${projectedSavings > 0 ? '✅ Vous devriez finir le mois dans le vert !' : '⚠️ Attention, vous risquez de dépasser votre budget.'}`;
    }

    // Réponses par défaut
    if (m.includes('bonjour') || m.includes('salut')) {
      const hour = new Date().getHours();
      const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir';
      return `${greeting} ! Je suis là pour vous aider avec vos finances. Vous pouvez me demander une analyse, des conseils, ajouter des dépenses, ou poser des questions sur votre budget.`;
    }

    if (m.includes('merci')) {
      return `De rien ! N'hésitez pas si vous avez d'autres questions sur vos finances. 😊`;
    }

    return `Je ne comprends pas cette question. Voici ce que je peux faire :\n\n💰 Analyser vos finances : "analyse ma situation"\n📊 Donner des conseils : "donne-moi des conseils"\n➕ Ajouter des dépenses : "ajoute 50€ en alimentation"\n🎯 Suivre vos objectifs : "progression épargne"\n🔮 Faire des prévisions : "prévision fin de mois"\n\nTapez votre question !`;
  }, [state, actions, computedValues, formatCurrency, normalize]);

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
    
    await simulateTyping(response);
  }, [input, getBotResponse, simulateTyping]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-40 hover:scale-110"
        aria-label="Ouvrir l'assistant IA"
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
          <span className="font-semibold">Assistant IA</span>
        </div>
        <button 
          onClick={() => setIsOpen(false)} 
          className="text-white/80 hover:text-white transition-colors"
          aria-label="Fermer l'assistant"
        >
          <Icons.X className="h-5 w-5" />
        </button>
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
      </div>
      
      <form 
        className="flex items-center border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-b-xl"
        onSubmit={e => { e.preventDefault(); handleSend(); }}
      >
        <input
          className="flex-1 bg-transparent px-3 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 outline-none text-base"
          placeholder="Posez votre question..."
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
          aria-label="Envoyer le message"
        >
          <Icons.Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
});

export default Chatbot; 