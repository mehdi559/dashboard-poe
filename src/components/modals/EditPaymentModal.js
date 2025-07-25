import React, { memo, useState, useEffect } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Modal from '../ui/Modal';

const EditPaymentModal = memo(({ financeManager, theme, t }) => {
  const { state, actions, formatCurrency } = financeManager;
  const [formData, setFormData] = useState({
    amount: '',
    date: '',
    description: ''
  });

  // Initialiser le formulaire quand le modal s'ouvre
  useEffect(() => {
    if (state.editingItem && state.modals.editPayment) {
      setFormData({
        amount: state.editingItem.amount || '',
        date: state.editingItem.date || new Date().toISOString().split('T')[0],
        description: state.editingItem.description || ''
      });
    }
  }, [state.editingItem, state.modals.editPayment]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (actions.updatePayment(state.editingItem.debtId, state.editingItem.id, formData)) {
      actions.toggleModal('editPayment', false);
      actions.setEditingItem(null);
      setFormData({ amount: '', date: '', description: '' });
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!state.editingItem) return null;

  return (
    <Modal
      isOpen={state.modals.editPayment}
      onClose={() => {
        actions.toggleModal('editPayment', false);
        actions.setEditingItem(null);
        setFormData({ amount: '', date: '', description: '' });
      }}
      title={t('editPayment') || 'Modifier le paiement'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className={`p-4 rounded-lg ${theme.bg} border ${theme.border}`}>
          <p className={`text-sm ${theme.textSecondary} mb-2`}>{t('paymentInformation') || 'Informations du paiement'}</p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>{t('originalAmount') || 'Montant original'}</span>
              <span className="font-medium text-green-600">
                {formatCurrency(state.editingItem.amount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>{t('originalDate') || 'Date originale'}</span>
              <span className={theme.text}>
                {new Date(state.editingItem.date).toLocaleDateString('fr-FR')}
              </span>
            </div>
          </div>
        </div>
        
        <Input
          label={t('paymentAmount') || 'Montant du paiement'}
          type="number"
          step="0.01"
          min="0"
          value={formData.amount}
          onChange={(value) => handleInputChange('amount', value)}
          required
        />
        
        <Input
          label={t('paymentDate') || 'Date du paiement'}
          type="date"
          value={formData.date}
          onChange={(value) => handleInputChange('date', value)}
          required
        />
        
        <Input
          label={t('description') || 'Description'}
          type="text"
          value={formData.description}
          onChange={(value) => handleInputChange('description', value)}
          placeholder={t('paymentDescription') || 'Description du paiement'}
        />
        
        <div className="flex space-x-2 pt-4">
          <Button type="submit" variant="success" className="flex-1" loading={state.loading}>
            {t('update') || 'Mettre à jour'}
          </Button>
          <Button 
            type="button"
            variant="outline" 
            onClick={() => {
              actions.toggleModal('editPayment', false);
              actions.setEditingItem(null);
              setFormData({ amount: '', date: '', description: '' });
            }}
            className="flex-1"
          >
            {t('cancel') || 'Annuler'}
          </Button>
        </div>
      </form>
    </Modal>
  );
});

export default EditPaymentModal; 