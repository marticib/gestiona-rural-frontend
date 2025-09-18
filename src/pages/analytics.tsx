import { IconChartBar, IconTrendingUp, IconTrendingDown } from "@tabler/icons-react"

export function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-gradient-to-tr from-indigo-200 to-purple-200 rounded-full blur-3xl opacity-15 animate-pulse delay-300"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full blur-3xl opacity-10 animate-pulse delay-700"></div>
      </div>
      
      <div className="relative flex flex-col gap-8 py-8">
        {/* Header */}
        <div className="px-4 lg:px-6 animate-in fade-in-2 slide-in-from-top-4 duration-1000">
          <div className="text-center bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 shadow-xl">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Analítiques</h1>
            <p className="text-lg text-gray-600">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Visualitza el rendiment del teu negoci
              </span>
            </p>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="px-4 lg:px-6 animate-in fade-in-2 slide-in-from-bottom-4 duration-1000 delay-200">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="group bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-6 shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-700 group-hover:text-green-600 transition-colors duration-300">Ingressos Mensuals</h3>
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center transform transition-all duration-300 group-hover:rotate-6 group-hover:scale-110 shadow-md">
                  <IconChartBar className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">€15,420</div>
              <div className="flex items-center text-sm">
                <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-2">
                  <IconTrendingUp className="h-3 w-3 text-white" />
                </div>
                <span className="text-green-600 font-semibold">+12.5%</span>
                <span className="text-gray-600 ml-1">vs mes anterior</span>
              </div>
            </div>
            
            <div className="group bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-6 shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors duration-300">Projectes Actius</h3>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center transform transition-all duration-300 group-hover:rotate-6 group-hover:scale-110 shadow-md">
                  <IconChartBar className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">24</div>
              <div className="flex items-center text-sm">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-2">
                  <IconTrendingUp className="h-3 w-3 text-white" />
                </div>
                <span className="text-blue-600 font-semibold">+3</span>
                <span className="text-gray-600 ml-1">nous projectes</span>
              </div>
            </div>
            
            <div className="group bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-6 shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-700 group-hover:text-purple-600 transition-colors duration-300">Satisfacció Client</h3>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center transform transition-all duration-300 group-hover:rotate-6 group-hover:scale-110 shadow-md">
                  <IconChartBar className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">94%</div>
              <div className="flex items-center text-sm">
                <div className="w-6 h-6 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center mr-2">
                  <IconTrendingDown className="h-3 w-3 text-white" />
                </div>
                <span className="text-red-600 font-semibold">-2%</span>
                <span className="text-gray-600 ml-1">vs mes anterior</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Chart Section */}
        <div className="px-4 lg:px-6 animate-in fade-in-2 slide-in-from-bottom-4 duration-1000 delay-400">
          <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-xl overflow-hidden">
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Rendiment per Mes</h3>
              <div className="h-[350px] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                    <IconChartBar className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-gray-600 font-medium">Gràfic d'analítiques (per implementar)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
