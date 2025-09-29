import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const Logout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return <button onClick={handleLogout}>Cerrar sesión</button>;
};
