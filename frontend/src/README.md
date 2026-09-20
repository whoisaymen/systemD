# System D frontend

The About page's interactive map uses MapLibre and OpenFreeMap vector tiles,
with the site's active colour palette. No API key is required. Its default
centre is Pianofabriek (rue du Fort / Fortstraat 35); coordinates and styling
live in `components/fabrique/brusselsMapStyle.ts`. The directions link still
comes from the contact document in Sanity. Controls and gesture hints are
translated in `messages/{fr,nl,en}.json`. The original SVG remains a fallback
when WebGL or map tiles are unavailable.

The frontend `predev`, `predev:turbopack`, and `prebuild` scripts copy MapLibre's
worker and shared module from the installed package into the ignored
`public/vendor/maplibre/` directory. Run development and builds through npm
so these assets are prepared for both Next.js bundlers.

This directory contains the Next.js application, shared components, Sanity
queries, and localized routes. The frontend belongs to the root npm workspace.

Follow the [repository setup guide](../../README.md) for the supported runtime,
environment variables, development commands, and validation workflow. See
[Deployment](../../DEPLOYMENT.md) for Vercel configuration.

The festival calendar reads its events and event types from Sanity in all
environments. The fifteen former preview events are now temporary CMS demo
content, with translations and existing archive photographs. See the
[demo seed instructions](../../studio/migrations/FESTIVAL_DEMO.md) to seed or
remove them later.

In Studio, **Big Bang → Short story → Contenu de la page** contains separate,
reorderable text and illustration blocks. The page follows this saved order.
Illustration names are Studio-only; each illustration’s width is saved on its
block, so moving it does not change its size.

For an older dataset, run `npm run migrate:bigbang-story:dry --workspace=studio`
from the repository root to review the conversion, then
`npm run migrate:bigbang-story --workspace=studio` to apply it. The migration
backs up originals in `studio/backups`, preserves each draft and published
version independently, and can be rerun without rearranging edited blocks.
