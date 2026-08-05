import API from './api';

export const login = async (credentials) => {
  const response = await API.post('/auth/login', credentials);
  return response.data;
};

export const register = async (userData) => {
  const response = await API.post('/auth/register', userData);
  return response.data;
};

export const getMe = async () => {
  const response = await API.get('/auth/me');
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await API.put('/auth/profile', profileData);
  return response.data;
};

export const seedDemoData = async () => {
  const response = await API.post('/auth/seed');
  return response.data;
};
