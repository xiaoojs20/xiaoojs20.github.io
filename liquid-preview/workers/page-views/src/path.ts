export const SITE_COUNTER_KEY = "site";

export function normalisePath(value: string): string | null {
    if (!value || value.length > 512 || !value.startsWith("/")) return null;
    const path = value.replace(/\/{2,}/g, "/").replace(/[?#].*$/, "");
    if (path.includes("..") || !/^\/(?:[^/?#\s]+\/)*$/u.test(path)) return null;
    return path === "/" ? "/" : `${path.replace(/\/$/, "")}/`;
}

export function articleCounterKey(path: string): string | null {
    const normalised = normalisePath(path);
    return normalised && /^\/(?:zh\/)?p\/[^/]+\/$/u.test(normalised)
        ? `article:${normalised}`
        : null;
}

export function pageCounterKey(path: string): string | null {
    const normalised = normalisePath(path);
    return normalised && !articleCounterKey(normalised) ? `page:${normalised}` : null;
}
