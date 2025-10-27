"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Eye, Trash2, Search } from "lucide-react"

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

export default function VentasPage() {
  const router = useRouter()
  const [ventas, setVentas] = useState<Venta[]>([])
  const [filteredVentas, setFilteredVentas] = useState<Venta[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || ""
  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (!token) {
      router.push("/login")
      return
    }

    loadVentas()
  }, [router])

  const loadVentas = async () => {
    try {
      const response = await fetch(apiUrl + "/ventas")
      const data = await response.json()
      setVentas(data)
      setFilteredVentas(data)
    } catch (error) {
      console.error("Error loading ventas:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    const filtered = ventas.filter((v) => v.id.toLowerCase().includes(term.toLowerCase()))
    setFilteredVentas(filtered)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta venta?")) return

    try {
      const response = await fetch(`/api/ventas/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setVentas(ventas.filter((v) => v.id !== id))
        setFilteredVentas(filteredVentas.filter((v) => v.id !== id))
      }
    } catch (error) {
      console.error("Error deleting venta:", error)
    }
  }

  const totalVentas = ventas.reduce((sum, v) => sum + v.total, 0)

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por ID de venta..."
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
                  <th className="text-right py-3 px-4 font-semibold">Total</th>
                  <th className="text-center py-3 px-4 font-semibold">Estado</th>
                  <th className="text-center py-3 px-4 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredVentas.map((venta) => (
                  <tr key={venta.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium">{venta.id}</td>
                    <td className="py-3 px-4">{venta.clienteId}</td>
                    <td className="py-3 px-4">{new Date(venta.fecha).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-right font-bold">${venta.total.toFixed(2)}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-block px-2 py-1 bg-green-500/10 text-green-600 text-xs rounded">
                        {venta.estado}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center gap-2">
                        <Link href={`/dashboard/ventas/${venta.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(venta.id)}
                          className="text-destructive"
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
            <div className="text-center py-8 text-muted-foreground">No hay ventas registradas</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
