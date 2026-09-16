import { sql } from "drizzle-orm";
import { check, foreignKey, jsonb, pgTable, text } from "drizzle-orm/pg-core";
import { entities, entityType } from "#src/db/schema/entities.js";

/**
 * linkedin_profiles: the LinkedIn page for an entity (eg person or company)
 *
 * Changelog:
 * - 2026-09-12 (0000_add_entity_tables): Created.
 */
export const linkedinProfiles = pgTable(
  "linkedin_profiles",
  {
    /** The person or company this profile belongs to. Also the primary key, so one profile per entity. */
    entityId: text().primaryKey(),

    /** The entity's type, PERSON or COMPANY. */
    entityType: entityType().notNull(),

    /** The profile's standard URL, e.g. "https://www.linkedin.com/in/jane-doe/" */
    linkedinUrl: text().notNull().unique(),

    /** Raw data captured from the profile page*/
    jsonBlob: jsonb(),
  },
  (t) => [
    check(
      "linkedin_profiles_person_or_company",
      sql`${t.entityType} in ('PERSON', 'COMPANY')`,
    ),
    foreignKey({
      columns: [t.entityId, t.entityType],
      foreignColumns: [entities.id, entities.type],
    }).onDelete("cascade"),
  ],
);
