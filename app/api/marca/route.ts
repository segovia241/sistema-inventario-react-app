import { type NextRequest, NextResponse } from "next/server"
import mockData, { type Marca } from "@/lib/db"
import { generateId } from "@/lib/utils"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nombre } = body

    if (!nombre) {
      return NextResponse.json({ error: "Nombre requerido" }, { status: 400 })
    }

    const nuevaMarca: Marca = {
      id: generateId(),
      nombre,
    }

    mockData.marcas.push(nuevaMarca)
    return NextResponse.json(nuevaMarca, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Error al crear marca" }, { status: 500 })
  }
}

export async function GET() {
  try {
    return NextResponse.json(mockData.marcas)
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener marcas" }, { status: 500 })
  }
}
