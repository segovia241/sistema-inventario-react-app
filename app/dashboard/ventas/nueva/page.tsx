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

interface Cliente {
  id_cliente: number
  nombre_completo: string
  ruc_dni: string | null
  telefono: string | null
  email: string | null
  direccion: string | null
  notas: string | null
}

interface ItemVenta {
  id_producto: number
  cantidad: number
  precio_unitario: number
}

export default function NuevaVentaPage() {
  const router = useRouter()
  const [productos, setProductos] = useState<Producto[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [clienteSearch, setClienteSearch] = useState("")
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null)
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false)
  const [metodoPago, setMetodoPago] = useState("1")
  const [tipoComprobante, setTipoComprobante] = useState("1")
  const [numeroComprobante, setNumeroComprobante] = useState("")
  const [notas, setNotas] = useState("")
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
    loadClientes()
    generarNumeroComprobante()
  }, [router, tipoComprobante])

  const loadProductos = async () => {
    try {
      const response = await fetch(apiUrl + "/productos")
      const data = await response.json()
      setProductos(data)
    } catch (error) {
      console.error("Error loading productos:", error)
    }
  }

  const loadClientes = async () => {
    try {
      const response = await fetch(apiUrl + "/clientes")
      const data = await response.json()
      setClientes(data)
      setLoading(false)
    } catch (error) {
      console.error("Error loading clientes:", error)
      setLoading(false)
    }
  }

  const generarNumeroComprobante = () => {
    const timestamp = new Date().getTime()
    const random = Math.floor(Math.random() * 1000)
    const prefijo = tipoComprobante === "1" ? "B" : "F"
    setNumeroComprobante(`${prefijo}-${timestamp}-${random}`)
  }

  const clientesFiltrados = clientes.filter(cliente =>
    cliente.nombre_completo.toLowerCase().includes(clienteSearch.toLowerCase()) ||
    (cliente.ruc_dni && cliente.ruc_dni.includes(clienteSearch))
  )

  const seleccionarCliente = (cliente: Cliente) => {
    setClienteSeleccionado(cliente)
    setClienteSearch(cliente.nombre_completo)
    setMostrarSugerencias(false)
  }

  const handleAddItem = () => {
    if (!selectedProducto || !cantidad) return

    const producto = productos.find((p) => p.id_producto.toString() === selectedProducto)
    if (!producto) return

    const newItem: ItemVenta = {
      id_producto: producto.id_producto,
      cantidad: Number.parseInt(cantidad),
      precio_unitario: producto.precio_venta,
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

    if (!clienteSeleccionado || items.length === 0 || !numeroComprobante) {
      alert("Por favor completa todos los campos obligatorios")
      return
    }

    try {
      const usuario = JSON.parse(localStorage.getItem("usuario") || "{}")
      
      if (!usuario.id) {
        alert("No se encontró información del usuario. Inicia sesión nuevamente.")
        router.push("/login")
        return
      }

      const monto_total = items.reduce((sum, item) => sum + item.cantidad * item.precio_unitario, 0)

      const ventaData = {
        id_cliente: clienteSeleccionado.id_cliente, // ✅ Usamos el ID del cliente seleccionado
        id_usuario: usuario.id,
        monto_total: monto_total,
        metodo_pago: Number(metodoPago),
        tipo_comprobante: Number(tipoComprobante),
        numero_comprobante: numeroComprobante,
        notas: notas || null,
        estado: "completada",
        items: items.map(item => ({
          id_producto: item.id_producto,
          cantidad: item.cantidad,
          precio_unitario: item.precio_unitario
        }))
      }

      console.log("Enviando datos:", ventaData)

      const response = await fetch(apiUrl + "/ventas", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`
        },
        body: JSON.stringify(ventaData),
      })

      if (response.ok) {
        router.push("/dashboard/ventas")
      } else {
        const errorData = await response.json()
        alert(`Error al crear la venta: ${errorData.message || "Error desconocido"}`)
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error al crear la venta")
    }
  }

  const total = items.reduce((sum, item) => sum + item.cantidad * item.precio_unitario, 0)

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
        {/* Información del Cliente y Comprobante */}
        <Card>
          <CardHeader>
            <CardTitle>Información de la Venta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Label htmlFor="cliente">Buscar Cliente *</Label>
                <Input
                  id="cliente"
                  value={clienteSearch}
                  onChange={(e) => {
                    setClienteSearch(e.target.value)
                    setMostrarSugerencias(true)
                    if (!e.target.value) {
                      setClienteSeleccionado(null)
                    }
                  }}
                  onFocus={() => setMostrarSugerencias(true)}
                  placeholder="Escribe el nombre o RUC/DNI del cliente"
                  required
                />
                
                {mostrarSugerencias && clienteSearch && clientesFiltrados.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {clientesFiltrados.map((cliente) => (
                      <div
                        key={cliente.id_cliente}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100 border-b last:border-b-0"
                        onClick={() => seleccionarCliente(cliente)}
                      >
                        <div className="font-medium">{cliente.nombre_completo}</div>
                        {cliente.ruc_dni && (
                          <div className="text-sm text-gray-600">RUC/DNI: {cliente.ruc_dni}</div>
                        )}
                        {cliente.telefono && (
                          <div className="text-sm text-gray-600">Tel: {cliente.telefono}</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {clienteSeleccionado && (
                  <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
                    <div className="font-medium text-green-800">Cliente seleccionado:</div>
                    <div>{clienteSeleccionado.nombre_completo}</div>
                    {clienteSeleccionado.ruc_dni && (
                      <div className="text-sm text-green-600">RUC/DNI: {clienteSeleccionado.ruc_dni}</div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="metodoPago">Método de Pago *</Label>
                <select
                  id="metodoPago"
                  value={metodoPago}
                  onChange={(e) => setMetodoPago(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                  required
                >
                  <option value="1">Efectivo</option>
                  <option value="2">Tarjeta</option>
                  <option value="3">Transferencia</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tipoComprobante">Tipo de Comprobante *</Label>
                <select
                  id="tipoComprobante"
                  value={tipoComprobante}
                  onChange={(e) => {
                    setTipoComprobante(e.target.value)
                    generarNumeroComprobante()
                  }}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                  required
                >
                  <option value="1">Boleta</option>
                  <option value="2">Factura</option>
                </select>
              </div>

              <div>
                <Label htmlFor="numeroComprobante">Número de Comprobante *</Label>
                <Input
                  id="numeroComprobante"
                  value={numeroComprobante}
                  onChange={(e) => setNumeroComprobante(e.target.value)}
                  placeholder="Número automático"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notas">Notas (Opcional)</Label>
              <Input
                id="notas"
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                placeholder="Notas adicionales..."
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
                    <option key={p.id_producto} value={p.id_producto.toString()}>
                      {p.nombre} - ${p.precio_venta.toFixed(2)} (Stock: {p.stock_actual})
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
                  min="1"
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
                      const producto = productos.find((p) => p.id_producto === item.id_producto)
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
          <Button 
            type="submit" 
            disabled={items.length === 0 || !clienteSeleccionado}
          >
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