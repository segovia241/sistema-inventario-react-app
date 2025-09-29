import { useEffect, useState } from "react";
import { getUsers } from "../services/api";
import type { User } from "../types/User";

function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getUsers()
      .then(setUsers)
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando usuarios...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Lista de Usuarios</h2>
      <ul>
        {users.map((u) => (
          <li key={u.id}>
            {u.nombre} {u.apellido} - {u.email} ({u.rol === 1 ? "Admin" : "Vendedor"})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UsersList;