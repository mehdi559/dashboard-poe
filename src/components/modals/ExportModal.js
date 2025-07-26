import React, { memo, useState, useEffect, useCallback } from 'react';
import * as Icons from 'lucide-react';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import ReportGenerator from '../../utils/ReportGenerator';
import { ExcelExportEngine } from '../../utils/ExcelExportEngine';

const ExportModal = memo(({ financeManager, theme, t }) => {
  const { state, actions, computedValues, showNotification } = financeManager;
  const [selectedReport, setSelectedReport] = useState('monthly');
  const [selectedFormat, setSelectedFormat] = useState('html');
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  // 🔧 NOUVEAUX ÉTATS POUR EXCEL v3.0
  const [selectedTemplate, setSelectedTemplate] = useState('comprehensive');
  const [selectedTheme, setSelectedTheme] = useState('green');

  const handlePreview = useCallback(async () => {
    setIsGenerating(true);
    try {
      console.log('🔍 Génération aperçu pour:', selectedReport);
      
      // Calculer les données nécessaires pour le rapport
      const currentMonthExpenses = state.expenses.filter(e => 
        e.date.startsWith(state.selectedMonth)
      );
      
      const totalSpent = currentMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      const totalBudget = state.categories.reduce((sum, cat) => sum + cat.budget, 0);
      // ✅ CORRECTION : Calcul correct du taux d'épargne basé sur les revenus mensuels
      const savingsRate = state.monthlyIncome > 0 ? ((state.monthlyIncome - totalSpent) / state.monthlyIncome) * 100 : 0;
      
      console.log('📊 Données pour aperçu:', {
        type: selectedReport,
        totalSpent,
        totalBudget,
        savingsRate,
        expensesCount: currentMonthExpenses.length,
        categoriesCount: state.categories.length,
        selectedMonth: state.selectedMonth
      });
      
      const reportData = {
        type: selectedReport,
        data: {
          ...state,
          ...computedValues,
          selectedMonth: state.selectedMonth,
          language: state.language,
          totalSpent,
          totalBudget,
          savingsRate,
          currentMonthExpenses,
          userName: state.userName
        },
        translations: t
      };
      
      let html;
      if (selectedReport === 'excel') {
        // Aperçu spécial pour Excel
        html = `
          <div class="container">
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 1200px; margin: 0 auto; padding: 2rem; background: white; }
              .header { text-align: center; margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 2px solid #e5e7eb; background: linear-gradient(135deg, #1f2937 0%, #374151 100%); color: white; padding: 2rem; border-radius: 12px; }
              .header h1 { font-size: 2.5rem; font-weight: bold; margin-bottom: 0.5rem; }
              .header p { opacity: 0.9; font-size: 1.1rem; }
              .section { margin-bottom: 2rem; }
              .section h2 { font-size: 1.8rem; font-weight: bold; color: #1f2937; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 2px solid #e5e7eb; }
              .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
              .info-card { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15); }
              .info-card h3 { font-size: 1.1rem; opacity: 0.9; margin-bottom: 0.5rem; }
              .info-card .value { font-size: 2rem; font-weight: bold; margin-bottom: 0.5rem; }
              .info-card .subtitle { font-size: 0.9rem; opacity: 0.75; }
              .sheet-list { background: #f8fafc; border-radius: 12px; padding: 1.5rem; }
              .sheet-item { display: flex; align-items: center; padding: 1rem; margin-bottom: 0.5rem; background: white; border-radius: 8px; border-left: 4px solid #10b981; }
              .sheet-icon { margin-right: 1rem; font-size: 1.5rem; }
              .sheet-content h4 { font-weight: 600; margin-bottom: 0.25rem; }
              .sheet-content p { color: #6b7280; font-size: 0.9rem; }
              .footer { text-align: center; margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 0.9rem; }
            </style>
            
            <div class="header">
              <h1>📊 ${t('exportExcelPremium')}</h1>
              <p>${t('generatedOn')} ${new Date().toLocaleDateString('fr-FR')} ${new Date().toLocaleTimeString('fr-FR')}</p>
            </div>

            <div class="info-grid">
              <div class="info-card">
                <h3>${t('totalExpenses') || 'Total Dépenses'}</h3>
                <div class="value">${currentMonthExpenses.length}</div>
                <div class="subtitle">${t('expenses') || 'dépenses'} ${t('thisMonth')}</div>
              </div>
              <div class="info-card">
                <h3>${t('totalCategories') || 'Total Catégories'}</h3>
                <div class="value">${state.categories.length}</div>
                <div class="subtitle">${t('categories') || 'catégories'}</div>
              </div>
              <div class="info-card">
                <h3>${t('totalSavingsGoals') || 'Objectifs Épargne'}</h3>
                <div class="value">${state.savingsGoals ? state.savingsGoals.length : 0}</div>
                <div class="subtitle">${t('savingsGoals') || 'objectifs'}</div>
              </div>
            </div>

            <div class="section">
              <h2>📋 ${t('excelSheetsIncluded') || 'Feuilles incluses'}</h2>
              <div class="sheet-list">
                <div class="sheet-item">
                  <div class="sheet-icon">📊</div>
                  <div class="sheet-content">
                    <h4>${t('excelSheet1') || 'Vue d\'ensemble'}</h4>
                    <p>${t('excelSheet1Desc') || 'Métriques principales et résumé financier'}</p>
                  </div>
                </div>
                <div class="sheet-item">
                  <div class="sheet-icon">💰</div>
                  <div class="sheet-content">
                    <h4>${t('excelSheet2') || 'Dépenses détaillées'}</h4>
                    <p>${t('excelSheet2Desc') || 'Liste complète des dépenses avec catégories'}</p>
                  </div>
                </div>
                <div class="sheet-item">
                  <div class="sheet-icon">🎯</div>
                  <div class="sheet-content">
                    <h4>${t('excelSheet3') || 'Analyse par catégorie'}</h4>
                    <p>${t('excelSheet3Desc') || 'Répartition et analyse des dépenses par catégorie'}</p>
                  </div>
                </div>
                <div class="sheet-item">
                  <div class="sheet-icon">📈</div>
                  <div class="sheet-content">
                    <h4>${t('excelSheet4') || 'Objectifs d\'épargne'}</h4>
                    <p>${t('excelSheet4Desc') || 'Suivi des objectifs d\'épargne et progression'}</p>
                  </div>
                </div>
                <div class="sheet-item">
                  <div class="sheet-icon">💳</div>
                  <div class="sheet-content">
                    <h4>${t('excelSheet5') || 'Gestion des dettes'}</h4>
                    <p>${t('excelSheet5Desc') || 'Analyse détaillée des dettes et recommandations'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="footer">
              ${t('generatedBy')} ${state.userName || t('user')} | ${t('futureFinance')}
            </div>
          </div>
        `;
      } else {
        // Aperçu normal pour les autres types de rapports
        html = await ReportGenerator.generateHTML(reportData);
      }
      
      setPreviewHtml(html);
      setShowPreview(true);
      
      console.log('✅ Aperçu généré avec succès');
    } catch (error) {
      console.error('❌ Erreur génération aperçu:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [selectedReport, state, computedValues, t]);

  // Régénérer l'aperçu quand le type de rapport change
  useEffect(() => {
    if (showPreview) {
      handlePreview();
    }
  }, [selectedReport, showPreview, handlePreview]);

  const reportTypes = [
    {
      id: 'monthly',
      icon: Icons.Calendar,
      title: t('monthlyReport'),
      description: t('monthlyReportDesc')
    },
    {
      id: 'annual',
      icon: Icons.TrendingUp,
      title: t('annualReport'),
      description: t('annualReportDesc')
    },
    {
      id: 'budget',
      icon: Icons.Target,
      title: t('budgetAnalysis'),
      description: t('budgetAnalysisDesc')
    },
    {
      id: 'savings',
      icon: Icons.PiggyBank,
      title: t('savingsReport'),
      description: t('savingsReportDesc')
    },
    {
      id: 'debts',
      icon: Icons.CreditCard,
      title: t('debtAnalysis'),
      description: t('debtAnalysisDesc')
    },
    {
      id: 'excel',
      icon: Icons.FileSpreadsheet,
      title: t('exportExcelPremium'),
      description: t('exportExcelPremiumDesc')
    }
  ];

  const handleExport = async () => {
    setIsGenerating(true);
    try {
      // Calculer les données nécessaires pour le rapport
      const currentMonthExpenses = state.expenses.filter(e => 
        e.date.startsWith(state.selectedMonth)
      );
      
      const totalSpent = currentMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      const totalBudget = state.categories.reduce((sum, cat) => sum + cat.budget, 0);
      // ✅ CORRECTION : Calcul correct du taux d'épargne basé sur les revenus mensuels
      const savingsRate = state.monthlyIncome > 0 ? ((state.monthlyIncome - totalSpent) / state.monthlyIncome) * 100 : 0;
      
      const reportData = {
        type: selectedReport,
        data: {
          ...state,
          ...computedValues,
          selectedMonth: state.selectedMonth,
          language: state.language,
          totalSpent,
          totalBudget,
          savingsRate,
          currentMonthExpenses,
          userName: state.userName
        },
        translations: t
      };

      if (selectedReport === 'excel') {
        // Données complètes pour v3.0
        const excelData = {
          expenses: reportData.data.currentMonthExpenses,
          categories: reportData.data.categories,
          totalBudget: reportData.data.totalBudget,
          totalSpent: reportData.data.totalSpent,
          selectedMonth: reportData.data.selectedMonth,
          userName: reportData.data.userName || 'Utilisateur',
          language: reportData.data.language || 'fr',
          monthlyIncome: state.monthlyIncome || 0,
          savingsRate: reportData.data.savingsRate,
          savingsGoals: state.savingsGoals || [],
          debts: state.debts || [],
          recurringExpenses: state.recurringExpenses || []
        };
        // Options avancées v3.0
        const options = {
          template: selectedTemplate,
          chartTypes: ['pie', 'column', 'line'], // Default chart types
          theme: selectedTheme,
          language: state.language, // Utilise la langue de l'interface
          enableCache: false  // 🔧 Désactivé temporairement pour éviter le cache
        };
        console.log('LANGUE PASSEE A L EXPORT EXCEL :', options.language);
        const result = await ExcelExportEngine.exportProfessionalBudget(excelData, options);
        if (result.success) {
          // Export normal (navigateur)
          const blob = new Blob([result.buffer], { 
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
          });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = result.fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          showNotification(`✅ Export Excel réussi: ${result.fileName}`, 'success');
        } else {
          showNotification(`❌ Erreur export Excel: ${result.error}`, 'error');
        }
      } else if (selectedFormat === 'html') {
        const htmlResult = await ReportGenerator.exportHTML(reportData);
        if (htmlResult.success) {
          // Export normal (navigateur)
          // Télécharger le fichier HTML normalement
          const blob = new Blob([htmlResult.html], { type: 'text/html' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = htmlResult.fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          showNotification(`Export HTML réussi: ${htmlResult.fileName}`, 'success');
        } else {
          showNotification('Erreur lors de l\'export HTML', 'error');
        }
      } else {
        console.log('🔄 Tentative d\'export PDF...');
        const pdfResult = await ReportGenerator.exportPDF(reportData);
        if (pdfResult.success) {
          // Export normal (navigateur)
          // Télécharger le fichier PDF normalement
          const blob = new Blob([pdfResult.buffer], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = pdfResult.fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          showNotification(`Export PDF réussi: ${pdfResult.fileName}`, 'success');
        } else {
          console.error('Erreur export PDF:', pdfResult.error);
          showNotification(`Erreur export PDF: ${pdfResult.error}`, 'error');
          
          // Proposer l'export HTML comme fallback
          if (window.confirm('L\'export PDF a échoué. Voulez-vous essayer l\'export HTML à la place ?')) {
            const htmlResult = await ReportGenerator.exportHTML(reportData);
            if (htmlResult.success) {
              // Télécharger le fichier HTML normalement (fallback)
              const blob = new Blob([htmlResult.html], { type: 'text/html' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = htmlResult.fileName;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
              showNotification(`Export HTML réussi: ${htmlResult.fileName}`, 'success');
            } else {
              showNotification('Erreur lors de l\'export HTML', 'error');
            }
          }
        }
      }
    } catch (error) {
      console.error('Erreur export:', error);
      showNotification(t('exportError'), 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  if (showPreview) {
    return (
      <Modal
        isOpen={state.modals.export}
        onClose={() => {
          setShowPreview(false);
          actions.toggleModal('export', false);
        }}
        title={t('reportPreview')}
        maxWidth="max-w-6xl"
      >
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Button
              onClick={() => setShowPreview(false)}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Icons.ArrowLeft className="h-4 w-4" />
              <span>{t('back')}</span>
            </Button>
            <div className="flex space-x-2">
              <Button
                onClick={handleExport}
                disabled={isGenerating}
                className="flex items-center space-x-2"
              >
                <Icons.Download className="h-4 w-4" />
                <span>{selectedFormat === 'html' ? 'HTML' : 'PDF'}</span>
              </Button>
            </div>
          </div>
          
          <div 
            className="border rounded-lg p-4 max-h-96 overflow-auto bg-white"
            dangerouslySetInnerHTML={{ __html: previewHtml }}
          />
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={state.modals.export}
      onClose={() => actions.toggleModal('export', false)}
      title={t('exportReports')}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6">
        {/* Sélection du type de rapport */}
        <div>
          <h4 className={`font-medium ${theme.text} mb-3`}>{t('selectReportType')}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {reportTypes.map((report) => {
              const IconComponent = report.icon;
              return (
                <button
                  key={report.id}
                  onClick={() => setSelectedReport(report.id)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    selectedReport === report.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <IconComponent className={`h-5 w-5 mt-0.5 ${
                      selectedReport === report.id ? 'text-blue-600' : 'text-gray-500'
                    }`} />
                    <div>
                      <div className={`font-medium ${theme.text}`}>
                        {report.title}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {report.description}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sélection du format - Masqué pour Excel */}
        {selectedReport !== 'excel' && (
          <div>
            <h4 className={`font-medium ${theme.text} mb-3`}>{t('selectFormat')}</h4>
            <div className="flex space-x-4">
              <button
                onClick={() => setSelectedFormat('html')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${
                  selectedFormat === 'html'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <Icons.Globe className="h-4 w-4" />
                <span>HTML</span>
              </button>
              <button
                onClick={() => setSelectedFormat('pdf')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${
                  selectedFormat === 'pdf'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <Icons.FileText className="h-4 w-4" />
                <span>PDF</span>
              </button>
            </div>
          </div>
        )}

        {/* Info Excel Premium */}
        {selectedReport === 'excel' && (
          <>
            <div className="mb-4">
              <h4 className={`font-medium ${theme.text} mb-3`}>{t('excelTemplate')}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[{ key: 'comprehensive', name: t('excelComplet'), desc: t('excelCompletDesc') }].map((template) => (
                  <button
                    key={template.key}
                    onClick={() => setSelectedTemplate(template.key)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      selectedTemplate === template.key
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="font-medium">{template.name}</div>
                    <div className="text-sm text-gray-500 mt-1">{template.desc}</div>
                  </button>
                ))}
              </div>
            </div>
            {/* Supprimer tout bloc ou texte sur les autres templates et 'Available templates' */}
            <div className="mb-4">
              <h4 className={`font-medium ${theme.text} mb-3`}>{t('excelThemeColor')}</h4>
              <select
                value={selectedTheme}
                onChange={e => setSelectedTheme(e.target.value)}
                className="p-2 rounded border border-gray-300 dark:border-gray-700"
              >
                <option value="green">🟢</option>
                <option value="blue">🔵</option>
                <option value="purple">🟣</option>
                <option value="orange">🟠</option>
              </select>
            </div>
            {/* Bloc d'information sur les templates supprimé */}
          </>
        )}

        {/* Actions */}
        <div className="flex justify-between space-x-3">
          <Button
            onClick={handlePreview}
            disabled={isGenerating}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <Icons.Eye className="h-4 w-4" />
            <span>{t('preview')}</span>
          </Button>
          
          <Button
            onClick={handleExport}
            disabled={isGenerating}
            className="flex items-center space-x-2"
          >
            {isGenerating ? (
              <Icons.Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Icons.Download className="h-4 w-4" />
            )}
            <span>{selectedReport === 'excel' ? t('exportExcel') : t('export')}</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
});

export default ExportModal; 