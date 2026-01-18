import api from "./axios";

export const getProjects = () => api.get("/projects");
export const createProject = (data) => api.post("/projects", data);
export const getProjectMembers = (projectId) =>
  axios.get(`/api/v1/projects/${projectId}/members`, { withCredentials: true });

export const addProjectMember = (projectId, data) =>
  axios.post(`/api/v1/projects/${projectId}/members`, data, {
    withCredentials: true,
  });

export const getProjectById = (projectId) =>
  axios.get(`/api/v1/projects/${projectId}`, { withCredentials: true });

