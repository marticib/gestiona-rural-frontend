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
  IconBuilding,
  IconMapPin,
  IconUsers,
  IconCurrencyEuro,
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
import { useRole } from '@/hooks/use-role'
import { AllotjamentsService } from '@/services/allotjaments'
import { PropietarisService } from '@/services/propietaris'
import { NouAllotjamentModal } from '@/components/allotjaments/nou-allotjament-modal'

export default function AllotjamentsPage() {
  const [allotjaments, setAllotjaments] = useState([])
  const [propietaris, setPropietaris] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterEstat, setFilterEstat] = useState('all')
  const [filterTipus, setFilterTipus] = useState('all')
  const [filterPropietari, setFilterPropietari] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const { success, error } = useToast()
  const { isSuperadmin } = useRole()
  
  // Memoitzar el resultat de isSuperadmin per evitar re-renders
  const isAdmin = isSuperadmin()

  const tipusAllotjament = [
    { value: 'apartament', label: 'Apartament' },
    { value: 'casa', label: 'Casa' },
    { value: 'habitacio', label: 'Habitació' },
    { value: 'estudi', label: 'Estudi' },
    { value: 'duple', label: 'Dúplex' },
    { value: 'altre', label: 'Altre' },
  ]

  const carregarAllotjaments = async (page = 1) => {
    try {
      setLoading(true)
      const params = {
        page,
        cerca: searchTerm,
        estat: filterEstat === 'all' ? '' : filterEstat,
        tipus: filterTipus === 'all' ? '' : filterTipus,
        per_page: 15,
      }
      
      // Només afegir filtre de propietari si és superadmin
      if (isAdmin && filterPropietari !== 'all') {
        params.propietari_id = filterPropietari
      }
      
      const response = await AllotjamentsService.getAll(params)
      
      if (response.success) {
        setAllotjaments(response.data)
        setCurrentPage(response.pagination.current_page)
        setTotalPages(response.pagination.last_page)
        setTotalItems(response.pagination.total)
      } else {
        error('Error en carregar els allotjaments')
      }
    } catch (err) {
      error('Error en carregar els allotjaments')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const carregarPropietaris = async () => {
    // Només carregar propietaris si és superadmin
    if (!isAdmin) {
      return
    }
    
    try {
      const response = await PropietarisService.getActius()
      if (response.success) {
        setPropietaris(response.data)
      }
    } catch (err) {
      console.error('Error carregant propietaris:', err)
    }
  }

  const eliminarAllotjament = async (id) => {
    if (!window.confirm('Estàs segur que vols eliminar aquest allotjament?')) {
      return
    }

    try {
      const response = await AllotjamentsService.delete(id)
      
      if (response.success) {
        success('Allotjament eliminat correctament')
        carregarAllotjaments(currentPage)
      } else {
        error('Error en eliminar l\'allotjament')
      }
    } catch (err) {
      error('Error en eliminar l\'allotjament')
      console.error(err)
    }
  }

  useEffect(() => {
    carregarPropietaris()
  }, [isAdmin])

  useEffect(() => {
    carregarAllotjaments()
  }, [searchTerm, filterEstat, filterTipus, isAdmin, filterPropietari])

  const getEstatBadge = (estat) => {
    switch (estat) {
      case 'actiu':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Actiu
          </Badge>
        )
      case 'inactiu':
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-800">
            Inactiu
          </Badge>
        )
      case 'manteniment':
        return (
          <Badge variant="destructive" className="bg-yellow-100 text-yellow-800">
            Manteniment
          </Badge>
        )
      default:
        return <Badge variant="outline">{estat}</Badge>
    }
  }

  const getTipusBadge = (tipus) => {
    const colors = {
      apartament: 'bg-blue-100 text-blue-800',
      casa: 'bg-green-100 text-green-800',
      habitacio: 'bg-purple-100 text-purple-800',
      estudi: 'bg-orange-100 text-orange-800',
      duple: 'bg-pink-100 text-pink-800',
      altre: 'bg-gray-100 text-gray-800',
    }

    return (
      <Badge variant="outline" className={colors[tipus] || colors.altre}>
        {tipusAllotjament.find(t => t.value === tipus)?.label || tipus}
      </Badge>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-br from-orange-200 to-yellow-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-gradient-to-tr from-green-200 to-blue-200 rounded-full blur-3xl opacity-15 animate-pulse delay-300"></div>
      </div>
      
      <div className="relative flex flex-col gap-8 py-8 px-6 md:px-8">
        {/* Header */}
        <div className="animate-in fade-in-2 slide-in-from-top-4 duration-1000">
          <div className="flex items-center justify-between bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 shadow-xl">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {isSuperadmin() ? 'Allotjaments' : 'Els Meus Allotjaments'}
              </h1>
              <p className="text-lg text-gray-600">
                <span className="bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent">
                  {isSuperadmin() 
                    ? 'Gestiona tots els allotjaments del sistema' 
                    : 'Gestiona els teus allotjaments'
                  }
                </span>
              </p>
            </div>
            <Button onClick={() => setModalOpen(true)} className="bg-gradient-to-r from-orange-600 to-green-600 hover:from-orange-700 hover:to-green-700 text-white font-semibold rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl h-12 px-6">
              <IconPlus className="mr-2 h-5 w-5" />
              Nou Allotjament
            </Button>
          </div>
        </div>

        {/* Filtres i cerca */}
        <div className="animate-in fade-in-2 slide-in-from-bottom-4 duration-1000 delay-200">
          <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 shadow-xl">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-1 items-center space-x-4">
                <div className="relative flex-1 max-w-sm group">
                  <IconSearch className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 transition-colors duration-300 group-focus-within:text-orange-600" />
                  <Input
                    placeholder="Cercar allotjaments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl h-12 transition-all duration-300"
                  />
                </div>
                <Select value={filterEstat} onValueChange={setFilterEstat}>
                  <SelectTrigger className="w-40 border-gray-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl h-12 transition-all duration-300">
                    <SelectValue placeholder="Estat" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 backdrop-blur-xl border-gray-200 rounded-xl shadow-xl">
                    <SelectItem value="all" className="rounded-lg hover:bg-orange-50 transition-colors duration-200">Tots</SelectItem>
                    <SelectItem value="actiu" className="rounded-lg hover:bg-orange-50 transition-colors duration-200">Actius</SelectItem>
                    <SelectItem value="inactiu" className="rounded-lg hover:bg-orange-50 transition-colors duration-200">Inactius</SelectItem>
                    <SelectItem value="manteniment" className="rounded-lg hover:bg-orange-50 transition-colors duration-200">Manteniment</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterTipus} onValueChange={setFilterTipus}>
                  <SelectTrigger className="w-40 border-gray-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl h-12 transition-all duration-300">
                    <SelectValue placeholder="Tipus" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 backdrop-blur-xl border-gray-200 rounded-xl shadow-xl">
                    <SelectItem value="all" className="rounded-lg hover:bg-orange-50 transition-colors duration-200">Tots</SelectItem>
                    {tipusAllotjament.map((tipus) => (
                      <SelectItem key={tipus.value} value={tipus.value} className="rounded-lg hover:bg-orange-50 transition-colors duration-200">
                        {tipus.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {/* Mostrar filtre de propietari només per superadmins */}
                {isSuperadmin() && (
                  <Select value={filterPropietari} onValueChange={setFilterPropietari}>
                    <SelectTrigger className="w-48 border-gray-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl h-12 transition-all duration-300">
                      <SelectValue placeholder="Propietari" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/95 backdrop-blur-xl border-gray-200 rounded-xl shadow-xl">
                      <SelectItem value="all" className="rounded-lg hover:bg-orange-50 transition-colors duration-200">Tots els propietaris</SelectItem>
                      {propietaris.map((propietari) => (
                        <SelectItem key={propietari.id} value={propietari.id.toString()} className="rounded-lg hover:bg-orange-50 transition-colors duration-200">
                          {propietari.nom_complet}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" className="border-gray-200 hover:bg-orange-50 hover:border-orange-300 rounded-xl h-12 px-4 transition-all duration-300">
                  <IconFilter className="mr-2 h-4 w-4 text-orange-600" />
                  Filtres
                </Button>
                <Button variant="outline" className="border-gray-200 hover:bg-orange-50 hover:border-orange-300 rounded-xl h-12 px-4 transition-all duration-300">
                  <IconDownload className="mr-2 h-4 w-4 text-orange-600" />
                  Exportar
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Estadístiques amb estil modern */}
        <div className="animate-in fade-in-2 slide-in-from-bottom-4 duration-1000 delay-400">
          <div className="grid gap-6 md:grid-cols-4">
            <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent">{totalItems}</div>
                  <p className="text-gray-600 font-medium">Total Allotjaments</p>
                </div>
                <div className="bg-gradient-to-r from-orange-500 to-green-600 p-3 rounded-2xl">
                  <IconBuilding className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-green-600">
                    {allotjaments.filter(a => a.estat === 'actiu').length}
                  </div>
                  <p className="text-gray-600 font-medium">Allotjaments Actius</p>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-2xl">
                  <IconUsers className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-yellow-600">
                    {allotjaments.filter(a => a.estat === 'manteniment').length}
                  </div>
                  <p className="text-gray-600 font-medium">En Manteniment</p>
                </div>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-600 p-3 rounded-2xl">
                  <IconMapPin className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-blue-600">
                    {allotjaments.length > 0 ? 
                      (allotjaments.reduce((sum, a) => sum + parseFloat(a.preu_per_nit || 0), 0) / allotjaments.length).toFixed(0) 
                      : 0}€
                  </div>
                  <p className="text-gray-600 font-medium">Preu Mitjà/Nit</p>
                </div>
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-2xl">
                  <IconCurrencyEuro className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Taula amb estil modern */}
        <div className="animate-in fade-in-2 slide-in-from-bottom-4 duration-1000 delay-600">
          <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200 hover:bg-orange-50/50">
                  <TableHead className="font-semibold text-gray-700">Allotjament</TableHead>
                  <TableHead className="font-semibold text-gray-700">Propietari</TableHead>
                  <TableHead className="font-semibold text-gray-700">Ubicació</TableHead>
                  <TableHead className="font-semibold text-gray-700">Tipus</TableHead>
                  <TableHead className="font-semibold text-gray-700">Capacitat</TableHead>
                  <TableHead className="font-semibold text-gray-700">Preu/Nit</TableHead>
                  <TableHead className="font-semibold text-gray-700">Estat</TableHead>
                  <TableHead className="text-right font-semibold text-gray-700">Accions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex items-center justify-center space-x-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600"></div>
                        <span className="text-gray-600">Carregant allotjaments...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : allotjaments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="text-gray-500">No s'han trobat allotjaments</div>
                    </TableCell>
                  </TableRow>
                ) : (
                  allotjaments.map((allotjament) => (
                    <TableRow key={allotjament.id} className="border-gray-200 hover:bg-orange-50/30 transition-all duration-200">
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-3">
                          <div className="bg-gradient-to-r from-orange-500 to-green-600 p-2 rounded-xl">
                            <IconBuilding className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{allotjament.nom}</div>
                            <div className="text-sm text-gray-500 truncate max-w-48">
                              {allotjament.descripcio}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-700">
                          {allotjament.propietari ? allotjament.propietari.nom + ' ' + allotjament.propietari.cognoms : '-'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <IconMapPin className="h-4 w-4 text-orange-600" />
                          <span className="text-sm text-gray-700">{allotjament.ciutat}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getTipusBadge(allotjament.tipus)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <IconUsers className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-gray-700">{allotjament.capacitat_maxima}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <IconCurrencyEuro className="h-4 w-4 text-blue-600" />
                          <span className="font-semibold text-gray-900">{allotjament.preu_per_nit}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getEstatBadge(allotjament.estat)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-orange-100 rounded-xl transition-all duration-200">
                              <span className="sr-only">Obrir menú</span>
                              <IconPencil className="h-4 w-4 text-gray-600" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-xl border-gray-200 rounded-xl shadow-xl">
                            <DropdownMenuLabel className="text-gray-700 font-semibold">Accions</DropdownMenuLabel>
                            <DropdownMenuItem asChild className="rounded-lg hover:bg-orange-50 transition-colors duration-200">
                              <Link to={`/allotjaments/${allotjament.id}`}>
                                <IconEye className="mr-2 h-4 w-4 text-blue-600" />
                                Veure detalls
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild className="rounded-lg hover:bg-orange-50 transition-colors duration-200">
                              <Link to={`/allotjaments/${allotjament.id}/editar`}>
                                <IconPencil className="mr-2 h-4 w-4 text-green-600" />
                                Editar
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-gray-200" />
                            <DropdownMenuItem
                              className="text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200"
                              onClick={() => eliminarAllotjament(allotjament.id)}
                            >
                              <IconTrash className="mr-2 h-4 w-4" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Paginació amb estil modern */}
        {totalPages > 1 && (
          <div className="animate-in fade-in-2 slide-in-from-bottom-4 duration-1000 delay-800">
            <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <p className="text-gray-600">
                  Mostrant {((currentPage - 1) * 15) + 1} a {Math.min(currentPage * 15, totalItems)} de {totalItems} allotjaments
                </p>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => carregarAllotjaments(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="border-gray-200 hover:bg-orange-50 hover:border-orange-300 rounded-xl px-4 py-2 transition-all duration-300 disabled:opacity-50"
                  >
                    Anterior
                  </Button>
                  <span className="text-gray-700 font-medium px-3 py-2 bg-orange-50 rounded-xl border border-orange-200">
                    Pàgina {currentPage} de {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => carregarAllotjaments(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="border-gray-200 hover:bg-orange-50 hover:border-orange-300 rounded-xl px-4 py-2 transition-all duration-300 disabled:opacity-50"
                  >
                    Següent
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal per afegir nou allotjament */}
        <NouAllotjamentModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          onSuccess={() => carregarAllotjaments(1)}
        />
      </div>
    </div>
  )
}
