import type { User } from "../types/User";

const API_URL = import.meta.env.VITE_API_URL;

export async function getUsers(): Promise<User[]> {
  const res = await fetch(`${API_URL}/usuarios`);
  if (!res.ok) throw new Error("Error al obtener usuarios");
  return res.json();
}
