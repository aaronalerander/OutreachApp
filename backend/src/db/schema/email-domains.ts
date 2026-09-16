import { pgTable, text } from "drizzle-orm/pg-core";
import { newId } from "#src/db/ids.js";
import { companies } from "#src/db/schema/companies.js";

/**
 * email_domains: the part of an email address after the @, e.g. acme.com.
 *
 * Stored once and shared by every address at that domain. A domain can belong
 * to a company (acme.com) or to no one (gmail.com).
 *
 * Changelog:
 * - 2026-09-12 (0000_add_entity_tables): Created.
 */
export const emailDomains = pgTable("email_domains", {
  /** Unique id for this domain, e.g. "email_domain_01j8x2k5m9qtw3v7c4f6hnrzye". Generated automatically. */
  id: text().primaryKey().$defaultFn(() => newId("email_domain")),

  /** The company that owns this domain. Empty for public providers like gmail.com. */
  companyEntityId: text().references(() => companies.entityId, {
    onDelete: "set null",
  }),

  /** The domain itself, e.g. "acme.com". Each domain appears once. */
  domain: text().notNull().unique(),
});
