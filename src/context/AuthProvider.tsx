import type { ReactNode } from 'react'
import { authClient, useSession } from '../lib/auth-client'
import { AuthContext, type AuthContextType } from './AuthContext'

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data, isPending } = useSession()

  const value: AuthContextType = {
    user: data?.user ?? null,
    isPending,
    logout: async () => {
      await authClient.signOut()
    },
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
