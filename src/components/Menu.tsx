import { Logout } from "./Logout";

export const Menu = () => {
  // Leer usuario desde localStorage
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  return (
    <div>
      <h1>
        {user ? `${user.nombre} ${user.apellido}` : "Usuario no identificado"}
      </h1>
      <Logout />
    </div>
  );
};
