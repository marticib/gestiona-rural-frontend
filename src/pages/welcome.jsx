import { useAuth } from "@/contexts/auth-context.jsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  IconHome, 
  IconCalendar, 
  IconUser, 
  IconStar,
  IconMail,
  IconPhone
} from "@tabler/icons-react"

export function WelcomePage() {
  const { user } = useAuth()

  return (
    <div className="space-y-6 px-6">
      {/* Header de benvinguda */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold mb-4">
          Benvingut/da, {user?.name}! 👋
        </h1>
        <p className="text-xl text-muted-foreground">
          Ens alegrem de tenir-te com a client de Gestiona
        </p>
        <Badge variant="secondary" className="mt-4">
          <IconUser className="w-4 h-4 mr-2" />
          Client
        </Badge>
      </div>

      {/* Cards informatives */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconHome className="w-5 h-5 text-blue-500" />
              Els nostres allotjaments
            </CardTitle>
            <CardDescription>
              Descobreix una àmplia varietat d'allotjaments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Tenim apartaments, cases, estudis i molts més tipus d'allotjaments 
              per fer que la teva estada sigui perfecta.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconCalendar className="w-5 h-5 text-green-500" />
              Reserves fàcils
            </CardTitle>
            <CardDescription>
              Procés de reserva ràpid i senzill
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              El nostre equip t'ajudarà amb tot el procés de reserva per 
              assegurar-nos que tinguis la millor experiència possible.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconStar className="w-5 h-5 text-yellow-500" />
              Servei d'excel·lència
            </CardTitle>
            <CardDescription>
              Atenció personalitzada 24/7
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              El nostre equip està disponible per ajudar-te amb qualsevol 
              necessitat que puguis tenir durant la teva estada.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Informació de contacte */}
      <Card>
        <CardHeader>
          <CardTitle>Com podem ajudar-te?</CardTitle>
          <CardDescription>
            Estem aquí per fer que la teva experiència sigui excepcional
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <IconMail className="w-5 h-5 text-blue-500" />
              <div>
                <p className="font-medium">Correu electrònic</p>
                <p className="text-sm text-muted-foreground">info@gestiona.com</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <IconPhone className="w-5 h-5 text-green-500" />
              <div>
                <p className="font-medium">Telèfon</p>
                <p className="text-sm text-muted-foreground">+34 972 XX XX XX</p>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <h4 className="font-medium mb-2">Horaris d'atenció:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
              <p>Dilluns a Divendres: 9:00 - 20:00</p>
              <p>Dissabtes: 10:00 - 18:00</p>
              <p>Diumenges: 10:00 - 14:00</p>
              <p>Urgències: 24 hores</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Missatge final */}
      <div className="text-center py-6">
        <p className="text-muted-foreground">
          Gràcies per confiar en nosaltres per als teus allotjaments. 
          Esperem que tinguis una experiència fantàstica! 🏡
        </p>
      </div>
    </div>
  )
}
