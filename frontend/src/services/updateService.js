import API from './api';

export const createDailyUpdate = async (updateData) => {
  const response = await API.post('/updates', updateData);
  return response.data;
};

export const getDailyUpdates = async (params = {}) => {
  const response = await API.get('/updates', { params });
  return response.data;
};

export const deleteDailyUpdate = async (id) => {
  const response = await API.delete(`/updates/${id}`);
  return response.data;
};
