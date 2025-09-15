import axios from "axios";
import useLanguageStore from "../zustand/stores/languageStore";
import useAuthStore from "../zustand/stores/authStore";

export const BASE_URL = "https://pullandpush.net/api";

const api = axios.create({ baseURL: BASE_URL });
api.interceptors.request.use((config) => {
  const language = useLanguageStore.getState().language;
  config.headers["Accept-Language"] = language;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await useAuthStore.getState().refreshToken();
      } catch (refreshError) {
        // Si le rafraîchissement du token échoue, déconnectez l'utilisateur
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
