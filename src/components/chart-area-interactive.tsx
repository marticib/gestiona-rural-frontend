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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Evolució de {getSelectedEntitatsLabel()}</CardTitle>
            <CardDescription>{getPeriodeDescription()}</CardDescription>
          </div>
          <div className="flex gap-4">
            <Select value={entitats.includes('totes') ? 'totes' : entitats[0]} onValueChange={handleEntitatChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecciona entitat" />
              </SelectTrigger>
              <SelectContent>
                {enititatsOptions.map((e) => (
                  <SelectItem key={e.value} value={e.value}>
                    {e.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={periode} onValueChange={setPeriode}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Selecciona període" />
              </SelectTrigger>
              <SelectContent>
                {periodesOptions.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          {loading ? (
            <div className="h-full w-full flex items-center justify-center bg-muted/50 rounded">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : data.length === 0 ? (
            <div className="h-full w-full flex items-center justify-center bg-muted/50 rounded">
              <p className="text-muted-foreground">No hi ha dades disponibles</p>
            </div>
          ) : (
            <div>
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
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              {tendencia.direccio === 'up' && (
                <>
                  Increment del {tendencia.percentatge.toFixed(1)}% en aquest període <TrendingUp className="h-4 w-4" />
                </>
              )}
              {tendencia.direccio === 'down' && (
                <>
                  Descens del {tendencia.percentatge.toFixed(1)}% en aquest període <TrendingUp className="h-4 w-4 rotate-180" />
                </>
              )}
              {tendencia.direccio === 'stable' && (
                <>
                  Sense canvis significatius <TrendingUp className="h-4 w-4 opacity-50" />
                </>
              )}
            </div>
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              Mostrant evolució de {getSelectedEntitatsLabel().toLowerCase()} per a {getPeriodeDescription().toLowerCase()}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
