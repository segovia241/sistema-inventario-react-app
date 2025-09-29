import type { User } from "../types/User";

const API_URL = import.meta.env.VITE_API_URL;

interface LoginResponse {
  valido: boolean;
  user?: User; // opcional, si tu backend devuelve info del usuario
}

export async function loginUser(email: string, password: string): Promise<User> {
  const res = await fetch(`${API_URL}/usuarios/verificar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data: LoginResponse = await res.json();

  if (!res.ok || !data.valido) {
    throw new Error("Credenciales inválidas o usuario inactivo");
  }

  if (!data.user) {
    throw new Error("No se recibió información del usuario");
  }

  return data.user;
}
