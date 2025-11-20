
CREATE TABLE links(
    code TEXT PRIMARY KEY,
    target_url TEXT NOT NULL,
    clicks BIGINT DEFAULT 0,
    last_clicked TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
