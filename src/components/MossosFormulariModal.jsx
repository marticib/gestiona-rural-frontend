import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { User, FileText, MapPin, CreditCard, Shield, Refresh, Plus, Minus } from 'lucide-react'
import { ReservesService } from '@/services/reserves'

const MossosFormulariModal = ({ open, onClose, viatger, onUpdate }) => {
  const [loading, setLoading] = useState(false)
  const [numeroViatgersOriginal, setNumeroViatgersOriginal] = useState(0)
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    setValue, 
    watch,
    reset 
  } = useForm()

  useEffect(() => {
    if (viatger && open) {
      // Omplir el formulari amb les dades existents
      Object.keys(viatger).forEach(key => {
        setValue(key, viatger[key])
      })
      
      // Guardar el valor original del número de viatgers
      setNumeroViatgersOriginal(parseInt(viatger.numero_viatgers) || 0)
    }
  }, [viatger, open, setValue])

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      // Utilitzar el valor original guardat i el valor actual del formulari
      const numeroViatgersNou = parseInt(data.numero_viatgers) || 0
      
      // Actualitzar les dades del viatger
      const response = await fetch(`/api/viatgers/${viatger.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        // Si el número de viatgers ha canviat, actualitzar també la reserva
        if (numeroViatgersOriginal !== numeroViatgersNou && viatger.reserva_id && numeroViatgersNou > 0) {
          console.log(`Actualitzant número d'hostes de ${numeroViatgersOriginal} a ${numeroViatgersNou} per a la reserva ${viatger.reserva_id}`)
          try {
            const reservaResponse = await ReservesService.updateGuestCount(viatger.reserva_id, numeroViatgersNou)
            
            if (reservaResponse.success) {
              toast.success('Dades de Mossos d\'Esquadra actualitzades i número d\'hostes de la reserva actualitzat correctament')
            } else {
              toast.warning('Dades de Mossos actualitzades, però hi ha hagut un problema actualitzant el número d\'hostes de la reserva')
            }
          } catch (reservaError) {
            console.error('Error actualitzant reserva:', reservaError)
            toast.warning('Dades de Mossos actualitzades, però no s\'ha pogut actualitzar el número d\'hostes de la reserva')
          }
        } else if (numeroViatgersOriginal === numeroViatgersNou) {
          toast.success('Dades de Mossos d\'Esquadra actualitzades correctament')
        } else {
          toast.success('Dades de Mossos d\'Esquadra actualitzades correctament')
        }
        
        onUpdate?.()
        onClose()
      } else {
        const error = await response.json()
        toast.error(error.message || 'Error en actualitzar les dades')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error en actualitzar les dades')
    } finally {
      setLoading(false)
    }
  }

  const incrementarViatgers = () => {
    const currentValue = parseInt(watch('numero_viatgers')) || 0
    const newValue = Math.min(currentValue + 1, 999)
    setValue('numero_viatgers', newValue)
  }

  const decrementarViatgers = () => {
    const currentValue = parseInt(watch('numero_viatgers')) || 0
    const newValue = Math.max(currentValue - 1, 1)
    setValue('numero_viatgers', newValue)
  }

  const tipusDocument = [
    { value: 'D', label: 'DNI/NIF' },
    { value: 'N', label: 'NIE' },
    { value: 'P', label: 'Passaport' },
    { value: 'O', label: 'Altres documents' }
  ]

  const tipusContracte = [
    { value: 'C', label: 'Contracte en curs' },
    { value: 'R', label: 'Reserva' }
  ]

  const tipusPagament = [
    { value: 'DESTI', label: 'En destí' },
    { value: 'EFECT', label: 'Efectiu' },
    { value: 'MOVIL', label: 'Pagament mòbil' },
    { value: 'OTRO', label: 'Altres' },
    { value: 'PLATF', label: 'Plataforma digital' },
    { value: 'TARJT', label: 'Targeta' },
    { value: 'TRANS', label: 'Transferència' },
    { value: 'TREG', label: 'Targeta regalo' }
  ]

  const relacionsParentesc = [
    { value: 'AB', label: 'Avi/àvia' },
    { value: 'BA', label: 'Germà/germana' },
    { value: 'BN', label: 'Besnet/besneta' },
    { value: 'CD', label: 'Cunyat/cunyada' },
    { value: 'CY', label: 'Cònjuge' },
    { value: 'HJ', label: 'Fill/filla' },
    { value: 'HR', label: 'Germà/germana' },
    { value: 'NI', label: 'Nét/néta' },
    { value: 'OT', label: 'Altres' },
    { value: 'PM', label: 'Pare/mare' },
    { value: 'SB', label: 'Nebot/neboda' },
    { value: 'SG', label: 'Sogre/sogra' },
    { value: 'TI', label: 'Tiet/tia' },
    { value: 'TU', label: 'Tutor/tutora' },
    { value: 'YN', label: 'Gendre/nora' }
  ]

  if (!viatger) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Dades per a Mossos d'Esquadra
          </DialogTitle>
          <DialogDescription>
            Completa les dades necessàries per generar el fitxer oficial TXT per a Mossos d'Esquadra.
            Els camps marcats amb * són obligatoris segons la normativa.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Tabs defaultValue="documents" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="documents" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Documents
              </TabsTrigger>
              <TabsTrigger value="personal" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Dades personals
              </TabsTrigger>
              <TabsTrigger value="contracte" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Contracte
              </TabsTrigger>
              <TabsTrigger value="adreca" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Adreça postal
              </TabsTrigger>
            </TabsList>

            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Documentació identificativa</CardTitle>
                  <CardDescription>
                    Dades dels documents d'identitat del viatger
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="tipus_document_mossos">Tipus de document *</Label>
                      <Select
                        value={watch('tipus_document_mossos')}
                        onValueChange={(value) => setValue('tipus_document_mossos', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona tipus" />
                        </SelectTrigger>
                        <SelectContent>
                          {tipusDocument.map((tipus) => (
                            <SelectItem key={tipus.value} value={tipus.value}>
                              {tipus.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="data_expedicio_document">Data expedició document</Label>
                      <Input 
                        type="date" 
                        {...register('data_expedicio_document')}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="numero_document_espanyol">Número document espanyol</Label>
                      <Input 
                        {...register('numero_document_espanyol')}
                        placeholder="Ex: 12345678A"
                        maxLength={11}
                      />
                    </div>

                    <div>
                      <Label htmlFor="numero_document_estranger">Número document estranger</Label>
                      <Input 
                        {...register('numero_document_estranger')}
                        placeholder="Per passaports estrangers"
                        maxLength={14}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="numero_suport">Número de suport (per DNI/NIE)</Label>
                    <Input 
                      {...register('numero_suport')}
                      placeholder="9 caràcters exactes"
                      maxLength={9}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Dades personals complementàries</CardTitle>
                  <CardDescription>
                    Informació personal addicional requerida per Mossos
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="primer_cognom">Primer cognom</Label>
                      <Input 
                        {...register('primer_cognom')}
                        maxLength={30}
                      />
                    </div>

                    <div>
                      <Label htmlFor="segon_cognom">Segon cognom</Label>
                      <Input 
                        {...register('segon_cognom')}
                        maxLength={30}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="pais_nacionalitat">País de nacionalitat (codi ISO)</Label>
                    <Input 
                      {...register('pais_nacionalitat')}
                      placeholder="Ex: ESP, FRA, DEU"
                      maxLength={3}
                    />
                  </div>

                  {/* Relació de parentesc només per menors de 18 anys */}
                  <div>
                    <Label htmlFor="relacio_parentesc">Relació de parentesc (només menors de 18 anys)</Label>
                    <Select
                      value={watch('relacio_parentesc')}
                      onValueChange={(value) => setValue('relacio_parentesc', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona relació" />
                      </SelectTrigger>
                      <SelectContent>
                        {relacionsParentesc.map((relacio) => (
                          <SelectItem key={relacio.value} value={relacio.value}>
                            {relacio.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contracte">
              <Card>
                <CardHeader>
                  <CardTitle>Informació del contracte i estada</CardTitle>
                  <CardDescription>
                    Dades sobre la reserva i estada del viatger
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="hora_entrada">Hora d'entrada</Label>
                      <Input 
                        type="time" 
                        {...register('hora_entrada')}
                      />
                    </div>

                    <div>
                      <Label htmlFor="hora_sortida">Hora de sortida</Label>
                      <Input 
                        type="time" 
                        {...register('hora_sortida')}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="data_contracte">Data del contracte</Label>
                      <Input 
                        type="date" 
                        {...register('data_contracte')}
                      />
                    </div>

                    <div>
                      <Label htmlFor="tipus_contracte">Tipus de contracte</Label>
                      <Select
                        value={watch('tipus_contracte')}
                        onValueChange={(value) => setValue('tipus_contracte', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona tipus" />
                        </SelectTrigger>
                        <SelectContent>
                          {tipusContracte.map((tipus) => (
                            <SelectItem key={tipus.value} value={tipus.value}>
                              {tipus.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="numero_contracte">Número de contracte</Label>
                      <Input 
                        {...register('numero_contracte')}
                        maxLength={20}
                      />
                    </div>

                    <div>
                      <Label htmlFor="numero_viatgers" className="flex items-center gap-2">
                        Número de viatgers 
                        <Badge variant="secondary" className="text-xs flex items-center gap-1">
                          <Refresh className="h-3 w-3" />
                          Actualitza la reserva
                        </Badge>
                        {parseInt(watch('numero_viatgers')) !== numeroViatgersOriginal && (
                          <Badge variant="warning" className="text-xs">
                            Modificat
                          </Badge>
                        )}
                      </Label>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={decrementarViatgers}
                          disabled={parseInt(watch('numero_viatgers')) <= 1}
                          className="px-2"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input 
                          type="number" 
                          {...register('numero_viatgers')}
                          min={1}
                          max={999}
                          className="text-center"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={incrementarViatgers}
                          disabled={parseInt(watch('numero_viatgers')) >= 999}
                          className="px-2"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1 space-y-1">
                        <p>Canviar aquest valor també actualitzarà el nombre d'hostes de la reserva associada</p>
                        {numeroViatgersOriginal > 0 && (
                          <p className="text-xs">
                            <span className="font-medium">Valor original:</span> {numeroViatgersOriginal} viatgers
                            {parseInt(watch('numero_viatgers')) !== numeroViatgersOriginal && (
                              <span className="ml-2 text-orange-600">
                                → Nou valor: {watch('numero_viatgers')} viatgers
                              </span>
                            )}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="numero_habitacions">Número d'habitacions</Label>
                      <Input 
                        type="number" 
                        {...register('numero_habitacions')}
                        min={1}
                        max={999}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="tipus_pagament">Tipus de pagament</Label>
                      <Select
                        value={watch('tipus_pagament')}
                        onValueChange={(value) => setValue('tipus_pagament', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona tipus" />
                        </SelectTrigger>
                        <SelectContent>
                          {tipusPagament.map((tipus) => (
                            <SelectItem key={tipus.value} value={tipus.value}>
                              {tipus.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="hotel_te_internet">L'hotel té internet?</Label>
                      <Select
                        value={watch('hotel_te_internet')}
                        onValueChange={(value) => setValue('hotel_te_internet', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona opció" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="S">Sí</SelectItem>
                          <SelectItem value="N">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="adreca">
              <Card>
                <CardHeader>
                  <CardTitle>Adreça postal específica per Mossos</CardTitle>
                  <CardDescription>
                    Adreça postal que es farà servir en el registre policial
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="direccio_postal_mossos">Direcció postal</Label>
                    <Input 
                      {...register('direccio_postal_mossos')}
                      maxLength={100}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="provincia_postal_mossos">Província (codi INE)</Label>
                      <Input 
                        {...register('provincia_postal_mossos')}
                        placeholder="Ex: 08"
                        maxLength={2}
                      />
                    </div>

                    <div>
                      <Label htmlFor="municipi_postal_mossos">Municipi (codi INE)</Label>
                      <Input 
                        {...register('municipi_postal_mossos')}
                        placeholder="Ex: 080193"
                        maxLength={6}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="localitat_postal_mossos">Localitat</Label>
                      <Input 
                        {...register('localitat_postal_mossos')}
                        maxLength={100}
                      />
                    </div>

                    <div>
                      <Label htmlFor="pais_postal_mossos">País (codi ISO)</Label>
                      <Input 
                        {...register('pais_postal_mossos')}
                        placeholder="Ex: ESP"
                        maxLength={3}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="codi_postal_mossos">Codi postal</Label>
                    <Input 
                      {...register('codi_postal_mossos')}
                      placeholder="Ex: 08001"
                      maxLength={20}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel·lar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardant...' : 'Guardar dades'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default MossosFormulariModal
