import { type NextRequest, NextResponse } from "next/server"
import mockData from "@/lib/db"
import { generateToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Email y contraseña requeridos" }, { status: 400 })
    }

    const usuario = mockData.usuarios.find((u) => u.email === email && u.password === password)

    if (!usuario) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
    }

    const token = generateToken(usuario.id.toString())

    return NextResponse.json({
      success: true,
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Error al verificar credenciales" }, { status: 500 })
  }
}
