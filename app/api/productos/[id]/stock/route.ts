import { type NextRequest, NextResponse } from "next/server"
import mockData from "@/lib/db"
import { getCurrentDate } from "@/lib/utils"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { cantidad } = body

    if (cantidad === undefined) {
      return NextResponse.json({ error: "Cantidad requerida" }, { status: 400 })
    }

    const productoIndex = mockData.productos.findIndex((p) => p.id_producto === Number.parseInt(id))

    if (productoIndex === -1) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 })
    }

    mockData.productos[productoIndex].stock_actual = cantidad
    mockData.productos[productoIndex].updated_at = getCurrentDate()

    return NextResponse.json(mockData.productos[productoIndex])
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar stock" }, { status: 500 })
  }
}
