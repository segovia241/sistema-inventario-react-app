import { NextResponse } from "next/server"
import mockData from "@/lib/db"

export async function GET() {
  try {
    const productosBajoStock = mockData.productos.filter((p) => p.stock_actual <= p.stock_minimo)
    return NextResponse.json(productosBajoStock)
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener productos con bajo stock" }, { status: 500 })
  }
}
