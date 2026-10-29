import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AuthContext, type AuthContextType } from '../context/AuthContext'
import { AdminRoute } from './AdminRoute'

function setup(auth: Pick<AuthContextType, 'user' | 'isPending'>) {
  render(
    <AuthContext.Provider value={{ ...auth, logout: async () => {} }}>
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/" element={<p>Accueil</p>} />
          <Route path="/login" element={<p>Login</p>} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <p>Espace admin</p>
              </AdminRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  )
}

const user = { id: '1', email: 'a@b.fr', name: 'A' }

describe('AdminRoute', () => {
  it('redirects to login without a session', () => {
    setup({ user: null, isPending: false })
    expect(screen.getByText('Login')).toBeInTheDocument()
  })

  it('redirects to home when the user is not admin', () => {
    setup({ user: { ...user, role: 'user' }, isPending: false })
    expect(screen.getByText('Accueil')).toBeInTheDocument()
  })

  it('renders the page for an admin', () => {
    setup({ user: { ...user, role: 'admin' }, isPending: false })
    expect(screen.getByText('Espace admin')).toBeInTheDocument()
  })

  it('waits while the session is loading', () => {
    setup({ user: null, isPending: true })
    expect(screen.getByText('Chargement...')).toBeInTheDocument()
  })
})
