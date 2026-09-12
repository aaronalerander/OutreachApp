const PROFILE_URL = /^https:\/\/([a-z]+\.)?linkedin\.com\/in\//;

export function isProfileUrl(url: string | undefined): boolean {
  return PROFILE_URL.test(url ?? "");
}
