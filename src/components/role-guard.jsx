import { useRole } from '@/hooks/use-role'

export function RoleGuard({ children, allowedRoles, section, fallback = null }) {
  const { hasAnyRole, canViewSection } = useRole()

  // Si es proporciona una secció, usar canViewSection
  if (section) {
    if (!canViewSection(section)) {
      return fallback
    }
    return children
  }

  // Si es proporcionen rols específics, verificar-los
  if (allowedRoles) {
    if (!hasAnyRole(allowedRoles)) {
      return fallback
    }
    return children
  }

  // Per defecte, permetre l'accés
  return children
}

// Component per mostrar contingut només per a superadmin
export function SuperadminOnly({ children, fallback = null }) {
  return (
    <RoleGuard allowedRoles={['superadmin', 'super_admin']} fallback={fallback}>
      {children}
    </RoleGuard>
  )
}

// Component per mostrar contingut només per a admin (superadmin + propietari)
export function AdminOnly({ children, fallback = null }) {
  return (
    <RoleGuard allowedRoles={['superadmin', 'super_admin', 'propietari', 'admin']} fallback={fallback}>
      {children}
    </RoleGuard>
  )
}

// Component per mostrar contingut només per a clients
export function ClientOnly({ children, fallback = null }) {
  return (
    <RoleGuard allowedRoles={['client', 'user']} fallback={fallback}>
      {children}
    </RoleGuard>
  )
}
