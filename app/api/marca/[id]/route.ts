import { type NextRequest, NextResponse } from "next/server"
import mockData, { type Marca } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const marca = mockData.marcas.find((m) => m.id === Number.parseInt(id))

    if (!marca) {
      return NextResponse.json({ error: "Marca no encontrada" }, { status: 404 })
    }

    return NextResponse.json(marca)
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener marca" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const marcaIndex = mockData.marcas.findIndex((m) => m.id === Number.parseInt(id))

    if (marcaIndex === -1) {
      return NextResponse.json({ error: "Marca no encontrada" }, { status: 404 })
    }

    const marcaActualizada: Marca = {
      ...mockData.marcas[marcaIndex],
      ...body,
      id: Number.parseInt(id),
    }

    mockData.marcas[marcaIndex] = marcaActualizada
    return NextResponse.json(marcaActualizada)
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar marca" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const marcaIndex = mockData.marcas.findIndex((m) => m.id === Number.parseInt(id))

    if (marcaIndex === -1) {
      return NextResponse.json({ error: "Marca no encontrada" }, { status: 404 })
    }

    const marcaEliminada = mockData.marcas.splice(marcaIndex, 1)
    return NextResponse.json(marcaEliminada[0])
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar marca" }, { status: 500 })
  }
}
