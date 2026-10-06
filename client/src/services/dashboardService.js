import api from './api';

const getStats = () => api.get('/dashboard').then((res) => res.data);

export default { getStats };
