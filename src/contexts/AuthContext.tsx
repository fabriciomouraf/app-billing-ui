import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { api } from "@/lib/api";
import type { User } from "@/types/api";

const STORAGE_KEY = "billing-user";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function loadStoredUser(): User | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as User;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = loadStoredUser();
    setUser(stored);
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const userWithPassword = await api.getUserByEmail(email);
    if (userWithPassword.password !== password) {
      throw new Error("Email ou senha inválidos");
    }
    const { password: _, ...userWithoutPassword } = userWithPassword;
    setUser(userWithoutPassword);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userWithoutPassword));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
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
