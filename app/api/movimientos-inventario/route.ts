import { type NextRequest, NextResponse } from "next/server"
import mockData, { type MovimientoInventario } from "@/lib/db"
import { generateId, getCurrentDate } from "@/lib/utils"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      id_producto,
      tipo_movimiento,
      cantidad,
      unidad_medida,
      stock_anterior,
      stock_nuevo,
      referencia,
      fecha_movimiento,
      id_usuario,
    } = body

    if (
      !id_producto ||
      !tipo_movimiento ||
      cantidad === undefined ||
      stock_anterior === undefined ||
      stock_nuevo === undefined ||
      !id_usuario
    ) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    const nuevoMovimiento: MovimientoInventario = {
      id_movimiento: generateId(),
      id_producto,
      tipo_movimiento,
      cantidad,
      unidad_medida: unidad_medida ?? 1,
      stock_anterior,
      stock_nuevo,
      referencia,
      fecha_movimiento: new Date(fecha_movimiento || getCurrentDate()),
      id_usuario,
    }

    mockData.movimientos.push(nuevoMovimiento)
    return NextResponse.json(nuevoMovimiento, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Error al crear movimiento" }, { status: 500 })
  }
}

export async function GET() {
  try {
    return NextResponse.json(mockData.movimientos)
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener movimientos" }, { status: 500 })
  }
}
