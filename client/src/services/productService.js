import api from './api';

const getProducts = (params) => api.get('/products', { params }).then((res) => res.data);
const getProductById = (id) => api.get(`/products/${id}`).then((res) => res.data);
const createProduct = (data) => api.post('/products', data).then((res) => res.data);
const updateProduct = (id, data) => api.put(`/products/${id}`, data).then((res) => res.data);
const deleteProduct = (id) => api.delete(`/products/${id}`).then((res) => res.data);

export default { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
