import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { RegisterPage } from './RegisterPage'

const { signInSocial } = vi.hoisted(() => ({ signInSocial: vi.fn() }))
vi.mock('../lib/auth-client', () => ({ authClient: { signIn: { social: signInSocial } } }))

function setup() {
  render(
    <MemoryRouter initialEntries={['/register']}>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<p>Page de connexion</p>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('RegisterPage', () => {
  it('validates empty and whitespace-only names and associates errors with fields', async () => {
    setup()
    await userEvent.type(screen.getByLabelText('Prénom'), '   ')
    await userEvent.type(screen.getByLabelText('Nom'), '   ')
    await userEvent.click(screen.getByRole('button', { name: 'Créer mon compte' }))
    expect(screen.getByLabelText('Prénom')).toHaveAccessibleDescription(
      'Veuillez saisir votre prénom.',
    )
    expect(screen.getByLabelText('Nom')).toHaveAccessibleDescription('Veuillez saisir votre nom.')
    expect(screen.getByLabelText('Email')).toHaveAccessibleDescription(
      'Veuillez saisir une adresse email valide.',
    )
    expect(screen.getByLabelText('Mot de passe')).toHaveAccessibleDescription(
      'Le mot de passe doit contenir au moins 8 caractères.',
    )
    expect(screen.getByLabelText('Prénom')).toHaveAttribute('aria-invalid', 'true')
  })

  it('rejects invalid email and short password, then accepts valid fields without signing up', async () => {
    setup()
    await userEvent.type(screen.getByLabelText('Prénom'), 'Alice')
    await userEvent.type(screen.getByLabelText('Nom'), 'Martin')
    await userEvent.type(screen.getByLabelText('Email'), 'alice@invalid')
    await userEvent.type(screen.getByLabelText('Mot de passe'), '1234567')
    await userEvent.click(screen.getByRole('button', { name: 'Créer mon compte' }))
    expect(screen.getAllByRole('alert')).toHaveLength(2)
    await userEvent.clear(screen.getByLabelText('Email'))
    await userEvent.type(screen.getByLabelText('Email'), 'alice@example.fr')
    await userEvent.type(screen.getByLabelText('Mot de passe'), '8')
    await userEvent.click(screen.getByRole('button', { name: 'Créer mon compte' }))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Créer un compte' })).toBeInTheDocument()
  })

  it('allows choosing client or artisan', async () => {
    setup()
    const client = screen.getByRole('radio', { name: 'Client' })
    const artisan = screen.getByRole('radio', { name: 'Artisan' })
    expect(client).toBeChecked()
    await userEvent.click(artisan)
    expect(artisan).toBeChecked()
    expect(client).not.toBeChecked()
    await userEvent.click(client)
    expect(client).toBeChecked()
  })

  it('links to login', async () => {
    setup()
    await userEvent.click(screen.getByRole('link', { name: 'Se connecter' }))
    expect(screen.getByText('Page de connexion')).toBeInTheDocument()
  })

  it('explains that Google is unavailable and does not start OAuth', async () => {
    setup()
    const button = screen.getByRole('button', { name: 'Continuer avec Google' })
    expect(button).toBeDisabled()
    expect(button).toHaveAccessibleDescription(
      "La connexion avec Google n'est pas encore disponible.",
    )
    await userEvent.click(button)
    expect(signInSocial).not.toHaveBeenCalled()
  })
})
