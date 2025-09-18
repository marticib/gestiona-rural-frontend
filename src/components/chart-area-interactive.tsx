"use client"

import { useState, useEffect } from 'react'
import { TrendingUp } from "lucide-react"
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/contexts/auth-context'
import DashboardService from '@/services/dashboard'

// Registrar components de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface EvolutionData {
  periode: string
  nom_periode: string
  total: number
}

interface ChartDataPoint {
  periode: string
  nom_periode: string
  propietaris?: number
  clients?: number
  allotjaments?: number
  reserves?: number
  viatgers?: number
  [key: string]: string | number | undefined
}

const chartConfig = {
  propietaris: {
    label: "Propietaris",
    color: "#8884d8",
  },
  clients: {
    label: "Clients", 
    color: "#82ca9d",
  },
  allotjaments: {
    label: "Allotjaments",
    color: "#ffc658",
  },
  reserves: {
    label: "Reserves",
    color: "#ff7300",
  },
  viatgers: {
    label: "Viatgers",
    color: "#8dd1e1",
  },
}

export function ChartAreaInteractive() {
  const [entitats, setEntitats] = useState<string[]>(['reserves'])
  const [periode, setPeriode] = useState('6months')
  const [data, setData] = useState<ChartDataPoint[]>([])
  const [loading, setLoading] = useState(true)
  const { hasRole, hasPermission } = useAuth()

  // Filtrar entitats segons el rol de l'usuari
  const isClient = hasRole('client_rural') || hasRole('Client')
  const canViewPropietaris = !isClient && (hasPermission('manage_all_properties') || hasRole('admin_rural') || hasRole('Admin'))
  
  const enititatsOptions = [
    ...(canViewPropietaris ? [{ value: 'propietaris', label: 'Propietaris' }] : []),
    { value: 'clients', label: 'Clients' },
    { value: 'allotjaments', label: 'Allotjaments' },
    { value: 'reserves', label: 'Reserves' },
    { value: 'viatgers', label: 'Viatgers' },
    { value: 'totes', label: canViewPropietaris ? 'Totes les entitats' : 'Totes les entitats' }
  ]

  const periodesOptions = [
    { value: '7days', label: 'Últims 7 dies' },
    { value: '3months', label: 'Últims 3 mesos' },
    { value: '6months', label: 'Últims 6 mesos' },
    { value: '1year', label: 'Últim any' }
  ]

  useEffect(() => {
    const carregarDades = async () => {
      try {
        setLoading(true)
        
        // Si s'ha seleccionat "totes", carregar totes les entitats segons permisos
        const entitatsList = entitats.includes('totes') 
          ? canViewPropietaris 
            ? ['propietaris', 'clients', 'allotjaments', 'reserves', 'viatgers']
            : ['clients', 'allotjaments', 'reserves', 'viatgers']
          : entitats

        console.log(`Carregant evolució per ${entitatsList.join(', ')} - ${periode}`)
        
        // Carregar dades per cada entitat
        const promises = entitatsList.map(async (entitat) => {
          const response = await DashboardService.getEvolucio(entitat, periode)
          return {
            entitat,
            data: response.success ? response.data.evolucio : []
          }
        })

        const results = await Promise.all(promises)
        console.log('Resultats del servidor:', results)

        // Combinar les dades en un format adequat per LineChart
        const combinedData: ChartDataPoint[] = []
        
        if (results.length > 0 && results[0].data.length > 0) {
          // Usar els períodes del primer conjunt de dades com a base
          results[0].data.forEach((periode) => {
            const dataPoint: ChartDataPoint = {
              periode: periode.periode,
              nom_periode: periode.nom_periode
            }
            
            // Afegir les dades de cada entitat per aquest període
            results.forEach(({ entitat, data }) => {
              const periodeData = data.find(d => d.periode === periode.periode)
              dataPoint[entitat as keyof ChartDataPoint] = periodeData?.total || 0
            })
            
            combinedData.push(dataPoint)
          })
        }

        console.log('Dades combinades per al chart:', combinedData)
        console.log('Entitats visibles:', entitatsList)
        setData(combinedData)
      } catch (error) {
        console.error('Error carregant evolució:', error)
        setData([])
      } finally {
        setLoading(false)
      }
    }

    carregarDades()
  }, [entitats, periode])

  const handleEntitatChange = (value: string) => {
    if (value === 'totes') {
      setEntitats(['totes'])
    } else {
      setEntitats([value])
    }
  }

  const getSelectedEntitatsLabel = () => {
    if (entitats.includes('totes')) {
      return 'Totes les entitats'
    }
    return enititatsOptions.find(e => e.value === entitats[0])?.label || 'Entitat'
  }

  const getPeriodeDescription = () => {
    return periodesOptions.find(p => p.value === periode)?.label || 'Període'
  }

  // Calcular tendència de l'entitat principal o la primera si són totes
  const getTendencia = () => {
    if (data.length < 2) return { percentatge: 0, direccio: 'stable' }
    
    const entitat = entitats.includes('totes') ? 'reserves' : entitats[0]
    const primer = data[0]?.[entitat as keyof ChartDataPoint] as number || 0
    const ultim = data[data.length - 1]?.[entitat as keyof ChartDataPoint] as number || 0
    
    if (primer === 0) return { percentatge: 0, direccio: 'stable' }
    
    const percentatge = ((ultim - primer) / primer) * 100
    const direccio = percentatge > 0 ? 'up' : percentatge < 0 ? 'down' : 'stable'
    
    return { percentatge: Math.abs(percentatge), direccio }
  }

  const tendencia = getTendencia()

  // Obtenir les entitats visibles per renderitzar les línies
  const getVisibleEntitats = () => {
    if (entitats.includes('totes')) {
      return canViewPropietaris 
        ? ['propietaris', 'clients', 'allotjaments', 'reserves', 'viatgers']
        : ['clients', 'allotjaments', 'reserves', 'viatgers']
    }
    return entitats
  }

  return (
    <div className="group">
      <div className="border-0 bg-transparent shadow-none">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Evolució de {getSelectedEntitatsLabel()}</h3>
              <p className="text-gray-600">{getPeriodeDescription()}</p>
            </div>
            <div className="flex gap-3">
              <Select value={entitats.includes('totes') ? 'totes' : entitats[0]} onValueChange={handleEntitatChange}>
                <SelectTrigger className="w-[180px] bg-white/80 border-gray-200 rounded-xl h-11 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300">
                  <SelectValue placeholder="Selecciona entitat" />
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-xl border-gray-200 rounded-xl shadow-xl">
                  {enititatsOptions.map((e) => (
                    <SelectItem key={e.value} value={e.value} className="rounded-lg hover:bg-blue-50 transition-colors duration-200">
                      {e.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={periode} onValueChange={setPeriode}>
                <SelectTrigger className="w-[150px] bg-white/80 border-gray-200 rounded-xl h-11 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300">
                  <SelectValue placeholder="Selecciona període" />
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-xl border-gray-200 rounded-xl shadow-xl">
                  {periodesOptions.map((p) => (
                    <SelectItem key={p.value} value={p.value} className="rounded-lg hover:bg-blue-50 transition-colors duration-200">
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="pb-6">
        <div className="pb-6">
          <div className="h-[350px] w-full">
            {loading ? (
              <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
                <div className="flex flex-col items-center space-y-4">
                  <div className="animate-spin rounded-full h-10 w-10 border-3 border-blue-500 border-t-transparent"></div>
                  <p className="text-gray-600 font-medium">Carregant dades...</p>
                </div>
              </div>
            ) : data.length === 0 ? (
              <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <p className="text-gray-600 font-medium">No hi ha dades disponibles</p>
                </div>
              </div>
            ) : (
              <div className="bg-white/50 rounded-2xl p-4 border border-gray-200">
                <div className="h-[300px] w-full">
                <Line
                  data={{
                    labels: data.map(point => point.nom_periode),
                    datasets: getVisibleEntitats().map((entitat) => ({
                      label: chartConfig[entitat as keyof typeof chartConfig]?.label || entitat,
                      data: data.map(point => point[entitat as keyof ChartDataPoint] as number || 0),
                      borderColor: chartConfig[entitat as keyof typeof chartConfig]?.color || "#8884d8",
                      backgroundColor: chartConfig[entitat as keyof typeof chartConfig]?.color || "#8884d8",
                      tension: 0.3,
                      pointRadius: 4,
                      pointHoverRadius: 6,
                    }))
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top' as const,
                        labels: {
                          usePointStyle: true,
                          padding: 20,
                        }
                      },
                      tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#1f2937',
                        bodyColor: '#1f2937',
                        borderColor: '#e5e7eb',
                        borderWidth: 1,
                      },
                    },
                    interaction: {
                      mode: 'nearest',
                      axis: 'x',
                      intersect: false,
                    },
                    scales: {
                      x: {
                        display: true,
                        title: {
                          display: true,
                          text: 'Període'
                        },
                        grid: {
                          display: false,
                        }
                      },
                      y: {
                        display: true,
                        title: {
                          display: true,
                          text: 'Quantitat'
                        },
                        beginAtZero: true,
                        grid: {
                          display: false,
                        }
                      },
                    },
                  }}
                />
              </div>
            </div>
          )}
        </div>
        <div className="border-t border-gray-200 pt-6">
          <div className="flex w-full items-start gap-2 text-sm">
            <div className="grid gap-2">
              <div className="flex items-center gap-2 leading-none font-semibold text-gray-900">
                {tendencia.direccio === 'up' && (
                  <>
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-2">
                      <TrendingUp className="h-4 w-4 text-white" />
                    </div>
                    Increment del {tendencia.percentatge.toFixed(1)}% en aquest període
                  </>
                )}
                {tendencia.direccio === 'down' && (
                  <>
                    <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center mr-2">
                      <TrendingUp className="h-4 w-4 text-white rotate-180" />
                    </div>
                    Descens del {tendencia.percentatge.toFixed(1)}% en aquest període
                  </>
                )}
                {tendencia.direccio === 'stable' && (
                  <>
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg flex items-center justify-center mr-2">
                      <TrendingUp className="h-4 w-4 text-white opacity-50" />
                    </div>
                    Sense canvis significatius
                  </>
                )}
              </div>
              <div className="text-gray-600 flex items-center gap-2 leading-none">
                Mostrant evolució de {getSelectedEntitatsLabel().toLowerCase()} per a {getPeriodeDescription().toLowerCase()}
              </div>
            </div>
          </div>
        </div>
        </div>
        </div>
      </div>
    </div>
  )
}
