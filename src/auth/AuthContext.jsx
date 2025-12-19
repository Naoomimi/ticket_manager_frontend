import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);
const STORAGE_KEY = "ticket_app_user";
const API_URL = "http://localhost:8080";

// Helper function to get initial user from localStorage synchronously
function getInitialUser() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    // If there's an error parsing, remove the corrupted data
    localStorage.removeItem(STORAGE_KEY);
  }
  return null;
}

export function AuthProvider({ children }) {
  // Initialize user from localStorage synchronously to avoid race conditions
  const [user, setUser] = useState(() => getInitialUser());
  const [isInitializing, setIsInitializing] = useState(true);

  // This effect runs after the initial render to handle any edge cases
  // and mark initialization as complete
  useEffect(() => {
    // Double-check localStorage in case it was modified externally
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Only update if different (shouldn't happen, but just in case)
        if (JSON.stringify(parsed) !== JSON.stringify(user)) {
          setUser(parsed);
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
        setUser(null);
      }
    } else if (user) {
      // If localStorage was cleared but we have user in state, clear it
      setUser(null);
    }
    
    // Mark initialization as complete
    setIsInitializing(false);
  }, []); // Only run once on mount

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
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        logout, 
        isAuthenticated: !!user,
        isInitializing 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
