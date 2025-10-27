import { type NextRequest, NextResponse } from "next/server"
import mockData, { type Categoria } from "@/lib/db"
import { generateId } from "@/lib/utils"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nombre } = body

    if (!nombre) {
      return NextResponse.json({ error: "Nombre requerido" }, { status: 400 })
    }

    const nuevaCategoria: Categoria = {
      id: generateId(),
      nombre,
    }

    mockData.categorias.push(nuevaCategoria)
    return NextResponse.json(nuevaCategoria, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Error al crear categoría" }, { status: 500 })
  }
}

export async function GET() {
  try {
    return NextResponse.json(mockData.categorias)
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener categorías" }, { status: 500 })
  }
}
