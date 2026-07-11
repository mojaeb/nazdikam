import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { clearSavedItemsCache, refreshSavedStatus } from "@/lib/saved-items";

export interface AuthUser {
  id: number;
  phone: string;
  name: string | null;
  avatar: string | null;
  role: "user" | "business_owner" | "admin";
  businessIds: number[];
  activeBusinessId: number | null;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoading: true,
  isLoggedIn: false,
  refresh: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (!res.ok) {
        setUser(null);
        clearSavedItemsCache();
        return;
      }
      const data = await res.json() as { user: AuthUser | null };
      setUser(data.user);
      if (data.user) {
        void refreshSavedStatus().catch(() => {});
      } else {
        clearSavedItemsCache();
      }
    } catch {
      setUser(null);
      clearSavedItemsCache();
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } finally {
      setUser(null);
      clearSavedItemsCache();
    }
  }, []);

  useEffect(() => {
    refresh().finally(() => setIsLoading(false));
  }, [refresh]);

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isLoggedIn: !!user, refresh, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
