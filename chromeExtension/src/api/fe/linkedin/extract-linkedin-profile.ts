import { extractProfile } from "@/content/linkedin/extract-profile";
import { LinkedInProfile } from "@/types/linkedin/linkedin-types";
import { Result } from "@/types/Result";
import { isProfileUrl } from "@/utils/linkedin/linkedin-utils";

// Reads the name and URL from the LinkedIn profile open in the current tab.
export async function extractLinkedinProfile(): Promise<
  Result<LinkedInProfile>
> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (tab?.id === undefined || !isProfileUrl(tab.url)) {
    return {
      ok: false,
      userFriendlyMessage:
        "Open a LinkedIn profile (linkedin.com/in/...) first.",
    };
  }

  try {
    const [injection] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: extractProfile,
    });
    if (!injection?.result) throw new Error("No result from page");
    return { ok: true, data: injection.result };
  } catch (error) {
    console.error("Profile capture failed:", error);
    return {
      ok: false,
      userFriendlyMessage:
        "Couldn't read this page. Try refreshing it and capturing again.",
    };
  }
}
