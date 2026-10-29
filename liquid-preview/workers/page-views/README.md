# Page-view counter Worker

This optional Cloudflare Worker records first-party page views in a D1 database. It is not configured for any live site.

1. Authenticate with Cloudflare and create a D1 database named `liquid-stack-page-views`.
2. Put its id in `wrangler.jsonc`; set `ALLOWED_ORIGIN` to your production site.
3. Set `VIEW_FINGERPRINT_SALT` using `wrangler secret put`.
4. Apply migrations, deploy the Worker, and configure its URL in `hugo.yaml` only if you enable the page-view integration.

Never commit database IDs, tokens, or secrets.
