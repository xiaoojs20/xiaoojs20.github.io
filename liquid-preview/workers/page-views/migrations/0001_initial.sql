-- Historical GA4 values end on 2026-07-26. The Worker only increments from 2026-07-27 UTC.
CREATE TABLE IF NOT EXISTS counters (
    counter_key TEXT PRIMARY KEY,
    historical_views INTEGER NOT NULL DEFAULT 0 CHECK (historical_views >= 0),
    live_views INTEGER NOT NULL DEFAULT 0 CHECK (live_views >= 0),
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS counted_visits (
    fingerprint TEXT NOT NULL,
    counter_key TEXT NOT NULL,
    counted_on TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (fingerprint, counter_key, counted_on)
);

CREATE INDEX IF NOT EXISTS counted_visits_created_at ON counted_visits(created_at);

CREATE TABLE IF NOT EXISTS counter_settings (
    setting_key TEXT PRIMARY KEY,
    setting_value TEXT NOT NULL
);

INSERT OR IGNORE INTO counter_settings(setting_key, setting_value)
VALUES ('switch_date', '2026-07-27');
