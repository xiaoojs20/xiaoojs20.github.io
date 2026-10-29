# Optional Waline secure uploads

Liquid Stack ships only the browser-side integration. Keep `secureUploads.enabled: false` unless your own backend implements and verifies every endpoint below.

## Public configuration

- `turnstileSiteKey`: the public Cloudflare Turnstile site key.
- `uploadSessionEndpoint`: accepts `POST` with `X-Turnstile-Token`; returns `{ "sessionToken": "..." }`.
- `uploadEndpoint`: accepts raw image bytes with `Content-Type`, `X-Image-Type`, and `X-Upload-Session`; returns `{ "url": "https://..." }`.
- `commentContextEndpoint`: returns an optional short-lived signed timezone context `{ "timezone", "proof", "expiresAt" }`.
- `commentEndpoint`: the Waline comment endpoint; it must verify the submitted `turnstile` token and any signed context.

Blank endpoint values default to the matching `/api/...` routes below `serverURL`.

## Server responsibilities

The backend must verify Turnstile tokens with Cloudflare, bind upload sessions to an allowed origin, repeat MIME and size validation, cap image count and storage use, rate-limit requests, generate safe object names, and return HTTPS URLs only. Keep Turnstile secret keys and storage credentials on the server. Client-side validation is usability help, not a security boundary.
