import { type NextRequest, NextResponse } from "next/server"
import mockData, { type Compra } from "@/lib/db"
import { getCurrentDate } from "@/lib/utils"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const compra = mockData.compras.find((c) => c.id_compra === Number.parseInt(id))

    if (!compra) {
      return NextResponse.json({ error: "Compra no encontrada" }, { status: 404 })
    }

    return NextResponse.json(compra)
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener compra" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const compraIndex = mockData.compras.findIndex((c) => c.id_compra === Number.parseInt(id))

    if (compraIndex === -1) {
      return NextResponse.json({ error: "Compra no encontrada" }, { status: 404 })
    }

    const compraActualizada: Compra = {
      ...mockData.compras[compraIndex],
      ...body,
      id_compra: Number.parseInt(id),
      updated_at: getCurrentDate(),
    }

    mockData.compras[compraIndex] = compraActualizada
    return NextResponse.json(compraActualizada)
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar compra" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const compraIndex = mockData.compras.findIndex((c) => c.id_compra === Number.parseInt(id))

    if (compraIndex === -1) {
      return NextResponse.json({ error: "Compra no encontrada" }, { status: 404 })
    }

    const compraEliminada = mockData.compras.splice(compraIndex, 1)
    return NextResponse.json(compraEliminada[0])
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar compra" }, { status: 500 })
  }
}
