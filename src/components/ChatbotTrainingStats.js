import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { chatbotTrainer } from '../utils/chatbotTraining';

const ChatbotTrainingStats = ({ isOpen, onClose }) => {
  const [stats, setStats] = useState(null);
  const [report, setReport] = useState(null);

  useEffect(() => {
    if (isOpen) {
      // Charger les données depuis le localStorage
      chatbotTrainer.loadFromLocalStorage();
      
      // Calculer les statistiques
      const performance = chatbotTrainer.analyzePerformance();
      const improvementReport = chatbotTrainer.generateImprovementReport();
      
      setStats(performance);
      setReport(improvementReport);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            📊 Statistiques d'entraînement du chatbot
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <Icons.X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Métriques de performance */}
          {stats && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Métriques de performance
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {stats.accuracy.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Précision de reconnaissance
                  </div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {stats.userSatisfaction.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Satisfaction utilisateur
                  </div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {stats.responseTime.toFixed(0)}ms
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Temps de réponse moyen
                  </div>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {chatbotTrainer.trainingData.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Exemples d'entraînement
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recommandations d'amélioration */}
          {report && report.recommendations.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Recommandations d'amélioration
              </h3>
              <div className="space-y-3">
                {report.recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-l-4 ${
                      rec.priority === 'high'
                        ? 'bg-red-50 dark:bg-red-900/20 border-red-400'
                        : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-400'
                    }`}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        {rec.priority === 'high' ? (
                          <Icons.AlertTriangle className="h-5 w-5 text-red-400" />
                        ) : (
                          <Icons.Info className="h-5 w-5 text-yellow-400" />
                        )}
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          {rec.description}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {rec.action}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions d'entraînement */}
          {report && report.trainingSuggestions.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Suggestions d'entraînement
              </h3>
              <div className="space-y-3">
                {report.trainingSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg"
                  >
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Intention: {suggestion.intent}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Précision actuelle: {(suggestion.currentAccuracy * 100).toFixed(1)}%
                    </p>
                    {suggestion.suggestedPatterns.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Mots-clés suggérés:
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {suggestion.suggestedPatterns.map((pattern, pIndex) => (
                            <span
                              key={pIndex}
                              className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded"
                            >
                              {pattern.word} ({pattern.frequency})
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => {
                const data = chatbotTrainer.exportTrainingData();
                const blob = new Blob([JSON.stringify(data, null, 2)], {
                  type: 'application/json'
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `chatbot-training-data-${new Date().toISOString().split('T')[0]}.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Icons.Download className="h-4 w-4 inline mr-2" />
              Exporter les données
            </button>
            <button
              onClick={() => {
                if (window.confirm('Êtes-vous sûr de vouloir réinitialiser toutes les données d\'entraînement ?')) {
                  chatbotTrainer.trainingData = [];
                  chatbotTrainer.userFeedback = [];
                  chatbotTrainer.saveToLocalStorage();
                  onClose();
                }
              }}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Icons.Trash2 className="h-4 w-4 inline mr-2" />
              Réinitialiser
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotTrainingStats; 