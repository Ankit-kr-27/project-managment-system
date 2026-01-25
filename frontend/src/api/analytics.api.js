import api from "./axios";

export const getProjectAnalytics = async (projectId) => {
    const response = await api.get(`/analytics/project/${projectId}`);
    return response.data;
};
