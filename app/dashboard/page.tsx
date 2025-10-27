"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, ShoppingCart, ShoppingBag, AlertTriangle } from "lucide-react"

interface Stats {
  totalProductos: number
  bajoStock: number
  ventasHoy: number
  comprasHoy: number
}

export default function DashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats>({
    totalProductos: 0,
    bajoStock: 0,
    ventasHoy: 0,
    comprasHoy: 0,
  })
  const [loading, setLoading] = useState(true)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (!token) {
      router.push("/login")
      return
    }

    // Cargar estadísticas
    const loadStats = async () => {
      try {
        const [productosRes, bajoStockRes] = await Promise.all([
          fetch(apiUrl + "/productos"),
          fetch(apiUrl + "/productos/bajo-stock"),
        ])

        const productos = await productosRes.json()
        const bajoStock = await bajoStockRes.json()

        setStats({
          totalProductos: productos.length || 0,
          bajoStock: bajoStock.length || 0,
          ventasHoy: 0,
          comprasHoy: 0,
        })
      } catch (error) {
        console.error("Error loading stats:", error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Cargando estadísticas...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Resumen de tu inventario de hardware y periféricos</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProductos}</div>
            <p className="text-xs text-muted-foreground">Productos en catálogo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bajo Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.bajoStock}</div>
            <p className="text-xs text-muted-foreground">Requieren reorden</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas Hoy</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.ventasHoy}</div>
            <p className="text-xs text-muted-foreground">Transacciones completadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compras Hoy</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.comprasHoy}</div>
            <p className="text-xs text-muted-foreground">Órdenes de compra</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Gestión de Productos</CardTitle>
            <CardDescription>Administra tu catálogo de hardware y periféricos</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/productos">
              <Button className="w-full">Ir a Productos</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inventario Bajo Stock</CardTitle>
            <CardDescription>Productos que necesitan reorden</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/inventario">
              <Button variant="outline" className="w-full bg-transparent">
                Ver Inventario
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Registrar Venta</CardTitle>
            <CardDescription>Crear nueva transacción de venta</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/ventas">
              <Button variant="outline" className="w-full bg-transparent">
                Nueva Venta
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Registrar Compra</CardTitle>
            <CardDescription>Crear nueva orden de compra</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/compras">
              <Button variant="outline" className="w-full bg-transparent">
                Nueva Compra
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
