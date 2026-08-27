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

## Personal data map

| Data | Collected where | Stored | Sent externally |
|---|---|---|---|
| Email, password | Sign up / sign in (`src/pages/Auth.tsx`) | Managed auth service; password hashed by the provider (bcrypt), never stored or logged by app code | No |
| Full name | Sign up | `profiles.display_name` | No |
| Avatar URL (Google OAuth) | OAuth sign-in | `profiles.avatar_url` | No |
| Situation description + AI results | Offense mapper, FIR draft | `search_history` (user-owned rows, RLS) | Situation text is sent to the AI gateway to produce the analysis — required for the feature |
| Bookmarked law sections | Result cards | `bookmarks` (user-owned rows, RLS) | No |
| Pasted/uploaded document text | Document explainer | Not stored — processed in-memory only | Sent to the AI gateway for the explanation, then discarded |
| Quiz answers | Quiz player | Not stored | Sent to AI gateway for feedback only |

No analytics, error-tracking, payment or email SDKs are integrated. Session tokens are held by the auth SDK in `localStorage`; no other personal data is written to browser storage or cookies.

### Privacy fixes applied
- Server logs no longer echo AI content derived from a user's situation (`[REDACTED]`) or raw gateway response bodies; all error logs print a message string only.
- Added a `delete-account` backend function: it identifies the caller from their own JWT (never a client-supplied id), deletes their `search_history`, `bookmarks` and `profiles` rows, then deletes the auth identity.
- Dashboard now has a "Your data & privacy" section with **Clear saved searches & bookmarks** and **Delete my account permanently**.
- API responses return only the requesting user's rows — every table is RLS-scoped to `auth.uid()`, and no endpoint returns password hashes or other users' data.
