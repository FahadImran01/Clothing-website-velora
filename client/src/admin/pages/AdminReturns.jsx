import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import returnService from '../../services/returnService';
import Loader from '../../components/Loader';
import '../AdminShared.css';

const STATUSES = ['Pending', 'Approved', 'Rejected', 'Refunded'];

const AdminReturns = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const load = () => {
    setLoading(true);
    returnService.getReturnRequests(statusFilter ? { status: statusFilter } : {})
      .then(setRequests)
      .catch(() => toast.error('Could not load return requests'))
      .finally(() => setLoading(false));
  };

  useEffect(load, [statusFilter]); // eslint-disable-line

  const handleStatusChange = async (request, status) => {
    try {
      await returnService.updateReturnStatus(request._id, status);
      toast.success('Return status updated');
      setRequests((prev) => prev.map((r) => (r._id === request._id ? { ...r, status } : r)));
    } catch (err) {
      toast.error(err.message || 'Could not update return status');
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="admin-page-header"><h2>Returns</h2></div>

      <div className="admin-toolbar">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Order</th><th>Customer</th><th>Reason</th><th>Requested</th><th>Status</th></tr></thead>
          <tbody>
            {requests.length === 0 ? (
              <tr><td colSpan={5}><div className="admin-empty">No return requests yet.</div></td></tr>
            ) : requests.map((r) => (
              <tr key={r._id}>
                <td>#{r.order?._id?.slice(-8).toUpperCase() || '—'}</td>
                <td>{r.user?.name || r.email}</td>
                <td style={{ maxWidth: 260 }}>{r.reason}</td>
                <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                <td>
                  <select
                    value={r.status}
                    onChange={(e) => handleStatusChange(r, e.target.value)}
                    style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid #e0ded7', fontSize: '0.8rem' }}
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminReturns;
