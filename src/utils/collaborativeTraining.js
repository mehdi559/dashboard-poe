// Système d'entraînement collaboratif pour le chatbot

export class CollaborativeTrainer {
  constructor() {
    this.baseTrainer = null; // Référence vers le chatbotTrainer principal
  }

  // Initialiser avec le trainer principal
  setBaseTrainer(trainer) {
    this.baseTrainer = trainer;
  }

  // Générer un package d'entraînement pour partager
  generateTrainingPackage() {
    if (!this.baseTrainer) {
      throw new Error('Base trainer not initialized');
    }

    const packageData = {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      instructions: {
        title: 'Guide de test du chatbot IA',
        description: 'Aidez-nous à améliorer le chatbot en testant ces scénarios',
        steps: [
          '1. Ouvrez le chatbot (bouton en bas à droite)',
          '2. Testez les interactions listées ci-dessous',
          '3. Donnez votre feedback avec 👍 👌 👎',
          '4. Exportez vos données et envoyez-les nous'
        ]
      },
      testScenarios: this.generateTestScenarios(),
      currentTrainingData: this.baseTrainer.exportTrainingData(),
      exportInstructions: {
        title: 'Comment exporter vos données',
        steps: [
          '1. Ouvrez le chatbot',
          '2. Cliquez sur l\'icône 📊 dans l\'en-tête',
          '3. Cliquez sur "Exporter les données"',
          '4. Envoyez le fichier JSON généré'
        ]
      }
    };

    return packageData;
  }

  // Générer des scénarios de test
  generateTestScenarios() {
    return {
      basicInteractions: [
        {
          category: 'Ajout de dépenses',
          scenarios: [
            {
              input: 'J\'ai dépensé 25€ en transport',
              expectedIntent: 'addExpense',
              description: 'Test d\'ajout de dépense avec montant et catégorie'
            },
            {
              input: 'Ajoute une dépense de 15€ pour le déjeuner',
              expectedIntent: 'addExpense',
              description: 'Test avec formulation différente'
            },
            {
              input: 'J\'ai payé 50€ en courses alimentaires',
              expectedIntent: 'addExpense',
              description: 'Test avec catégorie spécifique'
            }
          ]
        },
        {
          category: 'Analyse financière',
          scenarios: [
            {
              input: 'Comment va mon budget ?',
              expectedIntent: 'financialAnalysis',
              description: 'Test d\'analyse générale'
            },
            {
              input: 'Fais-moi un bilan de ma situation',
              expectedIntent: 'financialAnalysis',
              description: 'Test avec formulation alternative'
            },
            {
              input: 'Analyse mes dépenses ce mois-ci',
              expectedIntent: 'financialAnalysis',
              description: 'Test d\'analyse temporelle'
            }
          ]
        },
        {
          category: 'Conseils personnalisés',
          scenarios: [
            {
              input: 'Donne-moi des conseils pour économiser',
              expectedIntent: 'advice',
              description: 'Test de demande de conseils'
            },
            {
              input: 'J\'ai besoin d\'aide pour mon budget',
              expectedIntent: 'advice',
              description: 'Test avec formulation d\'aide'
            },
            {
              input: 'Que me recommandes-tu ?',
              expectedIntent: 'advice',
              description: 'Test de recommandation'
            }
          ]
        },
        {
          category: 'Prédictions',
          scenarios: [
            {
              input: 'Comment vais-je finir le mois ?',
              expectedIntent: 'prediction',
              description: 'Test de prédiction de fin de mois'
            },
            {
              input: 'Fais-moi une prévision',
              expectedIntent: 'prediction',
              description: 'Test de prévision générale'
            }
          ]
        }
      ],
      edgeCases: [
        {
          input: 'J\'ai dépensé beaucoup d\'argent',
          description: 'Test avec montant imprécis'
        },
        {
          input: 'Mon budget est compliqué',
          description: 'Test avec demande vague'
        },
        {
          input: 'Je ne sais pas quoi faire',
          description: 'Test de demande d\'aide générale'
        }
      ],
      creativeTests: [
        {
          input: 'Peux-tu m\'aider à gérer mes finances ?',
          description: 'Test avec formulation polie'
        },
        {
          input: 'J\'ai un problème avec mes dépenses',
          description: 'Test avec formulation de problème'
        },
        {
          input: 'Comment améliorer ma situation ?',
          description: 'Test avec formulation d\'amélioration'
        }
      ]
    };
  }

  // Importer et fusionner les données d'entraînement
  importAndMergeTrainingData(externalData) {
    if (!this.baseTrainer) {
      throw new Error('Base trainer not initialized');
    }

    const mergeReport = {
      imported: 0,
      merged: 0,
      conflicts: 0,
      newPatterns: 0,
      improvements: []
    };

    // Fusionner les données d'entraînement
    if (externalData.trainingData) {
      externalData.trainingData.forEach(externalExample => {
        const existingIndex = this.baseTrainer.trainingData.findIndex(
          existing => existing.userInput === externalExample.userInput
        );

        if (existingIndex === -1) {
          // Nouvel exemple
          this.baseTrainer.trainingData.push(externalExample);
          mergeReport.imported++;
        } else {
          // Exemple existant - fusionner les métriques
          const existing = this.baseTrainer.trainingData[existingIndex];
          existing.userSatisfaction = (existing.userSatisfaction + externalExample.userSatisfaction) / 2;
          mergeReport.merged++;
        }
      });
    }

    // Fusionner les feedbacks utilisateur
    if (externalData.userFeedback) {
      externalData.userFeedback.forEach(feedback => {
        this.baseTrainer.userFeedback.push(feedback);
        mergeReport.imported++;
      });
    }

    // Analyser les améliorations
    const beforePerformance = this.baseTrainer.analyzePerformance();
    this.baseTrainer.saveToLocalStorage();
    const afterPerformance = this.baseTrainer.analyzePerformance();

    if (afterPerformance.accuracy > beforePerformance.accuracy) {
      mergeReport.improvements.push(`Précision améliorée: ${beforePerformance.accuracy.toFixed(1)}% → ${afterPerformance.accuracy.toFixed(1)}%`);
    }

    if (afterPerformance.userSatisfaction > beforePerformance.userSatisfaction) {
      mergeReport.improvements.push(`Satisfaction améliorée: ${beforePerformance.userSatisfaction.toFixed(1)}% → ${afterPerformance.userSatisfaction.toFixed(1)}%`);
    }

    return mergeReport;
  }

  // Générer un rapport de fusion
  generateMergeReport(mergeReport) {
    return {
      title: 'Rapport de fusion des données d\'entraînement',
      summary: {
        imported: mergeReport.imported,
        merged: mergeReport.merged,
        conflicts: mergeReport.conflicts,
        newPatterns: mergeReport.newPatterns
      },
      improvements: mergeReport.improvements,
      recommendations: this.generateMergeRecommendations(mergeReport)
    };
  }

  // Générer des recommandations basées sur la fusion
  generateMergeRecommendations(mergeReport) {
    const recommendations = [];

    if (mergeReport.imported > 0) {
      recommendations.push({
        type: 'success',
        message: `${mergeReport.imported} nouveaux exemples d'entraînement ajoutés`
      });
    }

    if (mergeReport.improvements.length > 0) {
      recommendations.push({
        type: 'improvement',
        message: 'Performance améliorée grâce aux nouvelles données'
      });
    }

    if (mergeReport.conflicts > 0) {
      recommendations.push({
        type: 'warning',
        message: `${mergeReport.conflicts} conflits détectés - vérifiez la cohérence`
      });
    }

    return recommendations;
  }

  // Créer un guide de test pour les testeurs
  generateTesterGuide() {
    return {
      title: 'Guide de test du chatbot IA',
      introduction: 'Aidez-nous à améliorer le chatbot en testant ces scénarios et en donnant votre feedback.',
      sections: [
        {
          title: 'Comment tester',
          steps: [
            '1. Ouvrez l\'application',
            '2. Cliquez sur le bouton du chatbot (en bas à droite)',
            '3. Testez les interactions listées ci-dessous',
            '4. Donnez votre feedback avec 👍 👌 👎 après chaque réponse',
            '5. Exportez vos données et envoyez-les nous'
          ]
        },
        {
          title: 'Scénarios de test',
          scenarios: this.generateTestScenarios()
        },
        {
          title: 'Comment exporter vos données',
          steps: [
            '1. Dans le chatbot, cliquez sur l\'icône 📊',
            '2. Cliquez sur "Exporter les données"',
            '3. Le fichier JSON sera téléchargé',
            '4. Envoyez ce fichier par email ou message'
          ]
        }
      ]
    };
  }
}

// Instance globale
export const collaborativeTrainer = new CollaborativeTrainer(); 