# Deployment

The repository contains two independently deployed apps. Create two Vercel
projects connected to the same GitHub repository.

| Vercel project | Root Directory | Framework |
| --- | --- | --- |
| System D frontend | `frontend` | Next.js |
| System D Studio | `studio` | Other |

Keep **Include source files outside of the Root Directory in the Build Step**
enabled for both projects. Vercel then uses the workspace definitions and the
root `package-lock.json` when installing dependencies.

## Frontend

Use the following Vercel settings:

- Root Directory: `frontend`
- Framework Preset: Next.js
- Build Command: use the project default (`npm run build`)
- Output Directory: use the project default
- Node.js Version: 22.x

Set these environment variables for Production, Preview, and Development unless
a different scope is noted:

```dotenv
NEXT_PUBLIC_BASE_URL=https://www.example.com
NEXT_PUBLIC_SANITY_PROJECT_ID=s7yacqk1
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-12-01
NEXT_PUBLIC_SANITY_STUDIO_URL=https://studio.example.com
SANITY_API_READ_TOKEN=
SANITY_API_WRITE_TOKEN=
```

`SANITY_API_READ_TOKEN` is required for draft mode and uncached preview queries.
`SANITY_API_WRITE_TOKEN` is required by the film submission API route. Both are
server-only secrets and must be entered as sensitive values in Vercel.

`NEXT_PUBLIC_GITHUB_TOKEN` is optional. Do not use a private token here: values
with the `NEXT_PUBLIC_` prefix are included in browser assets.

## Studio

Use the following Vercel settings:

- Root Directory: `studio`
- Framework Preset: Other
- Build Command: `npm run build`
- Output Directory: `dist`
- Node.js Version: 22.x

Set these environment variables:

```dotenv
SANITY_STUDIO_PROJECT_ID=s7yacqk1
SANITY_STUDIO_DATASET=production
SANITY_STUDIO_API_VERSION=2024-12-01
SANITY_STUDIO_PREVIEW_URL=https://www.example.com
```

The `SANITY_STUDIO_*` values are compiled into the Studio's browser bundle, so
they must not contain secrets. `SANITY_STUDIO_HOST` is only needed when using
Sanity's own `sanity deploy` hosting and is not needed on Vercel.

The Studio's `vercel.json` sends non-file routes to `index.html`, which is
required when a Studio route is opened or refreshed directly.

## First Deployment

1. Import the repository as the frontend project and select `frontend`.
2. Import the same repository again as the Studio project and select `studio`.
3. Add the environment variables above, then deploy both projects.
4. Replace the example URLs with the final production domains and redeploy.
5. In the Sanity project settings, add the frontend and Studio production
   origins to CORS. Enable credentials for the frontend origin used by Visual
   Editing.

After both projects are connected, each GitHub push can deploy both apps. Vercel
can skip a project automatically when its workspace and dependencies were not
affected by a commit.
