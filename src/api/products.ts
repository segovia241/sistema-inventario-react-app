import type { Product } from '../types/Product'

const API_URL = import.meta.env.VITE_API_URL

export const getProducts = async (): Promise<Product[]> => {
  const res = await fetch(`${API_URL}/productos`)
  if (!res.ok) throw new Error("Error al obtener productos")
  return res.json()
}

export const getProductById = async (id: number): Promise<Product> => {
  const res = await fetch(`${API_URL}/productos/${id}`)
  if (!res.ok) throw new Error("Producto no encontrado")
  return res.json()
}

export const createProduct = async (product: Partial<Product>): Promise<Product> => {
  const res = await fetch(`${API_URL}/productos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product)
  })
  if (!res.ok) throw new Error("Error al crear producto")
  return res.json()
}

export const updateProduct = async (id: number, product: Partial<Product>): Promise<Product> => {
  const res = await fetch(`${API_URL}/productos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product)
  })
  if (!res.ok) throw new Error("Error al actualizar producto")
  return res.json()
}

export const deleteProduct = async (id: number): Promise<void> => {
  const res = await fetch(`${API_URL}/productos/${id}`, {
    method: 'DELETE'
  })
  if (!res.ok) throw new Error("Error al eliminar producto")
}

export const updateProductStock = async (id: number, stock_actual: number): Promise<Product> => {
  const res = await fetch(`${API_URL}/productos/${id}/stock`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stock_actual })
  })
  if (!res.ok) throw new Error("Error al actualizar stock")
  return res.json()
}

export const getLowStockProducts = async (): Promise<Product[]> => {
  const res = await fetch(`${API_URL}/productos/bajo-stock`)
  if (!res.ok) throw new Error("Error al obtener productos con bajo stock")
  return res.json()
}
