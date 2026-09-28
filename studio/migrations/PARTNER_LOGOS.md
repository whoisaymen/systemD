# Partner SVG assets

The four monochrome logos are in `frontend/public/assets/partners/`. Every mark
and letter is vector geometry; there are no embedded bitmaps, external fonts,
scripts, or linked resources. Fills use `currentColor` and backgrounds are transparent.

Sources, inspected 2026-09-20:

- **Pianofabriek:** traced the alpha silhouette of the existing Studio asset
  `image-dc56d8064ebbcf3e8b0c88272eec6a0befdf7f57-356x438-png` with Potrace 1.16
  (`--turdsize 2 --opttolerance 0.15`). The website's SVG uses a different symbol
  and horizontal arrangement, so it was not substituted.
- **Vlaanderen:** extracted vector paths from the PDF in the
  [official download](https://www.vlaanderen.be/brussel/subsidies/projectsubsidies-vlaanderen-brussel/logo).
  Removed the opaque right background, retained the trapezoid with a transparent
  lion cutout, and made the wordmark and trapezoid inherit the same color.
- **Saint-Gilles:** extracted the original inline SVG from the
  [municipal website](https://stgilles.brussels/), replacing the screenshot.
- **KVS:** traced the alpha silhouette of the existing Studio asset
  `image-b75dd152f98ffda6b2f9734329040d29da231a61-1255x1415-png` with the same Potrace
  settings. The [current press kit](https://www.kvs.be/fr/professionals-page)
  contains a different KVS/BXL design, so the existing handwritten mark is preserved.

All four SVGs were optimized with SVGO and visually checked. The frontend uses
the SVG asset's alpha channel as a CSS mask colored by `var(--color-primary)`. This lets
Studio retain its standard image uploader and thumbnail previews, avoids inline
HTML injection, and works with every theme. Existing raster entries still render
through the image fallback; new uploads in the partner logo field accept SVGs.
The About page fetches current CMS content without a response cache so replaced
assets do not remain stuck on their previous raster versions.

Run from the repository root:

```sh
node --import tsx studio/migrations/vectorizePartnerLogos.ts
node --import tsx studio/migrations/vectorizePartnerLogos.ts --apply
```

The migration checks original asset IDs before replacing anything, saves a local
backup, uploads each SVG once, and uses revision-guarded patches for only the logo
fields. It preserves names, links, order, and draft/published status. Rerunning it
with the same files is a no-op. Original raster assets remain available in Sanity.
