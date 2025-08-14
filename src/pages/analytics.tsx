import { IconChartBar, IconTrendingUp, IconTrendingDown } from "@tabler/icons-react"

export function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-6 py-4 md:py-6">
      <div className="px-4 lg:px-6">
        <div>
          <h1 className="text-2xl font-bold">Analítiques</h1>
          <p className="text-muted-foreground">Visualitza el rendiment del teu negoci</p>
        </div>
      </div>
      
      <div className="px-4 lg:px-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Ingressos Mensuals</h3>
              <IconChartBar className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold">€15,420</div>
            <div className="flex items-center text-sm">
              <IconTrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500">+12.5%</span>
              <span className="text-muted-foreground ml-1">vs mes anterior</span>
            </div>
          </div>
          
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Projectes Actius</h3>
              <IconChartBar className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold">24</div>
            <div className="flex items-center text-sm">
              <IconTrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500">+3</span>
              <span className="text-muted-foreground ml-1">nous projectes</span>
            </div>
          </div>
          
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Satisfacció Client</h3>
              <IconChartBar className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold">94%</div>
            <div className="flex items-center text-sm">
              <IconTrendingDown className="h-4 w-4 text-red-500 mr-1" />
              <span className="text-red-500">-2%</span>
              <span className="text-muted-foreground ml-1">vs mes anterior</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="px-4 lg:px-6">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-medium mb-4">Rendiment per Mes</h3>
            <div className="h-[300px] flex items-center justify-center bg-muted/50 rounded">
              <p className="text-muted-foreground">Gràfic d'analítiques (per implementar)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
