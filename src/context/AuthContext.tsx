import { createContext, type ReactNode } from 'react'
import { authClient, useSession } from '../lib/auth-client'

interface User {
  id: string
  email: string
  name: string
  image?: string | null
}

interface AuthContextType {
  user: User | null
  isPending: boolean
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, isPending } = useSession()

  const logout = async () => {
    await authClient.signOut()
  }

  const user = session?.user
    ? {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        image: session.user.image,
      }
    : null

  return <AuthContext.Provider value={{ user, isPending, logout }}>{children}</AuthContext.Provider>
}
