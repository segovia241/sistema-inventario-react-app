"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertTriangle, Plus, TrendingDown, TrendingUp } from "lucide-react"

interface Producto {
  id: string
  nombre: string
  sku: string
  stock: number
  stockMinimo: number
  precio: number
}

interface MovimientoInventario {
  id: string
  productoId: string
  tipo: "entrada" | "salida"
  cantidad: number
  razon: string
  fecha: string
}

export default function InventarioPage() {
  const router = useRouter()
  const [productos, setProductos] = useState<Producto[]>([])
  const [bajoStock, setBajoStock] = useState<Producto[]>([])
  const [movimientos, setMovimientos] = useState<MovimientoInventario[]>([])
  const [loading, setLoading] = useState(true)
  const [showMovimientoForm, setShowMovimientoForm] = useState(false)
  const [selectedProducto, setSelectedProducto] = useState<string>("")
  const [movimientoData, setMovimientoData] = useState({
    tipo: "entrada" as "entrada" | "salida",
    cantidad: "",
    razon: "",
  })
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || ""
  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (!token) {
      router.push("/login")
      return
    }

    loadData()
  }, [router])

  const loadData = async () => {
    try {
      const [productosRes, bajoStockRes, movimientosRes] = await Promise.all([
        fetch(apiUrl + "/productos"),
        fetch(apiUrl + "/productos/bajo-stock"),
        fetch(apiUrl + "/movimientos-inventario"),
      ])

      const productosData = await productosRes.json()
      const bajoStockData = await bajoStockRes.json()
      const movimientosData = await movimientosRes.json()

      setProductos(productosData)
      setBajoStock(bajoStockData)
      setMovimientos(movimientosData)
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleMovimientoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Crear movimiento
      const movimientoRes = await fetch(apiUrl + "/movimientos-inventario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productoId: selectedProducto,
          ...movimientoData,
          cantidad: Number.parseInt(movimientoData.cantidad),
        }),
      })

      if (movimientoRes.ok) {
        // Actualizar stock del producto
        const cantidad = Number.parseInt(movimientoData.cantidad)
        const nuevoStock =
          movimientoData.tipo === "entrada"
            ? (productos.find((p) => p.id === selectedProducto)?.stock || 0) + cantidad
            : (productos.find((p) => p.id === selectedProducto)?.stock || 0) - cantidad

        await fetch(`/api/productos/${selectedProducto}/stock`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nuevoStock }),
        })

        loadData()
        setShowMovimientoForm(false)
        setMovimientoData({ tipo: "entrada", cantidad: "", razon: "" })
        setSelectedProducto("")
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  if (loading) {
    return <div>Cargando...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Inventario</h1>
          <p className="text-muted-foreground">Gestiona el stock y movimientos de inventario</p>
        </div>
        <Button onClick={() => setShowMovimientoForm(!showMovimientoForm)}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Movimiento
        </Button>
      </div>

      {/* Bajo Stock Alert */}
      {bajoStock.length > 0 && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Productos con Bajo Stock ({bajoStock.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {bajoStock.map((producto) => (
                <div key={producto.id} className="flex justify-between items-center p-3 bg-background rounded">
                  <div>
                    <p className="font-medium">{producto.nombre}</p>
                    <p className="text-sm text-muted-foreground">SKU: {producto.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-destructive">{producto.stock} unidades</p>
                    <p className="text-xs text-muted-foreground">Mínimo: {producto.stockMinimo}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Movimiento Form */}
      {showMovimientoForm && (
        <Card>
          <CardHeader>
            <CardTitle>Registrar Movimiento de Inventario</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleMovimientoSubmit} className="space-y-4">
              <div>
                <Label htmlFor="producto">Producto</Label>
                <select
                  id="producto"
                  value={selectedProducto}
                  onChange={(e) => setSelectedProducto(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                  required
                >
                  <option value="">Selecciona un producto</option>
                  {productos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre} (Stock: {p.stock})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tipo">Tipo de Movimiento</Label>
                  <select
                    id="tipo"
                    value={movimientoData.tipo}
                    onChange={(e) =>
                      setMovimientoData({
                        ...movimientoData,
                        tipo: e.target.value as "entrada" | "salida",
                      })
                    }
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                  >
                    <option value="entrada">Entrada</option>
                    <option value="salida">Salida</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="cantidad">Cantidad</Label>
                  <Input
                    id="cantidad"
                    type="number"
                    value={movimientoData.cantidad}
                    onChange={(e) => setMovimientoData({ ...movimientoData, cantidad: e.target.value })}
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="razon">Razón</Label>
                <Input
                  id="razon"
                  value={movimientoData.razon}
                  onChange={(e) => setMovimientoData({ ...movimientoData, razon: e.target.value })}
                  placeholder="Ej: Compra a proveedor, Venta a cliente"
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">Registrar Movimiento</Button>
                <Button type="button" variant="outline" onClick={() => setShowMovimientoForm(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Stock Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productos.length}</div>
            <p className="text-xs text-muted-foreground">En catálogo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bajo Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{bajoStock.length}</div>
            <p className="text-xs text-muted-foreground">Requieren reorden</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Movimientos</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{movimientos.length}</div>
            <p className="text-xs text-muted-foreground">Registrados</p>
          </CardContent>
        </Card>
      </div>

      {/* Movimientos Table */}
      <Card>
        <CardHeader>
          <CardTitle>Últimos Movimientos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">Producto</th>
                  <th className="text-center py-3 px-4 font-semibold">Tipo</th>
                  <th className="text-right py-3 px-4 font-semibold">Cantidad</th>
                  <th className="text-left py-3 px-4 font-semibold">Razón</th>
                  <th className="text-left py-3 px-4 font-semibold">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {movimientos.slice(0, 10).map((mov) => {
                  const producto = productos.find((p) => p.id === mov.productoId)
                  return (
                    <tr key={mov.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4">{producto?.nombre}</td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                            mov.tipo === "entrada" ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"
                          }`}
                        >
                          {mov.tipo === "entrada" ? "Entrada" : "Salida"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-medium">{mov.cantidad}</td>
                      <td className="py-3 px-4">{mov.razon}</td>
                      <td className="py-3 px-4 text-muted-foreground">{new Date(mov.fecha).toLocaleDateString()}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {movimientos.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">No hay movimientos registrados</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
