import { type NextRequest, NextResponse } from "next/server"
import mockData, { type Cliente } from "@/lib/db"
import { getCurrentDate } from "@/lib/utils"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const cliente = mockData.clientes.find((c) => c.id_cliente === Number.parseInt(id))

    if (!cliente) {
      return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 })
    }

    return NextResponse.json(cliente)
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener cliente" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const clienteIndex = mockData.clientes.findIndex((c) => c.id_cliente === Number.parseInt(id))

    if (clienteIndex === -1) {
      return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 })
    }

    const clienteActualizado: Cliente = {
      ...mockData.clientes[clienteIndex],
      ...body,
      id_cliente: Number.parseInt(id),
      updated_at: getCurrentDate(),
    }

    mockData.clientes[clienteIndex] = clienteActualizado
    return NextResponse.json(clienteActualizado)
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar cliente" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const clienteIndex = mockData.clientes.findIndex((c) => c.id_cliente === Number.parseInt(id))

    if (clienteIndex === -1) {
      return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 })
    }

    const clienteEliminado = mockData.clientes.splice(clienteIndex, 1)
    return NextResponse.json(clienteEliminado[0])
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar cliente" }, { status: 500 })
  }
}
