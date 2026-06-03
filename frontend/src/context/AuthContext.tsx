import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import client from "../api/client";
import { User } from "../types";

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updatePreferredLLM: (provider: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem("token"),
    loading: true,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setState((s) => ({ ...s, loading: false }));
      return;
    }
    client
      .get<{ user: User }>("/auth/me")
      .then(({ data }) =>
        setState({ user: data.user, token, loading: false })
      )
      .catch(() => {
        localStorage.removeItem("token");
        setState({ user: null, token: null, loading: false });
      });
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await client.post<{ token: string; user: User }>("/auth/login", {
      email,
      password,
    });
    localStorage.setItem("token", data.token);
    setState({ user: data.user, token: data.token, loading: false });
  };

  const register = async (email: string, password: string, name: string) => {
    const { data } = await client.post<{ token: string; user: User }>("/auth/register", {
      email,
      password,
      name,
    });
    localStorage.setItem("token", data.token);
    setState({ user: data.user, token: data.token, loading: false });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setState({ user: null, token: null, loading: false });
  };

  const updatePreferredLLM = async (provider: string) => {
    await client.patch("/auth/preferences", { preferredLLM: provider });
    setState((s) =>
      s.user ? { ...s, user: { ...s.user, preferredLLM: provider } } : s
    );
  };

  return (
    <AuthContext.Provider
      value={{ ...state, login, register, logout, updatePreferredLLM }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used inside AuthProvider");
  return ctx;
}
