import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add token for protected routes
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (['post', 'put', 'delete'].includes(config.method?.toLowerCase() || '')) {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      return Promise.reject(new Error('No token provided'));
    }
  }
  return config;
});

// Add response interceptor to handle token errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      authService.removeToken();
      // The middleware will handle the redirect based on cookie
      // window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

// Auth helper functions
export const authService = {
  getToken: () => localStorage.getItem('adminToken'),
  setToken: (token: string) => localStorage.setItem('adminToken', token),
  removeToken: () => localStorage.removeItem('adminToken'),
  isAuthenticated: () => !!localStorage.getItem('adminToken'),
};

export interface PaginationResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface Profile {
  name: string;
  title: string;
  city: string;
  tagline: string;
  aboutMe: string;
  photo: string;
  phoneNumbers: string[];
  emails: string[];
  socialMedia: {
    type: string;
    url: string;
  }[];
}

export interface Education {
  _id: string;
  type: 'education' | 'certification';
  publisher: string;
  title: string;
  city?: string;
  startDate: string;
  endDate?: string;
  description: string;
}

export interface Experience {
  _id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string[];
  current?: boolean;
  user?: string;
  __v?: number;
}

export interface Skill {
  _id: string;
  id: number;
  name: string;
  category: string;
  level: number;
  description: string;
  __v?: number;
}

export interface Proficiency {
  _id: string;
  id: number;
  skill: string;
  value: number;
  description: string;
  __v?: number;
}

export interface Project {
  _id: string;
  user: string;
  name: string;
  description: string;
  url: string;
  techStack: string[];
  startDate: string;
  endDate: string | null;
  current: boolean;
  __v: number;
}

export interface LoginResponse {
  token: string;
  user: {
    _id: string;
    email: string;
    name: string;
    role: string;
  };
}

export interface ContactCounts {
  emails: number;
  phoneNumbers: number;
  socialMedia: number;
  total: number;
}

export interface UpdateContactCountsResponse {
  message: string;
  counts: ContactCounts;
}

export interface VisitStats {
  totalVisits: number;
  uniqueVisitors: number;
  lastUpdated: string;
}

export interface VisitResponse {
  message: string;
  isNewVisit: boolean;
}

interface EmailData {
  to: string;
  subject: string;
  text: string;
}

interface ContactCountUpdate {
  type: 'emails' | 'phoneNumbers' | 'socialMedia';
  count: number;
}

export const apiService = {
  // Auth
  login: (data: { email: string; password: string }) => api.post<LoginResponse>('/auth/login', data),

  // Profile
  getProfile: () => api.get<Profile>('/profile'),
  getContactCounts: () => api.get<ContactCounts>('/profile/contact-counts'),
  updateContactCounts: (data: ContactCountUpdate) => {
    return api.put<UpdateContactCountsResponse>('/profile/contact-counts', data);
  },
  updateProfile: (data: Partial<Profile>) => api.put('/profile', data),

  // Education
  getEducations: (page = 1, limit = 10) => 
    api.get<PaginationResponse<Education>>(`/education?page=${page}&limit=${limit}`),
  addEducation: (data: Omit<Education, '_id'>) => api.post('/education', data),
  updateEducation: (id: string, data: Partial<Education>) => api.put(`/education/${id}`, data),
  deleteEducation: (id: string) => api.delete(`/education/${id}`),

  // Experience
  getExperiences: (page = 1, limit = 10) => 
    api.get<PaginationResponse<Experience>>(`/experience?page=${page}&limit=${limit}`),
  addExperience: (data: Omit<Experience, '_id'>) => api.post('/experience', data),
  updateExperience: (id: string, data: Partial<Experience>) => api.put(`/experience/${id}`, data),
  deleteExperience: (id: string) => api.delete(`/experience/${id}`),

  // Skills
  getSkills: (page = 1, limit = 10, category?: string) =>
    api.get<PaginationResponse<Skill>>(`/skills?page=${page}&limit=${limit}${category ? `&category=${encodeURIComponent(category)}` : ''}`),
  addSkill: (data: Omit<Skill, '_id' | '__v'>) => api.post('/skills', data),
  updateSkill: (id: string, data: Partial<Skill>) => api.put(`/skills/${id}`, data),
  deleteSkill: (id: string) => api.delete(`/skills/${id}`),

  // Proficiency
  getProficiencies: () => api.get<Proficiency[]>('/proficiency'),
  addProficiency: (data: Omit<Proficiency, '_id' | '__v'>) => api.post('/proficiency', data),
  updateProficiency: (id: string, data: Partial<Proficiency>) => api.put(`/proficiency/${id}`, data),
  deleteProficiency: (id: string) => api.delete(`/proficiency/${id}`),

  // Projects
  getProjects: (page = 1, limit = 10) => 
    api.get<PaginationResponse<Project>>(`/projects?page=${page}&limit=${limit}`),
  addProject: (data: Omit<Project, '_id'>) => api.post('/projects', data),
  updateProject: (id: string, data: Partial<Project>) => api.put(`/projects/${id}`, data),
  deleteProject: (id: string) => api.delete(`/projects/${id}`),

  // Visitor
  trackVisit: (fingerprint: string) => 
    api.post<VisitResponse>('/visitor/track', { fingerprint }),
  getVisitStats: () => api.get<VisitStats>('/visitor/stats'),

  sendEmail: (data: EmailData) => {
    return api.post('/email/send', data);
  },
}; 