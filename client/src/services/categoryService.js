import api from './api';

const getCategories = () => api.get('/categories').then((res) => res.data);
const createCategory = (data) => api.post('/categories', data).then((res) => res.data);
const updateCategory = (id, data) => api.put(`/categories/${id}`, data).then((res) => res.data);
const deleteCategory = (id) => api.delete(`/categories/${id}`).then((res) => res.data);

export default { getCategories, createCategory, updateCategory, deleteCategory };
