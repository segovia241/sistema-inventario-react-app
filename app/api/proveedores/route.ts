import { type NextRequest, NextResponse } from "next/server"
import mockData, { type Proveedor } from "@/lib/db"
import { generateId, getCurrentDate } from "@/lib/utils"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { razon_social, ruc_dni, telefono, email, direccion, notas } = body

    if (!razon_social) {
      return NextResponse.json({ error: "Razón social requerida" }, { status: 400 })
    }

    const nuevoProveedor: Proveedor = {
      id_proveedor: generateId(),
      razon_social,
      ruc_dni,
      telefono,
      email,
      direccion,
      notas,
      created_at: getCurrentDate(),
      updated_at: getCurrentDate(),
    }

    mockData.proveedores.push(nuevoProveedor)
    return NextResponse.json(nuevoProveedor, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Error al crear proveedor" }, { status: 500 })
  }
}

export async function GET() {
  try {
    return NextResponse.json(mockData.proveedores)
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener proveedores" }, { status: 500 })
  }
}
