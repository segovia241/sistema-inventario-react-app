import { type NextRequest, NextResponse } from "next/server"
import mockData, { type Proveedor } from "@/lib/db"
import { getCurrentDate } from "@/lib/utils"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const proveedor = mockData.proveedores.find((p) => p.id_proveedor === Number.parseInt(id))

    if (!proveedor) {
      return NextResponse.json({ error: "Proveedor no encontrado" }, { status: 404 })
    }

    return NextResponse.json(proveedor)
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener proveedor" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const proveedorIndex = mockData.proveedores.findIndex((p) => p.id_proveedor === Number.parseInt(id))

    if (proveedorIndex === -1) {
      return NextResponse.json({ error: "Proveedor no encontrado" }, { status: 404 })
    }

    const proveedorActualizado: Proveedor = {
      ...mockData.proveedores[proveedorIndex],
      ...body,
      id_proveedor: Number.parseInt(id),
      updated_at: getCurrentDate(),
    }

    mockData.proveedores[proveedorIndex] = proveedorActualizado
    return NextResponse.json(proveedorActualizado)
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar proveedor" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const proveedorIndex = mockData.proveedores.findIndex((p) => p.id_proveedor === Number.parseInt(id))

    if (proveedorIndex === -1) {
      return NextResponse.json({ error: "Proveedor no encontrado" }, { status: 404 })
    }

    const proveedorEliminado = mockData.proveedores.splice(proveedorIndex, 1)
    return NextResponse.json(proveedorEliminado[0])
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar proveedor" }, { status: 500 })
  }
}
