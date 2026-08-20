import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { navItems, isAllowed } from '../config/nav'
import { useAuthUser } from '../hooks/useAuthUser'

interface RoleGuardProps {
  /** Key from config/nav.ts - reuses the same allow-list the sidebar uses,
   * so a role that can't see a link in the sidebar also can't reach it by
   * typing the URL directly. */
  navKey: string
  children: ReactNode
}

export default function RoleGuard({ navKey, children }: RoleGuardProps) {
  const user = useAuthUser()
  const item = navItems.find((i) => i.key === navKey)

  if (!item || !isAllowed(item, user)) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
