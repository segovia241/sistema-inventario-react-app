import { type NextRequest, NextResponse } from "next/server"
import mockData, { type Venta } from "@/lib/db"
import { getCurrentDate } from "@/lib/utils"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const venta = mockData.ventas.find((v) => v.id_venta === Number.parseInt(id))

    if (!venta) {
      return NextResponse.json({ error: "Venta no encontrada" }, { status: 404 })
    }

    return NextResponse.json(venta)
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener venta" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const ventaIndex = mockData.ventas.findIndex((v) => v.id_venta === Number.parseInt(id))

    if (ventaIndex === -1) {
      return NextResponse.json({ error: "Venta no encontrada" }, { status: 404 })
    }

    const ventaActualizada: Venta = {
      ...mockData.ventas[ventaIndex],
      ...body,
      id_venta: Number.parseInt(id),
      updated_at: getCurrentDate(),
    }

    mockData.ventas[ventaIndex] = ventaActualizada
    return NextResponse.json(ventaActualizada)
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar venta" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const ventaIndex = mockData.ventas.findIndex((v) => v.id_venta === Number.parseInt(id))

    if (ventaIndex === -1) {
      return NextResponse.json({ error: "Venta no encontrada" }, { status: 404 })
    }

    const ventaEliminada = mockData.ventas.splice(ventaIndex, 1)
    return NextResponse.json(ventaEliminada[0])
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar venta" }, { status: 500 })
  }
}
