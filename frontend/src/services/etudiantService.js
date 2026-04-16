// src/services/etudiantService.js
import api from './api';

const etudiantService = {
    getAll: () => api.get('/etudiants'),
    getById: (id) => api.get(`/etudiants/${id}`),
    create: (data) => api.post('/etudiants', data),
    update: (id, data) => api.put(`/etudiants/${id}`, data),
    delete: (id) => api.delete(`/etudiants/${id}`),
};

export default etudiantService;   // ← Très important : export default