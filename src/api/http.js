import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://192.168.1.28:3000", // URL de la API backend, la cambie para probar en red local cambiar si es necesario
});

// Interceptor para agregar el token JWT a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado
      localStorage.removeItem("token");
      // Opcionalmente redirigir al login
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
