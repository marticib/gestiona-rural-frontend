import { createContext, useContext, useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"

const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const toast = useToast()

  // Comprovar si hi ha un token guardat i validar-lo quan es carrega l'app
  useEffect(() => {
    const validateToken = async () => {
      const savedToken = localStorage.getItem("auth_token")
      const savedUser = localStorage.getItem("user")
      
      if (savedToken && savedUser) {
        try {
          // Verificar si el token és vàlid consultant el backend
          const response = await fetch("http://192.168.12.36:8000/api/auth/user", {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${savedToken}`,
              "Accept": "application/json",
            },
          })

          if (response.ok) {
            // Token vàlid, restaurar l'estat
            const data = await response.json()
            setToken(savedToken)
            setUser(data.user)
          } else {
            // Token invàlid, netejar localStorage
            localStorage.removeItem("auth_token")
            localStorage.removeItem("user")
            console.log("Token expirat o invàlid, sessió netejada")
          }
        } catch (error) {
          // Error de connexió o parsing, netejar localStorage
          console.error("Error validant token:", error)
          localStorage.removeItem("auth_token")
          localStorage.removeItem("user")
        }
      }
      
      setIsLoading(false)
    }

    validateToken()
  }, [])

  const login = async (email, password) => {
    try {
      const response = await fetch("http://192.168.12.36:8000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setToken(data.token)
        setUser(data.user)
        localStorage.setItem("auth_token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))
        toast.success(`Benvingut/da, ${data.user.name}!`)
        return true
      } else {
        toast.error(data.message || "Error d'autenticació")
        throw new Error(data.message || "Error d'autenticació")
      }
    } catch (error) {
      console.error("Error de login:", error)
      toast.error("Error de connexió amb el servidor")
      return false
    }
  }

  const logout = async () => {
    try {
      // Cridar al backend per fer logout si tenim token
      if (token) {
        await fetch("http://localhost:8000/api/auth/logout", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json",
          },
        })
      }
    } catch (error) {
      console.error("Error en logout:", error)
    } finally {
      // Sempre netejar l'estat local
      setUser(null)
      setToken(null)
      localStorage.removeItem("auth_token")
      localStorage.removeItem("user")
      toast.info("Sessió tancada correctament")
    }
  }

  const value = {
    user,
    token,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
