"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"

interface Compra {
  id_compra: number
  id_proveedor: number
  fecha_compra: string // Cambiado de 'fecha' a 'fecha_compra'
  monto_total: number
  metodo_pago: number // Agregado según entidad
  numero_factura?: string // Agregado según entidad
  notas?: string // Agregado según entidad
  created_at: string
  updated_at: string
  proveedor?: { // Datos del proveedor para mostrar nombre
    razon_social: string
    ruc_dni?: string
  }
  detalles: Array<{ // Cambiado de 'items' a 'detalles'
    id_producto: number
    cantidad: number
    precio_unitario: number
    producto?: { // Datos del producto para mostrar nombre
      nombre: string
      codigo: string
    }
  }>
}

interface MetodoPago {
  [key: number]: string
}

const METODOS_PAGO: MetodoPago = {
  1: "Efectivo",
  2: "Tarjeta",
  3: "Transferencia",
  4: "Cheque"
}

export default function DetalleCompraPage() {
  const router = useRouter()
  const params = useParams()
  const [compra, setCompra] = useState<Compra | null>(null)
  const [loading, setLoading] = useState(true)

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (!token) {
      router.push("/login")
      return
    }

    const loadCompra = async () => {
      try {
        const response = await fetch(`${apiUrl}/compras/${params.id}`)
        if (!response.ok) {
          throw new Error("Compra no encontrada")
        }
        const data = await response.json()
        setCompra(data)
      } catch (error) {
        console.error("Error loading compra:", error)
      } finally {
        setLoading(false)
      }
    }

    loadCompra()
  }, [params.id, router, apiUrl])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div>Cargando...</div>
      </div>
    )
  }

  if (!compra) {
    return (
      <div className="max-w-2xl space-y-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
        <div className="text-center py-8">
          <p className="text-lg font-medium">Compra no encontrada</p>
          <p className="text-muted-foreground mt-2">
            La compra que buscas no existe o no tienes acceso a ella.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Detalle de Compra</h1>
          <p className="text-muted-foreground">Compra #{compra.id_compra}</p>
        </div>
      </div>

      {/* Información Principal */}
      <Card>
        <CardHeader>
          <CardTitle>Información de la Compra</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Número de Compra</p>
              <p className="font-medium">#{compra.id_compra}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Proveedor</p>
              <p className="font-medium">
                {compra.proveedor?.razon_social || `Proveedor #${compra.id_proveedor}`}
                {compra.proveedor?.ruc_dni && (
                  <span className="text-sm text-muted-foreground block">
                    {compra.proveedor.ruc_dni}
                  </span>
                )}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Fecha de Compra</p>
              <p className="font-medium">
                {new Date(compra.fecha_compra).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Método de Pago</p>
              <p className="font-medium">
                {METODOS_PAGO[compra.metodo_pago] || `Método ${compra.metodo_pago}`}
              </p>
            </div>

            {compra.numero_factura && (
              <div>
                <p className="text-sm text-muted-foreground">Número de Factura</p>
                <p className="font-medium">{compra.numero_factura}</p>
              </div>
            )}

            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="font-bold text-lg text-primary">
                ${compra.monto_total.toFixed(2)}
              </p>
            </div>
          </div>

          {compra.notas && (
            <div>
              <p className="text-sm text-muted-foreground">Notas</p>
              <p className="font-medium mt-1 p-3 bg-muted/50 rounded-md">
                {compra.notas}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
            <div>
              <p className="text-sm text-muted-foreground">Creado</p>
              <p className="text-sm">
                {new Date(compra.created_at).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Actualizado</p>
              <p className="text-sm">
                {new Date(compra.updated_at).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Productos */}
      <Card>
        <CardHeader>
          <CardTitle>Productos Comprados</CardTitle>
        </CardHeader>
        <CardContent>
          {compra.detalles.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay productos en esta compra
            </div>
          ) : (
            <div className="space-y-4">
              {compra.detalles.map((detalle, index) => {
                const subtotal = detalle.cantidad * detalle.precio_unitario
                return (
                  <div
                    key={index}
                    className="flex justify-between items-start p-4 border border-border rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium">
                        {detalle.producto?.nombre || `Producto #${detalle.id_producto}`}
                      </p>
                      {detalle.producto?.codigo && (
                        <p className="text-sm text-muted-foreground">
                          Código: {detalle.producto.codigo}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground mt-1">
                        Cantidad: {detalle.cantidad}
                      </p>
                    </div>

                    <div className="text-right min-w-[120px]">
                      <p className="text-sm text-muted-foreground">
                        ${detalle.precio_unitario.toFixed(2)} c/u
                      </p>
                      <p className="font-bold text-lg">
                        ${subtotal.toFixed(2)}
                      </p>
                    </div>
                  </div>
                )
              })}

              {/* Total */}
              <div className="border-t border-border pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <p className="text-lg font-semibold">Total General</p>
                  <p className="text-2xl font-bold text-primary">
                    ${compra.monto_total.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}