-- Clinic directory for /api/search. Data changes only through migrations and db/seed.ts;
-- the site has no write endpoints.

CREATE TABLE clinics (
  id             SERIAL PRIMARY KEY,
  name           TEXT NOT NULL,
  slug           TEXT NOT NULL UNIQUE,
  city           TEXT NOT NULL,
  region         TEXT NOT NULL,
  postcode       TEXT,
  hfea_centre_id TEXT,
  website_url    TEXT,
  is_active      BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE clinic_services (
  id                          SERIAL PRIMARY KEY,
  clinic_id                   INTEGER NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  service                     TEXT NOT NULL
    CHECK (service IN ('egg_freezing', 'embryo_freezing', 'ivf', 'fertility_testing')),
  -- NULL means the clinic does not publish a price. Never estimate one.
  published_price_gbp         INTEGER CHECK (published_price_gbp >= 0),
  price_includes              TEXT,
  price_excludes              TEXT,
  medication_estimate_gbp     INTEGER CHECK (medication_estimate_gbp >= 0),
  annual_storage_gbp          INTEGER CHECK (annual_storage_gbp >= 0),
  -- TRUE when the published price already covers the first year of storage,
  -- so the all-in estimate must not add it a second time.
  first_year_storage_included BOOLEAN NOT NULL DEFAULT FALSE,
  -- Kept from the original data so nothing published is lost; not part of the all-in estimate.
  consultation_gbp            INTEGER CHECK (consultation_gbp >= 0),
  price_source_url            TEXT,
  price_checked_at            DATE,
  -- How the clinic dated its list, e.g. "Jan 2024 list"; price_checked_at is only month precision.
  price_checked_label         TEXT,
  UNIQUE (clinic_id, service)
);

CREATE TABLE success_rates (
  id           SERIAL PRIMARY KEY,
  clinic_id    INTEGER NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  service      TEXT NOT NULL
    CHECK (service IN ('egg_freezing', 'embryo_freezing', 'ivf', 'fertility_testing')),
  age_band     TEXT NOT NULL,
  rate_percent NUMERIC(5, 2) NOT NULL CHECK (rate_percent >= 0 AND rate_percent <= 100),
  source       TEXT NOT NULL DEFAULT 'HFEA' CHECK (source = 'HFEA'),
  period       TEXT NOT NULL,
  imported_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (clinic_id, service, age_band, period)
);

CREATE INDEX clinic_services_service_idx ON clinic_services (service);
CREATE INDEX clinic_services_price_idx   ON clinic_services (published_price_gbp);
CREATE INDEX clinics_region_idx          ON clinics (region);
CREATE INDEX success_rates_lookup_idx    ON success_rates (clinic_id, service);
