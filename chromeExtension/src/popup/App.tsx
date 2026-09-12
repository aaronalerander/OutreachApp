import { useState } from "react";
import { extractProfile } from "../content/linkedin";
import { isProfileUrl } from "../shared/utils";

export function App() {
  const [output, setOutput] = useState<string | null>(null);

  async function capture() {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (tab?.id === undefined || !isProfileUrl(tab.url)) {
      setOutput("Open a LinkedIn profile (linkedin.com/in/...) first.");
      return;
    }

    try {
      const [injection] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: extractProfile,
      });
      setOutput(JSON.stringify(injection.result, null, 2));
    } catch (error) {
      setOutput(`Couldn't read this page: ${String(error)}`);
    }
  }

  return (
    <>
      <h1>Outreach</h1>
      <button onClick={capture}>Capture profile</button>
      {output && <pre>{output}</pre>}
    </>
  );
}
