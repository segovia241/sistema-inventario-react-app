"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Eye, Trash2, Search } from "lucide-react"

interface Compra {
  id_compra: number
  fecha_compra: string
  id_proveedor: number
  id_usuario: number
  monto_total: number
  metodo_pago: number
  numero_factura: string
  notas: string | null
  created_at: string
  updated_at: string
}

export default function ComprasPage() {
  const router = useRouter()
  const [compras, setCompras] = useState<Compra[]>([])
  const [filteredCompras, setFilteredCompras] = useState<Compra[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (!token) {
      router.push("/login")
      return
    }

    loadCompras()
  }, [router])

  const loadCompras = async () => {
    try {
      const response = await fetch(apiUrl + "/compras")
      const data = await response.json()
      setCompras(data)
      setFilteredCompras(data)
    } catch (error) {
      console.error("Error loading compras:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    const filtered = compras.filter((c) =>
      c.id_compra.toString().includes(term)
    )
    setFilteredCompras(filtered)
  }

  const handleDelete = async (id_compra: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta compra?")) return

    try {
      const response = await fetch(`/api/compras/${id_compra}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setCompras(compras.filter((c) => c.id_compra !== id_compra))
        setFilteredCompras(filteredCompras.filter((c) => c.id_compra !== id_compra))
      }
    } catch (error) {
      console.error("Error deleting compra:", error)
    }
  }

  // 🔥 USAR monto_total REAL
  const totalCompras = compras.reduce(
    (sum, c) => sum + c.monto_total,
    0
  )

  if (loading) {
    return <div>Cargando...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Compras</h1>
          <p className="text-muted-foreground">Gestiona todas tus órdenes de compra</p>
        </div>
        <Link href="/dashboard/compras/nueva">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Compra
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Compras</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{compras.length}</div>
            <p className="text-xs text-muted-foreground">Órdenes registradas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gastos Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCompras.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">USD</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promedio por Compra</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(totalCompras / (compras.length || 1)).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">USD</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por ID de compra..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Compras Table */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Compras</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">ID Compra</th>
                  <th className="text-left py-3 px-4 font-semibold">Proveedor</th>
                  <th className="text-left py-3 px-4 font-semibold">Fecha</th>
                  <th className="text-right py-3 px-4 font-semibold">Total</th>
                  <th className="text-center py-3 px-4 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredCompras.map((compra) => (
                  <tr key={compra.id_compra} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium">{compra.id_compra}</td>
                    <td className="py-3 px-4">{compra.id_proveedor}</td>

                    <td className="py-3 px-4">
                      {new Date(compra.fecha_compra).toLocaleDateString()}
                    </td>

                    <td className="py-3 px-4 text-right font-bold">
                      ${compra.monto_total.toFixed(2)}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center gap-2">
                        <Link href={`/dashboard/compras/${compra.id_compra}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(compra.id_compra)}
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

          {filteredCompras.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No hay compras registradas
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
