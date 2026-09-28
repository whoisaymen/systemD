# System D

The System D website and Sanity Studio share an npm workspace and one lockfile.

- `frontend/`: Next.js website in French, Dutch, and English.
- `studio/`: Sanity content editor, schemas, and content migrations.
- [CMS content guide](CMS-CONTENT.md): editing and migrating existing content.
- [Deployment guide](DEPLOYMENT.md): Vercel and Sanity hosting configuration.

## Local setup

Use the recommended Node.js **24.21.0** and npm **12.0.2**. The supported runtime
is Node 24 LTS, at least **24.15.0**; other Node major versions are not supported.
The Node version is recorded in `.nvmrc` and `.node-version`; npm is recorded in
`package.json` under `packageManager`.

From the repository root:

```sh
nvm install
nvm use
npm install --global npm@12.0.2
npm ci
```

Other Node version managers can use `.node-version`. Install dependencies from
the repository root; workspace dependencies and `package-lock.json` are managed
together. Use `npm ci` for an existing checkout and `npm install` when deliberately
updating dependencies.

On first setup, create the local environment files from the examples (keep any
existing `.env.local` files):

```sh
cp -n frontend/.env.example frontend/.env.local
cp -n studio/.env.example studio/.env.local
```

Fill in `SANITY_API_READ_TOKEN` in `frontend/.env.local` with a Sanity token that
has the Viewer role. The frontend currently requires this token to start and
build, and Sanity Live can send it to browsers in authenticated preview sessions.
Keep write permissions on a separate `SANITY_API_WRITE_TOKEN`, used only by the
film submission server route. The write token is needed to accept submissions;
ordinary page browsing does not need it. Never put a write token in a
`NEXT_PUBLIC_*` or `SANITY_STUDIO_*` variable or commit local environment files.

The example project and dataset point at the existing System D CMS. Ask a project
maintainer for access and the required token; copying the example does not create
a local dataset. Use a separate dataset for content changes that should not affect
the live site.

```sh
npm run dev
```

The website runs at [localhost:3000](http://localhost:3000), and Studio runs at
[localhost:3333](http://localhost:3333). Add these origins to the Sanity project's
CORS settings with credentials enabled for preview. Set the Studio preview URL
and the frontend Studio URL to the corresponding local addresses, as shown in the
environment examples.

## Commands

Run these from the repository root:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the frontend and Studio together |
| `npm run dev:next` | Start only the frontend |
| `npm run dev:studio` | Start only Studio |
| `npm run lint` | Lint both workspaces |
| `npm run typecheck` | Check TypeScript in both workspaces |
| `npm test` | Run the frontend and CMS regression tests |
| `npm run check` | Run lint, type checking, and tests |
| `npm run build` | Build the frontend and Studio |
| `npm start` | Serve the built frontend |

The frontend build reads redirects and page content from Sanity, so it needs a
working network connection and the frontend environment values. CI runs the
checks and Studio build without private credentials. Vercel builds the frontend
using its configured environment; see [Deployment](DEPLOYMENT.md).

The Sanity API date in the environment files is intentionally pinned independently
of package versions. Updating dependencies does not require changing that date.
The optional GitHub stargazer token is now server-only: rename any existing
`NEXT_PUBLIC_GITHUB_TOKEN` environment variable to `GITHUB_TOKEN`.

## Compatibility choices

Dependencies are kept on current compatible releases. These major versions are
intentional until their integrations are migrated together:

| Dependency | Supported line | Compatibility reason |
| --- | --- | --- |
| Node.js | 24 LTS, at least 24.15 | Shared local, CI, and deployment runtime; local/CI pin 24.21 |
| TypeScript | 6.0 | Current lint tooling requires TypeScript below 6.1; TypeScript 7 also changes compiler APIs |
| ESLint | 9 | Next.js's React, import, and accessibility plugins support ESLint through version 9 |
| Sanity ESLint config | 6 | Version 7 requires ESLint 10 |
| Tailwind CSS | 3.4 | Existing custom styles and plugins use Tailwind 3 conventions |
| tailwind-merge | 2.6 | Matches the Tailwind 3 class system; version 3 targets Tailwind 4 |

The root `overrides` pin four security fixes inside Sanity's CLI dependencies:
`adm-zip` 0.6.1, `js-yaml` 3.15.2, `smol-toml` 1.8.0, and `uuid` 11.1.1.
They are scoped to the affected parent packages. Keep `js-yaml` on version 3
because its caller uses `safeLoad`, and UUID on version 11 because its caller
needs CommonJS support. Recheck these pins when the upstream packages update;
do not use `npm audit fix --force`, which currently proposes downgrading Sanity.

The frontend declares `ajv` and `yup` as optional dependencies to satisfy the
current form resolver's optional peers. npm 12 otherwise reuses incompatible
Studio/linter copies after a clean install. Form validation continues to use Zod.

## Making changes

See [Contributing](CONTRIBUTING.md) for the validation and dependency update
workflow. Content migration commands can modify the shared dataset; use their
dry-run variants and follow [CMS-CONTENT.md](CMS-CONTENT.md) before applying them.
