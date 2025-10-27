import { type NextRequest, NextResponse } from "next/server"
import mockData, { type Usuario } from "@/lib/db"
import { generateId, getCurrentDate } from "@/lib/utils"
import { generateToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nombre, email, password, rol, activo } = body

    if (!nombre || !email || !password) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    // Check if email already exists
    if (mockData.usuarios.some((u) => u.email === email)) {
      return NextResponse.json({ error: "El email ya está registrado" }, { status: 400 })
    }

    const nuevoUsuario: Usuario = {
      id: generateId(),
      nombre,
      apellido: "", // Empty for registration
      email,
      password,
      rol: rol || 3, // Default role: usuario
      activo: activo ?? 1,
      created_at: getCurrentDate(),
      updated_at: getCurrentDate(),
    }

    mockData.usuarios.push(nuevoUsuario)

    const token = generateToken(nuevoUsuario.id.toString())

    return NextResponse.json(
      {
        token,
        usuario: {
          id: nuevoUsuario.id,
          nombre: nuevoUsuario.nombre,
          email: nuevoUsuario.email,
          rol: nuevoUsuario.rol,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json({ error: "Error al crear usuario" }, { status: 500 })
  }
}

export async function GET() {
  try {
    return NextResponse.json(mockData.usuarios)
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener usuarios" }, { status: 500 })
  }
}
