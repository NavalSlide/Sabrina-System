import type { AuthUser } from '../services/userService'

/** Reads the signed-in user cached at login time. The backend is still the
 * source of truth for permissions (every write endpoint checks the role
 * server-side) - this is only used to decide what to show in the UI. */
export function useAuthUser(): AuthUser | null {
  const raw = localStorage.getItem('user')
  if (!raw) return null
  try {
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}
