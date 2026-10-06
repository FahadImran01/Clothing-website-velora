import api from './api';

const uploadImages = (files) => {
  const formData = new FormData();
  Array.from(files).forEach((file) => formData.append('images', file));
  return api.post('/upload', formData).then((res) => res.data);
};

export default { uploadImages };
