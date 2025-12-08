// src/hooks/useAuth.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import api from "../api/api"; // ✅ use your configured axios instance

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  avatarUrl?: string;
};

export type AuthContextType = {
  user: User | null;
  login: (payload: { identifier: string; password: string }) => Promise<void>;
  register: (payload: any) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  // Load user on refresh (optional: if you store token in localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (payload: { identifier: string; password: string }) => {
    const res = await api.post("/api/auth/login", payload);

    // ✅ Backend should now return { message, token?, user }
    const loggedInUser = res.data.user;
    setUser(loggedInUser);

    // Store user + token if provided
    localStorage.setItem("user", JSON.stringify(loggedInUser));
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
    }
  };

  const register = async (payload: any) => {
    const res = await api.post("/api/auth/register", payload);

    // ✅ Backend should return { message, user }
    const newUser = res.data.user;
    setUser(newUser);

    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const logout = async () => {
    try {
      await api.post("/api/auth/logout", {});
    } catch {
      // ignore errors
    }
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
