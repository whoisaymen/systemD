# CMS content wiring

The existing page layouts are preserved. Editable prose uses Portable Text, including bold, italics, links, lists and headings. Plain strings remain for URLs, image descriptions, identifiers and native form controls that cannot render markup.

| Studio location | Frontend content |
| --- | --- |
| Page d’accueil | Homepage video upload or direct URL; the original clip is stored as a Sanity video asset |
| Le Festival → Notre vision | One rich-text editor per vision item, including its heading |
| Le Festival → Blocs | Existing text panels, jury, event calendar and teaser media |
| Événements → Type d’événement | Optional label above the event-detail title; choose or create a reusable type under Types d’événements, with names in French, English and Dutch |
| Big Bang → Short / Long story | Existing story blocks, quotes, captions and tab labels |
| La Mémoire | Rich introduction and existing edition list |
| La Fabrique | Existing introduction, action accordions, supporting copy and text below the animated collage |
| Festivals → Description | Complete edition overview in one rich-text editor per language; the opening can use « Titre de niveau 2 », followed by « Normal » paragraphs |
| Festivals | Existing section labels, films, jury, venue and exhibition/gallery credits |
| L’Équipe, Films, Genres | Existing names, biographies, film copy, credits and taxonomy labels |
| Contact | Existing address, accordion labels and map link |
| Soumissions de films → Formulaire de participation | Existing application-form copy |

Festival editions use only `description` for their overview. The former `text` field is merged into it, preserving translations and inline formatting. The 2023 opening uses `h2` (bold, 1.7 times the body size on edition pages), and the rest uses normal paragraphs. To review or apply this migration from the repository root, run `node --import tsx studio/migrations/mergeFestivalDescription.ts`, adding `--apply` to save. It backs up originals, checks document revisions, and handles drafts separately from published copy.

Unused controls have been removed instead of adding new visible sections. Mémoire has no separate introduction title; customers add headings in its rich-text editor. Festival vision headings are merged into the corresponding rich body. Graphic wordmarks and decorative animations remain design assets.

## Validation

```sh
npm run test:cms --workspace=frontend
npm run typecheck
npm run build:next
npm run build:studio
```

Verified: 14 CMS tests, workspace type checks, the frontend production build, and the Studio production bundle. Studio schema validation reports no errors or warnings, and all 13 main content documents pass document validation. The latest editorial migration dry run reports no pending changes.

The Studio bundle was also checked with `sanity build --no-auto-updates` when the remote auto-update service had a TLS connection failure. A dataset-wide check still identifies older unfinished film, jury and navigation drafts with missing required metadata; these are separate from the removed-field warnings addressed here.

## Data migration and release

The migration accepts legacy strings, locale-keyed objects, and existing rich text. It preserves formatting, locales, identifiers and references, seeds only missing controls from existing visible copy, and removes retired fields from migrated documents. Revision guards protect concurrent edits. The homepage media connection is saved directly in its CMS document; there is no hardcoded video fallback. Backups are stored in the ignored `studio/backups/` directory.

```sh
# Review or update Studio drafts without changing the published site
npm run migrate:editorial:dry --workspace=studio
npm run migrate:editorial:drafts --workspace=studio
```

Drafts are intentionally separate from published content. Release the compatible frontend and Studio before publishing migrated drafts. To convert remaining published documents after that release:

```sh
npm run migrate:editorial:release:dry --workspace=studio
npm run migrate:editorial:release --workspace=studio
```

The script uses existing Sanity CLI authentication or the server token from the local frontend environment. It never prints credentials. It can be rerun safely after interruption; already migrated documents are skipped. Backups record both the original document and whether a new draft was created, so originals remain recoverable.

## Styles des titres

Le style de texte enrichi « Titre en étiquette » reprend les titres centrés sur fond coloré, avec une rotation alternée sur les lignes. Il conserve les caractères gras, italiques et les liens. Les anciens titres des éléments de vision utilisent ce style dans leur champ de contenu. L’intitulé du bouton « Notre vision » est un simple texte traduit (`visionTitle`).

Le formulaire est géré dans le document unique `filmSubmissionSettings`, sous « Soumissions de films », à côté de « Films reçus ». La page `/apply` lit ce document. La migration `npm run migrate:form-settings --workspace studio` transfère les textes depuis `site`, conserve séparément les brouillons et les publications, sauvegarde les originaux et retire le champ source après copie vérifiée. Les thèmes restent accessibles dans Réglages.
