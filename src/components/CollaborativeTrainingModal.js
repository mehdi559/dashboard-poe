import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { collaborativeTrainer } from '../utils/collaborativeTraining';

const CollaborativeTrainingModal = ({ isOpen, onClose, chatbotTrainer }) => {
  const [activeTab, setActiveTab] = useState('export');
  const [mergeReport, setMergeReport] = useState(null);
  const [importedFile, setImportedFile] = useState(null);

  // Initialiser le trainer collaboratif
  React.useEffect(() => {
    if (isOpen && chatbotTrainer) {
      collaborativeTrainer.setBaseTrainer(chatbotTrainer);
    }
  }, [isOpen, chatbotTrainer]);

  const handleExportPackage = () => {
    try {
      const packageData = collaborativeTrainer.generateTrainingPackage();
      const blob = new Blob([JSON.stringify(packageData, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chatbot-training-package-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
    }
  };

  const handleImportFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          setImportedFile(data);
        } catch (error) {
          console.error('Erreur lors de l\'import:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleMergeData = () => {
    if (importedFile && chatbotTrainer) {
      try {
        const report = collaborativeTrainer.importAndMergeTrainingData(importedFile);
        setMergeReport(report);
      } catch (error) {
        console.error('Erreur lors de la fusion:', error);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            🤝 Entraînement collaboratif du chatbot
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <Icons.X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Onglets */}
          <div className="flex space-x-1 mb-6">
            <button
              onClick={() => setActiveTab('export')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'export'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              📤 Exporter pour partage
            </button>
            <button
              onClick={() => setActiveTab('import')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'import'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              📥 Importer des données
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'guide'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              📋 Guide de test
            </button>
          </div>

          {/* Contenu des onglets */}
          {activeTab === 'export' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  📤 Exporter un package d'entraînement
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Créez un package contenant les instructions de test et les données actuelles pour partager avec vos testeurs.
                </p>
                <button
                  onClick={handleExportPackage}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  <Icons.Download className="h-5 w-5 inline mr-2" />
                  Exporter le package d'entraînement
                </button>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                  📋 Instructions pour vos testeurs
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800 dark:text-blue-200">
                  <li>Envoyez le fichier JSON à vos testeurs</li>
                  <li>Demandez-leur d'installer l'app et de tester le chatbot</li>
                  <li>Ils doivent donner du feedback sur chaque interaction</li>
                  <li>Ils exportent leurs données et vous les renvoient</li>
                  <li>Vous importez leurs données ici pour fusionner</li>
                </ol>
              </div>
            </div>
          )}

          {activeTab === 'import' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  📥 Importer des données de test
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Importez les données d'entraînement de vos testeurs pour améliorer le chatbot.
                </p>
                
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportFile}
                    className="hidden"
                    id="import-file"
                  />
                  <label
                    htmlFor="import-file"
                    className="cursor-pointer inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Icons.Upload className="h-5 w-5 mr-2" />
                    Choisir un fichier JSON
                  </label>
                  {importedFile && (
                    <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                      ✓ Fichier importé: {importedFile.timestamp || 'Données de test'}
                    </p>
                  )}
                </div>

                {importedFile && (
                  <button
                    onClick={handleMergeData}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    <Icons.Merge className="h-5 w-5 inline mr-2" />
                    Fusionner les données
                  </button>
                )}
              </div>

              {mergeReport && (
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">
                    ✅ Fusion terminée
                  </h4>
                  <div className="space-y-2 text-sm text-green-800 dark:text-green-200">
                    <p>• {mergeReport.imported} nouveaux exemples importés</p>
                    <p>• {mergeReport.merged} exemples fusionnés</p>
                    {mergeReport.improvements.length > 0 && (
                      <div>
                        <p className="font-medium">Améliorations:</p>
                        {mergeReport.improvements.map((improvement, index) => (
                          <p key={index}>• {improvement}</p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  📋 Guide de test pour vos proches
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Voici un guide que vous pouvez envoyer à vos testeurs pour qu'ils sachent comment tester efficacement le chatbot.
                </p>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                    Instructions pour les testeurs
                  </h4>
                  <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                    <div>
                      <strong>1. Ouvrir le chatbot</strong>
                      <p>Cliquez sur le bouton du chatbot en bas à droite de l'écran</p>
                    </div>
                    <div>
                      <strong>2. Tester les interactions</strong>
                      <p>Essayez ces phrases et donnez votre feedback :</p>
                      <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                        <li>"J'ai dépensé 25€ en transport"</li>
                        <li>"Comment va mon budget ?"</li>
                        <li>"Donne-moi des conseils pour économiser"</li>
                        <li>"Comment vais-je finir le mois ?"</li>
                      </ul>
                    </div>
                    <div>
                      <strong>3. Donner du feedback</strong>
                      <p>Après chaque réponse, cliquez sur 👍 👌 ou 👎</p>
                    </div>
                    <div>
                      <strong>4. Exporter les données</strong>
                      <p>Cliquez sur l'icône 📊 puis "Exporter les données"</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const guide = collaborativeTrainer.generateTesterGuide();
                    const blob = new Blob([JSON.stringify(guide, null, 2)], {
                      type: 'application/json'
                    });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'guide-testeur-chatbot.json';
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  <Icons.FileText className="h-5 w-5 inline mr-2" />
                  Exporter le guide de test
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollaborativeTrainingModal; 