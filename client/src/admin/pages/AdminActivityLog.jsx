import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import activityLogService from '../../services/activityLogService';
import Loader from '../../components/Loader';
import '../AdminShared.css';

const AdminActivityLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    activityLogService.getActivityLogs()
      .then(setLogs)
      .catch(() => toast.error('Could not load activity log'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <div className="admin-page-header"><h2>Activity Log</h2></div>
      <p style={{ fontSize: '0.85rem', color: 'var(--color-gray)', marginBottom: 20 }}>
        A record of recent admin actions across the store — the most recent 200 entries.
      </p>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>When</th><th>Admin</th><th>Action</th><th>Target</th><th>Details</th></tr></thead>
          <tbody>
            {logs.length === 0 ? (
              <tr><td colSpan={5}><div className="admin-empty">No activity recorded yet.</div></td></tr>
            ) : logs.map((log) => (
              <tr key={log._id}>
                <td style={{ whiteSpace: 'nowrap' }}>{new Date(log.createdAt).toLocaleString()}</td>
                <td>{log.adminName}</td>
                <td>{log.action}</td>
                <td>{log.targetType}{log.targetLabel ? ` — ${log.targetLabel}` : ''}</td>
                <td style={{ color: 'var(--color-gray)' }}>{log.details || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminActivityLog;
