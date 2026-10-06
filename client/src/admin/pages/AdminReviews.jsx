import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiCheck, FiTrash2 } from 'react-icons/fi';
import reviewService from '../../services/reviewService';
import ConfirmModal from '../components/ConfirmModal';
import Loader from '../../components/Loader';
import '../AdminShared.css';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = () => {
    setLoading(true);
    reviewService.getReviews({ allStatuses: true }).then(setReviews).catch(() => toast.error('Could not load reviews')).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleApprove = async (r) => {
    try {
      await reviewService.approveReview(r._id);
      toast.success('Review approved');
      setReviews((prev) => prev.map((x) => (x._id === r._id ? { ...x, isApproved: true } : x)));
    } catch (err) {
      toast.error(err.message || 'Could not approve review');
    }
  };

  const handleDelete = async () => {
    try {
      await reviewService.deleteReview(deleteTarget._id);
      toast.success('Review removed');
      setReviews((prev) => prev.filter((x) => x._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.message || 'Could not delete review');
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="admin-page-header"><h2>Reviews</h2></div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Product</th><th>Customer</th><th>Rating</th><th>Comment</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {reviews.length === 0 ? (
              <tr><td colSpan={6}><div className="admin-empty">No reviews yet.</div></td></tr>
            ) : reviews.map((r) => (
              <tr key={r._id}>
                <td>{r.product?.name || '—'}</td>
                <td>{r.name}</td>
                <td style={{ color: '#d4a017' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</td>
                <td style={{ maxWidth: 280 }}>{r.comment}</td>
                <td><span className={`status-pill ${r.isApproved ? 'status-in' : 'status-low'}`}>{r.isApproved ? 'Approved' : 'Pending'}</span></td>
                <td>
                  <div className="admin-table-actions">
                    {!r.isApproved && <button onClick={() => handleApprove(r)}><FiCheck size={16} /></button>}
                    <button className="danger" onClick={() => setDeleteTarget(r)}><FiTrash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {deleteTarget && (
        <ConfirmModal
          title="Delete Review"
          message="Are you sure you want to delete this review?"
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
};

export default AdminReviews;
