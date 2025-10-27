"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ProductFormProps {
  onSubmit: (data: any) => void
  initialData?: any
  isLoading?: boolean
  categorias?: any[]
  marcas?: any[]
}

export function ProductForm({ onSubmit, initialData, isLoading, categorias = [], marcas = [] }: ProductFormProps) {
  // Transformar los datos iniciales si vienen de la API
  const transformInitialData = (data: any) => {
    if (!data) return {
      codigo: "",
      nombre: "",
      descripcion: "",
      precio_compra: "",
      precio_venta: "",
      stock_actual: "",
      stock_minimo: "",
      categoria: undefined,
      marca: undefined,
      modelo: "",
    }

    return {
      codigo: data.codigo || "",
      nombre: data.nombre || "",
      descripcion: data.descripcion || "",
      precio_compra: data.precio_compra?.toString() || "",
      precio_venta: data.precio_venta?.toString() || "",
      stock_actual: data.stock_actual?.toString() || "",
      stock_minimo: data.stock_minimo?.toString() || "",
      categoria: data.categoria?.toString() || undefined,
      marca: data.marca?.toString() || undefined,
      modelo: data.modelo || "",
    }
  }

  const [formData, setFormData] = useState(() => transformInitialData(initialData))

  // Actualizar formData cuando initialData cambie
  useEffect(() => {
    setFormData(transformInitialData(initialData))
  }, [initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [name]: value === "" ? undefined : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  // Función para obtener el ID correcto basado en la estructura de datos
  const getCategoriaId = (categoria: any) => {
    return categoria.id_categoria?.toString() || categoria.id?.toString() || ""
  }

  const getCategoriaNombre = (categoria: any) => {
    return categoria.nombre || ""
  }

  const getMarcaId = (marca: any) => {
    return marca.id_marca?.toString() || marca.id?.toString() || ""
  }

  const getMarcaNombre = (marca: any) => {
    return marca.nombre || ""
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? "Editar Producto" : "Nuevo Producto"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nombre">Nombre del Producto</Label>
              <Input
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej: Monitor LED 24''"
                required
              />
            </div>

            <div>
              <Label htmlFor="codigo">Código</Label>
              <Input
                id="codigo"
                name="codigo"
                value={formData.codigo}
                onChange={handleChange}
                placeholder="Ej: MON-001"
                required
              />
            </div>

            <div>
              <Label htmlFor="precio_venta">Precio Venta</Label>
              <Input
                id="precio_venta"
                name="precio_venta"
                type="number"
                step="0.01"
                value={formData.precio_venta}
                onChange={handleChange}
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <Label htmlFor="precio_compra">Precio Compra</Label>
              <Input
                id="precio_compra"
                name="precio_compra"
                type="number"
                step="0.01"
                value={formData.precio_compra}
                onChange={handleChange}
                placeholder="0.00"
              />
            </div>

            <div>
              <Label htmlFor="stock_actual">Stock Actual</Label>
              <Input
                id="stock_actual"
                name="stock_actual"
                type="number"
                value={formData.stock_actual}
                onChange={handleChange}
                placeholder="0"
                required
              />
            </div>

            <div>
              <Label htmlFor="stock_minimo">Stock Mínimo</Label>
              <Input
                id="stock_minimo"
                name="stock_minimo"
                type="number"
                value={formData.stock_minimo}
                onChange={handleChange}
                placeholder="2"
                required
              />
            </div>

            <div>
              <Label htmlFor="categoria">Categoría</Label>
              <Select 
                value={formData.categoria || ""} 
                onValueChange={(value) => handleSelectChange("categoria", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.length > 0 ? (
                    categorias.map((categoria) => (
                      <SelectItem 
                        key={getCategoriaId(categoria)} 
                        value={getCategoriaId(categoria)}
                      >
                        {getCategoriaNombre(categoria)}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-data" disabled>
                      No hay categorías disponibles
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="marca">Marca</Label>
              <Select 
                value={formData.marca || ""} 
                onValueChange={(value) => handleSelectChange("marca", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar marca" />
                </SelectTrigger>
                <SelectContent>
                  {marcas.length > 0 ? (
                    marcas.map((marca) => (
                      <SelectItem 
                        key={getMarcaId(marca)} 
                        value={getMarcaId(marca)}
                      >
                        {getMarcaNombre(marca)}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-data" disabled>
                      No hay marcas disponibles
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="modelo">Modelo</Label>
              <Input
                id="modelo"
                name="modelo"
                value={formData.modelo}
                onChange={handleChange}
                placeholder="Ej: S24F350"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="descripcion">Descripción</Label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Descripción detallada del producto"
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
              rows={4}
            />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Guardando..." : initialData ? "Actualizar Producto" : "Crear Producto"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}