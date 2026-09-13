// What data-fetching functions return: either the data, or a message that's
// safe to show the user. They never throw, so callers only need to check `ok`.
export type Result<T> =
  | { ok: true; data: T }
  | { ok: false; userFriendlyMessage: string };
