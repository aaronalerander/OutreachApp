import { useState } from "react";
import { checkDbHealth, checkServerHealth } from "@/api/be/infrastructure-health/api";
import { extractLinkedinProfile } from "@/api/fe/linkedin/extract-linkedin-profile";

export function App() {
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function showOutput(data: unknown) {
    setError(null);
    setOutput(JSON.stringify(data, null, 2));
  }

  function handleError(userFriendlyMessage: string) {
    setOutput(null);
    setError(userFriendlyMessage);
  }

  async function onCaptureProfile() {
    const res = await extractLinkedinProfile();
    if (!res.ok) return handleError(res.userFriendlyMessage);
    showOutput(res.data);
  }

  async function onCheckServerHealth() {
    const res = await checkServerHealth();
    if (!res.ok) return handleError(res.userFriendlyMessage);
    showOutput(res.data);
  }

  async function onCheckDbHealth() {
    const res = await checkDbHealth();
    if (!res.ok) return handleError(res.userFriendlyMessage);
    showOutput(res.data);
  }

  return (
    <>
      <h1>Outreach</h1>
      <button onClick={onCaptureProfile}>Capture profile</button>
      <button onClick={onCheckServerHealth}>Check server health</button>
      <button onClick={onCheckDbHealth}>Check DB health</button>
      {error && <p className="error">{error}</p>}
      {output && <pre>{output}</pre>}
    </>
  );
}
