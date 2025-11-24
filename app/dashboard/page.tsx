"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Eye, Trash2, Search } from "lucide-react"

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
    productoId: number
    cantidad: number
    precioUnitario: number
  }>
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

export default function VentasPage() {
  const router = useRouter()
  const [ventas, setVentas] = useState<Venta[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [filteredVentas, setFilteredVentas] = useState<Venta[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (!token) {
      router.push("/login")
      return
    }

    loadVentas()
    loadClientes()
  }, [router])

  const loadVentas = async () => {
    try {
      const response = await fetch(apiUrl + "/ventas")
      const data = await response.json()
      setVentas(data)
      setFilteredVentas(data)
    } catch (error) {
      console.error("Error loading ventas:", error)
    }
  }

  const loadClientes = async () => {
    try {
      const response = await fetch(apiUrl + "/clientes")
      const data = await response.json()
      setClientes(data)
    } catch (error) {
      console.error("Error loading clientes:", error)
    } finally {
      setLoading(false)
    }
  }

  // Función para obtener el nombre del cliente por ID
  const getNombreCliente = (idCliente: number): string => {
    const cliente = clientes.find(c => c.id_cliente === idCliente)
    return cliente ? cliente.nombre_completo : `Cliente #${idCliente}`
  }

  // Función para obtener el método de pago como texto
  const getMetodoPago = (metodo: number): string => {
    const metodos = {
      1: "Efectivo",
      2: "Tarjeta", 
      3: "Transferencia"
    }
    return metodos[metodo as keyof typeof metodos] || "Desconocido"
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)

    if (!term.trim()) {
      setFilteredVentas(ventas)
      return
    }

    const filtered = ventas.filter((v) =>
      v.id_venta.toString().includes(term) ||
      v.numero_comprobante.toLowerCase().includes(term.toLowerCase()) ||
      getNombreCliente(v.id_cliente).toLowerCase().includes(term.toLowerCase())
    )

    setFilteredVentas(filtered)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta venta?")) return

    try {
      const response = await fetch(`${apiUrl}/ventas/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`
        }
      })

      if (response.ok) {
        setVentas(ventas.filter((v) => v.id_venta !== id))
        setFilteredVentas(filteredVentas.filter((v) => v.id_venta !== id))
      } else {
        alert("Error al eliminar la venta")
      }
    } catch (error) {
      console.error("Error deleting venta:", error)
      alert("Error al eliminar la venta")
    }
  }

  const totalVentas = ventas.reduce((sum, v) => sum + v.monto_total, 0)

  if (loading) {
    return <div>Cargando...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Ventas</h1>
          <p className="text-muted-foreground">Gestiona todas tus transacciones de venta</p>
        </div>
        <Link href="/dashboard/ventas/nueva">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Venta
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ventas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ventas.length}</div>
            <p className="text-xs text-muted-foreground">Transacciones registradas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalVentas.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">USD</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promedio por Venta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalVentas / (ventas.length || 1)).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">USD</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Atendidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(ventas.map(v => v.id_cliente)).size}
            </div>
            <p className="text-xs text-muted-foreground">Clientes únicos</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por ID, comprobante o cliente..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Ventas Table */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Ventas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">ID Venta</th>
                  <th className="text-left py-3 px-4 font-semibold">Cliente</th>
                  <th className="text-left py-3 px-4 font-semibold">Fecha</th>
                  <th className="text-left py-3 px-4 font-semibold">Comprobante</th>
                  <th className="text-left py-3 px-4 font-semibold">Método Pago</th>
                  <th className="text-right py-3 px-4 font-semibold">Total</th>
                  <th className="text-center py-3 px-4 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredVentas.map((venta) => (
                  <tr key={venta.id_venta} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium">#{venta.id_venta}</td>
                    <td className="py-3 px-4">
                      {getNombreCliente(venta.id_cliente)}
                    </td>
                    <td className="py-3 px-4">
                      {new Date(venta.fecha_venta).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {venta.numero_comprobante}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {getMetodoPago(venta.metodo_pago)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-bold">
                      ${venta.monto_total.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center gap-2">
                        <Link href={`/dashboard/ventas/${venta.id_venta}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(venta.id_venta)}
                          className="text-destructive hover:text-destructive-foreground hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredVentas.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? "No se encontraron ventas que coincidan con la búsqueda" : "No hay ventas registradas"}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}