"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Edit2, Trash2, Search } from "lucide-react"

interface Cliente {
  id_cliente: number
  nombre_completo: string
  ruc_dni: string
  telefono: string
  email: string
  direccion: string
  notas: string | null
}

export default function ClientesPage() {
  const router = useRouter()
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [filteredClientes, setFilteredClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [formData, setFormData] = useState({
    nombre_completo: "",
    ruc_dni: "",
    email: "",
    telefono: "",
    direccion: "",
    notas: "",
  })
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (!token) {
      router.push("/login")
      return
    }

    loadClientes()
  }, [router])

  const loadClientes = async () => {
    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(apiUrl + "/clientes", {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }
      
      const data = await response.json()
      setClientes(data)
      setFilteredClientes(data)
    } catch (error) {
      console.error("Error loading clientes:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    const filtered = clientes.filter(
      (c) => 
        c.nombre_completo.toLowerCase().includes(term.toLowerCase()) || 
        c.email.toLowerCase().includes(term.toLowerCase()) ||
        c.ruc_dni.includes(term)
    )
    setFilteredClientes(filtered)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const token = localStorage.getItem("authToken")
      const method = editingId ? "PUT" : "POST"
      const url = editingId ? `${apiUrl}/clientes/${editingId}` : `${apiUrl}/clientes`

      const response = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        loadClientes()
        setFormData({ 
          nombre_completo: "", 
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

  const handleEdit = (cliente: Cliente) => {
    setFormData({
      nombre_completo: cliente.nombre_completo,
      ruc_dni: cliente.ruc_dni,
      email: cliente.email,
      telefono: cliente.telefono,
      direccion: cliente.direccion,
      notas: cliente.notas || "",
    })
    setEditingId(cliente.id_cliente)
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este cliente?")) return

    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(`${apiUrl}/clientes/${id}`, { 
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        loadClientes()
      } else {
        const errorData = await response.json()
        alert(`Error al eliminar: ${errorData.message || response.statusText}`)
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error al eliminar el cliente")
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-full">Cargando clientes...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Clientes</h1>
          <p className="text-muted-foreground">Gestiona tu base de clientes</p>
        </div>
        <Button
          onClick={() => {
            setShowForm(!showForm)
            setEditingId(null)
            setFormData({ 
              nombre_completo: "", 
              ruc_dni: "", 
              email: "", 
              telefono: "", 
              direccion: "", 
              notas: "" 
            })
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Cliente
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre, email o RUC/DNI..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Editar Cliente" : "Nuevo Cliente"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nombre_completo">Nombre Completo</Label>
                  <Input
                    id="nombre_completo"
                    value={formData.nombre_completo}
                    onChange={(e) => setFormData({ ...formData, nombre_completo: e.target.value })}
                    placeholder="Nombre completo del cliente"
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
                  placeholder="Información adicional del cliente"
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
                      nombre_completo: "", 
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
          <CardTitle>Clientes ({filteredClientes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">Nombre Completo</th>
                  <th className="text-left py-3 px-4 font-semibold">RUC/DNI</th>
                  <th className="text-left py-3 px-4 font-semibold">Email</th>
                  <th className="text-left py-3 px-4 font-semibold">Teléfono</th>
                  <th className="text-center py-3 px-4 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredClientes.map((cliente) => (
                  <tr key={cliente.id_cliente} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium">{cliente.nombre_completo}</td>
                    <td className="py-3 px-4">{cliente.ruc_dni}</td>
                    <td className="py-3 px-4">{cliente.email}</td>
                    <td className="py-3 px-4">{cliente.telefono}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(cliente)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(cliente.id_cliente)}
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
          {filteredClientes.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {clientes.length === 0 ? "No hay clientes registrados" : "No hay clientes que coincidan con tu búsqueda"}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}