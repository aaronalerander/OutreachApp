import { sql } from "drizzle-orm";
import { check, foreignKey, pgTable, text } from "drizzle-orm/pg-core";
import { entities, entityType } from "#src/db/schema/entities.js";

/**
 * companies: a company
 *
 * Every company is an entity with type COMPANY. The database rejects a company
 * row that points at a non company entity.
 *
 * Changelog:
 * - 2026-09-12 (0000_add_entity_tables): Created.
 */
export const companies = pgTable(
  "companies",
  {
    /** The entity this company is. Also this table's primary key. */
    entityId: text().primaryKey(),

    /** Always COMPANY; you never set it. Only here so the foreign key can check the entity's type. */
    entityType: entityType().notNull().default("COMPANY"),

    /** The company's name, e.g. "Acme". */
    name: text().notNull(),
  },
  (t) => [
    check("companies_entity_type_is_company", sql`${t.entityType} = 'COMPANY'`),
    foreignKey({
      columns: [t.entityId, t.entityType],
      foreignColumns: [entities.id, entities.type],
    }).onDelete("cascade"),
  ],
);
