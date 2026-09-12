import type { LinkedInProfile } from "../shared/types";

export function extractProfile(): LinkedInProfile {
  const slug = location.pathname.match(/^\/in\/([^/]+)/)?.[1];

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
