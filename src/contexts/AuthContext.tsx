import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { api, setAuthToken } from "@/lib/api";
import type { User } from "@/types/api";

const STORAGE_KEY = "billing-token";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function decodeJwtPayload(token: string): { sub?: string } {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return {};
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64)) as { sub?: string };
  } catch {
    return {};
  }
}

async function loadSession(): Promise<{ user: User; token: string } | null> {
  try {
    const token = localStorage.getItem(STORAGE_KEY);
    if (!token) return null;
    const { sub } = decodeJwtPayload(token);
    if (!sub) return null;
    setAuthToken(token);
    const user = await api.getUser(sub);
    return { user, token };
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    setAuthToken(null);
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSession().then((session) => {
      if (session) {
        setUser(session.user);
      }
      setIsLoading(false);
    });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { token } = await api.login(email, password);
    setAuthToken(token);
    const { sub } = decodeJwtPayload(token);
    if (!sub) {
      setAuthToken(null);
      throw new Error("Token inválido");
    }
    const loggedUser = await api.getUser(sub);
    setUser(loggedUser);
    localStorage.setItem(STORAGE_KEY, token);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setAuthToken(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value: AuthContextValue = {
    user,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return ctx;
}
