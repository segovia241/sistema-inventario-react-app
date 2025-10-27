import { type NextRequest, NextResponse } from "next/server"
import mockData, { type Cliente } from "@/lib/db"
import { generateId, getCurrentDate } from "@/lib/utils"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nombre_completo, ruc_dni, telefono, email, direccion, notas } = body

    if (!nombre_completo || !ruc_dni) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    const nuevoCliente: Cliente = {
      id_cliente: generateId(),
      nombre_completo,
      ruc_dni,
      telefono: telefono ?? "",
      email: email ?? "",
      direccion: direccion ?? "",
      notas: notas ?? "",
      created_at: getCurrentDate(),
      updated_at: getCurrentDate(),
    }

    mockData.clientes.push(nuevoCliente)
    return NextResponse.json(nuevoCliente, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Error al crear cliente" }, { status: 500 })
  }
}

export async function GET() {
  try {
    return NextResponse.json(mockData.clientes)
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener clientes" }, { status: 500 })
  }
}
