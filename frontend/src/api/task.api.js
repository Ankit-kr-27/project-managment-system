import api from "./axios";

export const getTasksByProject = (projectId) =>
  api.get(`/tasks/project/${projectId}`);

export const createTask = (projectId, formData) =>
  api.post(`/tasks/project/${projectId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateTaskStatus = (taskId, status) =>
  api.put(`/tasks/${taskId}`, { status });

export const assignTaskMember = (taskId, assignedTo) =>
  api.patch(`/tasks/${taskId}/assign`, { assignedTo });

export const getMyTasks = () => api.get("/tasks/assigned/me");
