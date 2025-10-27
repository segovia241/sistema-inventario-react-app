"use client"

import { useEffect, useState } from "react"
import { Bell, User } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  return (
    <header className="bg-card border-b border-border px-6 py-4 flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold">Bienvenido</h2>
        <p className="text-muted-foreground">{user?.nombre || "Usuario"}</p>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Bell size={20} />
        </Button>
        <Button variant="ghost" size="icon">
          <User size={20} />
        </Button>
      </div>
    </header>
  )
}
