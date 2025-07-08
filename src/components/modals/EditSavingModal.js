import React, { memo } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Modal from '../ui/Modal';

const EditSavingModal = memo(({ financeManager, theme, t }) => {
  const { state, actions, formatCurrency } = financeManager;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (actions.addSavingsTransaction(state.editingItem.id, state.savingTransaction)) {
      actions.toggleModal('editSaving', false);
      actions.setEditingItem(null);
      actions.resetForm('savingTransaction');
    }
  };

  if (!state.editingItem) return null;

  return (
    <Modal
      isOpen={state.modals.editSaving}
      onClose={() => {
        actions.toggleModal('editSaving', false);
        actions.setEditingItem(null);
        actions.resetForm('savingTransaction');
      }}
      title={`Modifier l'épargne - ${state.editingItem.name}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className={`p-4 rounded-lg ${theme.bg} border ${theme.border}`}>
          <p className={`text-sm ${theme.textSecondary} mb-2`}>Informations de l'objectif:</p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Montant actuel:</span>
              <span className="font-medium text-green-600">
                {formatCurrency(state.editingItem.currentAmount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Objectif:</span>
              <span className={theme.text}>{formatCurrency(state.editingItem.targetAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span>Progression:</span>
              <span className={theme.text}>
                {((state.editingItem.currentAmount / state.editingItem.targetAmount) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
        
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Type d'opération <span className="text-red-500">*</span>
          </label>
          <select
            value={state.savingTransaction.type}
            onChange={(e) => actions.updateForm('savingTransaction', { type: e.target.value })}
            className={`w-full px-3 py-2 text-base border rounded-lg ${theme.input}`}
            required
          >
            <option value="add">Ajouter de l'argent</option>
            <option value="remove">Retirer de l'argent</option>
          </select>
        </div>
        
        <Input
          label="Montant"
          type="number"
          step="0.01"
          min="0"
          max={state.savingTransaction.type === 'remove' ? state.editingItem.currentAmount : state.editingItem.targetAmount - state.editingItem.currentAmount}
          value={state.savingTransaction.amount}
          onChange={(value) => actions.updateForm('savingTransaction', { amount: value })}
          error={state.errors.amount}
          required
        />
        
        <Input
          label="Description"
          type="text"
          value={state.savingTransaction.description}
          onChange={(value) => actions.updateForm('savingTransaction', { description: value })}
          error={state.errors.description}
          required
          minLength={3}
          maxLength={100}
          placeholder="Ex: Virement mensuel, Bonus travail..."
        />
        
        <div className="flex space-x-2 pt-4">
          <Button type="submit" variant={state.savingTransaction.type === 'add' ? 'success' : 'danger'} className="flex-1" loading={state.loading}>
            {state.savingTransaction.type === 'add' ? 'Ajouter' : 'Retirer'}
          </Button>
          <Button 
            type="button"
            variant="outline" 
            onClick={() => {
              actions.toggleModal('editSaving', false);
              actions.setEditingItem(null);
              actions.resetForm('savingTransaction');
            }}
            className="flex-1"
          >
            Annuler
          </Button>
        </div>
      </form>
    </Modal>
  );
});

export default EditSavingModal; 