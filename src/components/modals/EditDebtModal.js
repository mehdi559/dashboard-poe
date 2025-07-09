import React, { memo, useEffect } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Modal from '../ui/Modal';

const EditDebtModal = memo(({ financeManager, theme, t }) => {
  const { state, actions } = financeManager;

  // Réinitialiser le formulaire quand le modal s'ouvre
  useEffect(() => {
    if (state.editingItem && state.modals.editDebt) {
      actions.updateForm('editDebt', {
        name: state.editingItem.name,
        balance: state.editingItem.balance,
        minPayment: state.editingItem.minPayment,
        rate: state.editingItem.rate
      });
    }
  }, [state.editingItem, state.modals.editDebt, actions]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (actions.updateDebt(state.editingItem.id, state.editDebt)) {
      actions.toggleModal('editDebt', false);
      actions.setEditingItem(null);
      actions.resetForm('editDebt');
    }
  };

  const handleCancel = () => {
    actions.toggleModal('editDebt', false);
    actions.setEditingItem(null);
    actions.resetForm('editDebt');
  };

  if (!state.editingItem) return null;

  return (
    <Modal
      isOpen={state.modals.editDebt}
      onClose={handleCancel}
      title={t('editDebtTitle', { name: state.editingItem.name })}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className={`p-4 rounded-lg ${theme.bg} border ${theme.border}`}>
          <p className={`text-sm ${theme.textSecondary} mb-2`}>{t('editDebtInformation')}</p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>{t('currentBalance')}:</span>
              <span className="font-medium text-red-600">
                {state.editingItem.balance}
              </span>
            </div>
            <div className="flex justify-between">
              <span>{t('minimumPayment')}:</span>
              <span className={theme.text}>{state.editingItem.minPayment}</span>
            </div>
            <div className="flex justify-between">
              <span>{t('interestRate')}:</span>
              <span className={theme.text}>{state.editingItem.rate}%</span>
            </div>
          </div>
        </div>
        
        <Input
          label={t('debtName')}
          type="text"
          value={state.editDebt.name}
          onChange={(value) => actions.updateForm('editDebt', { name: value })}
          error={state.errors.name}
          required
          minLength={2}
          maxLength={50}
        />
        
        <Input
          label={t('currentBalance')}
          type="number"
          step="0.01"
          min="0"
          value={state.editDebt.balance}
          onChange={(value) => actions.updateForm('editDebt', { balance: value })}
          error={state.errors.balance}
          required
        />
        
        <Input
          label={t('minimumPayment')}
          type="number"
          step="0.01"
          min="0"
          value={state.editDebt.minPayment}
          onChange={(value) => actions.updateForm('editDebt', { minPayment: value })}
          error={state.errors.minPayment}
          required
        />
        
        <Input
          label={t('interestRate')}
          type="number"
          step="0.1"
          min="0"
          max="100"
          value={state.editDebt.rate}
          onChange={(value) => actions.updateForm('editDebt', { rate: value })}
          error={state.errors.rate}
          required
        />
        
        <div className="flex space-x-2 pt-4">
          <Button type="submit" variant="primary" className="flex-1" loading={state.loading}>
            {t('update')}
          </Button>
          <Button 
            type="button"
            variant="outline" 
            onClick={handleCancel}
            className="flex-1"
          >
            {t('cancel')}
          </Button>
        </div>
      </form>
    </Modal>
  );
});

export default EditDebtModal; 