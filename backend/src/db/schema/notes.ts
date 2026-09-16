import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { newId } from "#src/db/ids.js";

/**
 * notes: A note
 *
 * Changelog:
 * - 2026-09-12 (0000_add_entity_tables): Created.
 */
export const notes = pgTable("notes", {
  /** Unique ID for the Note */
  id: text().primaryKey().$defaultFn(() => newId("note")),

  /** When the note was created at */
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),

  /** The note itself. */
  text: text().notNull(),
});
