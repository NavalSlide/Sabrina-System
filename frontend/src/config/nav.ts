import type { IconName } from '@components/Icon'
import type { AuthUser } from '../services/userService'

export type RoleName = 'Administrador' | 'Docente' | 'Estudiante' | 'Representante'

export interface NavItem {
  key: string
  label: string
  href: string
  icon: IconName
  /** 'all' = every signed-in user. Otherwise the exact roles that can see it - admins (is_admin) always can, regardless of this list. */
  roles: 'all' | RoleName[]
}

export const navItems: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard', href: '/', icon: 'home', roles: 'all' },
  { key: 'panel', label: 'Panel de Administración', href: '/panel', icon: 'sliders', roles: [] },
  { key: 'academico', label: 'Académico', href: '/academico', icon: 'book-open', roles: [] },
  { key: 'docentes', label: 'Docentes', href: '/docentes', icon: 'users', roles: [] },
  { key: 'estudiantes', label: 'Estudiantes', href: '/estudiantes', icon: 'graduation-cap', roles: 'all' },
  { key: 'horarios', label: 'Horarios', href: '/horarios', icon: 'calendar', roles: 'all' },
  { key: 'evaluaciones', label: 'Evaluaciones', href: '/evaluaciones', icon: 'chart-bar', roles: 'all' },
  { key: 'laboratorios', label: 'Laboratorios', href: '/laboratorios', icon: 'flask', roles: ['Docente'] },
  { key: 'reservas', label: 'Reservas', href: '/reservas', icon: 'bookmark', roles: ['Docente'] },
  { key: 'notificaciones', label: 'Notificaciones', href: '/notificaciones', icon: 'bell', roles: 'all' },
  { key: 'usuarios', label: 'Usuarios', href: '/usuarios', icon: 'user-circle', roles: [] },
  { key: 'auditoria', label: 'Auditoría', href: '/auditoria', icon: 'shield-check', roles: [] },
]

/** Admin-only items (empty roles[] above) are implicit - `isAllowed` grants
 * them to `is_admin` regardless of what's listed. */
export function isAllowed(item: NavItem, user: AuthUser | null): boolean {
  if (item.roles === 'all') return Boolean(user)
  if (!user) return false
  if (user.is_admin) return true
  return user.rol != null && item.roles.includes(user.rol as RoleName)
}

export function visibleNavItems(user: AuthUser | null): NavItem[] {
  return navItems.filter((item) => isAllowed(item, user))
}
