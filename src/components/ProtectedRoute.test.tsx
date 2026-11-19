import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AuthContext, type AuthContextType } from '../context/AuthContext'
import { ProtectedRoute } from './ProtectedRoute'

function setup(auth: Pick<AuthContextType, 'user' | 'isPending'>) {
  render(
    <AuthContext.Provider value={{ ...auth, logout: async () => {} }}>
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/login" element={<p>Login</p>} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <p>Secret</p>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  )
}

describe('ProtectedRoute', () => {
  it('redirects to login without a session', () => {
    setup({ user: null, isPending: false })
    expect(screen.getByText('Login')).toBeInTheDocument()
  })

  it('waits while the session is loading', () => {
    setup({ user: null, isPending: true })
    expect(screen.getByText('Chargement...')).toBeInTheDocument()
  })

  it('renders the page with a session', () => {
    setup({ user: { id: '1', email: 'a@b.fr', name: 'A' }, isPending: false })
    expect(screen.getByText('Secret')).toBeInTheDocument()
  })
})
