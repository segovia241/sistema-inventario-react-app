"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Edit2, Trash2, Search } from "lucide-react"

interface Proveedor {
  id_proveedor: number
  razon_social: string
  ruc_dni: string
  telefono: string
  email: string
  direccion: string
  notas: string | null
}

export default function ProveedoresPage() {
  const router = useRouter()
  const [proveedores, setProveedores] = useState<Proveedor[]>([])
  const [filteredProveedores, setFilteredProveedores] = useState<Proveedor[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [formData, setFormData] = useState({
    razon_social: "",
    ruc_dni: "",
    email: "",
    telefono: "",
    direccion: "",
    notas: "",
  })
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || ""

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (!token) {
      router.push("/login")
      return
    }

    loadProveedores()
  }, [router])

  const loadProveedores = async () => {
    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(apiUrl + "/proveedores", {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }
      
      const data = await response.json()
      setProveedores(data)
      setFilteredProveedores(data)
    } catch (error) {
      console.error("Error loading proveedores:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    const filtered = proveedores.filter(
      (p) => 
        p.razon_social.toLowerCase().includes(term.toLowerCase()) || 
        p.email.toLowerCase().includes(term.toLowerCase()) ||
        p.ruc_dni.includes(term)
    )
    setFilteredProveedores(filtered)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const token = localStorage.getItem("authToken")
      const method = editingId ? "PUT" : "POST"
      const url = editingId ? `${apiUrl}/proveedores/${editingId}` : `${apiUrl}/proveedores`

      const response = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        loadProveedores()
        setFormData({ 
          razon_social: "", 
          ruc_dni: "", 
          email: "", 
          telefono: "", 
          direccion: "", 
          notas: "" 
        })
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

  const handleEdit = (proveedor: Proveedor) => {
    setFormData({
      razon_social: proveedor.razon_social,
      ruc_dni: proveedor.ruc_dni,
      email: proveedor.email,
      telefono: proveedor.telefono,
      direccion: proveedor.direccion,
      notas: proveedor.notas || "",
    })
    setEditingId(proveedor.id_proveedor)
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este proveedor?")) return

    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(`${apiUrl}/proveedores/${id}`, { 
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        loadProveedores()
      } else {
        const errorData = await response.json()
        alert(`Error al eliminar: ${errorData.message || response.statusText}`)
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error al eliminar el proveedor")
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-full">Cargando proveedores...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Proveedores</h1>
          <p className="text-muted-foreground">Gestiona tu red de proveedores</p>
        </div>
        <Button
          onClick={() => {
            setShowForm(!showForm)
            setEditingId(null)
            setFormData({ 
              razon_social: "", 
              ruc_dni: "", 
              email: "", 
              telefono: "", 
              direccion: "", 
              notas: "" 
            })
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Proveedor
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por razón social, email o RUC..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Editar Proveedor" : "Nuevo Proveedor"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="razon_social">Razón Social</Label>
                  <Input
                    id="razon_social"
                    value={formData.razon_social}
                    onChange={(e) => setFormData({ ...formData, razon_social: e.target.value })}
                    placeholder="Nombre del proveedor"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="ruc_dni">RUC/DNI</Label>
                  <Input
                    id="ruc_dni"
                    value={formData.ruc_dni}
                    onChange={(e) => setFormData({ ...formData, ruc_dni: e.target.value })}
                    placeholder="Número de RUC o DNI"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@example.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="direccion">Dirección</Label>
                <Input
                  id="direccion"
                  value={formData.direccion}
                  onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                  placeholder="Dirección completa"
                />
              </div>
              <div>
                <Label htmlFor="notas">Notas</Label>
                <textarea
                  id="notas"
                  value={formData.notas}
                  onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                  placeholder="Información adicional del proveedor"
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
                    setFormData({ 
                      razon_social: "", 
                      ruc_dni: "", 
                      email: "", 
                      telefono: "", 
                      direccion: "", 
                      notas: "" 
                    })
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
          <CardTitle>Proveedores ({filteredProveedores.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">Razón Social</th>
                  <th className="text-left py-3 px-4 font-semibold">RUC/DNI</th>
                  <th className="text-left py-3 px-4 font-semibold">Email</th>
                  <th className="text-left py-3 px-4 font-semibold">Teléfono</th>
                  <th className="text-center py-3 px-4 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProveedores.map((proveedor) => (
                  <tr key={proveedor.id_proveedor} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium">{proveedor.razon_social}</td>
                    <td className="py-3 px-4">{proveedor.ruc_dni}</td>
                    <td className="py-3 px-4">{proveedor.email}</td>
                    <td className="py-3 px-4">{proveedor.telefono}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(proveedor)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(proveedor.id_proveedor)}
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
          {filteredProveedores.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {proveedores.length === 0 ? "No hay proveedores registrados" : "No hay proveedores que coincidan con tu búsqueda"}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}