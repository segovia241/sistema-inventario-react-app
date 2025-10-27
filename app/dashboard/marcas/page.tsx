"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Edit2, Trash2 } from "lucide-react"

interface Marca {
  id: string
  nombre: string
  descripcion: string
}

export default function MarcasPage() {
  const router = useRouter()
  const [marcas, setMarcas] = useState<Marca[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ nombre: "", descripcion: "" })
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (!token) {
      router.push("/login")
      return
    }

    loadMarcas()
  }, [router])

  const loadMarcas = async () => {
    try {
      const response = await fetch(apiUrl + "/marca")
      const data = await response.json()
      setMarcas(data)
    } catch (error) {
      console.error("Error loading marcas:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const method = editingId ? "PUT" : "POST"
      const url = editingId ? `/api/marca/${editingId}` : "/api/marca"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        loadMarcas()
        setFormData({ nombre: "", descripcion: "" })
        setEditingId(null)
        setShowForm(false)
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const handleEdit = (marca: Marca) => {
    setFormData({ nombre: marca.nombre, descripcion: marca.descripcion })
    setEditingId(marca.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro?")) return

    try {
      const response = await fetch(`/api/marca/${id}`, { method: "DELETE" })
      if (response.ok) {
        loadMarcas()
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
          <h1 className="text-3xl font-bold">Marcas</h1>
          <p className="text-muted-foreground">Gestiona las marcas de productos</p>
        </div>
        <Button
          onClick={() => {
            setShowForm(!showForm)
            setEditingId(null)
            setFormData({ nombre: "", descripcion: "" })
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nueva Marca
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Editar Marca" : "Nueva Marca"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Ej: NVIDIA"
                  required
                />
              </div>
              <div>
                <Label htmlFor="descripcion">Descripción</Label>
                <textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  placeholder="Descripción de la marca"
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
          <CardTitle>Marcas ({marcas.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {marcas.map((marca) => (
              <div
                key={marca.id}
                className="flex justify-between items-center p-4 border border-border rounded-lg hover:bg-muted/50"
              >
                <div>
                  <p className="font-medium">{marca.nombre}</p>
                  <p className="text-sm text-muted-foreground">{marca.descripcion}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(marca)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(marca.id)} className="text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          {marcas.length === 0 && <div className="text-center py-8 text-muted-foreground">No hay marcas</div>}
        </CardContent>
      </Card>
    </div>
  )
}
