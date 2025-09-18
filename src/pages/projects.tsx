import { IconFolder, IconPlus } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"

export function ProjectsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 -left-20 w-72 h-72 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      <div className="absolute top-40 -right-20 w-72 h-72 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      <div className="absolute -bottom-20 left-20 w-72 h-72 bg-gradient-to-r from-teal-400 to-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>

      <div className="relative flex flex-col gap-6 py-4 md:py-6">
        {/* Header amb estil modern */}
        <div className="flex items-center justify-between px-4 lg:px-6">
          <div className="backdrop-blur-xl bg-white/40 rounded-3xl p-8 border border-white/20 shadow-xl animate-in fade-in-0 slide-in-from-left-2 duration-1000 flex-1 mr-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-teal-600 to-green-600 bg-clip-text text-transparent">
              Projectes
            </h1>
            <p className="text-gray-600 mt-2 text-lg">Gestiona tots els teus projectes</p>
          </div>
          <div className="animate-in fade-in-0 slide-in-from-right-2 duration-1000 delay-300">
            <Button className="bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700 text-white border-0 rounded-xl px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <IconPlus className="mr-2 h-4 w-4" />
              Nou Projecte
            </Button>
          </div>
        </div>
        
        {/* Grid de projectes amb estil modern */}
        <div className="px-4 lg:px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-1000 delay-500">
            {[1, 2, 3, 4, 5, 6].map((project, index) => (
              <div 
                key={project} 
                className="group backdrop-blur-xl bg-white/50 rounded-3xl p-6 border border-white/20 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 hover:bg-white/60"
                style={{ animationDelay: `${700 + index * 100}ms` }}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-gradient-to-r from-blue-500 to-teal-600 p-3 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <IconFolder className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Projecte {project}</h3>
                </div>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Descripció del projecte {project}. Lorem ipsum dolor sit amet consectetur.
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Actualitzat fa 2 dies</span>
                  <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                    Actiu
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
