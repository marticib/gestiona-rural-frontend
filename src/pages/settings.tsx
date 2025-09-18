import { IconSettings, IconUser, IconNotification, IconDatabase } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"

export function SettingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 -left-20 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      <div className="absolute top-40 -right-20 w-72 h-72 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      <div className="absolute -bottom-20 left-20 w-72 h-72 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>

      <div className="relative flex flex-col gap-6 py-4 md:py-6">
        {/* Header amb estil modern */}
        <div className="px-4 lg:px-6">
          <div className="backdrop-blur-xl bg-white/40 rounded-3xl p-8 border border-white/20 shadow-xl animate-in fade-in-0 slide-in-from-top-2 duration-1000">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
              Configuració
            </h1>
            <p className="text-gray-600 mt-2 text-lg">Gestiona la configuració del teu compte i aplicació</p>
          </div>
        </div>
        
        {/* Targetes de configuració amb estil modern */}
        <div className="px-4 lg:px-6">
          <div className="grid gap-6 md:grid-cols-2 animate-in fade-in-0 slide-in-from-bottom-2 duration-1000 delay-300">
            <div className="group backdrop-blur-xl bg-white/50 rounded-3xl p-8 border border-white/20 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 hover:bg-white/60">
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <IconUser className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Perfil d'Usuari</h3>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Actualitza la teva informació personal i preferències
              </p>
              <Button 
                variant="outline" 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 hover:from-blue-600 hover:to-indigo-700 rounded-xl px-6 py-2 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Editar Perfil
              </Button>
            </div>
            
            <div className="group backdrop-blur-xl bg-white/50 rounded-3xl p-8 border border-white/20 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 hover:bg-white/60">
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <IconNotification className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Notificacions</h3>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Configura com i quan rebre notificacions
              </p>
              <Button 
                variant="outline" 
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 hover:from-green-600 hover:to-emerald-700 rounded-xl px-6 py-2 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Configurar
              </Button>
            </div>
            
            <div className="group backdrop-blur-xl bg-white/50 rounded-3xl p-8 border border-white/20 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 hover:bg-white/60">
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-gradient-to-r from-purple-500 to-violet-600 p-3 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <IconDatabase className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Base de Dades</h3>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Exporta o importa les teves dades
              </p>
              <Button 
                variant="outline" 
                className="bg-gradient-to-r from-purple-500 to-violet-600 text-white border-0 hover:from-purple-600 hover:to-violet-700 rounded-xl px-6 py-2 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Gestionar Dades
              </Button>
            </div>
            
            <div className="group backdrop-blur-xl bg-white/50 rounded-3xl p-8 border border-white/20 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 hover:bg-white/60">
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-gradient-to-r from-orange-500 to-amber-600 p-3 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <IconSettings className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Configuració General</h3>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Ajustos generals de l'aplicació
              </p>
              <Button 
                variant="outline" 
                className="bg-gradient-to-r from-orange-500 to-amber-600 text-white border-0 hover:from-orange-600 hover:to-amber-700 rounded-xl px-6 py-2 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Ajustos
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
