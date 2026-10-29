import { articleCounterKey, normalisePath, pageCounterKey, SITE_COUNTER_KEY } from "./path";

interface Env {
    DB: D1Database;
    ALLOWED_ORIGIN: string;
    SWITCH_DATE: string;
}

type ViewRow = { historical_views: number; live_views: number };

const json = (data: unknown, status = 200, origin?: string) => new Response(JSON.stringify(data), {
    status,
    headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store",
        ...(origin ? { "access-control-allow-origin": origin, vary: "Origin" } : {}),
    },
});

const total = (row: ViewRow | null) => (row?.historical_views || 0) + (row?.live_views || 0);

async function readCounters(env: Env, articleKey?: string, pageKey?: string) {
    const keys = [SITE_COUNTER_KEY, ...(articleKey ? [articleKey] : []), ...(pageKey ? [pageKey] : [])];
    const marks = keys.map(() => "?").join(",");
    const result = await env.DB.prepare(`SELECT counter_key, historical_views, live_views FROM counters WHERE counter_key IN (${marks})`)
        .bind(...keys).all<ViewRow & { counter_key: string }>();
    const rows = new Map(result.results.map((row) => [row.counter_key, row]));
    return {
        siteViews: total(rows.get(SITE_COUNTER_KEY) || null),
        articleViews: articleKey ? total(rows.get(articleKey) || null) : undefined,
        pageViews: pageKey ? total(rows.get(pageKey) || null) : undefined,
    };
}

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        const origin = request.headers.get("Origin");
        if (origin && origin !== env.ALLOWED_ORIGIN) return json({ error: "origin_not_allowed" }, 403);
        if (request.method === "OPTIONS") {
            return new Response(null, { headers: { "access-control-allow-origin": env.ALLOWED_ORIGIN, "access-control-allow-methods": "GET, POST, OPTIONS", "access-control-allow-headers": "X-View-Scope", vary: "Origin" } });
        }
        const url = new URL(request.url);
        if (url.pathname !== "/v1/views") return json({ error: "not_found" }, 404, env.ALLOWED_ORIGIN);

        const path = normalisePath(url.searchParams.get("path") || "");
        const articleKey = path ? articleCounterKey(path) : null;
        const pageKey = path ? pageCounterKey(path) : null;
        if (!path) return json({ error: "invalid_path" }, 400, env.ALLOWED_ORIGIN);

        try {
            if (request.method === "GET") return json(await readCounters(env, articleKey || undefined, pageKey || undefined), 200, env.ALLOWED_ORIGIN);
            if (request.method !== "POST") return json({ error: "method_not_allowed" }, 405, env.ALLOWED_ORIGIN);
            if (origin !== env.ALLOWED_ORIGIN) return json({ error: "origin_required" }, 403, env.ALLOWED_ORIGIN);

            const requestedScope = request.headers.get("X-View-Scope");
            if (requestedScope !== "site" && requestedScope !== "article" && requestedScope !== "page") return json({ error: "invalid_scope" }, 400, env.ALLOWED_ORIGIN);
            if (requestedScope === "article" && !articleKey) return json({ error: "article_path_required" }, 400, env.ALLOWED_ORIGIN);
            if (requestedScope === "page" && !pageKey) return json({ error: "page_path_required" }, 400, env.ALLOWED_ORIGIN);
            if (new Date().toISOString().slice(0, 10) < env.SWITCH_DATE) return json(await readCounters(env, articleKey || undefined, pageKey || undefined), 200, env.ALLOWED_ORIGIN);

            const keys = requestedScope === "article" ? [SITE_COUNTER_KEY, articleKey!] : requestedScope === "page" ? [SITE_COUNTER_KEY, pageKey!] : [SITE_COUNTER_KEY];
            await env.DB.batch(keys.map((key) => env.DB.prepare("INSERT INTO counters(counter_key, live_views) VALUES (?, 1) ON CONFLICT(counter_key) DO UPDATE SET live_views = live_views + 1, updated_at = CURRENT_TIMESTAMP").bind(key)));
            return json(await readCounters(env, articleKey || undefined, pageKey || undefined), 200, env.ALLOWED_ORIGIN);
        } catch {
            return json({ error: "temporarily_unavailable" }, 503, env.ALLOWED_ORIGIN);
        }
    },
};
