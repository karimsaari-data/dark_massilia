-- Tables Cloudflare Analytics
-- À exécuter dans Supabase > SQL Editor

CREATE TABLE IF NOT EXISTS cf_daily (
  date             date        PRIMARY KEY,
  unique_visitors  integer     NOT NULL DEFAULT 0,
  page_views       integer     NOT NULL DEFAULT 0,
  requests         integer     NOT NULL DEFAULT 0,
  cached_requests  integer     NOT NULL DEFAULT 0,
  bytes            bigint      NOT NULL DEFAULT 0,
  cached_bytes     bigint      NOT NULL DEFAULT 0,
  threats          integer     NOT NULL DEFAULT 0,
  created_at       timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cf_daily_countries (
  date     date    NOT NULL,
  country  text    NOT NULL,
  requests integer NOT NULL DEFAULT 0,
  bytes    bigint  NOT NULL DEFAULT 0,
  threats  integer NOT NULL DEFAULT 0,
  PRIMARY KEY (date, country)
);

-- Indexes pour les requêtes courantes
CREATE INDEX IF NOT EXISTS cf_daily_date_desc ON cf_daily (date DESC);
CREATE INDEX IF NOT EXISTS cf_daily_countries_date ON cf_daily_countries (date DESC, requests DESC);
