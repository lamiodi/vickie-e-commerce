import axios from "axios";
export const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL, withCredentials: true });
export const setAccessToken = (token) => { api.defaults.headers.common["Authorization"] = token ? `Bearer ${token}` : undefined; };