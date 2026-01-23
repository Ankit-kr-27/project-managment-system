import api from "./axios";

export const login = (data) => api.post("/auth/login", data);
export const getCurrentUser = () => api.post("/auth/current-user");
export const logout = () => api.post("/auth/logout");
export const register = (data) => api.post("/auth/register", data);
export const updateAccount = (data) => api.patch("/auth/update-account", data);
export const deleteAccount = () => api.delete("/auth/delete-account");

