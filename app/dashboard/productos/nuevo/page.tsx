"use client"

import { useRouter } from "next/navigation"
import { ProductForm } from "@/components/products/product-form"
import { useState, useEffect } from "react"

export default function NuevoProductoPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [categorias, setCategorias] = useState<any[]>([])
  const [marcas, setMarcas] = useState<any[]>([])
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (!token) {
      router.push("/login")
      return
    }
    loadCatalogos()
  }, [router])

  const loadCatalogos = async () => {
    try {
      const token = localStorage.getItem("authToken")
      
      // Cargar categorías
      const categoriasResponse = await fetch(`${apiUrl}/categoria`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (categoriasResponse.ok) {
        const categoriasData = await categoriasResponse.json()
        setCategorias(categoriasData)
      }

      // Cargar marcas - si tienes endpoint para marcas
      setMarcas([])

    } catch (error) {
      console.error("Error loading catalogos:", error)
    }
  }

  const handleSubmit = async (formData: any) => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("authToken")
      
      // Preparar datos según lo que espera tu API
      const apiData = {
        codigo: formData.codigo,
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio_compra: parseFloat(formData.precio_compra) || 0,
        precio_venta: parseFloat(formData.precio_venta),
        stock_actual: parseInt(formData.stock_actual),
        stock_minimo: parseInt(formData.stock_minimo),
        categoria: formData.categoria ? parseInt(formData.categoria) : null,
        marca: formData.marca ? parseInt(formData.marca) : null,
        modelo: formData.modelo || null,
        unidad_medida: 1,
        estado: 1
      }

      const response = await fetch(apiUrl + "/productos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(apiData),
      })

      if (response.ok) {
        router.push("/dashboard/productos")
      } else {
        const errorData = await response.json()
        alert(`Error al crear el producto: ${errorData.message || response.statusText}`)
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error al crear el producto")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <ProductForm 
        onSubmit={handleSubmit} 
        isLoading={isLoading}
        categorias={categorias}
        marcas={marcas}
      />
    </div>
  )
}