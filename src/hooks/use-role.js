// Hook per gestionar rols d'usuaris
import { useAuth } from '@/contexts/auth-context.jsx'

export function useRole() {
  const { user } = useAuth()

  const hasRole = (role) => {
    return user?.role === role
  }

  const hasAnyRole = (roles) => {
    return roles.includes(user?.role)
  }

  const isSuperadmin = () => {
    return hasRole('superadmin')
  }

  const isPropietari = () => {
    return hasRole('propietari')
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
    user,
    hasRole,
    hasAnyRole,
    isSuperadmin,
    isPropietari,
    isClient,
    canManagePropietaris,
    canAccessAdmin,
    canViewSection,
    role: user?.role || null
  }
}
