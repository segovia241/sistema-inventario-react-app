export type Product = {
  id_producto: number
  codigo: string
  nombre: string
  descripcion: string | null
  categoria: number | null
  marca: number | null
  modelo: string | null
  precio_compra: number
  precio_venta: number
  stock_actual: number
  stock_minimo: number
  unidad_medida: number // 1=unidad, 2=kg, 3=g, 4=l, etc
  estado: number // 0=inactivo, 1=activo
  created_at: string | Date
  updated_at: string | Date
  // Campos adicionales para UI
  image_url?: string
  barcode?: string
  vendor?: string
  exp_date?: string
  tags?: string[]
}
