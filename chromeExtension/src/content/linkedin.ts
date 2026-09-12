import type { LinkedInProfile } from "../shared/types";

// Injected into the LinkedIn tab with chrome.scripting.executeScript, which
// serializes the function's source. It must not reference anything outside
// its own body (no imports, no module-level constants).
export function extractProfile(): LinkedInProfile {
  const slug = location.pathname.match(/^\/in\/([^/]+)/)?.[1];

  // The profile name is the page's main heading. Fall back to the tab title,
  // which looks like "(3) Jane Doe | LinkedIn".
  const heading = document
    .querySelector<HTMLElement>("main h1")
    ?.innerText.trim();
  const fromTitle = document.title
    .replace(/^\(\d+\)\s*/, "")
    .replace(/\s*\|\s*LinkedIn$/, "")
    .trim();

  const profile: LinkedInProfile = {
    name: heading || fromTitle || null,
    linkedinUrl: slug ? `https://www.linkedin.com/in/${slug}/` : location.href,
  };

  console.log("[Outreach]", JSON.stringify(profile, null, 2));
  return profile;
}
