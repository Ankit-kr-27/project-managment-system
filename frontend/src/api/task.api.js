import api from "./axios";

export const getTasksByProject = (projectId) =>
  api.get(`/tasks/project/${projectId}`);

export const createTask = (projectId, formData) =>
  api.post(`/tasks/project/${projectId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateTask = (taskId, data) =>
  api.put(`/tasks/${taskId}`, data);

export const deleteTask = (taskId) =>
  api.delete(`/tasks/${taskId}`);

export const getMyTasks = () => api.get("/tasks/assigned/me");
