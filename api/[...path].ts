/**
 * Every /api/* request enters here.
 *
 * Vercel's convention for a project without a framework is a default export
 * with a `fetch` method taking a web Request — which is exactly Hono's own
 * signature, so the app is handed over as-is.
 *
 * The catch-all filename matters: the routes below /api are nested, and a
 * single-segment file would not receive them.
 */
import { app } from '../src/server/app';

export default {
  fetch: app.fetch,
};
