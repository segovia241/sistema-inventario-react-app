"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2 } from "lucide-react"

interface Producto {
  id: string
  nombre: string
  precio: number
  stock: number
}

interface ItemVenta {
  productoId: string
  cantidad: number
  precioUnitario: number
}

export default function NuevaVentaPage() {
  const router = useRouter()
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const [clienteId, setClienteId] = useState("")
  const [items, setItems] = useState<ItemVenta[]>([])
  const [selectedProducto, setSelectedProducto] = useState("")
  const [cantidad, setCantidad] = useState("")
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (!token) {
      router.push("/login")
      return
    }

    loadProductos()
  }, [router])

  const loadProductos = async () => {
    try {
      const response = await fetch(apiUrl + "/productos")
      const data = await response.json()
      setProductos(data)
    } catch (error) {
      console.error("Error loading productos:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddItem = () => {
    if (!selectedProducto || !cantidad) return

    const producto = productos.find((p) => p.id === selectedProducto)
    if (!producto) return

    const newItem: ItemVenta = {
      productoId: selectedProducto,
      cantidad: Number.parseInt(cantidad),
      precioUnitario: producto.precio,
    }

    setItems([...items, newItem])
    setSelectedProducto("")
    setCantidad("")
  }

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!clienteId || items.length === 0) {
      alert("Por favor completa todos los campos")
      return
    }

    try {
      const total = items.reduce((sum, item) => sum + item.cantidad * item.precioUnitario, 0)

      const response = await fetch(apiUrl + "/ventas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clienteId,
          items,
          total,
          estado: "completada",
        }),
      })

      if (response.ok) {
        router.push("/dashboard/ventas")
      } else {
        alert("Error al crear la venta")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error al crear la venta")
    }
  }

  const total = items.reduce((sum, item) => sum + item.cantidad * item.precioUnitario, 0)

  if (loading) {
    return <div>Cargando...</div>
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Nueva Venta</h1>
        <p className="text-muted-foreground">Registra una nueva transacción de venta</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Cliente */}
        <Card>
          <CardHeader>
            <CardTitle>Información del Cliente</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="cliente">ID del Cliente</Label>
              <Input
                id="cliente"
                value={clienteId}
                onChange={(e) => setClienteId(e.target.value)}
                placeholder="Ej: CLI-001"
                required
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="producto">Producto</Label>
                <select
                  id="producto"
                  value={selectedProducto}
                  onChange={(e) => setSelectedProducto(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                >
                  <option value="">Selecciona un producto</option>
                  {productos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre} - ${p.precio.toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="cantidad">Cantidad</Label>
                <Input
                  id="cantidad"
                  type="number"
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                  placeholder="0"
                />
              </div>

              <div className="flex items-end">
                <Button type="button" onClick={handleAddItem} className="w-full">
                  Agregar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Items */}
        {items.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Productos en la Venta</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold">Producto</th>
                      <th className="text-right py-3 px-4 font-semibold">Precio</th>
                      <th className="text-right py-3 px-4 font-semibold">Cantidad</th>
                      <th className="text-right py-3 px-4 font-semibold">Subtotal</th>
                      <th className="text-center py-3 px-4 font-semibold">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => {
                      const producto = productos.find((p) => p.id === item.productoId)
                      const subtotal = item.cantidad * item.precioUnitario
                      return (
                        <tr key={index} className="border-b border-border">
                          <td className="py-3 px-4">{producto?.nombre}</td>
                          <td className="py-3 px-4 text-right">${item.precioUnitario.toFixed(2)}</td>
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
              </div>

              {/* Total */}
              <div className="mt-4 flex justify-end">
                <div className="text-right">
                  <p className="text-muted-foreground">Total:</p>
                  <p className="text-3xl font-bold">${total.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Submit */}
        <div className="flex gap-2">
          <Button type="submit" disabled={items.length === 0}>
            Registrar Venta
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  )
}
