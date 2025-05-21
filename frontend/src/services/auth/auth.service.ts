/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "../axios.service";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3002";

export const login = async (username: string, password: string) => {
  try {
    const response = await api.post(`${API_URL}/auth/login`, {
      username,
      password,
    },
    { withCredentials: true }
  );

    if (response.data.access_token) {
      // Guardar el token en localStorage
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("username", response.data.username);

      // Configurar Axios para incluir el token en todas las peticiones futuras
      api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.access_token}`;

      return { success: true, data: response.data };
    }

    return { success: false, error: "No se recibió token de acceso" };
  } catch (error: any) {
    console.error("Error en login:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Error al iniciar sesión",
    };
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  delete api.defaults.headers.common["Authorization"];
};

export const isAuthenticated = (): boolean => {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("token");
};

export const setupAxiosInterceptors = () => {
  if (typeof window === "undefined") return;

  // Configurar interceptor para añadir el token a todas las peticiones
  const token = localStorage.getItem("token");
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  // Interceptor para manejar errores de autenticación
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        logout();
        window.location.href = "/";
      }
      return Promise.reject(error);
    }
  );
};

// Llamar a esta función al inicio de la aplicación
if (typeof window !== "undefined") {
  setupAxiosInterceptors();
}
