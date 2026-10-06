import api from './api';

const getUsers = (params) => api.get('/users', { params }).then((res) => res.data);
const getUserById = (id) => api.get(`/users/${id}`).then((res) => res.data);
const toggleUserStatus = (id) => api.put(`/users/${id}/status`).then((res) => res.data);
const getWishlist = () => api.get('/users/me/wishlist').then((res) => res.data);
const toggleWishlist = (productId) => api.put(`/users/me/wishlist/${productId}`).then((res) => res.data);
const addAddress = (data) => api.post('/users/me/addresses', data).then((res) => res.data);
const deleteAddress = (id) => api.delete(`/users/me/addresses/${id}`).then((res) => res.data);

export default { getUsers, getUserById, toggleUserStatus, getWishlist, toggleWishlist, addAddress, deleteAddress };
