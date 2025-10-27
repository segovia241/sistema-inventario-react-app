import { type NextRequest, NextResponse } from "next/server"
import mockData, { type Venta } from "@/lib/db"
import { generateId, getCurrentDate } from "@/lib/utils"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      fecha_venta,
      id_cliente,
      id_usuario,
      monto_total,
      metodo_pago,
      tipo_comprobante,
      numero_comprobante,
      notas,
    } = body

    if (
      !fecha_venta ||
      !id_cliente ||
      !id_usuario ||
      monto_total === undefined ||
      !metodo_pago ||
      !tipo_comprobante ||
      !numero_comprobante
    ) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    const nuevaVenta: Venta = {
      id_venta: generateId(),
      fecha_venta: new Date(fecha_venta),
      id_cliente,
      id_usuario,
      monto_total,
      metodo_pago,
      tipo_comprobante,
      numero_comprobante,
      notas,
      created_at: getCurrentDate(),
      updated_at: getCurrentDate(),
    }

    mockData.ventas.push(nuevaVenta)
    return NextResponse.json(nuevaVenta, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Error al crear venta" }, { status: 500 })
  }
}

export async function GET() {
  try {
    return NextResponse.json(mockData.ventas)
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener ventas" }, { status: 500 })
  }
}
