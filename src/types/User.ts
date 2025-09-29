export interface User {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  rol: number;
  activo: number;
  created_at: string;
  updated_at: string;
  last_login: string | null;
}
