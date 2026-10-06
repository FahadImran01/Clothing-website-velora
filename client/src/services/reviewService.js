import api from './api';

const getReviews = (params) => api.get('/reviews', { params }).then((res) => res.data);
const createReview = (data) => api.post('/reviews', data).then((res) => res.data);
const approveReview = (id) => api.put(`/reviews/${id}/approve`).then((res) => res.data);
const deleteReview = (id) => api.delete(`/reviews/${id}`).then((res) => res.data);

export default { getReviews, createReview, approveReview, deleteReview };
