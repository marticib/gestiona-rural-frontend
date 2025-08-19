import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { 
  IconHome, 
  IconMapPin,
  IconCurrencyEuro 
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
import { useRole } from '@/hooks/use-role'
import { AllotjamentsService } from '@/services/allotjaments'
import { PropietarisService } from '@/services/propietaris'

export function NouAllotjamentModal({ open, onOpenChange, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [propietaris, setPropietaris] = useState([])
  const { success, error } = useToast()
  const { isSuperadmin } = useRole()

  // Configuració de react-hook-form
  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    clearErrors,
    formState: { errors }
  } = useForm({
    defaultValues: {
      // Informació obligatòria
      id_policial: '',
      nom: '',
      habitacions: 1,
      te_wifi: true,
      // Informació opcional
      tipus: 'apartament',
      propietari_id: '',
      adreça: '',
      ciutat: '',
      codi_postal: '',
      provincia: '',
      pais: 'Espanya',
      banys: 1,
      superficie: '',
      capacitat_maxima: 2,
      preu_nit: '',
      estat: 'actiu',
      descripcio: '',
      equipaments: '',
      normes: ''
    }
  })

  const tipusAllotjament = [
    { value: 'apartament', label: 'Apartament' },
    { value: 'casa', label: 'Casa' },
    { value: 'estudi', label: 'Estudi' },
    { value: 'duple', label: 'Dúplex' },
    { value: 'habitacio', label: 'Habitació' },
    { value: 'altre', label: 'Altre' }
  ]

  const estats = [
    { value: 'actiu', label: 'Actiu' },
    { value: 'inactiu', label: 'Inactiu' },
    { value: 'manteniment', label: 'Manteniment' }
  ]

  useEffect(() => {
    if (open) {
      // Només carregar propietaris si és superadmin
      if (isSuperadmin()) {
        carregarPropietaris()
      }
    }
  }, [open])

  useEffect(() => {
    if (open) {
      // Reset form when modal opens
      reset()
      clearErrors()
    }
  }, [open, reset, clearErrors])

  const carregarPropietaris = async () => {
    try {
      const response = await PropietarisService.getActius()
      if (response.success) {
        setPropietaris(response.data)
      }
    } catch (err) {
      console.error('Error carregant propietaris:', err)
    }
  }

  const onSubmit = async (data) => {
    setLoading(true)
    clearErrors()
    
    // Enviar només els camps que l'usuari ha omplert realment
    const dataToSend = {
      // Camps absolutament obligatoris (sempre s'envien)
      nom: data.nom,
      habitacions: parseInt(data.habitacions),
      te_wifi: Boolean(data.te_wifi),
    }

    // Afegir camps opcionals només si tenen valor
    if (data.id_policial && data.id_policial.trim()) {
      dataToSend.id_policial_allotjament = data.id_policial.trim()
    }

    // Només enviar propietari_id si és superadmin i s'ha seleccionat
    if (isSuperadmin() && data.propietari_id) {
      dataToSend.propietari_id = parseInt(data.propietari_id)
    }

    if (data.tipus && data.tipus !== 'apartament') {
      dataToSend.tipus = data.tipus
    }

    if (data.adreça && data.adreça.trim()) {
      dataToSend.adreça = data.adreça.trim()
    }

    if (data.ciutat && data.ciutat.trim()) {
      dataToSend.ciutat = data.ciutat.trim()
    }

    if (data.codi_postal && data.codi_postal.trim()) {
      dataToSend.codi_postal = data.codi_postal.trim()
    }

    if (data.provincia && data.provincia.trim()) {
      dataToSend.provincia = data.provincia.trim()
    }

    if (data.pais && data.pais.trim() && data.pais !== 'Espanya') {
      dataToSend.pais = data.pais.trim()
    }

    if (data.banys && parseInt(data.banys) !== 1) {
      dataToSend.banys = parseInt(data.banys)
    }

    if (data.superficie && parseFloat(data.superficie) > 0) {
      dataToSend.metres_quadrats = parseFloat(data.superficie)
    }

    if (data.capacitat_maxima && parseInt(data.capacitat_maxima) !== 2) {
      dataToSend.capacitat_maxima = parseInt(data.capacitat_maxima)
    }

    if (data.preu_nit && parseFloat(data.preu_nit) > 0) {
      dataToSend.preu_per_nit = parseFloat(data.preu_nit)
    }

    if (data.estat && data.estat !== 'actiu') {
      dataToSend.estat = data.estat
    }

    if (data.descripcio && data.descripcio.trim()) {
      dataToSend.descripcio = data.descripcio.trim()
    }

    if (data.normes && data.normes.trim()) {
      dataToSend.normes_casa = data.normes.trim()
    }

    console.log('Dades a enviar:', dataToSend) // Per debug

    try {
      const response = await AllotjamentsService.create(dataToSend)
      
      if (response.success) {
        success('Allotjament creat correctament')
        onSuccess()
        onOpenChange(false)
        reset()
      } else {
        // Gestionar errors específics de validació
        if (response.errors) {
          // Mapear errors del backend als camps del frontend
          Object.keys(response.errors).forEach(backendField => {
            let frontendField = backendField
            
            // Mapejar noms de camps del backend al frontend
            if (backendField === 'metres_quadrats') frontendField = 'superficie'
            if (backendField === 'preu_per_nit') frontendField = 'preu_nit'
            if (backendField === 'normes_casa') frontendField = 'normes'
            if (backendField === 'id_policial_allotjament') frontendField = 'id_policial'
            
            setError(frontendField, {
              type: 'server',
              message: Array.isArray(response.errors[backendField]) 
                ? response.errors[backendField][0] 
                : response.errors[backendField]
            })
          })
          
          error('Hi ha errors en el formulari. Revisa els camps marcats.')
        } else {
          error(response.message || 'Error en crear l\'allotjament')
        }
      }
    } catch (err) {
      console.error('Error en crear allotjament:', err)
      error('Error de connexió amb el servidor')
    }
    
    setLoading(false)
  }

  const handleClose = () => {
    reset()
    clearErrors()
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
            <IconHome className="h-5 w-5" />
            Nou Allotjament
          </DialogTitle>
          <DialogDescription>
            Afegeix un nou allotjament al sistema. Els camps marcats amb * són obligatoris.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* INFORMACIÓ OBLIGATÒRIA */}
          <div className="space-y-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-lg font-medium text-blue-800 border-b border-blue-300 pb-2">
              Informació Obligatòria
            </h3>
            <p className="text-sm text-blue-600 mb-4">
              Aquests camps són obligatoris per complir amb la normativa.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="id_policial">ID Policial de l'Allotjament *</Label>
                <Input
                  id="id_policial"
                  {...register('id_policial', { 
                    required: 'L\'ID policial és obligatori',
                    minLength: { value: 3, message: 'L\'ID policial ha de tenir almenys 3 caràcters' }
                  })}
                  placeholder="Ex: HUT-123456-78"
                  className={errors.id_policial ? 'border-red-500' : ''}
                />
                <FieldError error={errors.id_policial} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nom">Nom de l'allotjament *</Label>
                <Input
                  id="nom"
                  {...register('nom', { 
                    required: 'El nom és obligatori',
                    minLength: { value: 2, message: 'El nom ha de tenir almenys 2 caràcters' }
                  })}
                  placeholder="Apartament centre ciutat"
                  className={errors.nom ? 'border-red-500' : ''}
                />
                <FieldError error={errors.nom} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="habitacions">Nombre d'habitacions *</Label>
                <Input
                  id="habitacions"
                  type="number"
                  min="1"
                  {...register('habitacions', { 
                    required: 'El nombre d\'habitacions és obligatori',
                    valueAsNumber: true,
                    min: { value: 1, message: 'Ha de tenir almenys 1 habitació' }
                  })}
                  className={errors.habitacions ? 'border-red-500' : ''}
                />
                <FieldError error={errors.habitacions} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="te_wifi">L'establiment disposa d'internet? *</Label>
                <Controller
                  name="te_wifi"
                  control={control}
                  rules={{ required: 'Cal especificar si disposa d\'internet' }}
                  render={({ field }) => (
                    <Select value={field.value ? 'true' : 'false'} onValueChange={(value) => field.onChange(value === 'true')}>
                      <SelectTrigger className={errors.te_wifi ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Selecciona una opció" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Sí</SelectItem>
                        <SelectItem value="false">No</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError error={errors.te_wifi} />
              </div>
            </div>

            {/* Select de propietari només per superadmins */}
            {isSuperadmin() && (
              <div className="space-y-2">
                <Label htmlFor="propietari_id">Propietari *</Label>
                <Controller
                  name="propietari_id"
                  control={control}
                  rules={{ 
                    required: 'Selecciona un propietari' 
                  }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className={errors.propietari_id ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Selecciona un propietari" />
                      </SelectTrigger>
                      <SelectContent>
                        {propietaris.map((propietari) => (
                          <SelectItem key={propietari.id} value={propietari.id.toString()}>
                            {propietari.nom_complet}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError error={errors.propietari_id} />
              </div>
            )}
          </div>

          {/* INFORMACIÓ OPCIONAL */}
          <div className="space-y-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="text-lg font-medium text-gray-800 border-b border-gray-300 pb-2">
              Informació Opcional
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Completa aquesta informació per millorar la descripció de l'allotjament.
            </p>

            {/* Informació bàsica */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-700 border-l-4 border-blue-400 pl-3">Informació Bàsica</h4>
              
              <div className="space-y-2">
                <Label htmlFor="tipus">Tipus d'allotjament</Label>
                <Controller
                  name="tipus"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className={errors.tipus ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Selecciona el tipus" />
                      </SelectTrigger>
                      <SelectContent>
                        {tipusAllotjament.map((tipus) => (
                          <SelectItem key={tipus.value} value={tipus.value}>
                            {tipus.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError error={errors.tipus} />
              </div>
            </div>

            {/* Ubicació */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-700 border-l-4 border-green-400 pl-3">Ubicació</h4>
              
              <div className="space-y-2">
                <Label htmlFor="adreça">Adreça</Label>
                <div className="relative">
                  <IconMapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="adreça"
                    {...register('adreça')}
                    placeholder="Carrer, número, pis..."
                    className={`pl-9 ${errors.adreça ? 'border-red-500' : ''}`}
                  />
                </div>
                <FieldError error={errors.adreça} />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ciutat">Ciutat</Label>
                  <Input
                    id="ciutat"
                    {...register('ciutat')}
                    placeholder="Barcelona"
                    className={errors.ciutat ? 'border-red-500' : ''}
                  />
                  <FieldError error={errors.ciutat} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="codi_postal">Codi Postal</Label>
                  <Input
                    id="codi_postal"
                    {...register('codi_postal', {
                      pattern: { value: /^\d{5}$/, message: 'El codi postal ha de tenir 5 dígits' }
                    })}
                    placeholder="08001"
                    className={errors.codi_postal ? 'border-red-500' : ''}
                  />
                  <FieldError error={errors.codi_postal} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="provincia">Província</Label>
                  <Input
                    id="provincia"
                    {...register('provincia')}
                    placeholder="Barcelona"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pais">País</Label>
                <Input
                  id="pais"
                  {...register('pais')}
                  placeholder="Espanya"
                />
              </div>
            </div>

            {/* Característiques */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-700 border-l-4 border-purple-400 pl-3">Característiques</h4>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="banys">Banys</Label>
                  <Input
                    id="banys"
                    type="number"
                    min="1"
                    {...register('banys', { 
                      valueAsNumber: true,
                      min: { value: 1, message: 'Ha de tenir almenys 1 bany' }
                    })}
                    className={errors.banys ? 'border-red-500' : ''}
                  />
                  <FieldError error={errors.banys} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="superficie">Superfície (m²)</Label>
                  <Input
                    id="superficie"
                    type="number"
                    min="0"
                    step="0.01"
                    {...register('superficie', {
                      valueAsNumber: true,
                      min: { value: 0, message: 'La superfície ha de ser positiva' }
                    })}
                    placeholder="75.5"
                    className={errors.superficie ? 'border-red-500' : ''}
                  />
                  <FieldError error={errors.superficie} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="capacitat_maxima">Capacitat màxima</Label>
                  <Input
                    id="capacitat_maxima"
                    type="number"
                    min="1"
                    {...register('capacitat_maxima', { 
                      valueAsNumber: true,
                      min: { value: 1, message: 'La capacitat ha de ser almenys 1' }
                    })}
                    className={errors.capacitat_maxima ? 'border-red-500' : ''}
                  />
                  <FieldError error={errors.capacitat_maxima} />
                </div>
              </div>
            </div>

            {/* Preu i estat */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-700 border-l-4 border-yellow-400 pl-3">Preu i Estat</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="preu_nit">Preu per nit (€)</Label>
                  <div className="relative">
                    <IconCurrencyEuro className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="preu_nit"
                      type="number"
                      min="0"
                      step="0.01"
                      {...register('preu_nit', {
                        valueAsNumber: true,
                        min: { value: 0, message: 'El preu ha de ser positiu' }
                      })}
                      placeholder="75.00"
                      className={`pl-9 ${errors.preu_nit ? 'border-red-500' : ''}`}
                    />
                  </div>
                  <FieldError error={errors.preu_nit} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estat">Estat</Label>
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
            </div>

            {/* Descripcions */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-700 border-l-4 border-orange-400 pl-3">Descripcions</h4>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="descripcio">Descripció</Label>
                  <Textarea
                    id="descripcio"
                    {...register('descripcio')}
                    placeholder="Descripció general de l'allotjament..."
                    className="min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="equipaments">Equipaments</Label>
                  <Textarea
                    id="equipaments"
                    {...register('equipaments')}
                    placeholder="Aire condicionat, cuina equipada, televisió..."
                    className="min-h-[60px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="normes">Normes</Label>
                  <Textarea
                    id="normes"
                    {...register('normes')}
                    placeholder="No es permeten animals, no fumadors..."
                    className="min-h-[60px]"
                  />
                </div>
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
              {loading ? 'Creant...' : 'Crear Allotjament'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
