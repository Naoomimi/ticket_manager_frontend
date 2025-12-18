import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);
const STORAGE_KEY = "ticket_app_user";
const API_URL = "http://localhost:8080";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const login = async (email, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    let data = null;
    try {
      data = await res.json();
    } catch {
      //por si el backend no responde JSON
    }

    if (!res.ok || data?.success === false) {
      const err = new Error("AUTH_FAILED");
      err.status = res.status; 
      throw err;
    }

    const u = data.user;

    setUser(u);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    return u;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
