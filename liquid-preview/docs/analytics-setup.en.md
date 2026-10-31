# Blog visitor analytics

This site uses Cloudflare Web Analytics. Reports are viewed in the Cloudflare dashboard and are not displayed on the public blog.

## Setup

1. Sign in to your own [Cloudflare account](https://dash.cloudflare.com/), open **Web Analytics**, and select **Add a site**.
2. Add the hostname `xiaoojs20.github.io` and choose manual JavaScript installation. Keep GitHub Pages hosting; no domain or DNS change is needed.
3. Copy the `token` from `data-cf-beacon` in Cloudflare's snippet into `params.analytics.cloudflare.token` in `hugo.yaml`. This is a public collection identifier, not an API credential for reading reports.
4. Build for production and publish both language versions. The normal `hugo server` development preview does not load the beacon. Leaving the token empty also disables the beacon.
5. Visit the live site and check the browser network panel for `beacon.min.js` and a successful analytics submission. Reports may take a few minutes to appear.

## Keeping reports private

- Read reports within your Cloudflare account. Do not create a public statistics page or put analytics API credentials in the blog.
- Use a personal Cloudflare account that only you can access. Check account members and avoid granting others Web Analytics or account analytics permissions.
- The collection token in the page source cannot be used to sign in to Cloudflare or read reports.

## Available reports

- Visits, page views, and trends by day or another selected time range.
- Filters for page path, country, referring website, device type, browser, and operating system.
- Cloudflare's **Visits** counts visits, not deduplicated individuals. These reports cannot identify specific friends or recover data from before installation.
- Ad blockers, network failures, or scripts not running can cause undercounting.

Official documentation: [Setup](https://developers.cloudflare.com/web-analytics/get-started/), [dimensions](https://developers.cloudflare.com/web-analytics/data-metrics/dimensions/), and [metric definitions](https://developers.cloudflare.com/web-analytics/data-metrics/high-level-metrics/).

中文：[analytics-setup.zh.md](analytics-setup.zh.md)
