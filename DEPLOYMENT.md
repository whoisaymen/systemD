# Deployment

The frontend deploys automatically to the existing `system-d` Vercel project
when a branch is pushed to GitHub. The `v1` branch creates Preview deployments;
`main` remains the Production branch. Sanity Studio is deployed separately to
Sanity hosting with the Sanity CLI.

## Frontend on Vercel

The existing `system-d` project needs these settings after the repository split:

- Root Directory: `frontend`
- Framework Preset: Next.js
- Build Command: use the project default (`npm run build`)
- Output Directory: use the project default
- Node.js Version: 22.x
- Include source files outside the Root Directory: enabled

Set these environment variables in the existing Vercel project:

```dotenv
NEXT_PUBLIC_BASE_URL=https://YOUR-FRONTEND-DOMAIN
NEXT_PUBLIC_SANITY_PROJECT_ID=s7yacqk1
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-12-01
NEXT_PUBLIC_SANITY_STUDIO_URL=https://YOUR-STUDIO.sanity.studio
SANITY_API_READ_TOKEN=
SANITY_API_WRITE_TOKEN=
```

`SANITY_API_READ_TOKEN` is required for draft mode and uncached preview queries.
`SANITY_API_WRITE_TOKEN` is required by the film submission API route. Both must
remain server-only sensitive values in Vercel.

`NEXT_PUBLIC_GITHUB_TOKEN` is optional. Do not use a private token here because
values with the `NEXT_PUBLIC_` prefix are included in browser assets.

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
SANITY_STUDIO_PREVIEW_URL=https://YOUR-FRONTEND-DOMAIN
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
