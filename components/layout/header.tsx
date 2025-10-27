"use client"

import { useEffect, useState } from "react"

export function Header() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    try {
      const userData = localStorage.getItem("usuario")
      if (userData) {
        const parsed = JSON.parse(userData)
        setUser(parsed)
      }
    } catch (error) {
      console.error("Error al cargar usuario desde localStorage:", error)
      setUser(null)
    }
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
