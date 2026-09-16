import { sql } from "drizzle-orm";
import { check, pgEnum, pgTable, text, unique } from "drizzle-orm/pg-core";

/** Whether an entity is a person or a company. */
export const entityType = pgEnum("entity_type", ["COMPANY", "PERSON"]);

/**
 * entities: An Entity (Person Or Company, maybe Deal in future)
 *
 * Changelog:
 * - 2026-09-12 (0000_add_entity_tables): Created.
 */
export const entities = pgTable(
  "entities",
  {
    /**
     * Unique id for the entity, e.g. "person_01j8x2k5m9qtw3v7c4f6hnrzye".
     * Starts with person_ or company_ to match the type. People and companies
     * use it as their id too. Create it with newId("person") or newId("company").
     */
    id: text().primaryKey(),

    /** (eg. PERSON or COMPANY). Decides the entitiy type */
    type: entityType().notNull(),
  },
  (t) => [
    /**Postgres needs the (id, type) pair declared unique.
     * Then people, companies, phones, and the rest can require
     *  the entity they point at to be the type they expect.
     */
    unique().on(t.id, t.type),
    // The id's prefix must match the type: person_... for PERSON, company_... for COMPANY.
    check(
      "entities_id_prefix_matches_type",
      sql`(${t.type} = 'PERSON' and starts_with(${t.id}, 'person_'))
        or (${t.type} = 'COMPANY' and starts_with(${t.id}, 'company_'))`,
    ),
  ],
);
