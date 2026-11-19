import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { LoginPage } from './LoginPage'

const { signInEmail, signInSocial } = vi.hoisted(() => ({
  signInEmail: vi.fn(),
  signInSocial: vi.fn(),
}))

vi.mock('../lib/auth-client', () => ({
  authClient: { signIn: { email: signInEmail, social: signInSocial } },
}))

function setup() {
  render(
    <MemoryRouter
      initialEntries={[{ pathname: '/login', state: { from: { pathname: '/dashboard' } } }]}
    >
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<p>Dashboard</p>} />
      </Routes>
    </MemoryRouter>,
  )
}

async function fillAndSubmit() {
  await userEvent.type(screen.getByLabelText('Email'), 'a@b.fr')
  await userEvent.type(screen.getByLabelText('Mot de passe'), 'secret')
  await userEvent.click(screen.getByRole('button', { name: 'Se connecter' }))
}

describe('LoginPage', () => {
  beforeEach(() => vi.clearAllMocks())

  it('redirects to the initially requested page after login', async () => {
    signInEmail.mockResolvedValue({ error: null })
    setup()
    await fillAndSubmit()
    expect(await screen.findByText('Dashboard')).toBeInTheDocument()
    expect(signInEmail).toHaveBeenCalledWith({ email: 'a@b.fr', password: 'secret' })
  })

  it('shows an error when credentials are rejected', async () => {
    signInEmail.mockResolvedValue({ error: { message: 'Invalid' } })
    setup()
    await fillAndSubmit()
    expect(await screen.findByText(/Identifiants incorrects/)).toBeInTheDocument()
  })

  it('starts the Google sign-in with the requested page as callback', async () => {
    signInSocial.mockResolvedValue({})
    setup()
    await userEvent.click(screen.getByRole('button', { name: 'Continuer avec Google' }))
    expect(signInSocial).toHaveBeenCalledWith({
      provider: 'google',
      callbackURL: `${window.location.origin}/dashboard`,
    })
  })
})
