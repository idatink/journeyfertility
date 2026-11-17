/**
 * Loads the site's clinic data (src/app/data/clinics.ts) into Netlify Database.
 *
 *   NETLIFY_DB_URL="<connection string>" npx tsx db/seed.ts
 *
 * Safe to re-run: clinics upsert on slug and services on (clinic, service).
 * Rules: a price the clinic does not publish is stored as NULL, never estimated.
 * Success rates are not seeded: the site has no clinic-level HFEA figures yet.
 */
import { getDatabase } from '@netlify/database';
import { REAL_CLINICS, type Clinic } from '../src/app/data/clinics';
import { CITY_REGION, type SearchService } from '../src/app/lib/search';

const SERVICE_FIELDS: Record<SearchService, keyof Clinic> = {
  egg_freezing: 'eggFreezingCycle',
  embryo_freezing: 'embryoCycle',
  ivf: 'ivfCycle',
  fertility_testing: 'testingFee',
};

/** Only freezing has a storage fee that belongs in the all-in estimate. */
const STORAGE_SERVICES: SearchService[] = ['egg_freezing', 'embryo_freezing'];

/**
 * What a published price covers, only where the clinic's own list says so
 * (see the comments on each clinic in src/app/data/clinics.ts).
 */
const INCLUDES: Record<string, Partial<Record<SearchService, { text: string; firstYearStorage: boolean }>>> = {
  'manchester-fertility': {
    embryo_freezing: {
      text: 'Freezing, the first year of storage and a first frozen embryo transfer',
      firstYearStorage: true,
    },
  },
  'bourn-hall': {
    ivf: { text: 'Freeze fee, the first year of storage and an embryo transfer', firstYearStorage: true },
    embryo_freezing: {
      text: 'The IVF package: freeze fee, the first year of storage and an embryo transfer',
      firstYearStorage: true,
    },
  },
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "Jul 2026" -> 2026-07-01, "2024 list" -> 2024-01-01. Month precision at best. */
function checkedDate(label?: string): string | null {
  if (!label) return null;
  const year = label.match(/\b(20\d\d)\b/)?.[1];
  if (!year) return null;
  const month = MONTHS.findIndex((m) => label.startsWith(m)) + 1 || 1;
  return `${year}-${String(month).padStart(2, '0')}-01`;
}

function websiteFrom(url?: string): string | null {
  if (!url) return null;
  try {
    return new URL(url).origin + '/';
  } catch {
    return null;
  }
}

async function main() {
  const missing = REAL_CLINICS.filter((c) => !CITY_REGION[c.city]);
  if (missing.length) {
    throw new Error(`No region for: ${missing.map((c) => `${c.slug} (${c.city})`).join(', ')}`);
  }

  const db = getDatabase();
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');
    for (const c of REAL_CLINICS) {
      const { rows } = await client.query<{ id: number }>(
        `INSERT INTO clinics (name, slug, city, region, website_url, is_active, updated_at)
         VALUES ($1, $2, $3, $4, $5, TRUE, NOW())
         ON CONFLICT (slug) DO UPDATE SET
           name = EXCLUDED.name, city = EXCLUDED.city, region = EXCLUDED.region,
           website_url = EXCLUDED.website_url, is_active = TRUE, updated_at = NOW()
         RETURNING id`,
        [c.clinicName, c.slug, c.city, CITY_REGION[c.city], websiteFrom(c.priceSourceUrl)],
      );
      const clinicId = rows[0].id;

      for (const service of Object.keys(SERVICE_FIELDS) as SearchService[]) {
        const price = (c[SERVICE_FIELDS[service]] as number | null) ?? null;
        const includes = INCLUDES[c.slug]?.[service];
        const storage = STORAGE_SERVICES.includes(service) ? c.storagePerYear : null;
        await client.query(
          `INSERT INTO clinic_services (
             clinic_id, service, published_price_gbp, price_includes, price_excludes,
             medication_estimate_gbp, annual_storage_gbp, first_year_storage_included,
             consultation_gbp, price_source_url, price_checked_at, price_checked_label)
           VALUES ($1, $2, $3, $4, $5, NULL, $6, $7, $8, $9, $10, $11)
           ON CONFLICT (clinic_id, service) DO UPDATE SET
             published_price_gbp = EXCLUDED.published_price_gbp,
             price_includes = EXCLUDED.price_includes,
             price_excludes = EXCLUDED.price_excludes,
             medication_estimate_gbp = EXCLUDED.medication_estimate_gbp,
             annual_storage_gbp = EXCLUDED.annual_storage_gbp,
             first_year_storage_included = EXCLUDED.first_year_storage_included,
             consultation_gbp = EXCLUDED.consultation_gbp,
             price_source_url = EXCLUDED.price_source_url,
             price_checked_at = EXCLUDED.price_checked_at,
             price_checked_label = EXCLUDED.price_checked_label`,
          [
            clinicId,
            service,
            price,
            service === 'fertility_testing' && price !== null
              ? 'Assessment and consultation'
              : includes?.text ?? null,
            price !== null && !c.medsIncluded && service !== 'fertility_testing'
              ? 'Medication, which the clinic quotes separately'
              : null,
            storage,
            includes?.firstYearStorage ?? false,
            service === 'fertility_testing' ? null : c.consultation,
            c.priceSourceUrl ?? null,
            checkedDate(c.priceCheckedLabel),
            c.priceCheckedLabel ?? null,
          ],
        );
      }
    }
    await client.query('COMMIT');
    const counts = await db.sql<{ clinics: string; services: string; priced: string }>`
      SELECT (SELECT COUNT(*) FROM clinics) AS clinics,
             (SELECT COUNT(*) FROM clinic_services) AS services,
             (SELECT COUNT(*) FROM clinic_services WHERE published_price_gbp IS NOT NULL) AS priced`;
    console.log('Seeded', counts[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
    await db.pool.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
