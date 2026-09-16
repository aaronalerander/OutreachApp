import { sql } from "drizzle-orm";
import { check, foreignKey, pgTable, text } from "drizzle-orm/pg-core";
import { newId } from "#src/db/ids.js";
import { entities, entityType } from "#src/db/schema/entities.js";

/**
 * phones: A phone number.
 
 * Changelog:
 * - 2026-09-12 (0000_add_entity_tables): Created.
 */
export const phones = pgTable(
  "phones",
  {
    /** Unique ID for Row */
    id: text().primaryKey().$defaultFn(() => newId("phone")),

    /** The number. Stored as text so we can include area codes (eg: +1) */
    number: text().notNull(),

    /** The entity this phone number belongs to (eg: Company or Person) */
    entityId: text().notNull(),

    /** The entity's type, PERSON or COMPANY. Must match the entity; lets the database reject other types. */
    entityType: entityType().notNull(),
  },
  (t) => [
    /** This ensures the entity is of type person or company */
    check("phones_person_or_company", sql`${t.entityType} in ('PERSON', 'COMPANY')`),
    /**This ensure that this row references an entitiy in the entities table. */
    foreignKey({
      columns: [t.entityId, t.entityType],
      foreignColumns: [entities.id, entities.type],
    }).onDelete("cascade"),
  ],
);
