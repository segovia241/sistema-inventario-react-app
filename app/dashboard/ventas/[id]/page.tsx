"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"

interface Venta {
  id_venta: number
  fecha_venta: string
  id_cliente: number
  id_usuario: number
  monto_total: number
  metodo_pago: number
  tipo_comprobante: number
  numero_comprobante: string
  notas: string | null
  created_at: string
  updated_at: string
  items?: Array<{
    id_producto: number
    cantidad: number
    precio_unitario: number
    producto?: {
      nombre: string
      codigo: string
    }
  }>
}

interface Cliente {
  id_cliente: number
  nombre_completo: string
  ruc_dni: string | null
}

interface Producto {
  id_producto: number
  nombre: string
  codigo: string
}

export default function DetalleVentaPage() {
  const router = useRouter()
  const params = useParams()
  const [venta, setVenta] = useState<Venta | null>(null)
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

  useEffect(() => {
    const loadData = async () => {
      try {
        // Cargar venta
        const ventaResponse = await fetch(`${apiUrl}/ventas/${params.id}`)
        const ventaData = await ventaResponse.json()
        setVenta(ventaData)

        // Cargar clientes
        const clientesResponse = await fetch(`${apiUrl}/clientes`)
        const clientesData = await clientesResponse.json()
        setClientes(clientesData)

        // Cargar productos
        const productosResponse = await fetch(`${apiUrl}/productos`)
        const productosData = await productosResponse.json()
        setProductos(productosData)
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [params.id, apiUrl])

  // Función para obtener el nombre del cliente
  const getNombreCliente = (idCliente: number): string => {
    const cliente = clientes.find(c => c.id_cliente === idCliente)
    return cliente ? cliente.nombre_completo : `Cliente #${idCliente}`
  }

  // Función para obtener información del producto
  const getProductoInfo = (idProducto: number) => {
    const producto = productos.find(p => p.id_producto === idProducto)
    return producto || { nombre: `Producto #${idProducto}`, codigo: 'N/A' }
  }

  // Función para obtener método de pago como texto
  const getMetodoPago = (metodo: number): string => {
    const metodos = {
      1: "Efectivo",
      2: "Tarjeta", 
      3: "Transferencia"
    }
    return metodos[metodo as keyof typeof metodos] || "Desconocido"
  }

  // Función para obtener tipo de comprobante como texto
  const getTipoComprobante = (tipo: number): string => {
    const tipos = {
      1: "Boleta",
      2: "Factura"
    }
    return tipos[tipo as keyof typeof tipos] || "Desconocido"
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-64">Cargando...</div>
  }

  if (!venta) {
    return (
      <div className="max-w-2xl space-y-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
        <div className="text-center py-8 text-muted-foreground">
          Venta no encontrada
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl space-y-6">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver al listado
      </Button>

      {/* Información general */}
      <Card>
        <CardHeader className="bg-muted/50">
          <CardTitle className="flex justify-between items-center">
            <span>Detalle de Venta #{venta.id_venta}</span>
            <span className="text-lg font-normal text-muted-foreground">
              {venta.numero_comprobante}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Cliente</p>
                <p className="font-medium text-lg">{getNombreCliente(venta.id_cliente)}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Fecha y Hora</p>
                <p className="font-medium">
                  {new Date(venta.fecha_venta).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Tipo de Comprobante</p>
                <p className="font-medium">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {getTipoComprobante(venta.tipo_comprobante)}
                  </span>
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Método de Pago</p>
                <p className="font-medium">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    {getMetodoPago(venta.metodo_pago)}
                  </span>
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Total de la Venta</p>
                <p className="font-bold text-2xl text-primary">
                  ${venta.monto_total.toFixed(2)}
                </p>
              </div>

              {venta.notas && (
                <div>
                  <p className="text-sm text-muted-foreground">Notas</p>
                  <p className="font-medium bg-yellow-50 border border-yellow-200 rounded-md p-3">
                    {venta.notas}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Productos */}
      <Card>
        <CardHeader>
          <CardTitle>Productos Vendidos</CardTitle>
        </CardHeader>
        <CardContent>
          {venta.items && venta.items.length > 0 ? (
            <div className="space-y-3">
              {venta.items.map((item, index) => {
                const productoInfo = getProductoInfo(item.id_producto)
                const subtotal = item.cantidad * item.precio_unitario
                
                return (
                  <div
                    key={index}
                    className="flex justify-between items-center p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-base">{productoInfo.nombre}</p>
                      <p className="text-sm text-muted-foreground">
                        Código: {productoInfo.codigo} | Cantidad: {item.cantidad}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        ${item.precio_unitario.toFixed(2)} c/u
                      </p>
                      <p className="font-bold text-lg">
                        ${subtotal.toFixed(2)}
                      </p>
                    </div>
                  </div>
                )
              })}

              {/* Total */}
              <div className="flex justify-between items-center pt-4 mt-4 border-t border-border">
                <p className="font-medium text-lg">Total General</p>
                <p className="font-bold text-2xl text-primary">
                  ${venta.monto_total.toFixed(2)}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Esta venta no tiene productos registrados
            </div>
          )}
        </CardContent>
      </Card>

      {/* Información adicional */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground">Información Adicional</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Creado el</p>
              <p className="font-medium">
                {new Date(venta.created_at).toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Actualizado el</p>
              <p className="font-medium">
                {new Date(venta.updated_at).toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}