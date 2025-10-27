import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Sistema de Gestión de Inventario</h1>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="outline">Iniciar Sesión</Button>
            </Link>
            <Link href="/register">
              <Button>Registrarse</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Gestiona tu Inventario Fácilmente</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Controla tus ventas, compras, inventario y clientes en un solo lugar
          </p>
          <Link href="/register">
            <Button size="lg">Comenzar Ahora</Button>
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Productos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Administra tu catálogo de productos, categorías, marcas y precios de forma centralizada.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Control de Inventario</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Monitorea el stock en tiempo real, recibe alertas de bajo inventario y gestiona movimientos.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ventas y Compras</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Registra ventas a clientes y compras a proveedores con seguimiento completo.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gestión de Clientes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Mantén un registro detallado de tus clientes y su historial de compras.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gestión de Proveedores</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Administra tus proveedores, contactos y órdenes de compra de manera eficiente.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reportes y Análisis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Genera reportes detallados de ventas, compras e inventario para tomar mejores decisiones.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>© 2025 Sistema de Gestión de Inventario. Todos los derechos reservados.</p>
        </div>
      </footer>
    </main>
  )
}
