# Welcome to your Lovable project

TODO: Document your project here

## Security notes

### Secrets handling
- No secrets are hardcoded anywhere in the source. All credentials are read from environment variables.
- Client-side (`VITE_*`) vars contain only public-safe values: the backend URL, project id, and the publishable/anon key. These are safe to ship because **Row Level Security is enabled on every table** (`profiles`, `search_history`, `bookmarks`) with per-user policies.
- Server-side keys (`LOVABLE_API_KEY`, service role key) exist only in backend edge-function environments via `Deno.env.get(...)`. They are never imported, bundled, logged, or returned to the client.
- `.env` is gitignored; `.env.example` documents required variables with placeholders only.
- Error handlers log messages only — never tokens, keys, or connection strings.

### Rotate previously committed secrets
If any credential was ever hardcoded and committed, it still exists in git history even after removal. Rotate any such key immediately (backend API keys and database credentials) before deploying.
