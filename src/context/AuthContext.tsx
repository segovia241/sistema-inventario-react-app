import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { loginUser } from "../services/authService";
import type { User } from "../types/User";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Inicializar desde localStorage si hay usuario guardado
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) as User : null;
  });

  const login = async (email: string, password: string) => {
    const data: User = await loginUser(email, password);
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data)); // persistir usuario
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user"); // limpiar al cerrar sesión
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
};
