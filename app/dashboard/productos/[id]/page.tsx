"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { ProductForm } from "@/components/products/product-form"

export default function EditarProductoPage() {
  const router = useRouter()
  const params = useParams()
  const [producto, setProducto] = useState(null)
  const [categorias, setCategorias] = useState<any[]>([])
  const [marcas, setMarcas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (!token) {
      router.push("/login")
      return
    }

    loadProducto()
    loadCatalogos()
  }, [params.id, router])

  const loadProducto = async () => {
    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(`${apiUrl}/productos/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }
      
      const data = await response.json()
      setProducto(data)
    } catch (error) {
      console.error("Error loading producto:", error)
    } finally {
      setLoading(false)
    }
  }

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
      // const marcasResponse = await fetch(`${apiUrl}/marcas`, {
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json'
      //   }
      // })
      
      // if (marcasResponse.ok) {
      //   const marcasData = await marcasResponse.json()
      //   setMarcas(marcasData)
      // }

      // Por ahora, si no tienes endpoint de marcas, puedes dejarlo vacío o usar datos de ejemplo
      setMarcas([])

    } catch (error) {
      console.error("Error loading catalogos:", error)
    }
  }

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true)
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
        estado: formData.estado !== undefined ? parseInt(formData.estado) : 1
      }

      const response = await fetch(`${apiUrl}/productos/${params.id}`, {
        method: "PUT",
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
        alert(`Error al actualizar el producto: ${errorData.message || response.statusText}`)
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error al actualizar el producto")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-full">Cargando producto...</div>
  }

  return (
    <div className="max-w-2xl">
      <ProductForm 
        onSubmit={handleSubmit} 
        initialData={producto} 
        isLoading={isSubmitting}
        categorias={categorias}
        marcas={marcas}
      />
    </div>
  )
}