import { typeid } from "typeid-js";

/**
 * The prefix at the start of every ID says what it points at, e.g.
 * phone_01j8x2k9e4rw6hnb2c8yj7fzqa is a phone. The rest is a TypeID: unique,
 * and sorts by creation time.
 */
export type IdPrefix =
  | "person"
  | "company"
  | "employment"
  | "email_domain"
  | "email"
  | "phone"
  | "note";

export function newId(prefix: IdPrefix): string {
  return typeid(prefix).toString();
}
