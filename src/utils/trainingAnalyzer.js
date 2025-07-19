// Analyseur automatique pour l'optimisation après 2 jours d'entraînement

export class TrainingAnalyzer {
  constructor(trainingData) {
    this.trainingData = trainingData;
    this.analysis = {};
  }

  // Analyse complète des performances
  analyzeAfterTwoDays() {
    const analysis = {
      performance: this.analyzePerformance(),
      problems: this.identifyProblems(),
      recommendations: this.generateRecommendations(),
      actionPlan: this.createActionPlan()
    };

    this.analysis = analysis;
    return analysis;
  }

  // Analyse des métriques de performance
  analyzePerformance() {
    const recentData = this.trainingData.filter(data => 
      Date.now() - data.timestamp < 2 * 24 * 60 * 60 * 1000 // 2 jours
    );

    if (recentData.length === 0) {
      return {
        status: 'insufficient_data',
        message: 'Pas assez de données d\'entraînement (minimum 10 interactions)',
        recommendations: ['Ajoutez plus d\'interactions de test']
      };
    }

    const accuracy = this.calculateAccuracy(recentData);
    const satisfaction = this.calculateSatisfaction(recentData);
    const responseTime = this.calculateResponseTime(recentData);
    const interactionCount = recentData.length;

    return {
      status: 'ready_for_analysis',
      metrics: {
        accuracy,
        satisfaction,
        responseTime,
        interactionCount
      },
      thresholds: {
        accuracy: { current: accuracy, target: 80, status: accuracy >= 80 ? 'good' : 'needs_improvement' },
        satisfaction: { current: satisfaction, target: 85, status: satisfaction >= 85 ? 'good' : 'needs_improvement' },
        responseTime: { current: responseTime, target: 3, status: responseTime <= 3 ? 'good' : 'needs_improvement' },
        interactionCount: { current: interactionCount, target: 20, status: interactionCount >= 20 ? 'good' : 'needs_improvement' }
      }
    };
  }

  // Identification des problèmes spécifiques
  identifyProblems() {
    const problems = {
      intentRecognition: this.analyzeIntentRecognition(),
      responseQuality: this.analyzeResponseQuality(),
      userFeedback: this.analyzeUserFeedback(),
      patterns: this.analyzeProblemPatterns()
    };

    return problems;
  }

  // Analyse de la reconnaissance d'intention
  analyzeIntentRecognition() {
    const intentErrors = this.trainingData
      .filter(data => data.expectedIntent && data.actualIntent && data.expectedIntent !== data.actualIntent)
      .map(data => ({
        userInput: data.userInput,
        expectedIntent: data.expectedIntent,
        actualIntent: data.actualIntent,
        timestamp: data.timestamp
      }));

    const intentAccuracy = this.trainingData.length > 0 
      ? ((this.trainingData.length - intentErrors.length) / this.trainingData.length) * 100 
      : 0;

    return {
      accuracy: intentAccuracy,
      errors: intentErrors,
      problematicIntents: this.findProblematicIntents(intentErrors),
      recommendations: this.generateIntentRecommendations(intentErrors)
    };
  }

  // Analyse de la qualité des réponses
  analyzeResponseQuality() {
    const lowSatisfactionInteractions = this.trainingData
      .filter(data => data.userSatisfaction && data.userSatisfaction < 3)
      .map(data => ({
        userInput: data.userInput,
        botResponse: data.actualResponse,
        satisfaction: data.userSatisfaction,
        timestamp: data.timestamp
      }));

    return {
      lowSatisfactionCount: lowSatisfactionInteractions.length,
      averageSatisfaction: this.calculateSatisfaction(this.trainingData),
      problematicResponses: lowSatisfactionInteractions,
      recommendations: this.generateResponseRecommendations(lowSatisfactionInteractions)
    };
  }

  // Analyse du feedback utilisateur
  analyzeUserFeedback() {
    const feedback = this.trainingData
      .filter(data => data.feedback)
      .map(data => ({
        userInput: data.userInput,
        botResponse: data.actualResponse,
        feedback: data.feedback,
        satisfaction: data.userSatisfaction,
        timestamp: data.timestamp
      }));

    const negativeFeedback = feedback.filter(f => f.satisfaction < 3);
    const positiveFeedback = feedback.filter(f => f.satisfaction >= 4);

    return {
      totalFeedback: feedback.length,
      negativeFeedback: negativeFeedback.length,
      positiveFeedback: positiveFeedback.length,
      feedbackRatio: feedback.length > 0 ? (positiveFeedback.length / feedback.length) * 100 : 0,
      commonComplaints: this.extractCommonComplaints(negativeFeedback),
      commonPraises: this.extractCommonPraises(positiveFeedback)
    };
  }

  // Analyse des patterns problématiques
  analyzeProblemPatterns() {
    const patterns = {
      unrecognizedInputs: this.findUnrecognizedInputs(),
      lowSatisfactionPatterns: this.findLowSatisfactionPatterns(),
      slowResponsePatterns: this.findSlowResponsePatterns()
    };

    return patterns;
  }

  // Génération de recommandations
  generateRecommendations() {
    const performance = this.analysis.performance;
    const problems = this.analysis.problems;

    const recommendations = [];

    // Recommandations basées sur la précision
    if (performance.metrics.accuracy < 80) {
      recommendations.push({
        priority: 'high',
        category: 'intent_recognition',
        title: 'Améliorer la reconnaissance d\'intention',
        description: `Précision actuelle: ${performance.metrics.accuracy.toFixed(1)}% (objectif: 80%)`,
        actions: [
          'Ajouter plus de patterns d\'entraînement',
          'Tester des formulations variées',
          'Améliorer l\'algorithme de reconnaissance'
        ],
        examples: this.generateTrainingExamples()
      });
    }

    // Recommandations basées sur la satisfaction
    if (performance.metrics.satisfaction < 85) {
      recommendations.push({
        priority: 'high',
        category: 'response_quality',
        title: 'Améliorer la qualité des réponses',
        description: `Satisfaction actuelle: ${performance.metrics.satisfaction.toFixed(1)}% (objectif: 85%)`,
        actions: [
          'Personnaliser les réponses',
          'Ajouter du contexte',
          'Améliorer les conseils'
        ],
        examples: this.generateResponseExamples()
      });
    }

    // Recommandations basées sur le temps de réponse
    if (performance.metrics.responseTime > 3) {
      recommendations.push({
        priority: 'medium',
        category: 'performance',
        title: 'Optimiser la vitesse de réponse',
        description: `Temps de réponse actuel: ${performance.metrics.responseTime.toFixed(1)}s (objectif: <3s)`,
        actions: [
          'Simplifier les calculs',
          'Optimiser l\'algorithme',
          'Mettre en cache les réponses fréquentes'
        ]
      });
    }

    return recommendations;
  }

  // Création du plan d'action
  createActionPlan() {
    const recommendations = this.analysis.recommendations;
    
    const actionPlan = {
      immediate: [], // Actions à faire aujourd'hui
      shortTerm: [], // Actions à faire cette semaine
      longTerm: []   // Actions à faire ce mois
    };

    recommendations.forEach(rec => {
      if (rec.priority === 'high') {
        actionPlan.immediate.push({
          title: rec.title,
          time: '30 minutes',
          actions: rec.actions.slice(0, 2) // 2 actions prioritaires
        });
      } else if (rec.priority === 'medium') {
        actionPlan.shortTerm.push({
          title: rec.title,
          time: '1 heure',
          actions: rec.actions
        });
      }
    });

    return actionPlan;
  }

  // Méthodes utilitaires
  calculateAccuracy(data) {
    const correct = data.filter(d => d.expectedIntent === d.actualIntent).length;
    return data.length > 0 ? (correct / data.length) * 100 : 0;
  }

  calculateSatisfaction(data) {
    const satisfactionData = data.filter(d => d.userSatisfaction);
    if (satisfactionData.length === 0) return 0;
    
    const sum = satisfactionData.reduce((acc, d) => acc + d.userSatisfaction, 0);
    return (sum / satisfactionData.length) * 20; // Convertir 1-5 en pourcentage
  }

  calculateResponseTime(data) {
    const timeData = data.filter(d => d.responseTime);
    if (timeData.length === 0) return 0;
    
    const sum = timeData.reduce((acc, d) => acc + d.responseTime, 0);
    return sum / timeData.length;
  }

  findProblematicIntents(errors) {
    const intentErrors = {};
    errors.forEach(error => {
      if (!intentErrors[error.expectedIntent]) {
        intentErrors[error.expectedIntent] = 0;
      }
      intentErrors[error.expectedIntent]++;
    });

    return Object.entries(intentErrors)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([intent, count]) => ({ intent, errorCount: count }));
  }

  generateIntentRecommendations(errors) {
    const recommendations = [];
    
    if (errors.length > 0) {
      recommendations.push({
        type: 'add_patterns',
        description: `Ajouter ${Math.min(errors.length * 2, 10)} patterns d'entraînement`,
        examples: errors.slice(0, 3).map(e => e.userInput)
      });
    }

    return recommendations;
  }

  generateResponseRecommendations(lowSatisfactionInteractions) {
    const recommendations = [];
    
    if (lowSatisfactionInteractions.length > 0) {
      recommendations.push({
        type: 'improve_responses',
        description: `Améliorer ${lowSatisfactionInteractions.length} réponses`,
        examples: lowSatisfactionInteractions.slice(0, 3)
      });
    }

    return recommendations;
  }

  findUnrecognizedInputs() {
    return this.trainingData
      .filter(data => !data.actualIntent || data.actualIntent === 'unknown')
      .map(data => data.userInput);
  }

  findLowSatisfactionPatterns() {
    return this.trainingData
      .filter(data => data.userSatisfaction && data.userSatisfaction < 3)
      .map(data => ({
        input: data.userInput,
        response: data.actualResponse,
        satisfaction: data.userSatisfaction
      }));
  }

  findSlowResponsePatterns() {
    return this.trainingData
      .filter(data => data.responseTime && data.responseTime > 3000)
      .map(data => ({
        input: data.userInput,
        responseTime: data.responseTime
      }));
  }

  extractCommonComplaints(negativeFeedback) {
    const complaints = negativeFeedback.map(f => f.feedback).filter(Boolean);
    // Analyse simple des mots-clés dans les plaintes
    return complaints.slice(0, 3);
  }

  extractCommonPraises(positiveFeedback) {
    const praises = positiveFeedback.map(f => f.feedback).filter(Boolean);
    return praises.slice(0, 3);
  }

  generateTrainingExamples() {
    return [
      "J'ai dépensé 25€ pour le transport",
      "Add a 15€ expense for lunch",
      "Gasté 50€ en comestibles",
      "Comment va mon budget ?",
      "Give me advice",
      "Dame consejos"
    ];
  }

  generateResponseExamples() {
    return [
      {
        before: "Votre budget va bien",
        after: "Votre budget est à 65% d'utilisation. Vous avez encore 500€ disponibles ce mois-ci."
      },
      {
        before: "Vous dépensez beaucoup",
        after: "Vous dépensez 20% de plus qu'en moyenne ce mois-ci. Je recommande de limiter les dépenses non essentielles."
      }
    ];
  }

  // Export du rapport d'analyse
  exportAnalysisReport() {
    return {
      timestamp: new Date().toISOString(),
      analysis: this.analysis,
      summary: this.generateSummary(),
      nextSteps: this.generateNextSteps()
    };
  }

  generateSummary() {
    const performance = this.analysis.performance;
    
    if (performance.status === 'insufficient_data') {
      return {
        status: 'needs_more_data',
        message: 'Ajoutez plus d\'interactions de test pour une analyse complète',
        priority: 'high'
      };
    }

    const metrics = performance.metrics;
    const thresholds = performance.thresholds;
    
    const goodMetrics = Object.values(thresholds).filter(t => t.status === 'good').length;
    const totalMetrics = Object.keys(thresholds).length;
    
    return {
      status: goodMetrics >= totalMetrics * 0.75 ? 'good' : 'needs_improvement',
      message: `${goodMetrics}/${totalMetrics} métriques sont dans les objectifs`,
      priority: goodMetrics >= totalMetrics * 0.75 ? 'low' : 'high'
    };
  }

  generateNextSteps() {
    const summary = this.generateSummary();
    
    if (summary.status === 'needs_more_data') {
      return [
        'Ajouter au moins 10 interactions de test',
        'Tester différentes formulations',
        'Donner du feedback sur chaque interaction'
      ];
    }

    if (summary.status === 'good') {
      return [
        'Continuer l\'entraînement avec plus de testeurs',
        'Déployer l\'entraînement collaboratif',
        'Collecter des données multilingues'
      ];
    }

    return [
      'Suivre les recommandations d\'amélioration',
      'Retester après les optimisations',
      'Analyser les patterns d\'erreur spécifiques'
    ];
  }
} 