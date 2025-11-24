"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2 } from "lucide-react"

interface Producto {
  id_producto: number
  nombre: string
  precio_compra: number // Cambiado de precio_venta a precio_compra
  stock_actual: number
}

interface Proveedor {
  id_proveedor: number
  razon_social: string
  ruc_dni: string
}

interface ItemCompra {
  id_producto: number
  cantidad: number
  precio_unitario: number
}

export default function NuevaCompraPage() {
  const router = useRouter()
  const [productos, setProductos] = useState<Producto[]>([])
  const [proveedores, setProveedores] = useState<Proveedor[]>([])
  const [loading, setLoading] = useState(true)

  const [idProveedor, setIdProveedor] = useState("")
  const [metodoPago, setMetodoPago] = useState("1") // Valor por defecto como número (1=efectivo)
  const [numeroFactura, setNumeroFactura] = useState("")
  const [notas, setNotas] = useState("")
  const [items, setItems] = useState<ItemCompra[]>([])

  const [selectedProducto, setSelectedProducto] = useState("")
  const [cantidad, setCantidad] = useState("")
  const [precio, setPrecio] = useState("")

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (!token) {
      router.push("/login")
      return
    }
    loadProductos()
    loadProveedores()
  }, [router])

  const loadProductos = async () => {
    try {
      const response = await fetch(apiUrl + "/productos")
      const data = await response.json()
      const mapped: Producto[] = data.map((p: any) => ({
        id_producto: p.id_producto,
        nombre: p.nombre,
        precio_compra: p.precio_compra, // Cambiado a precio_compra
        stock_actual: p.stock_actual,
      }))
      setProductos(mapped)
    } catch (error) {
      console.error("Error loading productos:", error)
    }
  }

  const loadProveedores = async () => {
    try {
      const response = await fetch(apiUrl + "/proveedores")
      const data = await response.json()
      setProveedores(data)
    } catch (error) {
      console.error("Error loading proveedores:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddItem = () => {
    if (!selectedProducto || !cantidad || !precio) return
    
    const productoSeleccionado = productos.find(p => p.id_producto === Number(selectedProducto))
    const precioUnitario = Number(precio)

    const newItem: ItemCompra = {
      id_producto: Number(selectedProducto),
      cantidad: Number(cantidad),
      precio_unitario: precioUnitario,
    }
    
    setItems([...items, newItem])
    setSelectedProducto("")
    setCantidad("")
    setPrecio("")
  }

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!idProveedor || items.length === 0) {
      alert("Completa todos los campos")
      return
    }

    const usuario = JSON.parse(localStorage.getItem("usuario") || "{}")

    if (!usuario.id) {
      alert("No se encontró el usuario. Inicia sesión nuevamente.")
      router.push("/login")
      return
    }

    const monto_total = items.reduce(
      (sum, item) => sum + item.cantidad * item.precio_unitario,
      0
    )

    try {
      const response = await fetch(apiUrl + "/compras", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_proveedor: Number(idProveedor),
          id_usuario: usuario.id,
          monto_total,
          metodo_pago: Number(metodoPago), // Convertido a número
          numero_factura: numeroFactura || null,
          notas: notas || null,
          items,
        }),
      })

      if (response.ok) {
        router.push("/dashboard/compras")
      } else {
        const errorData = await response.json()
        alert(`Error al crear la compra: ${errorData.message}`)
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error al crear la compra")
    }
  }

  const total = items.reduce(
    (sum, item) => sum + item.cantidad * item.precio_unitario,
    0
  )

  if (loading) return <div>Cargando...</div>

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Nueva Compra</h1>
        <p className="text-muted-foreground">Registra una nueva orden de compra</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Proveedor */}
        <Card>
          <CardHeader>
            <CardTitle>Información del Proveedor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Proveedor</Label>
              <select
                value={idProveedor}
                onChange={(e) => setIdProveedor(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md"
                required
              >
                <option value="">Selecciona un proveedor</option>
                {proveedores.map((proveedor) => (
                  <option key={proveedor.id_proveedor} value={proveedor.id_proveedor}>
                    {proveedor.razon_social} {proveedor.ruc_dni ? `- ${proveedor.ruc_dni}` : ''}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <Label>Método de Pago</Label>
              <select
                value={metodoPago}
                onChange={(e) => setMetodoPago(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md"
                required
              >
                <option value="1">Efectivo</option>
                <option value="2">Tarjeta</option>
                <option value="3">Transferencia</option>
                <option value="4">Cheque</option>
              </select>
            </div>

            <div>
              <Label>Número de Factura (Opcional)</Label>
              <Input
                value={numeroFactura}
                onChange={(e) => setNumeroFactura(e.target.value)}
                placeholder="Número de factura"
              />
            </div>

            <div>
              <Label>Notas (Opcional)</Label>
              <textarea
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md min-h-[80px]"
                placeholder="Notas adicionales sobre la compra"
              />
            </div>
          </CardContent>
        </Card>

        {/* Agregar Items */}
        <Card>
          <CardHeader>
            <CardTitle>Agregar Productos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label>Producto</Label>
                <select
                  value={selectedProducto}
                  onChange={(e) => {
                    setSelectedProducto(e.target.value)
                    // Auto-completar precio de compra cuando se selecciona un producto
                    const producto = productos.find(p => p.id_producto === Number(e.target.value))
                    if (producto) {
                      setPrecio(producto.precio_compra.toString())
                    }
                  }}
                  className="w-full px-3 py-2 border border-input rounded-md"
                >
                  <option value="">Selecciona un producto</option>
                  {productos.map((p) => (
                    <option key={p.id_producto} value={p.id_producto}>
                      {p.nombre} (Stock: {p.stock_actual})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label>Cantidad</Label>
                <Input
                  type="number"
                  min="1"
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                  placeholder="0"
                />
              </div>

              <div>
                <Label>Precio Unitario</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  placeholder="0.00"
                />
              </div>

              <div className="flex items-end">
                <Button 
                  type="button" 
                  onClick={handleAddItem} 
                  className="w-full"
                  disabled={!selectedProducto || !cantidad || !precio}
                >
                  Agregar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Items */}
        {items.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Productos en la Compra</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold">Producto</th>
                    <th className="text-right py-3 px-4 font-semibold">Precio Unitario</th>
                    <th className="text-right py-3 px-4 font-semibold">Cantidad</th>
                    <th className="text-right py-3 px-4 font-semibold">Subtotal</th>
                    <th className="text-center py-3 px-4 font-semibold">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => {
                    const producto = productos.find(
                      (p) => p.id_producto === item.id_producto
                    )
                    const subtotal = item.cantidad * item.precio_unitario
                    return (
                      <tr key={index} className="border-b border-border">
                        <td className="py-3 px-4">{producto?.nombre}</td>
                        <td className="py-3 px-4 text-right">${item.precio_unitario.toFixed(2)}</td>
                        <td className="py-3 px-4 text-right">{item.cantidad}</td>
                        <td className="py-3 px-4 text-right font-bold">${subtotal.toFixed(2)}</td>
                        <td className="py-3 px-4 text-center">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(index)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>

              <div className="mt-4 flex justify-end">
                <div className="text-right">
                  <p className="text-muted-foreground">Total:</p>
                  <p className="text-3xl font-bold">${total.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-2">
          <Button type="submit" disabled={items.length === 0 || !idProveedor}>
            Registrar Compra
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  )
}