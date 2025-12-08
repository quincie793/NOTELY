import api from "./api";

export const login = (payload: { identifier: string; password: string }) =>
  api.post("/api/auth/login", payload);

export const register = (payload: any) =>
  api.post("/api/auth/register", payload);

export const logout = () =>
  api.post("/api/auth/logout");
