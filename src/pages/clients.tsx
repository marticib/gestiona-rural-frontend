import { IconUsers, IconPlus, IconMail, IconPhone } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"

export function ClientsPage() {
  return (
    <div className="flex flex-col gap-6 py-4 md:py-6">
      <div className="flex items-center justify-between px-4 lg:px-6">
        <div>
          <h1 className="text-2xl font-bold">Clients</h1>
          <p className="text-muted-foreground">Gestiona la teva base de clients</p>
        </div>
        <Button>
          <IconPlus className="mr-2 h-4 w-4" />
          Nou Client
        </Button>
      </div>
      
      <div className="px-4 lg:px-6">
        <div className="rounded-lg border bg-card">
          <div className="p-6">
            <h3 className="text-lg font-medium mb-4">Clients Recents</h3>
            <div className="space-y-4">
              {[
                { name: "Empresa ABC", email: "contacte@empresaabc.com", phone: "+34 600 000 001", status: "Actiu" },
                { name: "Startup XYZ", email: "info@startupxyz.com", phone: "+34 600 000 002", status: "Actiu" },
                { name: "Consultoria 123", email: "hola@consultoria123.com", phone: "+34 600 000 003", status: "Inactiu" },
                { name: "Tech Solutions", email: "contact@techsolutions.com", phone: "+34 600 000 004", status: "Actiu" },
              ].map((client, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                      <IconUsers className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">{client.name}</h4>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <IconMail className="h-4 w-4" />
                          <span>{client.email}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <IconPhone className="h-4 w-4" />
                          <span>{client.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      client.status === 'Actiu' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {client.status}
                    </span>
                    <Button variant="ghost" size="sm">
                      Veure
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
