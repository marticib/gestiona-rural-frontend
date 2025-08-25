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
    <div className="flex flex-col gap-6 py-4 md:py-6 px-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isSuperadmin() ? 'Allotjaments' : 'Els Meus Allotjaments'}
          </h1>
          <p className="text-muted-foreground">
            {isSuperadmin() 
              ? 'Gestiona tots els allotjaments del sistema' 
              : 'Gestiona els teus allotjaments'
            }
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <IconPlus className="mr-2 h-4 w-4" />
          Nou Allotjament
        </Button>
      </div>

      {/* Filtres i cerca */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cercar allotjaments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filterEstat} onValueChange={setFilterEstat}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Estat" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tots</SelectItem>
              <SelectItem value="actiu">Actius</SelectItem>
              <SelectItem value="inactiu">Inactius</SelectItem>
              <SelectItem value="manteniment">Manteniment</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterTipus} onValueChange={setFilterTipus}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Tipus" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tots</SelectItem>
              {tipusAllotjament.map((tipus) => (
                <SelectItem key={tipus.value} value={tipus.value}>
                  {tipus.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* Mostrar filtre de propietari només per superadmins */}
          {isSuperadmin() && (
            <Select value={filterPropietari} onValueChange={setFilterPropietari}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Propietari" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tots els propietaris</SelectItem>
                {propietaris.map((propietari) => (
                  <SelectItem key={propietari.id} value={propietari.id.toString()}>
                    {propietari.nom_complet}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <IconFilter className="mr-2 h-4 w-4" />
            Filtres
          </Button>
          <Button variant="outline" size="sm">
            <IconDownload className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Estadístiques */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border p-4">
          <div className="text-2xl font-bold">{totalItems}</div>
          <p className="text-sm text-muted-foreground">Total Allotjaments</p>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-2xl font-bold text-green-600">
            {allotjaments.filter(a => a.estat === 'actiu').length}
          </div>
          <p className="text-sm text-muted-foreground">Allotjaments Actius</p>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-2xl font-bold text-yellow-600">
            {allotjaments.filter(a => a.estat === 'manteniment').length}
          </div>
          <p className="text-sm text-muted-foreground">En Manteniment</p>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-2xl font-bold text-blue-600">
            {allotjaments.length > 0 ? 
              (allotjaments.reduce((sum, a) => sum + parseFloat(a.preu_per_nit || 0), 0) / allotjaments.length).toFixed(0) 
              : 0}€
          </div>
          <p className="text-sm text-muted-foreground">Preu Mitjà/Nit</p>
        </div>
      </div>

      {/* Taula */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Allotjament</TableHead>
              <TableHead>Propietari</TableHead>
              <TableHead>Ubicació</TableHead>
              <TableHead>Tipus</TableHead>
              <TableHead>Capacitat</TableHead>
              <TableHead>Preu/Nit</TableHead>
              <TableHead>Estat</TableHead>
              <TableHead className="text-right">Accions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  Carregant allotjaments...
                </TableCell>
              </TableRow>
            ) : allotjaments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  No s'han trobat allotjaments
                </TableCell>
              </TableRow>
            ) : (
              allotjaments.map((allotjament) => (
                <TableRow key={allotjament.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <IconBuilding className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-semibold">{allotjament.nom}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-48">
                          {allotjament.descripcio}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {allotjament.propietari ? allotjament.propietari.nom + ' ' + allotjament.propietari.cognoms : '-'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <IconMapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{allotjament.ciutat}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getTipusBadge(allotjament.tipus)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <IconUsers className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{allotjament.capacitat_maxima}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <IconCurrencyEuro className="h-3 w-3 text-muted-foreground" />
                      <span className="font-medium">{allotjament.preu_per_nit}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getEstatBadge(allotjament.estat)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Obrir menú</span>
                          <IconPencil className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Accions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link to={`/allotjaments/${allotjament.id}`}>
                            <IconEye className="mr-2 h-4 w-4" />
                            Veure detalls
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to={`/allotjaments/${allotjament.id}/editar`}>
                            <IconPencil className="mr-2 h-4 w-4" />
                            Editar
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
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

      {/* Paginació */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Mostrant {((currentPage - 1) * 15) + 1} a {Math.min(currentPage * 15, totalItems)} de {totalItems} allotjaments
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => carregarAllotjaments(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              Anterior
            </Button>
            <span className="text-sm">
              Pàgina {currentPage} de {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => carregarAllotjaments(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Següent
            </Button>
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
  )
}
