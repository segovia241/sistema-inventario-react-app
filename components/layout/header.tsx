"use client"

import { useEffect, useState } from "react"

export function Header() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const loadUser = () => {
      try {
        const userData = localStorage.getItem("usuario")

        // Si no hay nada, terminamos
        if (!userData) {
          setUser(null)
          return
        }

        // Validar que realmente es JSON
        try {
          const parsed = JSON.parse(userData)
          setUser(parsed)
        } catch (e) {
          console.warn("El valor en localStorage no era JSON, limpiando…")
          localStorage.removeItem("usuario")
          setUser(null)
        }
      } catch (error) {
        console.error("Error al cargar usuario desde localStorage:", error)
        setUser(null)
      }
    }

    loadUser()
  }, [])

  return (
    <header className="bg-card border-b border-border px-6 py-4 flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold">Bienvenido</h2>
        <p className="text-muted-foreground">{user?.nombre || "Usuario"}</p>
      </div>
    </header>
  )
}
