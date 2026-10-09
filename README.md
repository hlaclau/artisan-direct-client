# ArtisansDirect – Client

> **Fictional school project** for the _Front/Back Coordination_ course at Ynov. The assignment requires the project to be split into two repositories: this one (front-end) and [artisan-direct-api](https://github.com/hlaclau/artisan-direct-api) (back-end).

Front-end of **ArtisansDirect**, a platform connecting clients with craftspeople: artisan search, service requests, quotes, scheduling, payment and reviews.

## Stack

- [Bun](https://bun.sh) – runtime and package manager
- [React](https://react.dev) + [Vite](https://vite.dev) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com)
- [Vitest](https://vitest.dev) + [Testing Library](https://testing-library.com)
- [Oxlint](https://oxc.rs) (lint) and [Prettier](https://prettier.io) (format)
- [Lefthook](https://lefthook.dev) + [commitlint](https://commitlint.js.org) (git hooks)
- [mise](https://mise.jdx.dev) – tool versions and tasks

## Getting started

1. Install [mise](https://mise.jdx.dev/getting-started.html)
2. Clone the repository and install everything:

```sh
git clone git@github.com:hlaclau/artisan-direct-client.git
cd artisan-direct-client
mise trust
mise install      # installs the pinned Bun version
mise run install  # installs dependencies and git hooks
```

3. Start the dev server:

```sh
mise run dev
```

The app runs on http://localhost:5173.

## Tasks

Run `mise tasks` to list them all.

| Command               | Description                                    |
| --------------------- | ---------------------------------------------- |
| `mise run install`    | Install dependencies and git hooks             |
| `mise run dev`        | Start the dev server                           |
| `mise run build`      | Type-check and build for production            |
| `mise run lint`       | Lint with oxlint                               |
| `mise run lint:fix`   | Lint and auto-fix                              |
| `mise run fmt`        | Format with Prettier                           |
| `mise run fmt:check`  | Check formatting                               |
| `mise run typecheck`  | Type-check with tsc                            |
| `mise run test`       | Run tests once                                 |
| `mise run test:watch` | Run tests in watch mode                        |
| `mise run check`      | Lint + format check                            |
| `mise run ci`         | Lint, format check, typecheck, tests and build |

## Git hooks

Installed by `mise run install` through Lefthook:

- **pre-commit**: lints and formats staged files (fixes are re-staged automatically)
- **commit-msg**: rejects messages that don't follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)

## Tests

Tests live next to the code as `*.test.tsx` and run in jsdom. Jest-dom matchers (`toBeInTheDocument`, `toHaveTextContent`, …) are available via `src/test/setup.ts`.

## CI

GitHub Actions runs lint, format, typecheck, test and build as parallel jobs on every Pull Request and on `master`. Run `mise run ci` locally to run them all before pushing.

## Links

- Jira: [ADP – ArtisansDirect Platform](https://ynov-coordination-front-back.atlassian.net/jira/software/projects/ADP)
- Back-end: [artisan-direct-api](https://github.com/hlaclau/artisan-direct-api)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for branch, commit and Pull Request conventions.
