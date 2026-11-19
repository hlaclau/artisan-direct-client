import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { RegisterPage } from './RegisterPage'

const { signInSocial, signUpEmail, getSession, refetch, useAuth, useSession } = vi.hoisted(() => ({
  signInSocial: vi.fn(),
  signUpEmail: vi.fn(),
  getSession: vi.fn(),
  refetch: vi.fn(),
  useAuth: vi.fn(),
  useSession: vi.fn(),
}))
vi.mock('../lib/auth-client', () => ({
  authClient: { signIn: { social: signInSocial }, signUp: { email: signUpEmail }, getSession },
  useSession,
}))
vi.mock('../context/useAuth', () => ({ useAuth }))

function setup() {
  render(
    <MemoryRouter initialEntries={['/register']}>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<p>Page de connexion</p>} />
        <Route path="/dashboard" element={<p>Tableau de bord</p>} />
      </Routes>
    </MemoryRouter>,
  )
}

async function fillForm() {
  await userEvent.type(screen.getByLabelText('Prénom'), ' Alice ')
  await userEvent.type(screen.getByLabelText('Nom'), ' Martin ')
  await userEvent.type(screen.getByLabelText('Email'), 'alice@example.fr')
  await userEvent.type(screen.getByLabelText('Mot de passe'), '12345678')
}

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    useAuth.mockReturnValue({ user: null, isPending: false })
    signUpEmail.mockResolvedValue({ data: { user: { id: '1' } }, error: null })
    getSession.mockResolvedValue({ data: { user: { id: '1' }, session: { id: 's' } }, error: null })
    refetch.mockResolvedValue(undefined)
    useSession.mockReturnValue({
      refetch,
      data: { user: { id: '1' }, session: { id: 's' } },
      isPending: false,
      isRefetching: false,
      error: null,
    })
  })

  it('serializes signupRole in the real Better Auth request body', async () => {
    const { createAuthClient } = await import('better-auth/react')
    const fetchRequest = vi.fn(async (_url: RequestInfo | URL, _init?: RequestInit) =>
      Response.json({ user: { id: '1' }, token: 'token' }),
    )
    const client = createAuthClient({
      baseURL: 'http://localhost:3000',
      fetchOptions: { customFetchImpl: fetchRequest },
    })
    const payload = {
      name: 'Alice Martin',
      email: 'alice@example.fr',
      password: '12345678',
      signupRole: 'worker',
    }
    await client.signUp.email(payload)
    expect(JSON.parse(String(fetchRequest.mock.calls[0][1]?.body))).toMatchObject(payload)
  })
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

  it('rejects invalid email and short password before submitting valid fields', async () => {
    setup()
    await userEvent.type(screen.getByLabelText('Prénom'), 'Alice')
    await userEvent.type(screen.getByLabelText('Nom'), 'Martin')
    await userEvent.type(screen.getByLabelText('Email'), 'alice@invalid')
    await userEvent.type(screen.getByLabelText('Mot de passe'), '1234567')
    await userEvent.click(screen.getByRole('button', { name: 'Créer mon compte' }))
    expect(screen.getAllByRole('alert')).toHaveLength(2)
    expect(signUpEmail).not.toHaveBeenCalled()
    await userEvent.clear(screen.getByLabelText('Email'))
    await userEvent.type(screen.getByLabelText('Email'), 'alice@example.fr')
    await userEvent.type(screen.getByLabelText('Mot de passe'), '8')
    await userEvent.click(screen.getByRole('button', { name: 'Créer mon compte' }))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Créer un compte' })).toBeInTheDocument()
  })

  it.each([
    ['Client', 'customer'],
    ['Artisan', 'worker'],
  ])('transmits the %s role as %s', async (label, role) => {
    useAuth.mockReturnValue({ user: { id: '1' }, isPending: false })
    setup()
    await fillForm()
    await userEvent.click(screen.getByRole('radio', { name: label }))
    await userEvent.click(screen.getByRole('button', { name: 'Créer mon compte' }))
    expect(signUpEmail).toHaveBeenCalledWith({
      name: 'Alice Martin',
      email: 'alice@example.fr',
      password: '12345678',
      signupRole: role,
    })
    expect(await screen.findByText('Tableau de bord')).toBeInTheDocument()
    expect(getSession).toHaveBeenCalled()
    expect(refetch).toHaveBeenCalled()
  })

  it.each(['USER_ALREADY_EXISTS', 'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL'])(
    'displays a specific error for %s',
    async (code) => {
      signUpEmail.mockResolvedValue({ error: { code }, data: null })
      setup()
      await fillForm()
      await userEvent.click(screen.getByRole('button', { name: 'Créer mon compte' }))
      expect(await screen.findByRole('alert')).toHaveTextContent(
        'Cette adresse email est déjà utilisée',
      )
      expect(getSession).not.toHaveBeenCalled()
    },
  )

  it.each([0, 500, 503])('displays a safe service error for status %s', async (status) => {
    signUpEmail.mockResolvedValue({
      error: { status, message: 'private server details' },
      data: null,
    })
    setup()
    await fillForm()
    await userEvent.click(screen.getByRole('button', { name: 'Créer mon compte' }))
    expect(await screen.findByRole('alert')).toHaveTextContent(
      "Le service d'inscription est indisponible",
    )
    expect(screen.getByRole('alert')).not.toHaveTextContent('private server details')
  })

  it('displays a generic message for other API errors', async () => {
    signUpEmail.mockResolvedValue({
      error: { code: 'OTHER', status: 400, message: 'private details' },
      data: null,
    })
    setup()
    await fillForm()
    await userEvent.click(screen.getByRole('button', { name: 'Créer mon compte' }))
    expect(await screen.findByRole('alert')).toHaveTextContent("L'inscription a échoué")
    expect(screen.getByRole('alert')).not.toHaveTextContent('private details')
  })

  it('offers login without resubmitting if the refreshed session has no user', async () => {
    useSession.mockReturnValue({
      refetch,
      data: null,
      isPending: false,
      isRefetching: false,
      error: null,
    })
    setup()
    await fillForm()
    const form = screen.getByRole('button', { name: 'Créer mon compte' }).closest('form')!
    await userEvent.click(screen.getByRole('button', { name: 'Créer mon compte' }))
    expect(await screen.findByRole('alert')).toHaveTextContent(
      "Compte créé, mais la session n'a pas pu être confirmée",
    )
    expect(screen.getByRole('button', { name: 'Créer mon compte' })).toBeDisabled()
    fireEvent.submit(form)
    expect(signUpEmail).toHaveBeenCalledTimes(1)
    await userEvent.click(screen.getByRole('link', { name: 'Se connecter' }))
    expect(screen.getByText('Page de connexion')).toBeInTheDocument()
  })

  it('displays a network error', async () => {
    signUpEmail.mockRejectedValue(new Error('network'))
    setup()
    await fillForm()
    await userEvent.click(screen.getByRole('button', { name: 'Créer mon compte' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Vérifiez votre connexion')
  })

  it('does not navigate when no valid session is returned', async () => {
    getSession.mockResolvedValue({ data: null, error: null })
    setup()
    await fillForm()
    await userEvent.click(screen.getByRole('button', { name: 'Créer mon compte' }))
    expect(await screen.findByRole('alert')).toHaveTextContent(
      "la session n'a pas pu être confirmée",
    )
    expect(screen.queryByText('Tableau de bord')).not.toBeInTheDocument()
  })

  it('prevents concurrent submissions while loading', async () => {
    signUpEmail.mockImplementation(() => new Promise(() => {}))
    setup()
    await fillForm()
    const form = screen.getByRole('button', { name: 'Créer mon compte' }).closest('form')!
    fireEvent.submit(form)
    fireEvent.submit(form)
    expect(signUpEmail).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('button', { name: 'Inscription en cours...' })).toBeDisabled()
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
