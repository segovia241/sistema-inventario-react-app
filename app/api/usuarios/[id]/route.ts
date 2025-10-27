import { type NextRequest, NextResponse } from "next/server"
import mockData, { type Usuario } from "@/lib/db"
import { getCurrentDate } from "@/lib/utils"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const usuario = mockData.usuarios.find((u) => u.id === Number.parseInt(id))

    if (!usuario) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    return NextResponse.json(usuario)
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener usuario" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const usuarioIndex = mockData.usuarios.findIndex((u) => u.id === Number.parseInt(id))

    if (usuarioIndex === -1) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    const usuarioActualizado: Usuario = {
      ...mockData.usuarios[usuarioIndex],
      ...body,
      id: Number.parseInt(id),
      updated_at: getCurrentDate(),
    }

    mockData.usuarios[usuarioIndex] = usuarioActualizado
    return NextResponse.json(usuarioActualizado)
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar usuario" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const usuarioIndex = mockData.usuarios.findIndex((u) => u.id === Number.parseInt(id))

    if (usuarioIndex === -1) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    const usuarioEliminado = mockData.usuarios.splice(usuarioIndex, 1)
    return NextResponse.json(usuarioEliminado[0])
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar usuario" }, { status: 500 })
  }
}
