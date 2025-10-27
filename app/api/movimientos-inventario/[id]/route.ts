import { type NextRequest, NextResponse } from "next/server"
import mockData, { type MovimientoInventario } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const movimiento = mockData.movimientos.find((m) => m.id_movimiento === Number.parseInt(id))

    if (!movimiento) {
      return NextResponse.json({ error: "Movimiento no encontrado" }, { status: 404 })
    }

    return NextResponse.json(movimiento)
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener movimiento" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const movimientoIndex = mockData.movimientos.findIndex((m) => m.id_movimiento === Number.parseInt(id))

    if (movimientoIndex === -1) {
      return NextResponse.json({ error: "Movimiento no encontrado" }, { status: 404 })
    }

    const movimientoActualizado: MovimientoInventario = {
      ...mockData.movimientos[movimientoIndex],
      ...body,
      id_movimiento: Number.parseInt(id),
    }

    mockData.movimientos[movimientoIndex] = movimientoActualizado
    return NextResponse.json(movimientoActualizado)
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar movimiento" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const movimientoIndex = mockData.movimientos.findIndex((m) => m.id_movimiento === Number.parseInt(id))

    if (movimientoIndex === -1) {
      return NextResponse.json({ error: "Movimiento no encontrado" }, { status: 404 })
    }

    const movimientoEliminado = mockData.movimientos.splice(movimientoIndex, 1)
    return NextResponse.json(movimientoEliminado[0])
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar movimiento" }, { status: 500 })
  }
}
