import { Navigate } from "react-router-dom"
import { useRole } from "@/hooks/use-role"

export function RoleBasedRedirect() {
  const { isClient, canAccessAdmin } = useRole()

  if (isClient()) {
    return <Navigate to="/welcome" replace />
  }
  
  if (canAccessAdmin()) {
    return <Navigate to="/dashboard" replace />
  }

  // Fallback al dashboard
  return <Navigate to="/dashboard" replace />
}
