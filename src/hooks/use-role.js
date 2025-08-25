// Hook per gestionar rols d'usuaris amb integració Hub
import { useAuth } from '@/contexts/auth-context.jsx'
import { useMemo } from 'react'

export function useRole() {
  const { user } = useAuth()

  // Memoitzar les funcions auxiliars per evitar re-renders
  const ruralRoles = useMemo(() => {
    if (!user?.application_roles) {
      return []
    }
    
    return user.application_roles
      .filter(userRole => userRole.application.slug === 'rural')
      .map(userRole => userRole.role.slug)
  }, [user?.application_roles])

  // Memoitzar el rol principal per evitar re-calculs
  const primaryRole = useMemo(() => {
    // Ordre de prioritat: admin_rural > propietari > client
    if (ruralRoles.includes('admin_rural')) return 'admin_rural'
    if (ruralRoles.includes('propietari')) return 'propietari'
    if (ruralRoles.includes('client')) return 'client'
    
    return null
  }, [ruralRoles])

  // Memoitzar les funcions de comprovació de rols
  const roleCheckers = useMemo(() => {
    const hasRole = (role) => {
      // Mapejament de rols antics a nous
      const roleMapping = {
        'superadmin': 'admin_rural',
        'admin': 'admin_rural',
        'administrador': 'admin_rural',
        'propietari': 'propietari',
        'client': 'client',
        'user': 'client'
      }
      
      const mappedRole = roleMapping[role] || role
      return ruralRoles.includes(mappedRole)
    }

    const hasAnyRole = (roles) => {
      return roles.some(role => hasRole(role))
    }

    const isSuperadmin = () => {
      return hasRole('admin_rural')
    }

    const isPropietari = () => {
      return hasRole('propietari') || hasRole('admin_rural')
    }

    const isClient = () => {
      return hasRole('client')
    }

    const canManagePropietaris = () => {
      return isSuperadmin()
    }

    const canAccessAdmin = () => {
      return isSuperadmin() || isPropietari()
    }

    const canViewSection = (section) => {
      switch (section) {
        case 'propietaris':
          return canManagePropietaris()
        case 'allotjaments':
        case 'reserves':
        case 'clients':
          return canAccessAdmin()
        case 'dashboard':
          return canAccessAdmin()
        case 'welcome':
          return isClient()
        default:
          return false
      }
    }

    return {
      hasRole,
      hasAnyRole,
      isSuperadmin,
      isPropietari,
      isClient,
      canManagePropietaris,
      canAccessAdmin,
      canViewSection
    }
  }, [ruralRoles])

  return {
    user,
    ...roleCheckers,
    role: primaryRole,
    ruralRoles // Exposar tots els rols de Rural per debug
  }
}
