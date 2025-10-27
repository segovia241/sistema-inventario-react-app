import { type NextRequest, NextResponse } from "next/server"
import mockData, { type Categoria } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const categoria = mockData.categorias.find((c) => c.id === Number.parseInt(id))

    if (!categoria) {
      return NextResponse.json({ error: "Categoría no encontrada" }, { status: 404 })
    }

    return NextResponse.json(categoria)
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener categoría" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const categoriaIndex = mockData.categorias.findIndex((c) => c.id === Number.parseInt(id))

    if (categoriaIndex === -1) {
      return NextResponse.json({ error: "Categoría no encontrada" }, { status: 404 })
    }

    const categoriaActualizada: Categoria = {
      ...mockData.categorias[categoriaIndex],
      ...body,
      id: Number.parseInt(id),
    }

    mockData.categorias[categoriaIndex] = categoriaActualizada
    return NextResponse.json(categoriaActualizada)
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar categoría" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const categoriaIndex = mockData.categorias.findIndex((c) => c.id === Number.parseInt(id))

    if (categoriaIndex === -1) {
      return NextResponse.json({ error: "Categoría no encontrada" }, { status: 404 })
    }

    const categoriaEliminada = mockData.categorias.splice(categoriaIndex, 1)
    return NextResponse.json(categoriaEliminada[0])
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar categoría" }, { status: 500 })
  }
}
