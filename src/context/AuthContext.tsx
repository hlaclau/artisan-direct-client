import { createContext, useState, type ReactNode } from 'react'

interface User {
  email: string
}

interface AuthContextType {
  user: User | null
  login: (email: string) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const login = async (email: string) => {
    setUser({ email })
  }

  const logout = async () => {
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}
