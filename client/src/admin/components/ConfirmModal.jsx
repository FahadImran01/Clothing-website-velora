import React from 'react';

const ConfirmModal = ({ title, message, onConfirm, onCancel, confirmLabel = 'Delete' }) => (
  <div className="admin-modal-backdrop" onClick={onCancel}>
    <div className="admin-modal admin-confirm-modal" onClick={(e) => e.stopPropagation()}>
      <h3>{title}</h3>
      <p>{message}</p>
      <div className="admin-confirm-actions">
        <button className="btn btn-outline admin-btn-sm" onClick={onCancel}>Cancel</button>
        <button className="btn btn-dark admin-btn-sm" onClick={onConfirm} style={{ background: '#b0231f', borderColor: '#b0231f' }}>{confirmLabel}</button>
      </div>
    </div>
  </div>
);

export default ConfirmModal;
