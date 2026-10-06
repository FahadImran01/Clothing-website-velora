import React, { useState } from 'react';
import toast from 'react-hot-toast';
import returnService from '../services/returnService';
import './ReturnRequestForm.css';

const ReturnRequestForm = ({ orderId, email, onSubmitted }) => {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) return;
    setSubmitting(true);
    try {
      await returnService.createReturnRequest({ orderId, reason: reason.trim(), email });
      toast.success('Return request submitted');
      setOpen(false);
      setReason('');
      onSubmitted?.();
    } catch (err) {
      toast.error(err.message || 'Could not submit return request');
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) {
    return (
      <button type="button" className="btn btn-outline return-request-trigger" onClick={() => setOpen(true)}>
        Request Return
      </button>
    );
  }

  return (
    <form className="return-request-form" onSubmit={handleSubmit}>
      <textarea
        placeholder="Tell us why you'd like to return this order..."
        required
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        rows={3}
      />
      <div className="return-request-form-actions">
        <button type="button" className="btn btn-outline" onClick={() => setOpen(false)}>Cancel</button>
        <button type="submit" className="btn btn-dark" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Request'}
        </button>
      </div>
    </form>
  );
};

export default ReturnRequestForm;
