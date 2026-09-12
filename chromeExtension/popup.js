const PROFILE_URL = /^https:\/\/([a-z]+\.)?linkedin\.com\/in\//;

const output = document.getElementById("output");

document.getElementById("capture").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!PROFILE_URL.test(tab?.url ?? "")) {
    output.textContent = "Open a LinkedIn profile (linkedin.com/in/...) first.";
    return;
  }

  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: extractProfile,
  });

  output.textContent = JSON.stringify(result, null, 2);
});

// Runs inside the LinkedIn tab, so it can't use anything outside this function.
function extractProfile() {
  const slug = location.pathname.match(/^\/in\/([^/]+)/)?.[1];

  // The profile name is the page's main heading. Fall back to the tab title,
  // which looks like "(3) Jane Doe | LinkedIn".
  const heading = document.querySelector("main h1")?.innerText.trim();
  const fromTitle = document.title
    .replace(/^\(\d+\)\s*/, "")
    .replace(/\s*\|\s*LinkedIn$/, "")
    .trim();

  const profile = {
    name: heading || fromTitle || null,
    linkedinUrl: slug ? `https://www.linkedin.com/in/${slug}/` : location.href,
  };

  console.log("[Outreach]", JSON.stringify(profile, null, 2));
  return profile;
}
