import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { 
  IconUser, 
  IconMail, 
  IconPhone, 
  IconMapPin,
  IconFileText,
  IconBuilding
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
import { ClientsService } from '@/services/clients'
import { PropietarisService } from '@/services/propietaris'
import { useAuth } from '@/contexts/auth-context.jsx'
import { useRole } from '@/hooks/use-role'

export function NouClientModal({ open, onOpenChange, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [propietaris, setPropietaris] = useState([])
  const [currentUserPropietari, setCurrentUserPropietari] = useState(null)
  const { success, error } = useToast()
  const { user } = useAuth()
  const { isPropietari, isSuperadmin } = useRole()

  // Determinar si l'usuari actual és propietari
  const isCurrentUserPropietari = isPropietari() && !isSuperadmin()

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
      nom: '',
      cognoms: '',
      dni: '',
      email: '',
      telefon: '',
      data_naixement: '',
      genere: 'no_especificat',
      nacionalitat: '',
      adreca: '',
      ciutat: '',
      codi_postal: '',
      provincia: '',
      pais: 'Espanya',
      estat: 'actiu',
      propietari_id: '',
      professio: '',
      telefon_emergencia: '',
      contacte_emergencia: '',
      preferencies_alimentaries: '',
      allergies: '',
      notes: ''
    }
  })

  const generes = [
    { value: 'home', label: 'Home' },
    { value: 'dona', label: 'Dona' },
    { value: 'altre', label: 'Altre' },
    { value: 'no_especificat', label: 'No especificat' }
  ]

  const estats = [
    { value: 'actiu', label: 'Actiu' },
    { value: 'inactiu', label: 'Inactiu' },
    { value: 'bloquejat', label: 'Bloquejat' }
  ]

  useEffect(() => {
    if (open) {
      carregarPropietaris()
      carregarPropietariActual()
      reset()
      clearErrors()
    }
  }, [open, reset, clearErrors, user?.email])

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

  const carregarPropietariActual = async () => {
    if (isCurrentUserPropietari && user?.email) {
      try {
        const response = await PropietarisService.getByEmail(user.email)
        if (response.success) {
          setCurrentUserPropietari(response.data)
          // Assignar automàticament el propietari als valors per defecte del formulari
          reset(prev => ({
            ...prev,
            propietari_id: response.data.id.toString()
          }))
        }
      } catch (err) {
        console.error('Error carregant propietari actual:', err)
        // Si no es troba el propietari, mostrar un error informatiu
        error('No s\'ha trobat el teu registre de propietari. Contacta amb l\'administrador.')
      }
    }
  }

  const onSubmit = async (data) => {
    setLoading(true)
    clearErrors()
    
    // Si l'usuari és propietari, assegurar-nos que s'assigna el seu propietari
    let propietariId = data.propietari_id
    if (isCurrentUserPropietari && currentUserPropietari) {
      propietariId = currentUserPropietari.id
    }
    
    // Convertir i mapejar dades per al backend
    const dataToSend = {
      propietari_id: parseInt(propietariId),
      nom: data.nom,
      cognoms: data.cognoms,
      dni: data.dni.toUpperCase(),
      email: data.email,
      telefon: data.telefon || null,
      data_naixement: data.data_naixement || null,
      genere: data.genere,
      nacionalitat: data.nacionalitat || null,
      adreca: data.adreca || null,
      ciutat: data.ciutat || null,
      codi_postal: data.codi_postal || null,
      provincia: data.provincia || null,
      pais: data.pais || 'Espanya',
      estat: data.estat,
      professio: data.professio || null,
      telefon_emergencia: data.telefon_emergencia || null,
      contacte_emergencia: data.contacte_emergencia || null,
      preferencies_alimentaries: data.preferencies_alimentaries || null,
      allergies: data.allergies || null,
      notes: data.notes || null,
      // Camps estadístics inicials
      total_estades: 0,
      total_gastat: 0,
      puntuacio_mitjana: 0,
      ultima_estada: null
    }

    try {
      const response = await ClientsService.create(dataToSend)
      
      if (response.success) {
        success('Client creat correctament')
        onSuccess()
        onOpenChange(false)
        reset()
      } else {
        console.log('Error response:', response) // Debug
        
        // Gestionar errors específics de validació
        if (response.errors) {
          console.log('Validation errors:', response.errors) // Debug
          
          let hasUniqueErrors = false
          Object.keys(response.errors).forEach(backendField => {
            const errorMessage = Array.isArray(response.errors[backendField]) 
              ? response.errors[backendField][0] 
              : response.errors[backendField]
            
            console.log(`Setting error for field ${backendField}:`, errorMessage) // Debug
            
            setError(backendField, {
              type: 'server',
              message: errorMessage
            })

            // Detectar si és un error de camp duplicat
            if (errorMessage.includes('already been taken') || errorMessage.includes('ja existeix')) {
              hasUniqueErrors = true
            }
          })
          
          // Missatge d'error més específic
          if (hasUniqueErrors) {
            error('Ja existeix un client amb aquest email o DNI. Modifica les dades i torna-ho a provar.')
          } else {
            error('Hi ha errors en el formulari. Revisa els camps marcats.')
          }
        } else {
          error(response.message || 'Error en crear el client')
        }
      }
    } catch (err) {
      console.error('Error creating client:', err)
      error('Error de connexió. Prova-ho de nou.')
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
            <IconUser className="h-5 w-5" />
            Nou Client
          </DialogTitle>
          <DialogDescription>
            Afegeix un nou client al sistema. Els camps marcats amb * són obligatoris.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Informació personal */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Informació Personal</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nom">Nom *</Label>
                <Input
                  id="nom"
                  {...register('nom', { 
                    required: 'El nom és obligatori',
                    minLength: { value: 2, message: 'El nom ha de tenir almenys 2 caràcters' }
                  })}
                  placeholder="Nom del client"
                  className={errors.nom ? 'border-red-500' : ''}
                />
                <FieldError error={errors.nom} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cognoms">Cognoms *</Label>
                <Input
                  id="cognoms"
                  {...register('cognoms', { 
                    required: 'Els cognoms són obligatoris',
                    minLength: { value: 2, message: 'Els cognoms han de tenir almenys 2 caràcters' }
                  })}
                  placeholder="Cognoms del client"
                  className={errors.cognoms ? 'border-red-500' : ''}
                />
                <FieldError error={errors.cognoms} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dni">DNI *</Label>
                <Input
                  id="dni"
                  {...register('dni', { 
                    required: 'El DNI és obligatori',
                    pattern: { 
                      value: /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/i, 
                      message: 'Format de DNI invàlid (ex: 12345678A)' 
                    },
                    onChange: (e) => {
                      // Netejar errors de servidor quan l'usuari comença a escriure
                      if (errors.dni && errors.dni.type === 'server') {
                        clearErrors('dni')
                      }
                      return e
                    }
                  })}
                  placeholder="12345678A"
                  style={{ textTransform: 'uppercase' }}
                  className={errors.dni ? 'border-red-500' : ''}
                />
                <FieldError error={errors.dni} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="data_naixement">Data de Naixement</Label>
                <Input
                  id="data_naixement"
                  type="date"
                  {...register('data_naixement')}
                  className={errors.data_naixement ? 'border-red-500' : ''}
                />
                <FieldError error={errors.data_naixement} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="genere">Gènere</Label>
                <Controller
                  name="genere"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className={errors.genere ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Selecciona el gènere" />
                      </SelectTrigger>
                      <SelectContent>
                        {generes.map((genere) => (
                          <SelectItem key={genere.value} value={genere.value}>
                            {genere.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError error={errors.genere} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nacionalitat">Nacionalitat</Label>
                <Input
                  id="nacionalitat"
                  {...register('nacionalitat')}
                  placeholder="Espanyola"
                  className={errors.nacionalitat ? 'border-red-500' : ''}
                />
                <FieldError error={errors.nacionalitat} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="professio">Professió</Label>
                <Input
                  id="professio"
                  {...register('professio')}
                  placeholder="Enginyer, Professor, etc."
                  className={errors.professio ? 'border-red-500' : ''}
                />
                <FieldError error={errors.professio} />
              </div>
            </div>
          </div>

          {/* Informació de contacte */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Informació de Contacte</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <div className="relative">
                  <IconMail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    {...register('email', { 
                      required: 'L\'email és obligatori',
                      pattern: { 
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
                        message: 'Format d\'email invàlid' 
                      },
                      onChange: (e) => {
                        // Netejar errors de servidor quan l'usuari comença a escriure
                        if (errors.email && errors.email.type === 'server') {
                          clearErrors('email')
                        }
                        return e
                      }
                    })}
                    placeholder="client@example.com"
                    className={`pl-9 ${errors.email ? 'border-red-500' : ''}`}
                  />
                </div>
                <FieldError error={errors.email} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefon">Telèfon</Label>
                <div className="relative">
                  <IconPhone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="telefon"
                    {...register('telefon', {
                      pattern: { 
                        value: /^[0-9+\s-]{9,}$/, 
                        message: 'Format de telèfon invàlid' 
                      }
                    })}
                    placeholder="+34 123 456 789"
                    className={`pl-9 ${errors.telefon ? 'border-red-500' : ''}`}
                  />
                </div>
                <FieldError error={errors.telefon} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contacte_emergencia">Contacte d'Emergència</Label>
                <Input
                  id="contacte_emergencia"
                  {...register('contacte_emergencia')}
                  placeholder="Nom del contacte"
                  className={errors.contacte_emergencia ? 'border-red-500' : ''}
                />
                <FieldError error={errors.contacte_emergencia} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefon_emergencia">Telèfon d'Emergència</Label>
                <Input
                  id="telefon_emergencia"
                  {...register('telefon_emergencia', {
                    pattern: { 
                      value: /^[0-9+\s-]{9,}$/, 
                      message: 'Format de telèfon invàlid' 
                    }
                  })}
                  placeholder="+34 987 654 321"
                  className={errors.telefon_emergencia ? 'border-red-500' : ''}
                />
                <FieldError error={errors.telefon_emergencia} />
              </div>
            </div>
          </div>

          {/* Adreça */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Adreça</h3>
            
            <div className="space-y-2">
              <Label htmlFor="adreca">Adreça</Label>
              <div className="relative">
                <IconMapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="adreca"
                  {...register('adreca')}
                  placeholder="Carrer, número, pis..."
                  className={`pl-9 ${errors.adreca ? 'border-red-500' : ''}`}
                />
              </div>
              <FieldError error={errors.adreca} />
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
                  className={errors.provincia ? 'border-red-500' : ''}
                />
                <FieldError error={errors.provincia} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pais">País</Label>
              <Input
                id="pais"
                {...register('pais')}
                placeholder="Espanya"
                className={errors.pais ? 'border-red-500' : ''}
              />
              <FieldError error={errors.pais} />
            </div>
          </div>

          {/* Relació i estat - només visible per admins */}
          {!isCurrentUserPropietari && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Relació i Estat</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="propietari_id">Propietari *</Label>
                  <Controller
                    name="propietari_id"
                    control={control}
                    rules={{ required: 'Cal seleccionar un propietari' }}
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
          )}

          {/* Missatge informatiu per propietaris */}
          {isCurrentUserPropietari && currentUserPropietari && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <IconUser className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    Client assignat automàticament a: {currentUserPropietari.nom_complet}
                  </p>
                  <p className="text-xs text-blue-600">
                    Com a propietari, els clients es creen automàticament associats al teu perfil
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Informació addicional */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Informació Addicional</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="preferencies_alimentaries">Preferències Alimentàries</Label>
                <Textarea
                  id="preferencies_alimentaries"
                  {...register('preferencies_alimentaries')}
                  placeholder="Vegetarià, sense gluten, etc."
                  className="min-h-[60px]"
                />
                <FieldError error={errors.preferencies_alimentaries} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="allergies">Al·lèrgies</Label>
                <Textarea
                  id="allergies"
                  {...register('allergies')}
                  placeholder="Al·lèrgies conegudes..."
                  className="min-h-[60px]"
                />
                <FieldError error={errors.allergies} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  {...register('notes')}
                  placeholder="Notes addicionals sobre el client..."
                  className="min-h-[80px]"
                />
                <FieldError error={errors.notes} />
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
              {loading ? 'Creant...' : 'Crear Client'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
