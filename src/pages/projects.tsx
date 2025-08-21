import { IconFolder, IconPlus } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"

export function ProjectsPage() {
  return (
    <div className="flex flex-col gap-6 py-4 md:py-6">
      <div className="flex items-center justify-between px-4 lg:px-6">
        <div>
          <h1 className="text-2xl font-bold">Projectes</h1>
          <p className="text-muted-foreground">Gestiona tots els teus projectes</p>
        </div>
        <Button>
          <IconPlus className="mr-2 h-4 w-4" />
          Nou Projecte
        </Button>
      </div>
      
      <div className="px-4 lg:px-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((project) => (
            <div key={project} className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
              <div className="flex items-center space-x-2 mb-4">
                <IconFolder className="h-5 w-5 text-blue-500" />
                <h3 className="font-medium">Projecte {project}</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Descripció del projecte {project}. Lorem ipsum dolor sit amet consectetur.
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Actualitzat fa 2 dies</span>
                <span className="text-green-600 font-medium">Actiu</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
