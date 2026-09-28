# Deployment

The frontend deploys automatically to the existing `system-d` Vercel project
when a branch is pushed to GitHub. The `v1` branch creates Preview deployments;
`main` remains the Production branch. Sanity Studio is deployed separately to
Sanity hosting with the Sanity CLI.

## Frontend on Vercel

The existing `system-d` project needs these settings after the repository split:

- Root Directory: `frontend`
- Framework Preset: Next.js
- Install Command: defined in `frontend/vercel.json` as `npm install --global npm@12.0.2 && npm ci`
- Build Command: use the project default (`npm run build`)
- Output Directory: use the project default
- Node.js Version: 24.x (at least 24.15.0, matching the engine requirement)
- Include source files outside the Root Directory: enabled

Vercel chooses the Node 24 patch release on its build image; confirm the version
in the deployment log satisfies the engine requirement. The custom install
command selects the same npm version as local development and CI, and `npm ci`
uses the workspace lockfile from the repository root.

Set these environment variables in the existing Vercel project:

```dotenv
NEXT_PUBLIC_BASE_URL=https://YOUR-FRONTEND-DOMAIN
NEXT_PUBLIC_SANITY_PROJECT_ID=s7yacqk1
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-12-01
NEXT_PUBLIC_SANITY_STUDIO_URL=https://systemd.sanity.studio
SANITY_API_READ_TOKEN=
SANITY_API_WRITE_TOKEN=
```

`SANITY_API_READ_TOKEN` is required for frontend startup and builds, draft mode,
and live preview. Use a token with the Viewer role: Sanity Live can send this
token to browsers in authenticated preview sessions. `SANITY_API_WRITE_TOKEN` is
required by the film submission API route and must remain server-only. Store both
as sensitive environment values in Vercel, with no `NEXT_PUBLIC_` prefix.

`GITHUB_TOKEN` is optional and used only on the server for GitHub stargazer data.
Rename the previous `NEXT_PUBLIC_GITHUB_TOKEN` variable to `GITHUB_TOKEN` in
existing environments.

Use the root `package-lock.json` and npm 12.0.2, matching the root
`packageManager` field. From a clean local checkout, run `npm ci`, `npm run check`,
and `npm run build` with the configured environment before deploying. The
frontend build needs access to Sanity to load redirects and page content.

The GitHub Actions workflow checks lint, types, tests, and the Studio build
without deployment credentials. Frontend build validation uses the Vercel
Preview deployment environment. Keep the read token available in both Preview
and Production environment scopes.

Once the Root Directory is updated, the normal deployment flow is:

```sh
git push origin v1
```

Vercel will build and deploy `frontend/` from that push just as it did before the
repository split.

## Studio on Sanity

Configure the Studio locally in `studio/.env.local`:

```dotenv
SANITY_STUDIO_PROJECT_ID=s7yacqk1
SANITY_STUDIO_DATASET=production
SANITY_STUDIO_API_VERSION=2024-12-01
SANITY_STUDIO_PREVIEW_URL=https://systemd.brussels
SANITY_STUDIO_HOST=systemd
```

Deploy it from the repository root:

```sh
npm run deploy:studio
```

This runs `sanity deploy --yes` inside the `studio` workspace and updates
`https://systemd.sanity.studio`.

Add the final frontend and `https://systemd.sanity.studio` origins to the Sanity
project's CORS settings. Enable credentials for the frontend origin used by
Visual Editing.

The hosted Studio uses the root path on `systemd.sanity.studio`, without `/studio`.
Production Studio builds default the Editor preview to `https://systemd.brussels`;
local development defaults to `http://localhost:3000`. Override it with
`SANITY_STUDIO_PREVIEW_URL` when previewing a different frontend deployment.
The Editor previews the website; Vision is the GROQ query tool.
