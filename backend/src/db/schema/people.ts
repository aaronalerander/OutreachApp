import { sql } from "drizzle-orm";
import { check, foreignKey, pgTable, text } from "drizzle-orm/pg-core";
import { entities, entityType } from "#src/db/schema/entities.js";

/**
 * people: A Person
 *
 * Changelog:
 * - 2026-09-12 (0000_add_entity_tables): Created.
 */
export const people = pgTable(
  "people",
  {
    /**Parent Entity. See Entity Table For Details */
    entityId: text().primaryKey(),

    /** Always PERSON; you never set it. Lets the database check this row's entity is really a person. */
    entityType: entityType().notNull().default("PERSON"),

    /** First name, e.g. "Jane". */
    firstName: text().notNull(),

    /** Last name, e.g. "Doe". */
    lastName: text().notNull(),
  },
  (t) => [
    check("people_entity_type_is_person", sql`${t.entityType} = 'PERSON'`),
    foreignKey({
      columns: [t.entityId, t.entityType],
      foreignColumns: [entities.id, entities.type],
    }).onDelete("cascade"),
  ],
);
