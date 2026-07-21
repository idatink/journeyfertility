/**
 * Every /api/* request enters here.
 *
 * Vercel's Node runtime invokes the default export with Node's
 * (req: IncomingMessage, res: ServerResponse) — not a web Request. Hono speaks
 * web Request/Response, so the two are bridged by getRequestListener, which
 * builds a web Request from the Node stream, runs the Hono app, and writes the
 * web Response back to the Node response.
 *
 * `hono/vercel`'s handle() was tried first and hung: it returns a web handler
 * meant for the Edge runtime, which the Node runtime does not consume. Edge
 * would have consumed it, but Edge functions run at the nearest edge region
 * regardless of `regions` in vercel.json, which would move UK health data out
 * of London. Staying on the Node runtime keeps execution pinned to lhr1.
 *
 * The catch-all filename matters: the routes below /api are nested, and a
 * single-segment file would not receive them.
 */
import { getRequestListener } from '@hono/node-server';
import { app } from '../src/server/app.js';

export default getRequestListener(app.fetch);
