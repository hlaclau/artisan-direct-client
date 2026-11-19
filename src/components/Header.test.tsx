import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AuthContext, type User } from '../context/AuthContext'
import { Header } from './Header'

function setup(user: User | null) {
  render(
    <AuthContext.Provider value={{ user, isPending: false, logout: async () => {} }}>
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    </AuthContext.Provider>,
  )
}

const base = { id: '1', email: 'a@b.fr', name: 'A' }

describe('Header', () => {
  it('shows the admin link to admins', () => {
    setup({ ...base, role: 'admin' })
    expect(screen.getByRole('link', { name: 'Espace admin' })).toHaveAttribute('href', '/admin')
  })

  it('hides the admin link from regular users', () => {
    setup({ ...base, role: 'user' })
    expect(screen.queryByRole('link', { name: 'Espace admin' })).not.toBeInTheDocument()
  })

  it('hides the admin link when logged out', () => {
    setup(null)
    expect(screen.queryByRole('link', { name: 'Espace admin' })).not.toBeInTheDocument()
  })
})
