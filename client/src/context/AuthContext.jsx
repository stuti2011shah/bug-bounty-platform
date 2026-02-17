import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const USER_KEY = "bugbounty_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem(USER_KEY);
  };

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.exp * 1000 < Date.now()) {
          logout();
        }
      } catch {
        logout();
      }
    } else {
      localStorage.removeItem("token");
      setUser(null);
      localStorage.removeItem(USER_KEY);
    }
    setLoading(false);
  }, [token]);

  const login = (data) => {
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  };

  const value = { user, token, login, logout, setUser, isAuthenticated: !!token };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
