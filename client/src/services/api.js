import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401 || status === 403) {
      const isLoginRequest = error.config?.url?.includes("/login");

      if (!isLoginRequest) {
        localStorage.removeItem("token");

        const path = window.location.pathname;
        const loginPath =
          path.startsWith("/dashboard") || path.startsWith("/admin")
            ? "/admin/login"
            : "/student/login";

        if (path !== loginPath) {
          window.location.href = loginPath;
        }
      }
    }

    return Promise.reject(error);
  }
);

const handleError = (error) => {
  const message = error.response?.data?.message || "Request failed";
  const err = new Error(message);
  err.status = error.response?.status;
  throw err;
};

const apiService = {
  get: async (endpoint) => {
    try {
      const res = await api.get(endpoint);
      return res.data;
    } catch (error) {
      handleError(error);
    }
  },

  post: async (endpoint, body) => {
    try {
      const res = await api.post(endpoint, body);
      return res.data;
    } catch (error) {
      handleError(error);
    }
  },

  put: async (endpoint, body) => {
    try {
      const res = await api.put(endpoint, body);
      return res.data;
    } catch (error) {
      handleError(error);
    }
  },

  delete: async (endpoint) => {
    try {
      const res = await api.delete(endpoint);
      return res.data;
    } catch (error) {
      handleError(error);
    }
  },
};

export default apiService;
