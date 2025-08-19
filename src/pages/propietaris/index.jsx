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
    <div className="flex flex-col gap-6 py-4 md:py-6 px-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Propietaris</h1>
          <p className="text-muted-foreground">
            Gestiona tots els propietaris del sistema
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <IconPlus className="mr-2 h-4 w-4" />
          Nou Propietari
        </Button>
      </div>

      {/* Filtres i cerca */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cercar propietaris..."
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
            </SelectContent>
          </Select>
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
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border p-4">
          <div className="text-2xl font-bold">{totalItems}</div>
          <p className="text-sm text-muted-foreground">Total Propietaris</p>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-2xl font-bold text-green-600">
            {propietaris.filter(p => p.estat === 'actiu').length}
          </div>
          <p className="text-sm text-muted-foreground">Propietaris Actius</p>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-2xl font-bold text-gray-600">
            {propietaris.filter(p => p.estat === 'inactiu').length}
          </div>
          <p className="text-sm text-muted-foreground">Propietaris Inactius</p>
        </div>
      </div>

      {/* Taula */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telèfon</TableHead>
              <TableHead>Ciutat</TableHead>
              <TableHead>Estat</TableHead>
              <TableHead className="text-right">Accions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Carregant propietaris...
                </TableCell>
              </TableRow>
            ) : propietaris.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No s'han trobat propietaris
                </TableCell>
              </TableRow>
            ) : (
              propietaris.map((propietari) => (
                <TableRow key={propietari.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-semibold">
                        {propietari.nom} {propietari.cognoms}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        DNI: {propietari.dni}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{propietari.email}</TableCell>
                  <TableCell>{propietari.telefon || '-'}</TableCell>
                  <TableCell>{propietari.ciutat || '-'}</TableCell>
                  <TableCell>{getEstatBadge(propietari.estat)}</TableCell>
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
                          <Link to={`/propietaris/${propietari.id}`}>
                            <IconEye className="mr-2 h-4 w-4" />
                            Veure detalls
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to={`/propietaris/${propietari.id}/editar`}>
                            <IconPencil className="mr-2 h-4 w-4" />
                            Editar
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
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

      {/* Paginació */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Mostrant {((currentPage - 1) * 15) + 1} a {Math.min(currentPage * 15, totalItems)} de {totalItems} propietaris
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => carregarPropietaris(currentPage - 1)}
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
              onClick={() => carregarPropietaris(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Següent
            </Button>
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
  )
}
