import api from "./axios";

export const getCalendarTasks = async (projectId, start, end) => {
    const params = {};
    if (projectId) params.projectId = projectId;
    if (start) params.start = start;
    if (end) params.end = end;

    const response = await api.get("/calendar", { params });
    return response.data;
};
