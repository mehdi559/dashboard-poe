import React from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

const ResetAppModal = ({ isOpen, onClose, onConfirm, title, message, cancelLabel, confirmLabel }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <h2>{title}</h2>
    <p>{message}</p>
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
      <Button onClick={onClose} variant="secondary">{cancelLabel}</Button>
      <Button onClick={onConfirm} variant="danger">{confirmLabel}</Button>
    </div>
  </Modal>
);

export default ResetAppModal; 