# System D frontend

This directory contains the Next.js application, shared components, Sanity
queries, and localized routes. The frontend belongs to the root npm workspace.

Follow the [repository setup guide](../../README.md) for the supported runtime,
environment variables, development commands, and validation workflow. See
[Deployment](../../DEPLOYMENT.md) for Vercel configuration.

Local development adds fifteen sample festival events (including ten in September) from
`content/festivalMockEvents.ts`, using existing archive images and translated
copy. They cover multiple events on one day, long titles, portrait and landscape
photographs in September, and events spanning several days or months.
Published CMS events remain alongside the samples.
Set `FESTIVAL_MOCK_EVENTS=false` to hide them. Production builds never add them.
