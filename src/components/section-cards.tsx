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
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5 px-4 lg:px-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-6 shadow-lg animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-20"></div>
              <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl"></div>
            </div>
            <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg mb-2"></div>
            <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-32"></div>
          </div>
        ))}
      </div>
    )
  }

  if (!estadistiques) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5 px-4 lg:px-6">
        <div className="col-span-full text-center text-gray-600 bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 shadow-lg">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
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
    ? "grid gap-6 md:grid-cols-2 lg:grid-cols-5 px-4 lg:px-6"
    : "grid gap-6 md:grid-cols-2 lg:grid-cols-4 px-4 lg:px-6"

  return (
    <div className={gridClass}>
      {/* Propietaris - Només visible per admins */}
      {canViewPropietaris && (
        <div className="group bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-6 shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105">
          <div className="flex flex-row items-center justify-between space-y-0 pb-4">
            <h3 className="tracking-tight text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors duration-300">Propietaris</h3>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center transform transition-all duration-300 group-hover:rotate-6 group-hover:scale-110 shadow-md">
              <Building className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{estadistiques.totals.propietaris}</div>
          <p className="text-sm text-gray-600">Total registrats</p>
        </div>
      )}

      {/* Clients */}
      <div className="group bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-6 shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105">
        <div className="flex flex-row items-center justify-between space-y-0 pb-4">
          <h3 className="tracking-tight text-sm font-semibold text-gray-700 group-hover:text-green-600 transition-colors duration-300">Clients</h3>
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center transform transition-all duration-300 group-hover:rotate-6 group-hover:scale-110 shadow-md">
            <Users className="h-6 w-6 text-white" />
          </div>
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-1">{estadistiques.totals.clients}</div>
        <p className="text-sm text-gray-600">Total registrats</p>
      </div>

      {/* Allotjaments */}
      <div className="group bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-6 shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105">
        <div className="flex flex-row items-center justify-between space-y-0 pb-4">
          <h3 className="tracking-tight text-sm font-semibold text-gray-700 group-hover:text-orange-600 transition-colors duration-300">Allotjaments</h3>
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center transform transition-all duration-300 group-hover:rotate-6 group-hover:scale-110 shadow-md">
            <Home className="h-6 w-6 text-white" />
          </div>
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-1">{estadistiques.totals.allotjaments}</div>
        <p className="text-sm text-gray-600">
          {estadistiques.recents.allotjaments_actius_ultims_90_dies} actius (90 dies)
        </p>
      </div>

      {/* Reserves */}
      <div className="group bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-6 shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105">
        <div className="flex flex-row items-center justify-between space-y-0 pb-4">
          <h3 className="tracking-tight text-sm font-semibold text-gray-700 group-hover:text-purple-600 transition-colors duration-300">Reserves</h3>
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center transform transition-all duration-300 group-hover:rotate-6 group-hover:scale-110 shadow-md">
            <Calendar className="h-6 w-6 text-white" />
          </div>
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-1">{estadistiques.totals.reserves}</div>
        <p className="text-sm text-gray-600">
          +{estadistiques.recents.reserves_ultims_30_dies} últims 30 dies
        </p>
      </div>

      {/* Viatgers */}
      <div className="group bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-6 shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105">
        <div className="flex flex-row items-center justify-between space-y-0 pb-4">
          <h3 className="tracking-tight text-sm font-semibold text-gray-700 group-hover:text-indigo-600 transition-colors duration-300">Viatgers</h3>
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center transform transition-all duration-300 group-hover:rotate-6 group-hover:scale-110 shadow-md">
            <UserCheck className="h-6 w-6 text-white" />
          </div>
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-1">{estadistiques.totals.viatgers}</div>
        <p className="text-sm text-gray-600">
          +{estadistiques.recents.viatgers_completats_ultims_30_dies} completats (30 dies)
        </p>
      </div>
    </div>
  )
}
