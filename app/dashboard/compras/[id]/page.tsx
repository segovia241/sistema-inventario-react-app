"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"

interface Compra {
  id: string
  proveedorId: string
  fecha: string
  total: number
  estado: string
  items: Array<{
    productoId: string
    cantidad: number
    precioUnitario: number
  }>
}

export default function DetalleCompraPage() {
  const router = useRouter()
  const params = useParams()
  const [compra, setCompra] = useState<Compra | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCompra = async () => {
      try {
        const response = await fetch(`/api/compras/${params.id}`)
        const data = await response.json()
        setCompra(data)
      } catch (error) {
        console.error("Error loading compra:", error)
      } finally {
        setLoading(false)
      }
    }

    loadCompra()
  }, [params.id])

  if (loading) {
    return <div>Cargando...</div>
  }

  if (!compra) {
    return <div>Compra no encontrada</div>
  }

  return (
    <div className="max-w-2xl space-y-6">
      <Button variant="ghost" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Detalle de Compra #{compra.id}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Proveedor</p>
              <p className="font-medium">{compra.proveedorId}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Fecha</p>
              <p className="font-medium">{new Date(compra.fecha).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Estado</p>
              <p className="font-medium">{compra.estado}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="font-bold text-lg">${compra.total.toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Productos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {compra.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-3 border border-border rounded">
                <div>
                  <p className="font-medium">Producto ID: {item.productoId}</p>
                  <p className="text-sm text-muted-foreground">Cantidad: {item.cantidad}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">${item.precioUnitario.toFixed(2)} c/u</p>
                  <p className="font-bold">${(item.cantidad * item.precioUnitario).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
