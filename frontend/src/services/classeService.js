// src/services/classeService.js
import api from './api';

const classeService = {
    getAll: () => api.get('/classes'),
    getById: (id) => api.get(`/classes/${id}`),
    create: (data) => api.post('/classes', data),
    update: (id, data) => api.put(`/classes/${id}`, data),
    delete: (id) => api.delete(`/classes/${id}`),
};

export default classeService;   // ← Doit être comme ça