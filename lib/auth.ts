export interface AuthToken {
  token: string
  usuario: {
    id: string
    nombre: string
    email: string
    rol: string
  }
}

export function generateToken(usuarioId: string): string {
  // En producción, usar JWT real
  return `token_${usuarioId}_${Date.now()}`
}

export function verifyToken(token: string): string | null {
  // En producción, verificar JWT real
  if (token.startsWith("token_")) {
    const parts = token.split("_")
    return parts[1] || null
  }
  return null
}
