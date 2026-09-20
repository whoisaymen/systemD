# Temporary festival demo content

The former local preview samples live in `lib/festivalDemoEvents.ts`: 15 events,
six event types, English/French/Dutch copy, and references to existing Sanity
photographs. The frontend now reads only CMS events, including in development.

From the repository root, preview the seed, then apply it:

```sh
node --import tsx studio/migrations/seedFestivalDemoEvents.ts --year=2026
node --import tsx studio/migrations/seedFestivalDemoEvents.ts --year=2026 --apply
```

The script uses the dataset and server tokens from `frontend/.env.local`.
Applying creates published `event` and `eventType` documents and appends references
to the visible festival events block, including the festival draft if present.
It preserves existing content and edits to seeded documents; repeated runs do not
duplicate documents or references. Backups are saved in ignored `studio/backups/`.

In Studio, edit them under **Événements** and **Types d’événements**, or through
the festival's **Bloc événements**. Events have IDs `demo-festival-2026-*` and types
have IDs `demo-festival-event-type-*` so they remain identifiable after edits.

To remove the 2026 demo later, preview and then apply:

```sh
node --import tsx studio/migrations/seedFestivalDemoEvents.ts --year=2026 --remove
node --import tsx studio/migrations/seedFestivalDemoEvents.ts --year=2026 --remove --apply
```

Cleanup unlinks the seeded events from festival blocks and deletes their published
and draft documents. It removes demo types only if no other content uses them,
and keeps existing events and image assets. If a demo event is used elsewhere,
cleanup stops and lists the documents to unlink first. Cleanup also deletes edits
made to demo events, so keep the preview step when preparing the real content.
