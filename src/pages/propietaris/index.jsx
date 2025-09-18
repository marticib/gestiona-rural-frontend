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
  IconBuilding,
  IconUsers,
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
import { PropietarisService } from '@/services/propietaris'
import { NouPropietariModal } from '@/components/propietaris/nou-propietari-modal'

export default function PropietarisPage() {
  const [propietaris, setPropietaris] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterEstat, setFilterEstat] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const { success, error } = useToast()

  const carregarPropietaris = async (page = 1) => {
    try {
      setLoading(true)
      const params = {
        page,
        cerca: searchTerm,
        estat: filterEstat === 'all' ? '' : filterEstat,
        per_page: 15,
      }
      
      const response = await PropietarisService.getAll(params)
      
      if (response.success) {
        setPropietaris(response.data)
        setCurrentPage(response.pagination.current_page)
        setTotalPages(response.pagination.last_page)
        setTotalItems(response.pagination.total)
      } else {
        error('Error en carregar els propietaris')
      }
    } catch (err) {
      error('Error en carregar els propietaris')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const eliminarPropietari = async (id) => {
    if (!window.confirm('Estàs segur que vols eliminar aquest propietari?')) {
      return
    }

    try {
      const response = await PropietarisService.delete(id)
      
      if (response.success) {
        success('Propietari eliminat correctament')
        carregarPropietaris(currentPage)
      } else {
        error('Error en eliminar el propietari')
      }
    } catch (err) {
      error('Error en eliminar el propietari')
      console.error(err)
    }
  }

  useEffect(() => {
    carregarPropietaris()
  }, [searchTerm, filterEstat])

  const getEstatBadge = (estat) => {
    return estat === 'actiu' ? (
      <Badge variant="default" className="bg-green-100 text-green-800">
        Actiu
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-gray-100 text-gray-800">
        Inactiu
      </Badge>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 -left-20 w-72 h-72 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      <div className="absolute top-40 -right-20 w-72 h-72 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      <div className="absolute -bottom-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>

      <div className="relative flex flex-col gap-8 py-8 px-6 md:px-8">
        {/* Header amb estil modern */}
        <div className="animate-in fade-in-2 slide-in-from-top-4 duration-1000">
          <div className="flex items-center justify-between bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 shadow-xl">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Propietaris</h1>
              <p className="text-lg text-gray-600">
                <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Gestiona tots els propietaris del sistema
                </span>
              </p>
            </div>
            <Button onClick={() => setModalOpen(true)} className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl h-12 px-6">
              <IconPlus className="mr-2 h-5 w-5" />
              Nou Propietari
            </Button>
          </div>
        </div>

        {/* Filtres i cerca amb estil modern */}
        <div className="animate-in fade-in-2 slide-in-from-bottom-4 duration-1000 delay-200">
          <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 shadow-xl">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-1 items-center space-x-4">
                <div className="relative flex-1 max-w-sm group">
                  <IconSearch className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 transition-colors duration-300 group-focus-within:text-purple-600" />
                  <Input
                    placeholder="Cercar propietaris..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500 rounded-xl h-12 transition-all duration-300"
                  />
                </div>
                <Select value={filterEstat} onValueChange={setFilterEstat}>
                  <SelectTrigger className="w-40 border-gray-200 focus:border-purple-500 focus:ring-purple-500 rounded-xl h-12 transition-all duration-300">
                    <SelectValue placeholder="Estat" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 backdrop-blur-xl border-gray-200 rounded-xl shadow-xl">
                    <SelectItem value="all" className="rounded-lg hover:bg-purple-50 transition-colors duration-200">Tots</SelectItem>
                    <SelectItem value="actiu" className="rounded-lg hover:bg-purple-50 transition-colors duration-200">Actius</SelectItem>
                    <SelectItem value="inactiu" className="rounded-lg hover:bg-purple-50 transition-colors duration-200">Inactius</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" className="border-gray-200 hover:bg-purple-50 hover:border-purple-300 rounded-xl h-12 px-4 transition-all duration-300">
                  <IconFilter className="mr-2 h-4 w-4 text-purple-600" />
                  Filtres
                </Button>
                <Button variant="outline" className="border-gray-200 hover:bg-purple-50 hover:border-purple-300 rounded-xl h-12 px-4 transition-all duration-300">
                  <IconDownload className="mr-2 h-4 w-4 text-purple-600" />
                  Exportar
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Estadístiques amb estil modern */}
        <div className="animate-in fade-in-2 slide-in-from-bottom-4 duration-1000 delay-400">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">{totalItems}</div>
                  <p className="text-gray-600 font-medium">Total Propietaris</p>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-3 rounded-2xl">
                  <IconUsers className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-green-600">
                    {propietaris.filter(p => p.estat === 'actiu').length}
                  </div>
                  <p className="text-gray-600 font-medium">Propietaris Actius</p>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-2xl">
                  <IconUser className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-gray-600">
                    {propietaris.filter(p => p.estat === 'inactiu').length}
                  </div>
                  <p className="text-gray-600 font-medium">Propietaris Inactius</p>
                </div>
                <div className="bg-gradient-to-r from-gray-500 to-slate-600 p-3 rounded-2xl">
                  <IconBuilding className="h-6 w-6 text-white" />
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
                <TableRow className="border-gray-200 hover:bg-purple-50/50">
                  <TableHead className="font-semibold text-gray-700">Nom</TableHead>
                  <TableHead className="font-semibold text-gray-700">Email</TableHead>
                  <TableHead className="font-semibold text-gray-700">Telèfon</TableHead>
                  <TableHead className="font-semibold text-gray-700">Ciutat</TableHead>
                  <TableHead className="font-semibold text-gray-700">Estat</TableHead>
                  <TableHead className="text-right font-semibold text-gray-700">Accions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex items-center justify-center space-x-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                        <span className="text-gray-600">Carregant propietaris...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : propietaris.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="text-gray-500">No s'han trobat propietaris</div>
                    </TableCell>
                  </TableRow>
                ) : (
                  propietaris.map((propietari) => (
                    <TableRow key={propietari.id} className="border-gray-200 hover:bg-purple-50/30 transition-all duration-200">
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-3">
                          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-2 rounded-xl">
                            <IconUser className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {propietari.nom} {propietari.cognoms}
                            </div>
                            <div className="text-sm text-gray-500">
                              DNI: {propietari.dni}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <IconMail className="h-4 w-4 text-purple-600" />
                          <span className="text-gray-700">{propietari.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <IconPhone className="h-4 w-4 text-indigo-600" />
                          <span className="text-gray-700">{propietari.telefon || '-'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <IconMapPin className="h-4 w-4 text-purple-600" />
                          <span className="text-gray-700">{propietari.ciutat || '-'}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getEstatBadge(propietari.estat)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-purple-100 rounded-xl transition-all duration-200">
                              <span className="sr-only">Obrir menú</span>
                              <IconPencil className="h-4 w-4 text-gray-600" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-xl border-gray-200 rounded-xl shadow-xl">
                            <DropdownMenuLabel className="text-gray-700 font-semibold">Accions</DropdownMenuLabel>
                            <DropdownMenuItem asChild className="rounded-lg hover:bg-purple-50 transition-colors duration-200">
                              <Link to={`/propietaris/${propietari.id}`}>
                                <IconEye className="mr-2 h-4 w-4 text-blue-600" />
                                Veure detalls
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild className="rounded-lg hover:bg-purple-50 transition-colors duration-200">
                              <Link to={`/propietaris/${propietari.id}/editar`}>
                                <IconPencil className="mr-2 h-4 w-4 text-purple-600" />
                                Editar
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-gray-200" />
                            <DropdownMenuItem
                              className="text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200"
                              onClick={() => eliminarPropietari(propietari.id)}
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
                  Mostrant {((currentPage - 1) * 15) + 1} a {Math.min(currentPage * 15, totalItems)} de {totalItems} propietaris
                </p>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => carregarPropietaris(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="border-gray-200 hover:bg-purple-50 hover:border-purple-300 rounded-xl px-4 py-2 transition-all duration-300 disabled:opacity-50"
                  >
                    Anterior
                  </Button>
                  <span className="text-gray-700 font-medium px-3 py-2 bg-purple-50 rounded-xl border border-purple-200">
                    Pàgina {currentPage} de {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => carregarPropietaris(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="border-gray-200 hover:bg-purple-50 hover:border-purple-300 rounded-xl px-4 py-2 transition-all duration-300 disabled:opacity-50"
                  >
                    Següent
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal per afegir nou propietari */}
        <NouPropietariModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          onSuccess={() => carregarPropietaris(1)}
        />
      </div>
    </div>
  )
}
