import { AxiosError } from 'axios'

/** Pulls a human-readable message out of an ApiResponse-shaped axios error. */
export function extractErrorMessage(error: unknown, fallback = 'Ocurrio un error inesperado.'): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as { error?: string; errors?: Record<string, unknown> } | undefined
    if (data?.error) return data.error
    if (data?.errors) {
      const firstKey = Object.keys(data.errors)[0]
      const firstValue = data.errors[firstKey]
      if (Array.isArray(firstValue)) return String(firstValue[0])
      if (typeof firstValue === 'string') return firstValue
    }
    if (error.message) return error.message
  }
  if (error instanceof Error) return error.message
  return fallback
}
