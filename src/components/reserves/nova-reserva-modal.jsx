import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { 
  IconCalendar, 
  IconUsers, 
  IconCurrencyEuro, 
  IconHome,
  IconUser,
  IconFileText 
} from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { ReservesService } from '@/services/reserves'
import { ClientsService } from '@/services/clients'
import { AllotjamentsService } from '@/services/allotjaments'

export function NovaReservaModal({ open, onOpenChange, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [clients, setClients] = useState([])
  const [allotjaments, setAllotjaments] = useState([])
  const [preuCalculat, setPreuCalculat] = useState(0)
  const [nitsCalculades, setNitsCalculades] = useState(0)
  const { success, error } = useToast()

  // Configuració de react-hook-form
  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    clearErrors,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      client_id: '',
      allotjament_id: '',
      data_entrada: '',
      data_sortida: '',
      persones: 1,
      preu_per_nit: '',
      preu_total: '',
      nits: '',
      estat: 'pendent_pagament',
      metode_pagament: 'targeta_credit',
      pagat: false,
      notes_client: '',
      notes_internes: ''
    }
  })

  const estats = [
    { value: 'pendent_pagament', label: 'Pendent de pagament' },
    { value: 'confirmada', label: 'Confirmada' },
    { value: 'en_curs', label: 'En curs' },
    { value: 'completada', label: 'Completada' },
    { value: 'cancel·lada', label: 'Cancel·lada' }
  ]

  const metodesPagament = [
    { value: 'targeta_credit', label: 'Targeta de crèdit' },
    { value: 'transferencia', label: 'Transferència bancària' },
    { value: 'paypal', label: 'PayPal' },
    { value: 'efectiu', label: 'Efectiu' },
    { value: 'altre', label: 'Altre' }
  ]

  // Watch per a calcular automàticament el preu
  const dataEntrada = watch('data_entrada')
  const dataSortida = watch('data_sortida')
  const preuPerNit = watch('preu_per_nit')
  const allotjamentId = watch('allotjament_id')

  useEffect(() => {
    if (open) {
      carregarClients()
      carregarAllotjaments()
      reset()
      clearErrors()
      setPreuCalculat(0)
      setNitsCalculades(0)
    }
  }, [open, reset, clearErrors])

  // Calcular automàticament nits i preu total
  useEffect(() => {
    if (dataEntrada && dataSortida && preuPerNit) {
      const entrada = new Date(dataEntrada)
      const sortida = new Date(dataSortida)
      
      if (sortida > entrada) {
        const diferenciaTempo = sortida.getTime() - entrada.getTime()
        const nits = Math.ceil(diferenciaTempo / (1000 * 3600 * 24))
        const total = nits * parseFloat(preuPerNit)
        
        setNitsCalculades(nits)
        setPreuCalculat(total)
        setValue('nits', nits)
        setValue('preu_total', total.toFixed(2))
      }
    }
  }, [dataEntrada, dataSortida, preuPerNit, setValue])

  // Quan es selecciona un allotjament, carregar el seu preu
  useEffect(() => {
    if (allotjamentId) {
      const allotjament = allotjaments.find(a => a.id.toString() === allotjamentId)
      if (allotjament && allotjament.preu_per_nit) {
        setValue('preu_per_nit', allotjament.preu_per_nit)
      }
    }
  }, [allotjamentId, allotjaments, setValue])

  const carregarClients = async () => {
    try {
      const response = await ClientsService.getAll({ estat: 'actiu' })
      if (response.success) {
        setClients(response.data)
      }
    } catch (err) {
      console.error('Error carregant clients:', err)
    }
  }

  const carregarAllotjaments = async () => {
    try {
      const response = await AllotjamentsService.getAll({ estat: 'actiu' })
      if (response.success) {
        setAllotjaments(response.data)
      }
    } catch (err) {
      console.error('Error carregant allotjaments:', err)
    }
  }

  const onSubmit = async (data) => {
    setLoading(true)
    clearErrors()

    // Validació de dates
    const entrada = new Date(data.data_entrada)
    const sortida = new Date(data.data_sortida)
    const avui = new Date()
    avui.setHours(0, 0, 0, 0)

    if (entrada < avui) {
      setError('data_entrada', {
        type: 'manual',
        message: 'La data d\'entrada no pot ser anterior a avui'
      })
      setLoading(false)
      return
    }

    if (sortida <= entrada) {
      setError('data_sortida', {
        type: 'manual',
        message: 'La data de sortida ha de ser posterior a la d\'entrada'
      })
      setLoading(false)
      return
    }

    // Preparar dades per al backend
    const dataToSend = {
      client_id: parseInt(data.client_id),
      allotjament_id: parseInt(data.allotjament_id),
      data_entrada: data.data_entrada,
      data_sortida: data.data_sortida,
      persones: parseInt(data.persones),
      preu_per_nit: parseFloat(data.preu_per_nit),
      preu_total: parseFloat(data.preu_total),
      nits: parseInt(data.nits),
      estat: data.estat,
      metode_pagament: data.metode_pagament,
      pagat: data.pagat,
      notes_client: data.notes_client || null,
      notes_internes: data.notes_internes || null,
      // Calcular comissió (exemple: 10%)
      comissio_plataforma: parseFloat(data.preu_total) * 0.10,
      ingressos_net: parseFloat(data.preu_total) * 0.90
    }

    const response = await ReservesService.create(dataToSend)
    
    if (response.success) {
      success('Reserva creada correctament')
      onSuccess()
      onOpenChange(false)
      reset()
    } else {
      // Gestionar errors específics de validació
      if (response.errors) {
        Object.keys(response.errors).forEach(field => {
          setError(field, {
            type: 'server',
            message: Array.isArray(response.errors[field]) 
              ? response.errors[field][0] 
              : response.errors[field]
          })
        })
        
        error('Hi ha errors en el formulari. Revisa els camps marcats.')
      } else {
        error(response.message || 'Error en crear la reserva')
      }
    }
    
    setLoading(false)
  }

  const handleClose = () => {
    reset()
    clearErrors()
    setPreuCalculat(0)
    setNitsCalculades(0)
    onOpenChange(false)
  }

  // Component per mostrar errors
  const FieldError = ({ error }) => {
    if (!error) return null
    return (
      <div className="text-sm text-red-500 mt-1">
        {error.message}
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconCalendar className="h-5 w-5" />
            Nova Reserva
          </DialogTitle>
          <DialogDescription>
            Crea una nova reserva al sistema. Els camps marcats amb * són obligatoris.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Selecció de client i allotjament */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Client i Allotjament</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="client_id">Client *</Label>
                <Controller
                  name="client_id"
                  control={control}
                  rules={{ required: 'Cal seleccionar un client' }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className={errors.client_id ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Selecciona un client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id.toString()}>
                            <div className="flex items-center gap-2">
                              <IconUser className="h-4 w-4" />
                              {client.nom} {client.cognoms}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError error={errors.client_id} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="allotjament_id">Allotjament *</Label>
                <Controller
                  name="allotjament_id"
                  control={control}
                  rules={{ required: 'Cal seleccionar un allotjament' }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className={errors.allotjament_id ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Selecciona un allotjament" />
                      </SelectTrigger>
                      <SelectContent>
                        {allotjaments.map((allotjament) => (
                          <SelectItem key={allotjament.id} value={allotjament.id.toString()}>
                            <div className="flex items-center gap-2">
                              <IconHome className="h-4 w-4" />
                              {allotjament.nom} - {allotjament.ciutat}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError error={errors.allotjament_id} />
              </div>
            </div>
          </div>

          {/* Dates i persones */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Dates i Persones</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="data_entrada">Data d'entrada *</Label>
                <Input
                  id="data_entrada"
                  type="date"
                  {...register('data_entrada', { 
                    required: 'La data d\'entrada és obligatòria'
                  })}
                  className={errors.data_entrada ? 'border-red-500' : ''}
                />
                <FieldError error={errors.data_entrada} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="data_sortida">Data de sortida *</Label>
                <Input
                  id="data_sortida"
                  type="date"
                  {...register('data_sortida', { 
                    required: 'La data de sortida és obligatòria'
                  })}
                  className={errors.data_sortida ? 'border-red-500' : ''}
                />
                <FieldError error={errors.data_sortida} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="persones">Persones *</Label>
                <div className="relative">
                  <IconUsers className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="persones"
                    type="number"
                    min="1"
                    {...register('persones', { 
                      required: 'El nombre de persones és obligatori',
                      valueAsNumber: true,
                      min: { value: 1, message: 'Ha de ser almenys 1 persona' }
                    })}
                    className={`pl-9 ${errors.persones ? 'border-red-500' : ''}`}
                  />
                </div>
                <FieldError error={errors.persones} />
              </div>
            </div>

            {/* Informació calculada */}
            {nitsCalculades > 0 && (
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Nits:</strong> {nitsCalculades} | 
                  <strong> Preu total calculat:</strong> {preuCalculat.toFixed(2)}€
                </p>
              </div>
            )}
          </div>

          {/* Preu i pagament */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Preu i Pagament</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="preu_per_nit">Preu per nit (€) *</Label>
                <div className="relative">
                  <IconCurrencyEuro className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="preu_per_nit"
                    type="number"
                    min="0"
                    step="0.01"
                    {...register('preu_per_nit', {
                      required: 'El preu per nit és obligatori',
                      valueAsNumber: true,
                      min: { value: 0.01, message: 'El preu ha de ser major que 0' }
                    })}
                    className={`pl-9 ${errors.preu_per_nit ? 'border-red-500' : ''}`}
                  />
                </div>
                <FieldError error={errors.preu_per_nit} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nits">Nits</Label>
                <Input
                  id="nits"
                  type="number"
                  {...register('nits')}
                  readOnly
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="preu_total">Preu total (€)</Label>
                <Input
                  id="preu_total"
                  type="number"
                  step="0.01"
                  {...register('preu_total')}
                  readOnly
                  className="bg-muted font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="metode_pagament">Mètode de pagament</Label>
                <Controller
                  name="metode_pagament"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className={errors.metode_pagament ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Selecciona el mètode" />
                      </SelectTrigger>
                      <SelectContent>
                        {metodesPagament.map((metode) => (
                          <SelectItem key={metode.value} value={metode.value}>
                            {metode.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError error={errors.metode_pagament} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estat">Estat de la reserva</Label>
                <Controller
                  name="estat"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className={errors.estat ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Selecciona l'estat" />
                      </SelectTrigger>
                      <SelectContent>
                        {estats.map((estat) => (
                          <SelectItem key={estat.value} value={estat.value}>
                            {estat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError error={errors.estat} />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                id="pagat"
                type="checkbox"
                {...register('pagat')}
                className="rounded border-gray-300"
              />
              <Label htmlFor="pagat" className="text-sm font-normal">
                Marcar com a pagat
              </Label>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Notes</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notes_client">Notes del client</Label>
                <Textarea
                  id="notes_client"
                  {...register('notes_client')}
                  placeholder="Comentaris o peticions especials del client..."
                  className="min-h-[80px]"
                />
                <FieldError error={errors.notes_client} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes_internes">Notes internes</Label>
                <Textarea
                  id="notes_internes"
                  {...register('notes_internes')}
                  placeholder="Notes internes per a l'equip..."
                  className="min-h-[80px]"
                />
                <FieldError error={errors.notes_internes} />
              </div>
            </div>
          </div>

          {/* Botons */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel·lar
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? 'Creant...' : 'Crear Reserva'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
