import React from 'react';
import './ConfirmDialog.css';

const ConfirmDialog = ({ title, message, onConfirm, onCancel, confirmLabel = 'Confirm' }) => (
  <div className="confirm-dialog-backdrop" onClick={onCancel}>
    <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
      <h3>{title}</h3>
      <p>{message}</p>
      <div className="confirm-dialog-actions">
        <button className="btn btn-outline" onClick={onCancel}>Go Back</button>
        <button className="btn confirm-dialog-danger" onClick={onConfirm}>{confirmLabel}</button>
      </div>
    </div>
  </div>
);

export default ConfirmDialog;
