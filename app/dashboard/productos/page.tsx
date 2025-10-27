"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Edit2, Trash2, Search } from "lucide-react"

interface Producto {
  id_producto: number
  codigo: string
  nombre: string
  descripcion: string
  precio_venta: number
  stock_actual: number
  stock_minimo: number
  estado: number
}

export default function ProductosPage() {
  const router = useRouter()
  const [productos, setProductos] = useState<Producto[]>([])
  const [filteredProductos, setFilteredProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
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
      const token = localStorage.getItem("authToken")
      const response = await fetch(apiUrl + "/productos", {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }
      
      const data = await response.json()
      setProductos(data)
      setFilteredProductos(data)
    } catch (error) {
      console.error("Error loading productos:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    const filtered = productos.filter(
      (p) => 
        p.nombre.toLowerCase().includes(term.toLowerCase()) || 
        p.codigo.toLowerCase().includes(term.toLowerCase())
    )
    setFilteredProductos(filtered)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este producto?")) return

    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(`${apiUrl}/productos/${id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        setProductos(productos.filter((p) => p.id_producto !== id))
        setFilteredProductos(filteredProductos.filter((p) => p.id_producto !== id))
      } else {
        console.error("Error al eliminar producto")
      }
    } catch (error) {
      console.error("Error deleting producto:", error)
    }
  }

  const getEstadoProducto = (producto: Producto) => {
    if (producto.estado === 0) {
      return {
        text: "Inactivo",
        class: "bg-gray-500/10 text-gray-600"
      }
    }
    
    if (producto.stock_actual <= producto.stock_minimo) {
      return {
        text: "Bajo Stock",
        class: "bg-destructive/10 text-destructive"
      }
    }
    
    return {
      text: "En Stock",
      class: "bg-green-500/10 text-green-600"
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-full">Cargando productos...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Productos</h1>
          <p className="text-muted-foreground">Gestiona tu catálogo de hardware y periféricos</p>
        </div>
        <Link href="/dashboard/productos/nuevo">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Producto
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre o código..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Catálogo de Productos ({filteredProductos.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">Nombre</th>
                  <th className="text-left py-3 px-4 font-semibold">Código</th>
                  <th className="text-right py-3 px-4 font-semibold">Precio</th>
                  <th className="text-right py-3 px-4 font-semibold">Stock</th>
                  <th className="text-center py-3 px-4 font-semibold">Estado</th>
                  <th className="text-center py-3 px-4 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProductos.map((producto) => {
                  const estado = getEstadoProducto(producto)
                  return (
                    <tr key={producto.id_producto} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium">{producto.nombre}</div>
                          <div className="text-xs text-muted-foreground">{producto.descripcion}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{producto.codigo}</td>
                      <td className="py-3 px-4 text-right font-medium">${producto.precio_venta.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right">{producto.stock_actual.toLocaleString()}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-block px-2 py-1 text-xs rounded ${estado.class}`}>
                          {estado.text}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex justify-center gap-2">
                          <Link href={`/dashboard/productos/${producto.id_producto}`}>
                            <Button variant="ghost" size="sm">
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(producto.id_producto)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {filteredProductos.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {productos.length === 0 ? "No hay productos registrados" : "No hay productos que coincidan con tu búsqueda"}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}