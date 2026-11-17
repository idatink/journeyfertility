import type { Config } from '@netlify/functions';
import { getDatabase } from '@netlify/database';
import { REAL_CLINICS } from '../../src/app/data/clinics';
import {
  MAX_BUDGET_LIMIT,
  REGIONS,
  SEARCH_SERVICES,
  SEARCH_SORTS,
  type SearchResponse,
  type SearchResult,
  type SearchService,
  type SearchSort,
} from '../../src/app/lib/search';

const ALLOWED_PARAMS = new Set(['service', 'clinic', 'region', 'max_budget', 'sort']);
const CLINIC_SLUGS = new Set(REAL_CLINICS.map((c) => c.slug));
const REGION_SLUGS = new Set<string>(REGIONS.map((r) => r.slug));

// ORDER BY cannot be a bound parameter, so each allowlisted sort maps to a fixed fragment.
// Clinics without a published price always sort last.
const ORDER_BY: Record<SearchSort, string> = {
  price_asc: 'all_in_estimate_gbp ASC NULLS LAST, published_price_gbp ASC NULLS LAST, c.name ASC',
  price_desc: 'all_in_estimate_gbp DESC NULLS LAST, published_price_gbp DESC NULLS LAST, c.name ASC',
  name: 'c.name ASC',
};

interface Params {
  service: SearchService;
  clinic: string | null;
  region: string | null;
  maxBudget: number | null;
  sort: SearchSort;
}

function badRequest(message: string): Response {
  return Response.json(
    { error: 'bad_request', message },
    { status: 400, headers: { 'Cache-Control': 'no-store' } },
  );
}

function parse(url: URL): Params | string {
  for (const key of url.searchParams.keys()) {
    if (!ALLOWED_PARAMS.has(key)) return `Unknown parameter "${key}".`;
    if (url.searchParams.getAll(key).length > 1) return `Parameter "${key}" was given more than once.`;
  }

  const service = url.searchParams.get('service');
  if (!service) return 'Parameter "service" is required.';
  if (!(SEARCH_SERVICES as readonly string[]).includes(service)) {
    return `"service" must be one of: ${SEARCH_SERVICES.join(', ')}.`;
  }

  const clinic = url.searchParams.get('clinic');
  if (clinic !== null && !CLINIC_SLUGS.has(clinic)) return '"clinic" is not a known clinic.';

  const region = url.searchParams.get('region');
  if (region !== null && !REGION_SLUGS.has(region)) {
    return `"region" must be one of: ${[...REGION_SLUGS].join(', ')}.`;
  }

  const rawBudget = url.searchParams.get('max_budget');
  let maxBudget: number | null = null;
  if (rawBudget !== null) {
    if (!/^\d{1,6}$/.test(rawBudget)) return '"max_budget" must be a whole number of pounds.';
    maxBudget = Number(rawBudget);
    if (maxBudget < 1 || maxBudget > MAX_BUDGET_LIMIT) {
      return `"max_budget" must be between 1 and ${MAX_BUDGET_LIMIT}.`;
    }
  }

  const sort = url.searchParams.get('sort') ?? 'price_asc';
  if (!(SEARCH_SORTS as readonly string[]).includes(sort)) {
    return `"sort" must be one of: ${SEARCH_SORTS.join(', ')}.`;
  }

  return { service: service as SearchService, clinic, region, maxBudget, sort: sort as SearchSort };
}

interface Row extends Omit<SearchResult, 'all_in_parts' | 'success_rate'> {
  rate_percent: string | null;
  age_band: string | null;
  period: string | null;
}

export default async (req: Request): Promise<Response> => {
  if (req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405, headers: { Allow: 'GET' } });
  }

  const params = parse(new URL(req.url));
  if (typeof params === 'string') return badRequest(params);
  const { service, clinic, region, maxBudget, sort } = params;

  const db = getDatabase();
  try {
    const rows = await db.sql<Row>`
      WITH priced AS (
        SELECT
          c.slug, c.name, c.city, c.region,
          cs.published_price_gbp, cs.price_includes, cs.price_excludes,
          cs.medication_estimate_gbp, cs.annual_storage_gbp, cs.first_year_storage_included,
          cs.price_source_url, cs.price_checked_label,
          CASE WHEN cs.published_price_gbp IS NULL THEN NULL
               ELSE cs.published_price_gbp
                    + COALESCE(cs.medication_estimate_gbp, 0)
                    + CASE WHEN cs.first_year_storage_included THEN 0
                           ELSE COALESCE(cs.annual_storage_gbp, 0) END
          END AS all_in_estimate_gbp,
          c.id AS clinic_id
        FROM clinics c
        JOIN clinic_services cs ON cs.clinic_id = c.id
        WHERE c.is_active
          AND cs.service = ${service}
          AND (${clinic}::text IS NULL OR c.slug = ${clinic}::text)
          AND (${region}::text IS NULL OR c.region = ${region}::text)
      )
      SELECT c.*, sr.rate_percent, sr.age_band, sr.period
      FROM priced c
      LEFT JOIN LATERAL (
        SELECT rate_percent, age_band, period
        FROM success_rates
        WHERE clinic_id = c.clinic_id AND service = ${service} AND source = 'HFEA'
        ORDER BY (age_band = 'all_ages') DESC, imported_at DESC
        LIMIT 1
      ) sr ON TRUE
      -- A clinic that does not publish a price cannot be ruled out by budget, so it stays.
      WHERE (${maxBudget}::int IS NULL OR c.all_in_estimate_gbp IS NULL OR c.all_in_estimate_gbp <= ${maxBudget}::int)
      ORDER BY ${db.sql.raw(ORDER_BY[sort])}
    `;

    const results: SearchResult[] = rows.map((r) => {
      const parts: SearchResult['all_in_parts'] = [];
      if (r.published_price_gbp !== null) {
        parts.push('published_price');
        if (r.medication_estimate_gbp !== null) parts.push('medication');
        if (r.annual_storage_gbp !== null || r.first_year_storage_included) parts.push('one_year_storage');
      }
      return {
        slug: r.slug,
        name: r.name,
        city: r.city,
        region: r.region,
        published_price_gbp: r.published_price_gbp,
        price_includes: r.price_includes,
        price_excludes: r.price_excludes,
        medication_estimate_gbp: r.medication_estimate_gbp,
        annual_storage_gbp: r.annual_storage_gbp,
        first_year_storage_included: r.first_year_storage_included,
        all_in_estimate_gbp: r.all_in_estimate_gbp === null ? null : Number(r.all_in_estimate_gbp),
        all_in_parts: parts,
        price_source_url: r.price_source_url,
        price_checked_label: r.price_checked_label,
        success_rate:
          r.rate_percent === null
            ? null
            : { rate_percent: Number(r.rate_percent), age_band: r.age_band!, period: r.period! },
      };
    });

    const body: SearchResponse = { service, count: results.length, results };
    return Response.json(body, { headers: { 'Cache-Control': 'public, max-age=300' } });
  } catch (err) {
    console.error('search failed', err);
    return Response.json(
      { error: 'server_error', message: 'Search is unavailable right now.' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } },
    );
  }
};

export const config: Config = {
  path: '/api/search',
  // UK hosting. Choosing a functions region needs a Netlify Pro plan.
  region: 'lhr',
};
