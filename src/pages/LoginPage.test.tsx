import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { AuthContext } from '../context/AuthContext'
import { LoginPage } from './LoginPage'

function setup(login: (email: string, password: string) => Promise<void>) {
  render(
    <AuthContext.Provider value={{ user: null, login, logout: vi.fn() }}>
      <MemoryRouter
        initialEntries={[{ pathname: '/login', state: { from: { pathname: '/dashboard' } } }]}
      >
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<p>Dashboard</p>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  )
}

async function fillAndSubmit() {
  await userEvent.type(screen.getByLabelText('Email'), 'a@b.fr')
  await userEvent.type(screen.getByLabelText('Mot de passe'), 'secret')
  await userEvent.click(screen.getByRole('button', { name: 'Se connecter' }))
}

describe('LoginPage', () => {
  it('redirects to the initially requested page after login', async () => {
    setup(vi.fn().mockResolvedValue(undefined))
    await fillAndSubmit()
    expect(await screen.findByText('Dashboard')).toBeInTheDocument()
  })

  it('shows a generic error when login fails', async () => {
    setup(vi.fn().mockRejectedValue(new Error('boom')))
    await fillAndSubmit()
    expect(await screen.findByRole('alert')).toHaveTextContent('Email ou mot de passe incorrect.')
  })
})
