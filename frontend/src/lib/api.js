import axios from 'axios';

export const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL || ''}/api`,
  withCredentials: true,
});

export const setAccessToken = (token) => {
  api.defaults.headers.common['Authorization'] = token ? `Bearer ${token}` : undefined;
};

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Call refresh endpoint
        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/auth/refresh`,
          {},
          {
            withCredentials: true,
          }
        );

        if (res.data.access) {
          setAccessToken(res.data.access);
          originalRequest.headers['Authorization'] = `Bearer ${res.data.access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, redirect to login or handle logout
        setAccessToken(null);
        // window.location.href = "/account"; // Optional: Redirect to login
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
