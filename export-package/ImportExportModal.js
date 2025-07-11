import React, { memo } from 'react';
import * as Icons from 'lucide-react';
import Button from '../ui/Button';
import Modal from '../ui/Modal';

const ImportExportModal = memo(({ financeManager, theme, t }) => {
  const { state, actions } = financeManager;

  const handleExportJSON = () => {
    console.log('Clic sur Export JSON');
    actions.exportData();
  };

  const handleExportCSV = () => {
    console.log('Clic sur Export CSV');
    actions.exportExpensesToCSV();
  };

  console.log('Modal import ouvert:', state.modals.import);

  return (
    <Modal
      isOpen={state.modals.import}
      onClose={() => actions.toggleModal('import', false)}
      title="Exporter les données"
      maxWidth="max-w-lg"
    >
      <div className="space-y-6">
        <div>
          <h4 className={`font-medium ${theme.text} mb-3`}>Choisissez le format d'export :</h4>
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={handleExportJSON}
              className="flex items-center justify-center space-x-2 p-4"
              aria-label="Exporter toutes les données en JSON"
            >
              <Icons.Download className="h-5 w-5" />
              <span>Export JSON</span>
            </Button>
            <Button
              onClick={handleExportCSV}
              variant="outline"
              className="flex items-center justify-center space-x-2 p-4"
              aria-label="Exporter les dépenses en CSV"
            >
              <Icons.FileText className="h-5 w-5" />
              <span>Export CSV</span>
            </Button>
          </div>
          
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Export JSON :</strong> Toutes vos données (dépenses, catégories, objectifs, etc.)
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              <strong>Export CSV :</strong> Uniquement vos dépenses (pour Excel/Sheets)
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
});

export default ImportExportModal; 