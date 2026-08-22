import React, { createContext, useContext, useState, useEffect } from "react";
import { api, getAuthToken, setAuthToken, getRefreshToken, setRefreshToken, removeAuthToken, getSavedAdminUser, setSavedAdminUser } from "@/lib/api";

interface AdminUser {
  id: number;
  email: string;
  username: string;
  full_name?: string;
  role: string;
  is_active: boolean;
}

interface AdminAuthContextType {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (usernameOrEmail: string, password: string) => Promise<void>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(getSavedAdminUser());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      api.getMe()
        .then((user) => {
          setAdmin(user);
          setSavedAdminUser(user);
        })
        .catch(() => {
          removeAuthToken();
          setAdmin(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (usernameOrEmail: string, password: string) => {
    const res = await api.login({ email: usernameOrEmail, username_or_email: usernameOrEmail, password });
    setAuthToken(res.access_token);
    if (res.refresh_token) {
      setRefreshToken(res.refresh_token);
    }
    setSavedAdminUser(res.admin);
    setAdmin(res.admin);
  };

  const logout = () => {
    removeAuthToken();
    setAdmin(null);
    if (typeof window !== "undefined") {
      window.location.href = "/admin/login";
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        isAuthenticated: !!admin,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}
