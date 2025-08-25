// Hook per gestionar rols d'usuaris amb integració Hub
import { useAuth } from '@/contexts/auth-context.jsx'

export function useRole() {
  const { user } = useAuth()

  // Funció auxiliar per obtenir els rols de l'usuari per a l'aplicació Rural
  const getRuralRoles = () => {
    if (!user?.application_roles) {
      console.log('Rural useRole - No application_roles found for user:', user);
      return []
    }
    
    const ruralRoles = user.application_roles
      .filter(userRole => userRole.application.slug === 'rural')
      .map(userRole => userRole.role.slug)
    
    console.log('Rural useRole - Rural roles:', ruralRoles);
    return ruralRoles
  }

  // Funció auxiliar per obtenir el rol principal de l'usuari a Rural
  const getPrimaryRuralRole = () => {
    const ruralRoles = getRuralRoles()
    
    // Ordre de prioritat: super_admin > admin > manager > user
    if (ruralRoles.includes('super_admin')) return 'super_admin'
    if (ruralRoles.includes('admin')) return 'admin'
    if (ruralRoles.includes('manager')) return 'manager'
    if (ruralRoles.includes('user')) return 'user'
    
    return null
  }

  const hasRole = (role) => {
    const ruralRoles = getRuralRoles()
    
    // Mapejament de rols antics a nous
    const roleMapping = {
      'superadmin': 'super_admin',
      'propietari': 'admin',
      'client': 'user'
    }
    
    const mappedRole = roleMapping[role] || role
    return ruralRoles.includes(mappedRole)
  }

  const hasAnyRole = (roles) => {
    return roles.some(role => hasRole(role))
  }

  const isSuperadmin = () => {
    return hasRole('superadmin') || hasRole('super_admin')
  }

  const isPropietari = () => {
    return hasRole('propietari') || hasRole('admin')
  }

  const isClient = () => {
    return hasRole('client') || hasRole('user')
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
    user,
    hasRole,
    hasAnyRole,
    isSuperadmin,
    isPropietari,
    isClient,
    canManagePropietaris,
    canAccessAdmin,
    canViewSection,
    role: getPrimaryRuralRole(),
    ruralRoles: getRuralRoles() // Exposar tots els rols de Rural per debug
  }
}
