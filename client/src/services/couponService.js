import api from './api';

const getCoupons = () => api.get('/coupons').then((res) => res.data);
const validateCoupon = (code) => api.get(`/coupons/validate/${code}`).then((res) => res.data);
const createCoupon = (data) => api.post('/coupons', data).then((res) => res.data);
const updateCoupon = (id, data) => api.put(`/coupons/${id}`, data).then((res) => res.data);
const deleteCoupon = (id) => api.delete(`/coupons/${id}`).then((res) => res.data);

export default { getCoupons, validateCoupon, createCoupon, updateCoupon, deleteCoupon };
