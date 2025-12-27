import { api, setAccessToken } from './api.js';
export const register = async (data) => (await api.post('/auth/register', data)).data;
export const login = async (credentials) => {
  const { data } = await api.post('/auth/login', credentials);
  if (data.access) {
    setAccessToken(data.access);
  }
  return data;
};
export const refresh = async () => {
  const res = await api.post('/auth/refresh');
  setAccessToken(res.data.access);
  return res.data;
};
export const meOrders = async () => (await api.get('/orders/mine')).data;
export const getMe = async () => (await api.get('/auth/me')).data;
