import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { 
  IconCalendar, 
  IconUsers, 
  IconCurrencyEuro, 
  IconHome,
  IconUser,
  IconFileText,
  IconPlus,
  IconChevronDown,
  IconChevronUp
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
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
  const [nouClientOpen, setNouClientOpen] = useState(false)
  const [creantClient, setCreantClient] = useState(false)
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

  // Form per crear nou client
  const {
    register: registerClient,
    handleSubmit: handleSubmitClient,
    reset: resetClient,
    formState: { errors: errorsClient }
  } = useForm({
    defaultValues: {
      nom: '',
      cognoms: '',
      email: '',
      telefon: '',
      dni: ''
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

  const crearNouClient = async (dataClient) => {
    setCreantClient(true)
    
    try {
      const response = await ClientsService.create(dataClient)
      
      if (response.success) {
        success('Client creat correctament')
        // Afegir el nou client a la llista
        setClients(prev => [...prev, response.data])
        // Seleccionar automàticament el nou client
        setValue('client_id', response.data.id.toString())
        // Tancar el collapse i resetar el form
        setNouClientOpen(false)
        resetClient()
      } else {
        error(response.message || 'Error en crear el client')
      }
    } catch (err) {
      console.error('Error creant client:', err)
      error('Error en crear el client')
    } finally {
      setCreantClient(false)
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
      nombre_hostes: parseInt(data.persones),
      preu_per_nit: parseFloat(data.preu_per_nit),
      estat: data.estat || 'pendent_pagament',
      metode_pagament: data.metode_pagament || 'targeta_credit',
      pagat: data.pagat || false,
      notes_client: data.notes_client || null,
      notes_internes: data.notes_internes || null,
      // Camps opcionals amb valors per defecte
      nens: 0,
      bebes: 0,
      taxes_locals: 0,
      comissio_plataforma: parseFloat(data.preu_total || 0) * 0.10,
      descomptes: 0,
      suplement_neteja: 0,
      altres_despeses: 0,
      servei_neteja_extra: false,
      servei_esmorzar: false,
      servei_transport: false,
      animals_domestics: false
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
    resetClient()
    clearErrors()
    setPreuCalculat(0)
    setNitsCalculades(0)
    setNouClientOpen(false)
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50 border-0 shadow-2xl backdrop-blur-xl">
        {/* Background decorations */}
        <div className="absolute top-4 -left-4 w-24 h-24 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
        <div className="absolute bottom-4 -right-4 w-24 h-24 bg-gradient-to-r from-cyan-100 to-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
        
        <div className="relative">
          <DialogHeader className="space-y-4 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
                <IconCalendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Nova Reserva
                </DialogTitle>
                <DialogDescription className="text-gray-600 mt-1">
                  Crea una nova reserva al sistema. Els camps marcats amb * són obligatoris.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="overflow-y-auto max-h-[70vh] pr-2">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Selecció de client i allotjament */}
              <div className="bg-white/60 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 space-y-6 shadow-lg">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <IconHome className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    Client i Allotjament
                  </h3>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="client_id" className="text-sm font-medium text-gray-700">Client *</Label>
                    
                    <div className="flex gap-3">
                      <Controller
                        name="client_id"
                        control={control}
                        rules={{ required: 'Cal seleccionar un client' }}
                        render={({ field }) => (
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className={`flex-1 bg-white/80 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl transition-all duration-300 ${errors.client_id ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : ''}`}>
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
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setNouClientOpen(!nouClientOpen)}
                    className="px-3 h-10"
                  >
                    <IconPlus className="h-4 w-4" />
                    {nouClientOpen ? (
                      <IconChevronUp className="h-3 w-3 ml-1" />
                    ) : (
                      <IconChevronDown className="h-3 w-3 ml-1" />
                    )}
                  </Button>
                </div>
                
                <FieldError error={errors.client_id} />

                {/* Collapse per crear nou client */}
                <Collapsible open={nouClientOpen} onOpenChange={setNouClientOpen}>
                  <CollapsibleContent className="space-y-4 mt-4 p-4 border rounded-lg bg-muted/50">
                    <h4 className="font-medium text-sm">Crear nou client</h4>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label htmlFor="client_nom" className="text-xs">Nom *</Label>
                        <Input
                          id="client_nom"
                          {...registerClient('nom', { 
                            required: 'El nom és obligatori' 
                          })}
                          placeholder="Nom"
                          className={`text-sm ${errorsClient.nom ? 'border-red-500' : ''}`}
                        />
                        {errorsClient.nom && (
                          <div className="text-xs text-red-500">{errorsClient.nom.message}</div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="client_cognoms" className="text-xs">Cognoms *</Label>
                        <Input
                          id="client_cognoms"
                          {...registerClient('cognoms', { 
                            required: 'Els cognoms són obligatoris' 
                          })}
                          placeholder="Cognoms"
                          className={`text-sm ${errorsClient.cognoms ? 'border-red-500' : ''}`}
                        />
                        {errorsClient.cognoms && (
                          <div className="text-xs text-red-500">{errorsClient.cognoms.message}</div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="client_email" className="text-xs">Email *</Label>
                        <Input
                          id="client_email"
                          type="email"
                          {...registerClient('email', { 
                            required: 'L\'email és obligatori',
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: 'Format d\'email invàlid'
                            }
                          })}
                          placeholder="email@exemple.com"
                          className={`text-sm ${errorsClient.email ? 'border-red-500' : ''}`}
                        />
                        {errorsClient.email && (
                          <div className="text-xs text-red-500">{errorsClient.email.message}</div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="client_telefon" className="text-xs">Telèfon</Label>
                        <Input
                          id="client_telefon"
                          type="tel"
                          {...registerClient('telefon')}
                          placeholder="123456789"
                          className="text-sm"
                        />
                      </div>

                      <div className="space-y-1 col-span-2">
                        <Label htmlFor="client_dni" className="text-xs">DNI/NIE</Label>
                        <Input
                          id="client_dni"
                          {...registerClient('dni')}
                          placeholder="12345678A"
                          className="text-sm"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleSubmitClient(crearNouClient)}
                        disabled={creantClient}
                        className="flex-1"
                      >
                        {creantClient ? 'Creant...' : 'Crear Client'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setNouClientOpen(false)
                          resetClient()
                        }}
                      >
                        Cancel·lar
                      </Button>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>

              <div className="space-y-3">
                <Label htmlFor="allotjament_id" className="text-sm font-medium text-gray-700">Allotjament *</Label>
                <Controller
                  name="allotjament_id"
                  control={control}
                  rules={{ required: 'Cal seleccionar un allotjament' }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className={`bg-white/80 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl transition-all duration-300 ${errors.allotjament_id ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : ''}`}>
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
          <div className="bg-white/60 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 space-y-6 shadow-lg">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <IconCalendar className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Dates i Persones
              </h3>
            </div>
            
            <div className="grid grid-cols-3 gap-6">
              <div className="space-y-3">
                <Label htmlFor="data_entrada" className="text-sm font-medium text-gray-700">Data d'entrada *</Label>
                <Input
                  id="data_entrada"
                  type="date"
                  {...register('data_entrada', { 
                    required: 'La data d\'entrada és obligatòria'
                  })}
                  className={`bg-white/80 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl transition-all duration-300 ${errors.data_entrada ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : ''}`}
                />
                <FieldError error={errors.data_entrada} />
              </div>

              <div className="space-y-3">
                <Label htmlFor="data_sortida" className="text-sm font-medium text-gray-700">Data de sortida *</Label>
                <Input
                  id="data_sortida"
                  type="date"
                  {...register('data_sortida', { 
                    required: 'La data de sortida és obligatòria'
                  })}
                  className={`bg-white/80 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl transition-all duration-300 ${errors.data_sortida ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : ''}`}
                />
                <FieldError error={errors.data_sortida} />
              </div>

              <div className="space-y-3">
                <Label htmlFor="persones" className="text-sm font-medium text-gray-700">Persones *</Label>
                <div className="relative">
                  <IconUsers className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="persones"
                    type="number"
                    min="1"
                    {...register('persones', { 
                      required: 'El nombre de persones és obligatori',
                      valueAsNumber: true,
                      min: { value: 1, message: 'Ha de ser almenys 1 persona' }
                    })}
                    className={`pl-10 bg-white/80 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl transition-all duration-300 ${errors.persones ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : ''}`}
                  />
                </div>
                <FieldError error={errors.persones} />
              </div>
            </div>

            {/* Informació calculada */}
            {nitsCalculades > 0 && (
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 p-4 rounded-xl">
                <p className="text-sm text-blue-800">
                  <strong>Nits:</strong> {nitsCalculades} | 
                  <strong> Preu total calculat:</strong> {preuCalculat.toFixed(2)}€
                </p>
              </div>
            )}
          </div>

          {/* Preu i pagament */}
          <div className="bg-white/60 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 space-y-6 shadow-lg">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <IconCurrencyEuro className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Preu i Pagament
              </h3>
            </div>
            
            <div className="grid grid-cols-3 gap-6">
              <div className="space-y-3">
                <Label htmlFor="preu_per_nit" className="text-sm font-medium text-gray-700">Preu per nit (€) *</Label>
                <div className="relative">
                  <IconCurrencyEuro className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
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
                    className={`pl-10 bg-white/80 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl transition-all duration-300 ${errors.preu_per_nit ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : ''}`}
                  />
                </div>
                <FieldError error={errors.preu_per_nit} />
              </div>

              <div className="space-y-3">
                <Label htmlFor="nits" className="text-sm font-medium text-gray-700">Nits</Label>
                <Input
                  id="nits"
                  type="number"
                  {...register('nits')}
                  readOnly
                  className="bg-gray-50 border-gray-200 rounded-xl text-gray-600"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="preu_total" className="text-sm font-medium text-gray-700">Preu total (€)</Label>
                <Input
                  id="preu_total"
                  type="number"
                  step="0.01"
                  {...register('preu_total')}
                  readOnly
                  className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 rounded-xl font-semibold text-blue-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="metode_pagament" className="text-sm font-medium text-gray-700">Mètode de pagament</Label>
                <Controller
                  name="metode_pagament"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className={`bg-white/80 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl transition-all duration-300 ${errors.metode_pagament ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : ''}`}>
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

              <div className="space-y-3">
                <Label htmlFor="estat" className="text-sm font-medium text-gray-700">Estat de la reserva</Label>
                <Controller
                  name="estat"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className={`bg-white/80 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl transition-all duration-300 ${errors.estat ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : ''}`}>
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

            <div className="flex items-center space-x-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-4 rounded-xl">
              <input
                id="pagat"
                type="checkbox"
                {...register('pagat')}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500 w-4 h-4"
              />
              <Label htmlFor="pagat" className="text-sm font-medium text-green-800">
                Marcar com a pagat
              </Label>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white/60 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 space-y-6 shadow-lg">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <IconFileText className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Notes
              </h3>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="notes_client" className="text-sm font-medium text-gray-700">Notes del client</Label>
                <Textarea
                  id="notes_client"
                  {...register('notes_client')}
                  placeholder="Comentaris o peticions especials del client..."
                  className="min-h-[80px] bg-white/80 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl transition-all duration-300"
                />
                <FieldError error={errors.notes_client} />
              </div>

              <div className="space-y-3">
                <Label htmlFor="notes_internes" className="text-sm font-medium text-gray-700">Notes internes</Label>
                <Textarea
                  id="notes_internes"
                  {...register('notes_internes')}
                  placeholder="Notes internes per a l'equip..."
                  className="min-h-[80px] bg-white/80 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl transition-all duration-300"
                />
                <FieldError error={errors.notes_internes} />
              </div>
            </div>
          </div>

          {/* Botons */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl px-6 py-2.5 transition-all duration-300"
            >
              Cancel·lar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white border-0 rounded-xl px-8 py-2.5 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              {loading ? 'Creant...' : 'Crear Reserva'}
            </Button>
          </div>
          </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
