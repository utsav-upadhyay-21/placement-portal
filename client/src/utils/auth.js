export const getToken = () => localStorage.getItem("token");

export const setToken = (token) => localStorage.setItem("token", token);

export const clearToken = () => localStorage.removeItem("token");

export const decodeToken = (token) => {
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};

export const getRole = () => decodeToken(getToken())?.role || null;

export const isAdmin = () => getRole() === "admin";
