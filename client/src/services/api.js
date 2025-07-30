import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://quiz-web-vvlj.onrender.com';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
  changePassword: (passwordData) => api.put('/auth/change-password', passwordData),
};

// Quiz API
export const quizAPI = {
  getQuestions: (params = {}) => api.get('/quiz/questions', { params }),
  getCategories: () => api.get('/quiz/categories'),
  getStats: () => api.get('/quiz/stats'),
};

// Results API
export const resultsAPI = {
  saveResult: (resultData) => api.post('/results/save', resultData),
  getMyResults: (params = {}) => api.get('/results/my-results', { params }),
  getResult: (id) => api.get(`/results/result/${id}`),
  getStats: () => api.get('/results/stats'),
  deleteResult: (id) => api.delete(`/results/result/${id}`),
  getLeaderboard: (params = {}) => api.get('/results/leaderboard', { params }),
};

export default api; 
