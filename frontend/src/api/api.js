import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: BASE_URL,
});

export const postsApi = {
    getAll: () => api.get('/posts'),
    getOne: (id) => api.get(`/posts/${id}`),
    create: (post) => api.post('/posts', post),
    update: (id, post) => api.put(`/posts/${id}`, post),
    delete: (id) => api.delete(`/posts/${id}`),
    like: (id) => api.post(`/posts/${id}/like`),
    view: (id) => api.post(`/posts/${id}/view`),
};

export const commentsApi = {
    getByPostId: (postId) => api.get(`/comments/post/${postId}`),
    add: (postId, comment) => api.post(`/comments/post/${postId}`, comment),
};

export const uploadApi = {
    upload: (formData) => api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
};

export const statsApi = {
    getStats: () => api.get('/stats'),
};

export default api;
