/**
 * Every /api/* request enters here.
 *
 * Hono's official Vercel adapter. `handle(app)` returns a handler with the
 * `(req: Request) => Response` signature Vercel's Node runtime expects. The
 * generic `export default { fetch }` object convention is not accepted by that
 * runtime and crashes the function with FUNCTION_INVOCATION_FAILED, so the
 * adapter is used rather than handing over `app.fetch` directly.
 *
 * The catch-all filename matters: the routes below /api are nested, and a
 * single-segment file would not receive them.
 */
import { handle } from 'hono/vercel';
import { app } from '../src/server/app.js';

export default handle(app);
