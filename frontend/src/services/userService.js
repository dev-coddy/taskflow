import API from './api';

export const getUsers = async (params = {}) => {
  const response = await API.get('/users', { params });
  return response.data;
};

export const createUser = async (userData) => {
  const response = await API.post('/users', userData);
  return response.data;
};

export const updateUser = async (id, userData) => {
  const response = await API.put(`/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await API.delete(`/users/${id}`);
  return response.data;
};
