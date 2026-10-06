import api from './api';

const getActivityLogs = () => api.get('/activity-logs').then((res) => res.data);

export default { getActivityLogs };
