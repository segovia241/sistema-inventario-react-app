import { type NextRequest, NextResponse } from "next/server"
import mockData, { type Producto } from "@/lib/db"
import { generateId, getCurrentDate } from "@/lib/utils"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      codigo,
      nombre,
      descripcion,
      categoria,
      marca,
      modelo,
      precio_compra,
      precio_venta,
      stock_actual,
      stock_minimo,
      unidad_medida,
      estado,
    } = body

    if (!codigo || !nombre || precio_compra === undefined || precio_venta === undefined) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    const nuevoProducto: Producto = {
      id_producto: generateId(),
      codigo,
      nombre,
      descripcion,
      categoria,
      marca,
      modelo,
      precio_compra,
      precio_venta,
      stock_actual: stock_actual ?? 0,
      stock_minimo: stock_minimo ?? 0,
      unidad_medida: unidad_medida ?? 1,
      estado: estado ?? 1,
      created_at: getCurrentDate(),
      updated_at: getCurrentDate(),
    }

    mockData.productos.push(nuevoProducto)
    return NextResponse.json(nuevoProducto, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Error al crear producto" }, { status: 500 })
  }
}

export async function GET() {
  try {
    return NextResponse.json(mockData.productos)
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener productos" }, { status: 500 })
  }
}
