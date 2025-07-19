// Système d'entraînement et d'amélioration du chatbot

export class ChatbotTrainer {
  constructor() {
    this.trainingData = [];
    this.userFeedback = [];
    this.conversationHistory = [];
    this.performanceMetrics = {
      accuracy: 0,
      userSatisfaction: 0,
      responseTime: 0,
      intentRecognition: 0
    };
  }

  // Collecte de données d'entraînement
  addTrainingExample(userInput, expectedIntent, expectedResponse, actualResponse, userSatisfaction) {
    this.trainingData.push({
      userInput,
      expectedIntent,
      expectedResponse,
      actualResponse,
      userSatisfaction,
      timestamp: Date.now()
    });
  }

  // Collecte de feedback utilisateur
  addUserFeedback(conversationId, userInput, botResponse, rating, feedback) {
    this.userFeedback.push({
      conversationId,
      userInput,
      botResponse,
      rating, // 1-5
      feedback,
      timestamp: Date.now()
    });
  }

  // Analyse des performances
  analyzePerformance() {
    const recentData = this.trainingData.filter(data => 
      Date.now() - data.timestamp < 30 * 24 * 60 * 60 * 1000 // 30 jours
    );

    if (recentData.length === 0) return this.performanceMetrics;

    // Calcul de la précision
    const correctIntent = recentData.filter(data => 
      data.expectedIntent === data.actualIntent
    ).length;
    this.performanceMetrics.accuracy = (correctIntent / recentData.length) * 100;

    // Calcul de la satisfaction utilisateur
    const avgSatisfaction = recentData.reduce((sum, data) => 
      sum + (data.userSatisfaction || 0), 0
    ) / recentData.length;
    this.performanceMetrics.userSatisfaction = avgSatisfaction * 100;

    // Calcul du temps de réponse moyen
    const avgResponseTime = recentData.reduce((sum, data) => 
      sum + (data.responseTime || 0), 0
    ) / recentData.length;
    this.performanceMetrics.responseTime = avgResponseTime;

    return this.performanceMetrics;
  }

  // Génération de rapports d'amélioration
  generateImprovementReport() {
    const performance = this.analyzePerformance();
    const report = {
      performance,
      recommendations: [],
      trainingSuggestions: []
    };

    // Recommandations basées sur les performances
    if (performance.accuracy < 80) {
      report.recommendations.push({
        type: 'intent_recognition',
        priority: 'high',
        description: 'Améliorer la reconnaissance d\'intention',
        action: 'Ajouter plus de patterns et d\'exemples d\'entraînement'
      });
    }

    if (performance.userSatisfaction < 70) {
      report.recommendations.push({
        type: 'response_quality',
        priority: 'high',
        description: 'Améliorer la qualité des réponses',
        action: 'Analyser les feedbacks négatifs et ajuster les réponses'
      });
    }

    if (performance.responseTime > 2000) {
      report.recommendations.push({
        type: 'response_speed',
        priority: 'medium',
        description: 'Optimiser la vitesse de réponse',
        action: 'Simplifier les calculs et optimiser l\'algorithme'
      });
    }

    // Suggestions d'entraînement basées sur les patterns
    const intentPatterns = this.analyzeIntentPatterns();
    Object.keys(intentPatterns).forEach(intent => {
      if (intentPatterns[intent].accuracy < 0.8) {
        report.trainingSuggestions.push({
          intent,
          currentAccuracy: intentPatterns[intent].accuracy,
          suggestedPatterns: this.generateSuggestedPatterns(intent)
        });
      }
    });

    return report;
  }

  // Analyse des patterns d'intention
  analyzeIntentPatterns() {
    const patterns = {};
    
    this.trainingData.forEach(data => {
      if (!patterns[data.expectedIntent]) {
        patterns[data.expectedIntent] = {
          total: 0,
          correct: 0,
          examples: []
        };
      }
      
      patterns[data.expectedIntent].total++;
      if (data.expectedIntent === data.actualIntent) {
        patterns[data.expectedIntent].correct++;
      }
      patterns[data.expectedIntent].examples.push(data.userInput);
    });

    // Calcul de la précision par intention
    Object.keys(patterns).forEach(intent => {
      patterns[intent].accuracy = patterns[intent].correct / patterns[intent].total;
    });

    return patterns;
  }

  // Génération de patterns suggérés
  generateSuggestedPatterns(intent) {
    const examples = this.trainingData
      .filter(data => data.expectedIntent === intent)
      .map(data => data.userInput);

    // Analyse des mots-clés les plus fréquents
    const wordFrequency = {};
    examples.forEach(example => {
      const words = example.toLowerCase().split(/\s+/);
      words.forEach(word => {
        wordFrequency[word] = (wordFrequency[word] || 0) + 1;
      });
    });

    // Retourner les mots les plus fréquents
    return Object.entries(wordFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([word, count]) => ({ word, frequency: count }));
  }

  // Export des données d'entraînement
  exportTrainingData() {
    return {
      trainingData: this.trainingData,
      userFeedback: this.userFeedback,
      performanceMetrics: this.performanceMetrics,
      exportDate: new Date().toISOString()
    };
  }

  // Import des données d'entraînement
  importTrainingData(data) {
    if (data.trainingData) {
      this.trainingData = [...this.trainingData, ...data.trainingData];
    }
    if (data.userFeedback) {
      this.userFeedback = [...this.userFeedback, ...data.userFeedback];
    }
  }

  // Sauvegarde automatique
  saveToLocalStorage() {
    localStorage.setItem('chatbotTrainingData', JSON.stringify({
      trainingData: this.trainingData,
      userFeedback: this.userFeedback,
      performanceMetrics: this.performanceMetrics
    }));
  }

  // Chargement depuis le localStorage
  loadFromLocalStorage() {
    const saved = localStorage.getItem('chatbotTrainingData');
    if (saved) {
      const data = JSON.parse(saved);
      this.trainingData = data.trainingData || [];
      this.userFeedback = data.userFeedback || [];
      this.performanceMetrics = data.performanceMetrics || this.performanceMetrics;
    }
  }
}

// Instance globale du trainer
export const chatbotTrainer = new ChatbotTrainer();

// Fonction utilitaire pour évaluer la qualité d'une réponse
export const evaluateResponseQuality = (userInput, botResponse, expectedIntent) => {
  let score = 0;
  
  // Score basé sur la longueur de la réponse (pas trop courte, pas trop longue)
  if (botResponse.length >= 20 && botResponse.length <= 500) {
    score += 0.3;
  }
  
  // Score basé sur la présence de mots-clés pertinents
  const relevantKeywords = {
    addExpense: ['ajouté', 'dépense', 'montant', 'catégorie'],
    financialAnalysis: ['analyse', 'bilan', 'situation', 'pourcentage'],
    advice: ['conseil', 'recommandation', 'suggestion', 'aide'],
    prediction: ['prédiction', 'prévision', 'fin de mois', 'tendance']
  };
  
  const keywords = relevantKeywords[expectedIntent] || [];
  const keywordMatches = keywords.filter(keyword => 
    botResponse.toLowerCase().includes(keyword)
  ).length;
  
  score += (keywordMatches / keywords.length) * 0.4;
  
  // Score basé sur la structure de la réponse
  if (botResponse.includes('\n') || botResponse.includes('•')) {
    score += 0.2; // Réponse bien structurée
  }
  
  // Score basé sur l'émotion positive
  const positiveWords = ['parfait', 'excellent', 'bon', 'bien', 'félicitations'];
  const hasPositiveTone = positiveWords.some(word => 
    botResponse.toLowerCase().includes(word)
  );
  if (hasPositiveTone) {
    score += 0.1;
  }
  
  return Math.min(score, 1); // Score entre 0 et 1
}; 