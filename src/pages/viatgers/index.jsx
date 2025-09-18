import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  IconPlus,
  IconSearch,
  IconEye,
  IconPencil,
  IconTrash,
  IconFilter,
  IconDownload,
  IconUser,
  IconMail,
  IconPhone,
  IconMapPin,
  IconCalendar,
  IconFileText,
  IconUsers,
  IconShield,
  IconClipboardList,
} from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { ViatgersService } from '@/services/viatgers'
import { ReservesService } from '@/services/reserves'

export default function ViatgersPage() {
  const [viatgers, setViatgers] = useState([])
  const [reserves, setReserves] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterReserva, setFilterReserva] = useState('')
  const [estadistiques, setEstadistiques] = useState({
    total: 0,
    pendents: 0,
    complerts: 0,
    formularis_generats: 0
  })
  const { toast } = useToast()

  const loadViatgers = async () => {
    try {
      setLoading(true)
      
      const params = {}
      if (searchTerm) {
        params.cerca = searchTerm
      }
      if (filterReserva) {
        params.reserva_id = filterReserva
      }

      const [viatgersData, estadistiquesData, reservesData] = await Promise.all([
        ViatgersService.getAll(params),
        ViatgersService.getEstadistiques(),
        ReservesService.getAll()
      ])

      setViatgers(viatgersData.data || [])
      setEstadistiques(estadistiquesData || {})
      setReserves(reservesData.data || [])
    } catch (error) {
      console.error('Error carregant viatgers:', error)
      toast({
        title: 'Error',
        description: 'No s\'han pogut carregar els viatgers',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadViatgers()
  }, [searchTerm, filterReserva])

  const handleDelete = async (id) => {
    if (window.confirm('Estàs segur que vols eliminar aquest viatger?')) {
      try {
        await ViatgersService.delete(id)
        toast({
          title: 'Èxit',
          description: 'Viatger eliminat correctament',
        })
        loadViatgers()
      } catch (error) {
        console.error('Error eliminant viatger:', error)
        toast({
          title: 'Error',
          description: 'No s\'ha pogut eliminar el viatger',
          variant: 'destructive',
        })
      }
    }
  }

  const handleGenerarMossos = async (reservaId) => {
    try {
      await ViatgersService.generarTxtMossos(reservaId)
      toast({
        title: 'Èxit',
        description: 'Fitxer de Mossos generat correctament',
      })
      loadViatgers()
    } catch (error) {
      console.error('Error generant fitxer Mossos:', error)
      toast({
        title: 'Error',
        description: 'No s\'ha pogut generar el fitxer de Mossos',
        variant: 'destructive',
      })
    }
  }

  const getReservaNom = (reservaId) => {
    const reserva = reserves.find(r => r.id === reservaId)
    return reserva ? `${reserva.codi_reserva} - ${reserva.nom_client}` : 'Reserva no trobada'
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('ca-ES')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
      {/* Header amb efecte glassmorphism */}
      <div className="backdrop-blur-xl bg-white/60 border-b border-white/20 sticky top-0 z-10">
        <div className="container mx-auto p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                Gestió de Viatgers
              </h1>
              <p className="text-gray-600 mt-1">
                Administra els viatgers i genera els fitxers per a Mossos d'Esquadra
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                asChild
                className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <Link to="/viatgers/nou">
                  <IconPlus className="mr-2 h-4 w-4" />
                  Nou Viatger
                </Link>
              </Button>
              
              <Button 
                variant="outline"
                className="border-teal-200 text-teal-700 hover:bg-teal-50 hover:border-teal-300 backdrop-blur-sm"
                onClick={() => loadViatgers()}
              >
                <IconDownload className="mr-2 h-4 w-4" />
                Actualitzar
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6 space-y-6">
        {/* Targetes d'estadístiques amb glassmorphism */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="backdrop-blur-xl bg-white/40 rounded-3xl p-6 border border-white/20 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl shadow-lg">
                <IconUsers className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Viatgers</p>
                <p className="text-2xl font-bold text-gray-900">{estadistiques.total || 0}</p>
              </div>
            </div>
          </div>

          <div className="backdrop-blur-xl bg-white/40 rounded-3xl p-6 border border-white/20 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 delay-75">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl shadow-lg">
                <IconClipboardList className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pendents</p>
                <p className="text-2xl font-bold text-gray-900">{estadistiques.pendents || 0}</p>
              </div>
            </div>
          </div>

          <div className="backdrop-blur-xl bg-white/40 rounded-3xl p-6 border border-white/20 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 delay-150">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl shadow-lg">
                <IconShield className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Complerts</p>
                <p className="text-2xl font-bold text-gray-900">{estadistiques.complerts || 0}</p>
              </div>
            </div>
          </div>

          <div className="backdrop-blur-xl bg-white/40 rounded-3xl p-6 border border-white/20 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 delay-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl shadow-lg">
                <IconFileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Formularis</p>
                <p className="text-2xl font-bold text-gray-900">{estadistiques.formularis_generats || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtres amb glassmorphism */}
        <div className="backdrop-blur-xl bg-white/40 rounded-3xl p-6 border border-white/20 shadow-lg">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Cerca per nom, DNI o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/60 border-white/20 backdrop-blur-sm focus:bg-white/80 transition-all duration-300"
                />
              </div>
            </div>
            
            <div className="lg:w-64">
              <Select value={filterReserva} onValueChange={setFilterReserva}>
                <SelectTrigger className="bg-white/60 border-white/20 backdrop-blur-sm focus:bg-white/80 transition-all duration-300">
                  <SelectValue placeholder="Filtrar per reserva" />
                </SelectTrigger>
                <SelectContent className="backdrop-blur-xl bg-white/90">
                  <SelectItem value="">Totes les reserves</SelectItem>
                  {reserves.map((reserva) => (
                    <SelectItem key={reserva.id} value={reserva.id.toString()}>
                      {reserva.codi_reserva} - {reserva.nom_client}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {(searchTerm || filterReserva) && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('')
                  setFilterReserva('')
                }}
                className="border-teal-200 text-teal-700 hover:bg-teal-50 backdrop-blur-sm"
              >
                <IconFilter className="mr-2 h-4 w-4" />
                Netejar
              </Button>
            )}
          </div>
        </div>

        {/* Taula amb glassmorphism */}
        <div className="backdrop-blur-xl bg-white/40 rounded-3xl border border-white/20 shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregant viatgers...</p>
            </div>
          ) : viatgers.length === 0 ? (
            <div className="p-12 text-center">
              <IconUsers className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No hi ha viatgers</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || filterReserva 
                  ? 'No s\'han trobat viatgers amb els filtres aplicats'
                  : 'Comença afegint el primer viatger'
                }
              </p>
              {!searchTerm && !filterReserva && (
                <Button asChild className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white">
                  <Link to="/viatgers/nou">
                    <IconPlus className="mr-2 h-4 w-4" />
                    Afegir Viatger
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/20 bg-white/20">
                    <TableHead className="text-gray-700 font-semibold">Viatger</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Contacte</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Reserva</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Dates</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Estat</TableHead>
                    <TableHead className="text-right text-gray-700 font-semibold">Accions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {viatgers.map((viatger, index) => (
                    <TableRow 
                      key={viatger.id} 
                      className="border-white/20 hover:bg-white/30 transition-all duration-300"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
                            {viatger.nom?.charAt(0) || '?'}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {viatger.nom} {viatger.cognoms}
                            </div>
                            <div className="text-sm text-gray-600">
                              {viatger.dni || 'DNI no disponible'}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="space-y-1">
                          {viatger.email && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <IconMail className="h-4 w-4" />
                              {viatger.email}
                            </div>
                          )}
                          {viatger.telefon && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <IconPhone className="h-4 w-4" />
                              {viatger.telefon}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            {getReservaNom(viatger.reserva_id)}
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="space-y-1 text-sm text-gray-600">
                          {viatger.data_arribada && (
                            <div className="flex items-center gap-2">
                              <IconCalendar className="h-4 w-4" />
                              {formatDate(viatger.data_arribada)}
                            </div>
                          )}
                          {viatger.data_sortida && (
                            <div className="flex items-center gap-2">
                              <IconCalendar className="h-4 w-4" />
                              {formatDate(viatger.data_sortida)}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <Badge 
                          variant={viatger.estat === 'complet' ? 'default' : 'secondary'}
                          className={
                            viatger.estat === 'complet' 
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                              : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                          }
                        >
                          {viatger.estat === 'complet' ? 'Complet' : 'Pendent'}
                        </Badge>
                      </TableCell>
                      
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-white/40">
                              <span className="sr-only">Obrir menú</span>
                              <IconPencil className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent 
                            align="end" 
                            className="backdrop-blur-xl bg-white/90 border-white/20"
                          >
                            <DropdownMenuLabel>Accions</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-white/30" />
                            
                            <DropdownMenuItem asChild>
                              <Link 
                                to={`/viatgers/${viatger.id}`}
                                className="flex items-center cursor-pointer"
                              >
                                <IconEye className="mr-2 h-4 w-4" />
                                Veure detalls
                              </Link>
                            </DropdownMenuItem>
                            
                            <DropdownMenuItem asChild>
                              <Link 
                                to={`/viatgers/${viatger.id}/editar`}
                                className="flex items-center cursor-pointer"
                              >
                                <IconPencil className="mr-2 h-4 w-4" />
                                Editar
                              </Link>
                            </DropdownMenuItem>
                            
                            <DropdownMenuSeparator className="bg-white/30" />
                            
                            <DropdownMenuItem
                              onClick={() => handleGenerarMossos(viatger.reserva_id)}
                              className="text-blue-600 focus:text-blue-600"
                            >
                              <IconShield className="mr-2 h-4 w-4" />
                              Generar fitxer Mossos
                            </DropdownMenuItem>
                            
                            <DropdownMenuSeparator className="bg-white/30" />
                            
                            <DropdownMenuItem
                              onClick={() => handleDelete(viatger.id)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <IconTrash className="mr-2 h-4 w-4" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}