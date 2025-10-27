// Mock database - En producción, conectar a una base de datos real
// Este archivo sirve como punto central para todas las operaciones de base de datos

export interface Usuario {
  id: number
  nombre: string
  apellido: string
  email: string
  password: string
  rol: number // 1=admin, 2=vendedor, 3=cajero
  activo: number // 0=inactivo, 1=activo
  created_at: Date
  updated_at: Date
  last_login?: Date
}

export interface Producto {
  id_producto: number
  codigo: string
  nombre: string
  descripcion?: string
  categoria?: number
  marca?: number
  modelo?: string
  precio_compra: number
  precio_venta: number
  stock_actual: number
  stock_minimo: number
  unidad_medida: number
  estado: number
  created_at: Date
  updated_at: Date
}

export interface Venta {
  id_venta: number
  fecha_venta: Date
  id_cliente: number
  id_usuario: number
  monto_total: number
  metodo_pago: number // 1=efectivo, 2=tarjeta, 3=transferencia
  tipo_comprobante: number // 1=boleta, 2=factura
  numero_comprobante: string
  notas?: string
  created_at: Date
  updated_at: Date
}

export interface Cliente {
  id_cliente: number
  nombre_completo: string
  ruc_dni: string
  telefono: string
  email: string
  direccion: string
  notas: string
  created_at: Date
  updated_at: Date
}

export interface Proveedor {
  id_proveedor: number
  razon_social: string
  ruc_dni?: string
  telefono?: string
  email?: string
  direccion?: string
  notas?: string
  created_at: Date
  updated_at: Date
}

export interface Compra {
  id_compra: number
  fecha_compra: Date
  id_proveedor: number
  id_usuario: number
  monto_total: number
  metodo_pago: number
  numero_factura?: string
  notas?: string
  created_at: Date
  updated_at: Date
}

export interface Categoria {
  id: number
  nombre: string
}

export interface Marca {
  id: number
  nombre: string
}

export interface MovimientoInventario {
  id_movimiento: number
  id_producto: number
  tipo_movimiento: number
  cantidad: number
  unidad_medida: number
  stock_anterior: number
  stock_nuevo: number
  referencia?: number
  fecha_movimiento: Date
  id_usuario: number
}

// Mock data storage
const mockData = {
  usuarios: [] as Usuario[],
  productos: [] as Producto[],
  ventas: [] as Venta[],
  clientes: [] as Cliente[],
  proveedores: [] as Proveedor[],
  compras: [] as Compra[],
  categorias: [] as Categoria[],
  marcas: [] as Marca[],
  movimientos: [] as MovimientoInventario[],
}

export default mockData
