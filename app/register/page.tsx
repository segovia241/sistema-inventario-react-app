import { RegisterForm } from "@/components/auth/register-form"

export const metadata = {
  title: "Registrarse",
  description: "Crea una nueva cuenta",
}

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-muted p-4">
      <RegisterForm />
    </main>
  )
}
