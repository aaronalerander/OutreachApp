import { sql } from "drizzle-orm";
import { check, foreignKey, pgTable, text, unique } from "drizzle-orm/pg-core";
import { newId } from "#src/db/ids.js";
import { emailDomains } from "#src/db/schema/email-domains.js";
import { entities, entityType } from "#src/db/schema/entities.js";

/**
 * email_usernames: an email address belonging to a person or a company.
 *
 * Stored as the part before the @ plus a link to the domain, so
 * jane@acme.com is username "jane" + the acme.com domain. An entity can have
 * several addresses (jane@acme.com for a person, info@acme.com for a company);
 * each address belongs to one entity. Only people and companies can have
 * addresses; the database rejects other entity types.
 *
 * Changelog:
 * - 2026-09-12 (0000_add_entity_tables): Created.
 */
export const emailUsernames = pgTable(
  "email_usernames",
  {
    /** Unique id for this email address, e.g. "email_01j8x2k5m9qtw3v7c4f6hnrzye". Generated automatically. */
    id: text().primaryKey().$defaultFn(() => newId("email")),

    /** The part before the @, e.g. "jane" in jane@acme.com. */
    username: text().notNull(),

    /** The domain after the @. */
    emailDomainId: text()
      .notNull()
      .references(() => emailDomains.id, { onDelete: "cascade" }),

    /** The person or company this address belongs to. */
    entityId: text().notNull(),

    /** The entity's type, PERSON or COMPANY. Must match the entity; lets the database reject other types. */
    entityType: entityType().notNull(),
  },
  (t) => [
    // An email address belongs to one entity.
    unique().on(t.username, t.emailDomainId),
    check("email_usernames_person_or_company", sql`${t.entityType} in ('PERSON', 'COMPANY')`),
    foreignKey({
      columns: [t.entityId, t.entityType],
      foreignColumns: [entities.id, entities.type],
    }).onDelete("cascade"),
  ],
);
