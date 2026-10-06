import api from './api';

const createReturnRequest = (data) => api.post('/returns', data).then((res) => res.data);
const getReturnRequests = (params) => api.get('/returns', { params }).then((res) => res.data);
const updateReturnStatus = (id, status) => api.put(`/returns/${id}`, { status }).then((res) => res.data);

export default { createReturnRequest, getReturnRequests, updateReturnStatus };
