# Database schema rules

Tables live in this folder, one file per table. Every table and
column is documented, and every change is explained, so the schema files double
as documentation and a change log.

**Adding a table**
- A doc comment (`/** ... */`) above the table saying what one row represents.
- A doc comment above every column saying what it holds, with an example where useful.
- A `Changelog:` section in the table's doc comment with a `Created.` entry.

**Changing a table** (adding, removing, renaming, or changing a column or constraint)
- Add a changelog entry saying what changed and **why**.
- Add or update doc comments for affected columns.

**Removing a table**
- Say why in the commit message; the file's history stays in git.

**Changelog format:** one line per change, oldest first:
```
 * Changelog:
 * - 2026-09-12 (0000_add_entity_tables): Created.
 * - 2026-10-01 (0001_add_person_headline): Added headline, to show what someone does without opening their LinkedIn.
```
The name in parentheses is the migration the change produced (the file in `backend/drizzle/`).

**Workflow**
1. Edit or add the schema file, with docs and a changelog entry.
2. In `backend/`, run `npm run db:generate -- --name describe_the_change`.
3. Put that migration's name in the changelog entry.
4. Commit the schema file and the generated migration together.

**Changes before a migration is merged:** while a migration only exists on your
branch (not merged to `main`, never deployed), fold further changes into it:
delete it, regenerate it, and keep the single changelog entry. Once merged, never
edit a migration; make a new one and add a changelog entry.

**IDs:** every id is text starting with a prefix that says what it points at,
e.g. `phone_01j8x2k9e4rw6hnb2c8yj7fzqa` (a TypeID). Prefixes live in `IdPrefix`
in `backend/src/db/ids.ts`; add one there for each new table.
- A table with its own id: `id: text().primaryKey().$defaultFn(() => newId("phone"))`.
  It's filled in automatically on insert, or you can pass your own.
- Entities are the exception: their id has no default, because the prefix depends
  on the type. Pass `newId("person")` or `newId("company")`. The database rejects
  an id whose prefix doesn't match the type.
- Columns that point at another table's id are `text()` too.

**Entity types:** a table that points at `entities` either accepts any type
(like `note_links`) or only some types (like `phones`: people and companies only).
For "only some types", store the entity's type next to its id and enforce it:
- An `entityType: entityType().notNull()` column.
- A check listing the allowed types, e.g. `sql\`${t.entityType} in ('PERSON', 'COMPANY')\``.
- A foreign key on `(entityId, entityType)` to `(entities.id, entities.type)`.

See `phones.ts`. Adding a new entity type (e.g. DEAL) means: add it to the
`entityType` enum, add its prefix to `IdPrefix`, extend the id-prefix check in
`entities.ts`, and decide which restricted tables should allow it.

Column names are camelCase in code and stored as snake_case in Postgres (`casing`
in `drizzle.config.ts` and `db/client.ts`). Schema files import each other with
`#src/...` like the rest of the backend.
