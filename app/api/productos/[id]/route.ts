import { type NextRequest, NextResponse } from "next/server"
import mockData, { type Producto } from "@/lib/db"
import { getCurrentDate } from "@/lib/utils"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const producto = mockData.productos.find((p) => p.id_producto === Number.parseInt(id))

    if (!producto) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 })
    }

    return NextResponse.json(producto)
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener producto" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const productoIndex = mockData.productos.findIndex((p) => p.id_producto === Number.parseInt(id))

    if (productoIndex === -1) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 })
    }

    const productoActualizado: Producto = {
      ...mockData.productos[productoIndex],
      ...body,
      id_producto: Number.parseInt(id),
      updated_at: getCurrentDate(),
    }

    mockData.productos[productoIndex] = productoActualizado
    return NextResponse.json(productoActualizado)
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar producto" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const productoIndex = mockData.productos.findIndex((p) => p.id_producto === Number.parseInt(id))

    if (productoIndex === -1) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 })
    }

    const productoEliminado = mockData.productos.splice(productoIndex, 1)
    return NextResponse.json(productoEliminado[0])
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar producto" }, { status: 500 })
  }
}
