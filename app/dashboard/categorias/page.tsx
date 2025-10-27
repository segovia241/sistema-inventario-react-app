"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Edit2, Trash2 } from "lucide-react"

interface Categoria {
  id: string
  nombre: string
  descripcion: string
}

export default function CategoriasPage() {
  const router = useRouter()
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ nombre: "", descripcion: "" })
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || ""

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (!token) {
      router.push("/login")
      return
    }

    loadCategorias()
  }, [router])

  const loadCategorias = async () => {
    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(apiUrl + "/categoria", {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }
      
      const data = await response.json()
      setCategorias(data)
    } catch (error) {
      console.error("Error loading categorias:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const token = localStorage.getItem("authToken")
      const method = editingId ? "PUT" : "POST"
      const url = editingId ? `${apiUrl}/categoria/${editingId}` : `${apiUrl}/categoria`

      const response = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        loadCategorias()
        setFormData({ nombre: "", descripcion: "" })
        setEditingId(null)
        setShowForm(false)
      } else {
        const errorData = await response.json()
        alert(`Error: ${errorData.message || response.statusText}`)
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error al procesar la solicitud")
    }
  }

  const handleEdit = (categoria: Categoria) => {
    setFormData({ nombre: categoria.nombre, descripcion: categoria.descripcion })
    setEditingId(categoria.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta categoría?")) return

    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(`${apiUrl}/categoria/${id}`, { 
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        loadCategorias()
      } else {
        const errorData = await response.json()
        alert(`Error al eliminar: ${errorData.message || response.statusText}`)
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error al eliminar la categoría")
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-full">Cargando categorías...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Categorías</h1>
          <p className="text-muted-foreground">Gestiona las categorías de productos</p>
        </div>
        <Button
          onClick={() => {
            setShowForm(!showForm)
            setEditingId(null)
            setFormData({ nombre: "", descripcion: "" })
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nueva Categoría
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Editar Categoría" : "Nueva Categoría"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Ej: Tarjetas Gráficas"
                  required
                />
              </div>
              <div>
                <Label htmlFor="descripcion">Descripción</Label>
                <textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  placeholder="Descripción de la categoría"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">{editingId ? "Actualizar" : "Crear"}</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false)
                    setEditingId(null)
                    setFormData({ nombre: "", descripcion: "" })
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Categorías ({categorias.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {categorias.map((categoria) => (
              <div
                key={categoria.id}
                className="flex justify-between items-center p-4 border border-border rounded-lg hover:bg-muted/50"
              >
                <div>
                  <p className="font-medium">{categoria.nombre}</p>
                  <p className="text-sm text-muted-foreground">{categoria.descripcion}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(categoria)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(categoria.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          {categorias.length === 0 && <div className="text-center py-8 text-muted-foreground">No hay categorías</div>}
        </CardContent>
      </Card>
    </div>
  )
}