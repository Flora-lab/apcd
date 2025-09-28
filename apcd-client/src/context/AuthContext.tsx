import type { ReactNode } from "react";
import { createContext, useContext, useState, useEffect } from "react"; // ✅ ajouter useEffect
import { api } from "../api/axios";

// Définir le type de l'utilisateur
export type User = {
  id: string;
  name: string;
  role: "user" | "admin";
};

// Type pour stocker user + token
type AuthUser = {
  user: User;
  token: string;
};

// Définir le type du contexte
type AuthContextType = {
  user: User | null;
  token: string | null;       // ✅ ajouter
  login: (authUser: AuthUser) => void;
  logout: () => void;
};

// Créer le contexte
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider pour englober ton app
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Charger user + token depuis localStorage au montage
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/user"); // route protégée par auth:sanctum
        setUser(res.data);
        // Optionnel : synchroniser localStorage
        localStorage.setItem("user_id", res.data.id);
        localStorage.setItem("user_name", res.data.name);
        localStorage.setItem("user_role", res.data.role);
      } catch {
        setUser(null);
        setToken(null);
        localStorage.clear();
      }
    };
  
    fetchUser();
  }, []);  

  const login = ({ user, token }: AuthUser) => {
    setUser(user);
    setToken(token);
    localStorage.setItem("auth_token", token);
    localStorage.setItem("user_role", user.role);
    localStorage.setItem("user_id", user.id);       // ✅ stocker id
    localStorage.setItem("user_name", user.name);   // ✅ stocker nom
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_role");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_name");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook pour utiliser le contexte
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
