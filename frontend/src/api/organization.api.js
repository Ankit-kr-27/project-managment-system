import api from "./axios";

export const createOrganization = async (data) => {
    const response = await api.post("/organizations", data);
    return response.data;
};

export const getUserOrganizations = async () => {
    const response = await api.get("/organizations");
    return response.data;
};

export const getOrganizationById = async (organizationId) => {
    const response = await api.get(`/organizations/${organizationId}`);
    return response.data;
};

export const addMemberToOrganization = async (organizationId, data) => {
    const response = await api.post(`/organizations/${organizationId}/members`, data);
    return response.data;
};
