export function validatePhone(phone: string): boolean {
  return /^1[3-9]\d{9}$/.test(phone)
}
