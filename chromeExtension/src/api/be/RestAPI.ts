import type { Result } from "@/types/Result";

// Where the backend lives. Defaults to the local server; set VITE_API_URL
// at build time to point at the deployed one.
export const API_URL: string =
  import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export class RestAPI {
  private constructor() {}

  static async Get<T>(path: string): Promise<Result<T>> {
    let response: Response;
    try {
      response = await fetch(`${API_URL}${path}`);
    } catch {
      return {
        ok: false,
        userFriendlyMessage: `Couldn't reach the server at ${API_URL}. Is it running?`,
      };
    }

    const body = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        ok: false,
        userFriendlyMessage:
          body?.error ?? `The server returned an error (${response.status}).`,
      };
    }

    return { ok: true, data: body as T };
  }
}
