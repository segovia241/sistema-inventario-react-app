import { type NextRequest, NextResponse } from "next/server"
import mockData, { type Compra } from "@/lib/db"
import { generateId, getCurrentDate } from "@/lib/utils"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fecha_compra, id_proveedor, id_usuario, monto_total, metodo_pago, numero_factura, notas } = body

    if (!fecha_compra || !id_proveedor || !id_usuario || monto_total === undefined || !metodo_pago) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    const nuevaCompra: Compra = {
      id_compra: generateId(),
      fecha_compra: new Date(fecha_compra),
      id_proveedor,
      id_usuario,
      monto_total,
      metodo_pago,
      numero_factura,
      notas,
      created_at: getCurrentDate(),
      updated_at: getCurrentDate(),
    }

    mockData.compras.push(nuevaCompra)
    return NextResponse.json(nuevaCompra, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Error al crear compra" }, { status: 500 })
  }
}

export async function GET() {
  try {
    return NextResponse.json(mockData.compras)
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener compras" }, { status: 500 })
  }
}
