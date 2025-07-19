import React, { useState, useEffect } from 'react';
import { TrainingAnalyzer } from '../utils/trainingAnalyzer';

const TrainingAnalyzerModal = ({ isOpen, onClose, trainingData }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && trainingData) {
      analyzeTrainingData();
    }
  }, [isOpen, trainingData]);

  const analyzeTrainingData = () => {
    setLoading(true);
    
    try {
      const analyzer = new TrainingAnalyzer(trainingData);
      const result = analyzer.analyzeAfterTwoDays();
      setAnalysis(result);
    } catch (error) {
      console.error('Erreur lors de l\'analyse:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'good': return 'text-green-600';
      case 'needs_improvement': return 'text-yellow-600';
      case 'insufficient_data': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'good': return '✅';
      case 'needs_improvement': return '⚠️';
      case 'insufficient_data': return '❌';
      default: return '❓';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            📊 Analyse après 2 jours d'entraînement
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ✕
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Analyse en cours...</p>
          </div>
        ) : analysis ? (
          <div className="space-y-6">
            {/* Résumé des performances */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">📈 Résumé des performances</h3>
              
              {analysis.performance.status === 'insufficient_data' ? (
                <div className="text-center py-4">
                  <p className="text-red-600 font-medium">
                    {analysis.performance.message}
                  </p>
                  <p className="text-gray-600 mt-2">
                    Ajoutez plus d'interactions de test pour une analyse complète
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(analysis.performance.thresholds).map(([metric, data]) => (
                    <div key={metric} className="bg-white rounded-lg p-3 border">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600 capitalize">
                          {metric === 'accuracy' ? 'Précision' :
                           metric === 'satisfaction' ? 'Satisfaction' :
                           metric === 'responseTime' ? 'Temps de réponse' :
                           'Interactions'}
                        </span>
                        <span className={getStatusColor(data.status)}>
                          {getStatusIcon(data.status)}
                        </span>
                      </div>
                      <div className="mt-2">
                        <span className="text-2xl font-bold">
                          {metric === 'responseTime' ? `${data.current.toFixed(1)}s` :
                           metric === 'interactionCount' ? data.current :
                           `${data.current.toFixed(1)}%`}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">
                          / {metric === 'responseTime' ? `${data.target}s` :
                             metric === 'interactionCount' ? data.target :
                             `${data.target}%`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Problèmes identifiés */}
            {analysis.problems && (
              <div className="bg-yellow-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">🔍 Problèmes identifiés</h3>
                
                <div className="space-y-4">
                  {/* Reconnaissance d'intention */}
                  {analysis.problems.intentRecognition && (
                    <div className="bg-white rounded-lg p-3 border">
                      <h4 className="font-medium text-gray-800 mb-2">
                        Reconnaissance d'intention ({analysis.problems.intentRecognition.accuracy.toFixed(1)}%)
                      </h4>
                      {analysis.problems.intentRecognition.errors.length > 0 && (
                        <div className="text-sm text-gray-600">
                          <p className="mb-2">Erreurs détectées :</p>
                          <ul className="list-disc list-inside space-y-1">
                            {analysis.problems.intentRecognition.errors.slice(0, 3).map((error, index) => (
                              <li key={index}>
                                "{error.userInput}" → Attendu: {error.expectedIntent}, Reçu: {error.actualIntent}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Qualité des réponses */}
                  {analysis.problems.responseQuality && (
                    <div className="bg-white rounded-lg p-3 border">
                      <h4 className="font-medium text-gray-800 mb-2">
                        Qualité des réponses ({analysis.problems.responseQuality.lowSatisfactionCount} problèmes)
                      </h4>
                      {analysis.problems.responseQuality.problematicResponses.length > 0 && (
                        <div className="text-sm text-gray-600">
                          <p className="mb-2">Réponses insatisfaisantes :</p>
                          <ul className="list-disc list-inside space-y-1">
                            {analysis.problems.responseQuality.problematicResponses.slice(0, 3).map((response, index) => (
                              <li key={index}>
                                "{response.userInput}" → Satisfaction: {response.satisfaction}/5
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Recommandations */}
            {analysis.recommendations && analysis.recommendations.length > 0 && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">💡 Recommandations</h3>
                
                <div className="space-y-4">
                  {analysis.recommendations.map((rec, index) => (
                    <div key={index} className="bg-white rounded-lg p-3 border">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800 mb-2">
                            {rec.title}
                          </h4>
                          <p className="text-sm text-gray-600 mb-3">
                            {rec.description}
                          </p>
                          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                            {rec.actions.map((action, actionIndex) => (
                              <li key={actionIndex}>{action}</li>
                            ))}
                          </ul>
                        </div>
                        <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                          rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                          rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {rec.priority === 'high' ? 'Priorité haute' :
                           rec.priority === 'medium' ? 'Priorité moyenne' :
                           'Priorité basse'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Plan d'action */}
            {analysis.actionPlan && (
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">📋 Plan d'action</h3>
                
                <div className="space-y-4">
                  {/* Actions immédiates */}
                  {analysis.actionPlan.immediate.length > 0 && (
                    <div className="bg-white rounded-lg p-3 border">
                      <h4 className="font-medium text-red-800 mb-2">🚨 Actions immédiates (aujourd'hui)</h4>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        {analysis.actionPlan.immediate.map((action, index) => (
                          <li key={index}>
                            <strong>{action.title}</strong> ({action.time})
                            <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                              {action.actions.map((subAction, subIndex) => (
                                <li key={subIndex}>{subAction}</li>
                              ))}
                            </ul>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Actions à court terme */}
                  {analysis.actionPlan.shortTerm.length > 0 && (
                    <div className="bg-white rounded-lg p-3 border">
                      <h4 className="font-medium text-yellow-800 mb-2">⏰ Actions à court terme (cette semaine)</h4>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        {analysis.actionPlan.shortTerm.map((action, index) => (
                          <li key={index}>
                            <strong>{action.title}</strong> ({action.time})
                            <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                              {action.actions.map((subAction, subIndex) => (
                                <li key={subIndex}>{subAction}</li>
                              ))}
                            </ul>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Prochaines étapes */}
            <div className="bg-purple-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">🎯 Prochaines étapes</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-3 border">
                  <h4 className="font-medium text-gray-800 mb-2">✅ Si les métriques sont bonnes</h4>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>Continuer l'entraînement avec plus de testeurs</li>
                    <li>Déployer l'entraînement collaboratif</li>
                    <li>Collecter des données multilingues</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-lg p-3 border">
                  <h4 className="font-medium text-gray-800 mb-2">⚠️ Si les métriques sont faibles</h4>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>Suivre les recommandations d'amélioration</li>
                    <li>Retester après les optimisations</li>
                    <li>Analyser les patterns d'erreur spécifiques</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">Aucune donnée d'entraînement disponible</p>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrainingAnalyzerModal; 