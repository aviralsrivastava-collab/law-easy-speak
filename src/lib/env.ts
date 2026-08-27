/**
 * Startup environment validation.
 * The app refuses to boot if a critical variable is missing, instead of
 * failing later with a confusing runtime error.
 */
const REQUIRED = ["VITE_SUPABASE_URL", "VITE_SUPABASE_PUBLISHABLE_KEY"] as const;

export function assertEnv() {
  const env = import.meta.env as Record<string, string | undefined>;
  const missing = REQUIRED.filter((key) => !env[key]);

  if (missing.length === 0) return;

  const message =
    `LexiLearn cannot start: missing configuration (${missing.join(", ")}). ` +
    `Set these variables in your environment and redeploy.`;

  const root = document.getElementById("root");
  if (root) {
    root.innerHTML = `<div style="font-family:system-ui;padding:2rem;max-width:40rem;margin:0 auto;color:#e6edf3;background:#0b0f14;min-height:100vh">
      <h1 style="font-size:1.25rem;margin-bottom:.5rem">Configuration error</h1>
      <p style="opacity:.8;line-height:1.6">${message}</p>
    </div>`;
  }

  throw new Error(message);
}
