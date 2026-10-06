import api from './api';

const createOrder = (data) => api.post('/orders', data).then((res) => res.data);
const getMyOrders = () => api.get('/orders/my-orders').then((res) => res.data);
const getOrderById = (id) => api.get(`/orders/${id}`).then((res) => res.data);
const getAllOrders = (params) => api.get('/orders', { params }).then((res) => res.data);
const updateOrderStatus = (id, status) => api.put(`/orders/${id}`, { status }).then((res) => res.data);
const cancelOrder = (id, email) => api.put(`/orders/${id}/cancel`, { email }).then((res) => res.data);
const trackOrder = (orderId, email) => api.get(`/orders/track/${orderId}`, { params: { email } }).then((res) => res.data);

export default { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus, cancelOrder, trackOrder };
