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
  id_producto: number
  codigo: string
  nombre: string
  descripcion: string | null
  categoria: string | null
  marca: string | null
  modelo: string | null
  precio_compra: number
  precio_venta: number
  stock_actual: number
  stock_minimo: number
  unidad_medida: number
  estado: number
  created_at: string
  updated_at: string
}

interface MovimientoInventario {
  id_movimiento: number
  id_producto: number
  tipo_movimiento: number   // 1 = entrada, 2 = salida, 3 = ajuste
  cantidad: number
  unidad_medida: number
  stock_anterior: number
  stock_nuevo: number
  referencia: number | null  // CORREGIDO: de string a number
  fecha_movimiento: string
  id_usuario: number
}

export default function InventarioPage() {
  const router = useRouter()
  const [productos, setProductos] = useState<Producto[]>([])
  const [bajoStock, setBajoStock] = useState<Producto[]>([])
  const [movimientos, setMovimientos] = useState<MovimientoInventario[]>([])
  const [loading, setLoading] = useState(true)
  const [showMovimientoForm, setShowMovimientoForm] = useState(false)
  const [selectedProducto, setSelectedProducto] = useState<number>(0)
  const [movimientoData, setMovimientoData] = useState({
    tipo: "1", // CORREGIDO: usar números en lugar de strings
    cantidad: "",
    razon: "",
    referencia: "" // Agregado para el campo referencia
  })

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

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
      const token = localStorage.getItem("authToken")
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      const [productosRes, movimientosRes] = await Promise.all([
        fetch(`${apiUrl}/productos`, { headers }),
        fetch(`${apiUrl}/movimientos-inventario`, { headers }),
      ])

      if (!productosRes.ok || !movimientosRes.ok) {
        throw new Error("Error al cargar los datos")
      }

      const productosData = await productosRes.json()
      const movimientosData = await movimientosRes.json()

      setProductos(productosData)
      setMovimientos(movimientosData)
      
      // Calcular productos con bajo stock localmente
      const productosBajoStock = productosData.filter((p: Producto) => 
        p.stock_actual <= p.stock_minimo
      )
      setBajoStock(productosBajoStock)
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleMovimientoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedProducto || !movimientoData.cantidad || !movimientoData.razon) {
      alert("Por favor completa todos los campos")
      return
    }

    try {
      const token = localStorage.getItem("authToken")
      const usuario = JSON.parse(localStorage.getItem("usuario") || "{}")
      
      if (!usuario.id) {
        alert("No se encontró información del usuario. Inicia sesión nuevamente.")
        return
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      // CORREGIDO: Usar números directamente
      const tipoMovimiento = Number(movimientoData.tipo)
      const cantidad = Number(movimientoData.cantidad)
      const referencia = movimientoData.referencia ? Number(movimientoData.referencia) : null

      // Obtener producto actual para calcular stocks
      const producto = productos.find((p) => p.id_producto === selectedProducto)
      if (!producto) {
        alert("Producto no encontrado")
        return
      }

      // Calcular nuevo stock según tipo de movimiento
      const stockAnterior = producto.stock_actual
      let stockNuevo = stockAnterior

      if (tipoMovimiento === 1) { // Entrada
        stockNuevo = stockAnterior + cantidad
      } else if (tipoMovimiento === 2) { // Salida
        stockNuevo = stockAnterior - cantidad
      } else if (tipoMovimiento === 3) { // Ajuste
        stockNuevo = cantidad // En ajuste, la cantidad es el nuevo valor
      }

      // Validar que no haya stock negativo
      if (stockNuevo < 0) {
        alert("No hay suficiente stock para realizar esta salida")
        return
      }

      // Crear movimiento
      const movimientoPayload = {
        id_producto: selectedProducto,
        tipo_movimiento: tipoMovimiento,
        cantidad: tipoMovimiento === 3 ? Math.abs(stockNuevo - stockAnterior) : cantidad,
        unidad_medida: producto.unidad_medida,
        stock_anterior: stockAnterior,
        stock_nuevo: stockNuevo,
        referencia: referencia, // CORREGIDO: número o null
        id_usuario: usuario.id
      }

      const movimientoRes = await fetch(`${apiUrl}/movimientos-inventario`, {
        method: "POST",
        headers,
        body: JSON.stringify(movimientoPayload),
      })

      if (!movimientoRes.ok) {
        const errorData = await movimientoRes.json()
        throw new Error(errorData.message || "Error al crear movimiento")
      }

      // Actualizar stock del producto
      const updateStockRes = await fetch(`${apiUrl}/productos/${selectedProducto}/stock`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ stock_actual: stockNuevo }),
      })

      if (!updateStockRes.ok) {
        throw new Error("Error al actualizar stock")
      }

      // Recargar datos
      await loadData()
      
      // Limpiar formulario
      setShowMovimientoForm(false)
      setMovimientoData({ tipo: "1", cantidad: "", razon: "", referencia: "" })
      setSelectedProducto(0)
      
      alert("Movimiento registrado exitosamente")

    } catch (error) {
      console.error("Error:", error)
      alert(error instanceof Error ? error.message : "Error al registrar movimiento")
    }
  }

  const getProductoStockInfo = (producto: Producto) => {
    let color = "text-green-600"
    let estado = "Normal"

    if (producto.stock_actual === 0) {
      color = "text-red-600"
      estado = "Sin Stock"
    } else if (producto.stock_actual <= producto.stock_minimo) {
      color = "text-red-600"
      estado = "Bajo Stock"
    } else if (producto.stock_actual <= producto.stock_minimo * 2) {
      color = "text-yellow-600"
      estado = "Stock Medio"
    }

    return { color, estado }
  }

  const calcularNuevoStock = () => {
    if (!selectedProducto || !movimientoData.cantidad) return null

    const producto = productos.find(p => p.id_producto === selectedProducto)
    if (!producto) return null

    const cantidad = Number(movimientoData.cantidad)
    const tipoMovimiento = Number(movimientoData.tipo)
    const stockActual = producto.stock_actual

    if (tipoMovimiento === 1) { // Entrada
      return stockActual + cantidad
    } else if (tipoMovimiento === 2) { // Salida
      return stockActual - cantidad
    } else if (tipoMovimiento === 3) { // Ajuste
      return cantidad
    }

    return stockActual
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-64">Cargando inventario...</div>
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

      {/* Movimiento Form */}
      {showMovimientoForm && (
        <Card>
          <CardHeader>
            <CardTitle>Registrar Movimiento de Inventario</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleMovimientoSubmit} className="space-y-4">
              <div>
                <Label htmlFor="producto">Producto *</Label>
                <select
                  id="producto"
                  value={selectedProducto}
                  onChange={(e) => setSelectedProducto(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                  required
                >
                  <option value={0}>Selecciona un producto</option>
                  {productos.map((p) => (
                    <option key={p.id_producto} value={p.id_producto}>
                      {p.nombre} (Stock actual: {p.stock_actual})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tipo">Tipo de Movimiento *</Label>
                  <select
                    id="tipo"
                    value={movimientoData.tipo}
                    onChange={(e) =>
                      setMovimientoData({
                        ...movimientoData,
                        tipo: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                    required
                  >
                    <option value="1">Entrada (+ Stock)</option>
                    <option value="2">Salida (- Stock)</option>
                    <option value="3">Ajuste</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="cantidad">
                    {movimientoData.tipo === "3" ? "Nuevo Stock *" : "Cantidad *"}
                  </Label>
                  <Input
                    id="cantidad"
                    type="number"
                    value={movimientoData.cantidad}
                    onChange={(e) => setMovimientoData({ ...movimientoData, cantidad: e.target.value })}
                    placeholder="0"
                    required
                    min="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="referencia">Referencia (Opcional)</Label>
                  <Input
                    id="referencia"
                    type="number"
                    value={movimientoData.referencia}
                    onChange={(e) => setMovimientoData({ ...movimientoData, referencia: e.target.value })}
                    placeholder="Número de compra, venta, etc."
                  />
                </div>

                <div>
                  <Label htmlFor="razon">Razón del Movimiento *</Label>
                  <Input
                    id="razon"
                    value={movimientoData.razon}
                    onChange={(e) => setMovimientoData({ ...movimientoData, razon: e.target.value })}
                    placeholder="Ej: Compra a proveedor, Venta a cliente"
                    required
                  />
                </div>
              </div>

              {selectedProducto > 0 && (
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-sm font-medium">Resumen del movimiento:</p>
                  <p className="text-sm text-muted-foreground">
                    {movimientoData.tipo === "1" ? "+" : movimientoData.tipo === "2" ? "-" : "Ajuste a "}
                    {movimientoData.cantidad || 0} unidades
                    {movimientoData.cantidad && (
                      <>
                        {" "} - Stock actual: {
                          productos.find(p => p.id_producto === selectedProducto)?.stock_actual
                        } → {calcularNuevoStock()}
                      </>
                    )}
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <Button type="submit">Registrar Movimiento</Button>
                <Button type="button" variant="outline" onClick={() => {
                  setShowMovimientoForm(false)
                  setMovimientoData({ tipo: "1", cantidad: "", razon: "", referencia: "" })
                  setSelectedProducto(0)
                }}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Stock Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <p className="text-xs text-muted-foreground">Requieren atención</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sin Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {productos.filter(p => p.stock_actual === 0).length}
            </div>
            <p className="text-xs text-muted-foreground">Productos agotados</p>
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

      {/* Productos con Bajo Stock */}
      {bajoStock.length > 0 && (
        <Card className="border-destructive/20">
          <CardHeader className="bg-destructive/10">
            <CardTitle className="flex items-center text-destructive">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Productos con Bajo Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold">Producto</th>
                    <th className="text-right py-3 px-4 font-semibold">Stock Actual</th>
                    <th className="text-right py-3 px-4 font-semibold">Stock Mínimo</th>
                    <th className="text-center py-3 px-4 font-semibold">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {bajoStock.map((producto) => {
                    const stockInfo = getProductoStockInfo(producto)
                    return (
                      <tr key={producto.id_producto} className="border-b border-border">
                        <td className="py-3 px-4 font-medium">{producto.nombre}</td>
                        <td className="py-3 px-4 text-right font-bold">{producto.stock_actual}</td>
                        <td className="py-3 px-4 text-right text-muted-foreground">{producto.stock_minimo}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${stockInfo.color} bg-opacity-10`}>
                            {stockInfo.estado}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Movimientos Table */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Movimientos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">Producto</th>
                  <th className="text-center py-3 px-4 font-semibold">Tipo</th>
                  <th className="text-right py-3 px-4 font-semibold">Cantidad</th>
                  <th className="text-right py-3 px-4 font-semibold">Stock Anterior</th>
                  <th className="text-right py-3 px-4 font-semibold">Stock Nuevo</th>
                  <th className="text-left py-3 px-4 font-semibold">Referencia</th>
                  <th className="text-left py-3 px-4 font-semibold">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {movimientos.slice(0, 50).map((mov) => {
                  const producto = productos.find((p) => p.id_producto === mov.id_producto)

                  const tipoInfo = {
                    1: { texto: "Entrada", color: "bg-green-500/10 text-green-600" },
                    2: { texto: "Salida", color: "bg-red-500/10 text-red-600" },
                    3: { texto: "Ajuste", color: "bg-blue-500/10 text-blue-600" }
                  }[mov.tipo_movimiento] || { texto: "Desconocido", color: "bg-gray-500/10 text-gray-600" }

                  return (
                    <tr key={mov.id_movimiento} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">
                        {producto?.nombre || `Producto #${mov.id_producto}`}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${tipoInfo.color}`}>
                          {tipoInfo.texto}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-bold">
                        {mov.tipo_movimiento === 1 ? "+" : mov.tipo_movimiento === 2 ? "-" : "±"}{mov.cantidad}
                      </td>
                      <td className="py-3 px-4 text-right text-muted-foreground">
                        {mov.stock_anterior}
                      </td>
                      <td className="py-3 px-4 text-right font-medium">
                        {mov.stock_nuevo}
                      </td>
                      <td className="py-3 px-4">
                        {mov.referencia ? `#${mov.referencia}` : "—"}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {new Date(mov.fecha_movimiento).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {movimientos.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">No hay movimientos registrados</div>
          )}
          {movimientos.length > 50 && (
            <div className="text-center pt-4 text-sm text-muted-foreground">
              Mostrando los últimos 50 movimientos de {movimientos.length} totales
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}