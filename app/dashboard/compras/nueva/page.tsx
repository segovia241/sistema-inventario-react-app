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

interface ItemCompra {
  productoId: string
  cantidad: number
  precioUnitario: number
}

export default function NuevaCompraPage() {
  const router = useRouter()
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const [proveedorId, setProveedorId] = useState("")
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
    if (!selectedProducto || !cantidad || !precio) return

    const newItem: ItemCompra = {
      productoId: selectedProducto,
      cantidad: Number.parseInt(cantidad),
      precioUnitario: Number.parseFloat(precio),
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

    if (!proveedorId || items.length === 0) {
      alert("Por favor completa todos los campos")
      return
    }

    try {
      const total = items.reduce((sum, item) => sum + item.cantidad * item.precioUnitario, 0)

      const response = await fetch(apiUrl + "/compras", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proveedorId,
          items,
          total,
          estado: "pendiente",
        }),
      })

      if (response.ok) {
        router.push("/dashboard/compras")
      } else {
        alert("Error al crear la compra")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error al crear la compra")
    }
  }

  const total = items.reduce((sum, item) => sum + item.cantidad * item.precioUnitario, 0)

  if (loading) {
    return <div>Cargando...</div>
  }

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
          <CardContent>
            <div>
              <Label htmlFor="proveedor">ID del Proveedor</Label>
              <Input
                id="proveedor"
                value={proveedorId}
                onChange={(e) => setProveedorId(e.target.value)}
                placeholder="Ej: PROV-001"
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                      {p.nombre}
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

              <div>
                <Label htmlFor="precio">Precio Unitario</Label>
                <Input
                  id="precio"
                  type="number"
                  step="0.01"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  placeholder="0.00"
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
              <CardTitle>Productos en la Compra</CardTitle>
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
