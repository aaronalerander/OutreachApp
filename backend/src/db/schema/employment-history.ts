import { date, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { newId } from "#src/db/ids.js";
import { companies } from "#src/db/schema/companies.js";
import { people } from "#src/db/schema/people.js";

/**
 * employment_history: a job a person held at a company.
 *
 * Dates come in two kinds: confirmed (we know it for sure) and estimated (our
 * best guess), because exact dates often aren't known.
 *
 * Changelog:
 * - 2026-09-12 (0000_add_entity_tables): Created.
 */
export const employmentHistory = pgTable("employment_history", {
  /** Unique id for this job record, e.g. "employment_01j8x2k5m9qtw3v7c4f6hnrzye". Generated automatically. */
  id: text().primaryKey().$defaultFn(() => newId("employment")),

  /** The person who held the job. */
  personEntityId: text()
    .notNull()
    .references(() => people.entityId, { onDelete: "cascade" }),

  /** The company they worked at. */
  companyEntityId: text()
    .notNull()
    .references(() => companies.entityId, { onDelete: "cascade" }),

  /** Job title, e.g. "Software Engineer". */
  title: text().notNull(),

  /** When this record was added to our database. */
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),

  /** Start date we know for sure. Empty if we don't know it. */
  confirmedStart: date(),

  /** Our best guess at the start date. Required. */
  estimatedStart: date().notNull(),

  /** End date we know for sure. Empty if we don't know it, or the job is current. */
  confirmedEnd: date(),

  /** Our best guess at the end date. Empty if we have no estimate, e.g. the job is current. */
  estimatedEnd: date(),
});
