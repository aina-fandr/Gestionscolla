// src/services/paiementService.js
import api from './api';

const paiementService = {
    getStats: () => api.get('/paiements/stats'),
    // Tu peux ajouter d'autres méthodes plus tard
    getAll: () => api.get('/paiements'),
    getByEtudiant: (etudiantId) => api.get(`/paiements/etudiant/${etudiantId}`),
};

export default paiementService;