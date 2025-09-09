import { useState, useEffect } from 'react'
import { Users, Home, Calendar, UserCheck, Building } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import DashboardService from '@/services/dashboard'

interface Estadistiques {
  totals: {
    propietaris: number
    clients: number
    allotjaments: number
    reserves: number
    viatgers: number
  }
  recents: {
    reserves_ultims_30_dies: number
    viatgers_completats_ultims_30_dies: number
    allotjaments_actius_ultims_90_dies: number
  }
}

export function SectionCards() {
  const [estadistiques, setEstadistiques] = useState<Estadistiques | null>(null)
  const [loading, setLoading] = useState(true)
  const { hasRole, hasPermission, getRuralRole } = useAuth()

  useEffect(() => {
    const carregarEstadistiques = async () => {
      try {
        const response = await DashboardService.getEstadistiques()
        if (response.success) {
          setEstadistiques(response.data)
        }
      } catch (error) {
        console.error('Error carregant estadístiques:', error)
      } finally {
        setLoading(false)
      }
    }

    carregarEstadistiques()
  }, [])

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 px-4 lg:px-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!estadistiques) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 px-4 lg:px-6">
        <div className="col-span-full text-center text-muted-foreground">
          Error carregant estadístiques
        </div>
      </div>
    )
  }

  // Determinar quines cards mostrar segons el rol
  const isClient = hasRole('client_rural') || hasRole('Client')
  const canViewPropietaris = !isClient && (hasPermission('manage_all_properties') || hasRole('admin_rural') || hasRole('Admin'))
  
  // Calcular el nombre de columnes segons les cards visibles
  const visibleCardsCount = [
    canViewPropietaris, // Propietaris
    true, // Clients (sempre visible)
    true, // Allotjaments (sempre visible)
    true, // Reserves (sempre visible)
    true  // Viatgers (sempre visible)
  ].filter(Boolean).length
  
  const gridClass = visibleCardsCount === 5 
    ? "grid gap-4 md:grid-cols-2 lg:grid-cols-5 px-4 lg:px-6"
    : "grid gap-4 md:grid-cols-2 lg:grid-cols-4 px-4 lg:px-6"

  return (
    <div className={gridClass}>
      {/* Propietaris - Només visible per admins */}
      {canViewPropietaris && (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Propietaris</h3>
            <Building className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{estadistiques.totals.propietaris}</div>
          <p className="text-xs text-muted-foreground">Total registrats</p>
        </div>
      )}

      {/* Clients */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="tracking-tight text-sm font-medium">Clients</h3>
          <Users className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="text-2xl font-bold">{estadistiques.totals.clients}</div>
        <p className="text-xs text-muted-foreground">Total registrats</p>
      </div>

      {/* Allotjaments */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="tracking-tight text-sm font-medium">Allotjaments</h3>
          <Home className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="text-2xl font-bold">{estadistiques.totals.allotjaments}</div>
        <p className="text-xs text-muted-foreground">
          {estadistiques.recents.allotjaments_actius_ultims_90_dies} actius (90 dies)
        </p>
      </div>

      {/* Reserves */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="tracking-tight text-sm font-medium">Reserves</h3>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="text-2xl font-bold">{estadistiques.totals.reserves}</div>
        <p className="text-xs text-muted-foreground">
          +{estadistiques.recents.reserves_ultims_30_dies} últims 30 dies
        </p>
      </div>

      {/* Viatgers */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="tracking-tight text-sm font-medium">Viatgers</h3>
          <UserCheck className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="text-2xl font-bold">{estadistiques.totals.viatgers}</div>
        <p className="text-xs text-muted-foreground">
          +{estadistiques.recents.viatgers_completats_ultims_30_dies} completats (30 dies)
        </p>
      </div>
    </div>
  )
}
