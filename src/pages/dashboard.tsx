import { SectionCards } from "@/components/section-cards"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import data from "@/data.json"

export function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-gradient-to-tr from-purple-200 to-blue-200 rounded-full blur-3xl opacity-15 animate-pulse delay-300"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-100 to-pink-100 rounded-full blur-3xl opacity-10 animate-pulse delay-700"></div>
      </div>
      
      <div className="relative flex flex-col gap-8 py-8 md:gap-10 md:py-10">
        {/* Header */}
        <div className="px-4 lg:px-6">
          <div className="text-center mb-8 animate-in fade-in-2 slide-in-from-top-4 duration-1000">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Dashboard
            </h1>
            <p className="text-lg text-gray-600">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Gestiona
              </span> el teu negoci rural amb facilitat
            </p>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="animate-in fade-in-2 slide-in-from-bottom-4 duration-1000 delay-200">
          <SectionCards />
        </div>
        
        {/* Charts Section */}
        <div className="px-4 lg:px-6 animate-in fade-in-2 slide-in-from-bottom-4 duration-1000 delay-400">
          <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 shadow-xl">
            <ChartAreaInteractive />
          </div>
        </div>
        
        {/* Optional Data Table */}
        {/* <div className="px-4 lg:px-6 animate-in fade-in-2 slide-in-from-bottom-4 duration-1000 delay-600">
          <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 shadow-xl">
            <DataTable data={data} />
          </div>
        </div> */}
      </div>
    </div>
  )
}
