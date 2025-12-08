import api from "./api";

export const listEntries = () => api.get("/entries");
export const createEntry = (data: any) => api.post("/entries", data);
export const deleteEntry = (id: string) => api.delete(`/entry/${id}`);
export const updateEntry = (id: string, data: any) => api.put(`/entry/${id}`, data);
export const getEntry = (id: string) => api.get(`/entry/${id}`);
