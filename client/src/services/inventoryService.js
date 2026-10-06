import api from './api';

const getInventory = (params) => api.get('/inventory', { params }).then((res) => res.data);
const updateStock = (id, data) => api.put(`/inventory/${id}`, data).then((res) => res.data);

export default { getInventory, updateStock };
