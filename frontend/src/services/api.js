import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
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
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  // Register user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Firebase authentication
  firebaseAuth: async (firebaseData) => {
    const response = await api.post('/auth/firebase-auth', firebaseData);
    return response.data;
  },

  // Get user profile
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await api.put('/auth/profile', userData);
    return response.data;
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await api.put('/auth/change-password', passwordData);
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  }
};

// Assessment API calls
export const assessmentAPI = {
  // Create assessment
  createAssessment: async (assessmentData) => {
    const response = await api.post('/assessments', assessmentData);
    return response.data;
  },

  // Get user assessments
  getUserAssessments: async (params = {}) => {
    const response = await api.get('/assessments', { params });
    return response.data;
  },

  // Get assessment details
  getAssessment: async (assessmentId) => {
    const response = await api.get(`/assessments/${assessmentId}`);
    return response.data;
  },

  // Start assessment
  startAssessment: async (assessmentId) => {
    const response = await api.post(`/assessments/${assessmentId}/start`);
    return response.data;
  },

  // Submit assessment response
  submitResponse: async (assessmentId, responseData) => {
    const response = await api.post(`/assessments/${assessmentId}/responses`, responseData);
    return response.data;
  },

  // Complete assessment
  completeAssessment: async (assessmentId) => {
    const response = await api.post(`/assessments/${assessmentId}/complete`);
    return response.data;
  },

  // Get career questions
  getCareerQuestions: async () => {
    const response = await api.get('/assessments/questions');
    return response.data;
  },

  // Submit career answers
  submitCareerAnswers: async (answers) => {
    const response = await api.post('/assessments/submit-answers', answers);
    return response.data;
  },

  // Get user recommendations
  getUserRecommendations: async () => {
    const response = await api.get('/assessments/recommendations');
    return response.data;
  }
};

// Personality API calls
export const personalityAPI = {
  // Get personality questions
  getPersonalityQuestions: async () => {
    const response = await api.get('/personality/questions');
    return response.data;
  },

  // Submit personality test
  submitPersonalityTest: async (answers) => {
    const response = await api.post('/personality/submit', answers);
    return response.data;
  }
};

// Market API calls
export const marketAPI = {
  // Get market trends
  getMarketTrends: async (industry = 'all') => {
    const response = await api.get(`/market/trends?industry=${industry}`);
    return response.data;
  }
};

// Roadmap API calls
export const roadmapAPI = {
  // Generate career roadmap
  generateRoadmap: async (data) => {
    const response = await api.post('/roadmap/generate', data);
    return response.data;
  }
};

// Profile API calls
export const profileAPI = {
  // Get user profile
  getUserProfile: async (userId) => {
    const response = await api.get(`/profile/${userId}`);
    return response.data;
  },

  // Update user profile
  updateUserProfile: async (userId, data) => {
    const response = await api.put(`/profile/${userId}/update`, data);
    return response.data;
  }
};

// Career API calls
export const careerAPI = {
  // Get career recommendations
  getCareerRecommendations: async (params = {}) => {
    const response = await api.get('/career/recommendations', { params });
    return response.data;
  },

  // Get job market trends
  getJobMarketTrends: async (params = {}) => {
    const response = await api.get('/career/trends', { params });
    return response.data;
  },

  // Get skill demand analysis
  getSkillDemandAnalysis: async (params = {}) => {
    const response = await api.get('/career/skills', { params });
    return response.data;
  },

  // Get salary insights
  getSalaryInsights: async (params = {}) => {
    const response = await api.get('/career/salary', { params });
    return response.data;
  },

  // Get emerging job roles
  getEmergingJobRoles: async (params = {}) => {
    const response = await api.get('/career/emerging-roles', { params });
    return response.data;
  },

  // Get skill gap analysis
  getSkillGapAnalysis: async () => {
    const response = await api.get('/career/skill-gaps');
    return response.data;
  },

  // Generate career roadmap
  generateCareerRoadmap: async (roadmapData) => {
    const response = await api.post('/career/roadmap', roadmapData);
    return response.data;
  }
};

export default api;
