import { IconSettings, IconUser, IconNotification, IconDatabase } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"

export function SettingsPage() {
  return (
    <div className="flex flex-col gap-6 py-4 md:py-6">
      <div className="px-4 lg:px-6">
        <div>
          <h1 className="text-2xl font-bold">Configuració</h1>
          <p className="text-muted-foreground">Gestiona la configuració del teu compte i aplicació</p>
        </div>
      </div>
      
      <div className="px-4 lg:px-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-4">
              <IconUser className="h-5 w-5 text-blue-500" />
              <h3 className="font-medium">Perfil d'Usuari</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Actualitza la teva informació personal i preferències
            </p>
            <Button variant="outline">Editar Perfil</Button>
          </div>
          
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-4">
              <IconNotification className="h-5 w-5 text-green-500" />
              <h3 className="font-medium">Notificacions</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Configura com i quan rebre notificacions
            </p>
            <Button variant="outline">Configurar</Button>
          </div>
          
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-4">
              <IconDatabase className="h-5 w-5 text-purple-500" />
              <h3 className="font-medium">Base de Dades</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Exporta o importa les teves dades
            </p>
            <Button variant="outline">Gestionar Dades</Button>
          </div>
          
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-4">
              <IconSettings className="h-5 w-5 text-orange-500" />
              <h3 className="font-medium">Configuració General</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Ajustos generals de l'aplicació
            </p>
            <Button variant="outline">Ajustos</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
