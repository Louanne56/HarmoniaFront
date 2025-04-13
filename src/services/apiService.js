import axios from 'axios';
import { API_URL, BASE_URL } from './apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuration de base de l'API
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 secondes de timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// Variables pour la gestion du refresh token
let isRefreshing = false;
let failedQueue = [];

// Traite les requêtes en attente après un refresh token
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    error ? prom.reject(error) : prom.resolve(token);
  });
  failedQueue = [];
};

// --- FONCTIONS D'AUTHENTIFICATION --- //

// Inscription d'un nouvel utilisateur
export const inscrireUtilisateur = async (userData) => {
  try {
    const response = await apiClient.post('/auth/inscription', userData);
    return { success: true, data: response.data };
  } catch (error) {
    const errorData = error.response?.data;
    return {
      success: false,
      message: errorData?.message || "Erreur lors de l'inscription",
      errors: errorData?.errors || []
    };
  }
};

// --- INTERCEPTEURS --- //

// Ajoute automatiquement le token JWT aux requêtes
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  error => Promise.reject(error)
);

// Gère les erreurs 401 (token expiré)
apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // Si token invalide et pas déjà en cours de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return apiClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Refresh du token
        const [token, refreshToken] = await Promise.all([
          AsyncStorage.getItem('token'),
          AsyncStorage.getItem('refreshToken')
        ]);

        const { data } = await apiClient.post('/auth/refresh-token', { token, refreshToken });
        await AsyncStorage.multiSet([
          ['token', data.token],
          ['refreshToken', data.refreshToken]
        ]);

        // Ré-exécute la requête originale
        originalRequest.headers['Authorization'] = `Bearer ${data.token}`;
        processQueue(null, data.token);
        return apiClient(originalRequest);

      } catch (refreshError) {
        await AsyncStorage.multiRemove(['token', 'refreshToken', 'user']);
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

// --- FONCTIONS MUSICALES --- //

// Récupère les progressions filtrées
export const getProgressions = async (tonalite, mode, style = null) => {
  let url = `/progressions/filtred?tonalite=${tonalite}&mode=${mode}`;
  if (style) url += `&style=${style}`;
  const response = await apiClient.get(url);
  return response.data;
};

// --- FONCTIONS DE FAVORIS --- //

// Récupère les favoris d'un utilisateur
export const getUserFavorites = async (userId) => {
  const response = await apiClient.get(`/suites-favorites/user/${userId}`);
  return response.data;
};

// Ajoute/supprime un favori
export const toggleFavoriteAPI = async (userId, progressionId, isFavorite) => {
  if (isFavorite) {
    await apiClient.delete(`/suites-favorites/user/${userId}/progression/${progressionId}`);
  } else {
    await apiClient.post(`/suites-favorites`, { 
      userId, 
      progressionAccordsId: progressionId 
    });
  }
  return true;
};


// Génère l'URL complète d'une ressource
export const getResourceUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  const baseUrl = BASE_URL || API_URL.replace('/api', '');
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
};

// Export de l'instance configurée
export const api = apiClient;