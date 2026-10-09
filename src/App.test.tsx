import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'

describe('App', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => null,
      }),
    )
  })

  it("affiche le titre de la page d'accueil", () => {
    render(<App />)
    expect(screen.getByText(/Page d'accueil/i)).toBeInTheDocument()
  })
})
