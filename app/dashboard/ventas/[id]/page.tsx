"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"

interface Venta {
  id: string
  clienteId: string
  fecha: string
  total: number
  estado: string
  items: Array<{
    productoId: string
    cantidad: number
    precioUnitario: number
  }>
}

export default function DetalleVentaPage() {
  const router = useRouter()
  const params = useParams()
  const [venta, setVenta] = useState<Venta | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadVenta = async () => {
      try {
        const response = await fetch(`/api/ventas/${params.id}`)
        const data = await response.json()
        setVenta(data)
      } catch (error) {
        console.error("Error loading venta:", error)
      } finally {
        setLoading(false)
      }
    }

    loadVenta()
  }, [params.id])

  if (loading) {
    return <div>Cargando...</div>
  }

  if (!venta) {
    return <div>Venta no encontrada</div>
  }

  return (
    <div className="max-w-2xl space-y-6">
      <Button variant="ghost" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Detalle de Venta #{venta.id}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Cliente</p>
              <p className="font-medium">{venta.clienteId}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Fecha</p>
              <p className="font-medium">{new Date(venta.fecha).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Estado</p>
              <p className="font-medium">{venta.estado}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="font-bold text-lg">${venta.total.toFixed(2)}</p>
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
            {venta.items.map((item, index) => (
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
