export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ")
}

export function generateId(): number {
  return Math.floor(Math.random() * 1000000)
}

export function getCurrentDate(): Date {
  return new Date()
}
