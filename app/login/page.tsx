import { LoginForm } from "@/components/auth/login-form"

export const metadata = {
  title: "Iniciar Sesión",
  description: "Inicia sesión en tu cuenta",
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-muted p-4">
      <LoginForm />
    </main>
  )
}
