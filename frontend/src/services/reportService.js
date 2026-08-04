import API from './api';

export const getDashboardStats = async () => {
  const response = await API.get('/reports/dashboard');
  return response.data;
};

export const generateEODEmail = async (payload) => {
  const response = await API.post('/reports/generate-email', payload);
  return response.data;
};
