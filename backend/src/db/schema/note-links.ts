import { pgTable, primaryKey, text } from "drizzle-orm/pg-core";
import { entities } from "#src/db/schema/entities.js";
import { notes } from "#src/db/schema/notes.js";

/**
 * note_links: attaches a note to an entity (eg: Person or Company)
 * 
 * Changelog:
 * - 2026-09-12 (0000_add_entity_tables): Created.
 */
export const noteLinks = pgTable(
  "note_links",
  {
    /** The the entity the note is linked to */
    entityId: text()
      .notNull()
      .references(() => entities.id, { onDelete: "cascade" }),

    /** The ID of the note. (Foreign key)*/
    noteId: text()
      .notNull()
      .references(() => notes.id, { onDelete: "cascade" }),
  },
  // The pair is the key, so a note can't be linked to the same entity twice.
  (t) => [primaryKey({ columns: [t.entityId, t.noteId] })],
);
