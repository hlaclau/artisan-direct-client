import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      // `include` makes untested files under src count at 0%
      include: ['src/**'],
      exclude: [
        'src/**/*.{test,spec}.*',
        'src/**/*.d.ts',
        'src/test/**',
        'src/**/__generated__/**',
        'src/**/*.generated.*',
        'src/**/*.css',
      ],
      reporter: ['text', 'lcov', 'json-summary', 'json'],
    },
  },
})
