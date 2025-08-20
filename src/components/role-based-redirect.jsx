import { Navigate } from "react-router-dom"
import { useRole } from "@/hooks/use-role"

export function RoleBasedRedirect() {
  const { isClient, canAccessAdmin } = useRole()

  if (isClient()) {
    return <Navigate to="/app/welcome" replace />
  }
  
  if (canAccessAdmin()) {
    return <Navigate to="/app/dashboard" replace />
  }

  // Fallback al dashboard
  return <Navigate to="/app/dashboard" replace />
}
