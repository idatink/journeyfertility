/**
 * Key/value storage on Vercel Blob.
 *
 * This replaces the Supabase kv_store and keeps the same tiny surface — get,
 * set, del, getByPrefix — so the routes and the retention logic did not have to
 * change to follow the move.
 *
 * The store must be created as **private**, in **London**. Neither can be
 * changed after creation, and both matter: private means a blob is readable
 * only through a Function holding the token rather than by anyone who learns
 * the URL, and London is what lets the privacy notice say the data stays in the
 * UK. A public store here would publish fertility enquiries to anyone with a
 * link.
 */
import { put, get, del, list } from '@vercel/blob';

const ACCESS = 'private' as const;

/**
 * Blob pathnames are a filesystem-like namespace, so `enquiry:JF-AB12` becomes
 * `enquiry/JF-AB12.json` and prefix listing gets the folder for free.
 *
 * Only the first colon separates the prefix; the remainder is percent-encoded.
 * Rate limit keys carry a raw client address, and an IPv6 address is full of
 * colons that would otherwise explode into a tree of empty folders.
 */
function pathFor(key: string): string {
  const separator = key.indexOf(':');
  if (separator === -1) return `${encodeURIComponent(key)}.json`;
  const prefix = key.slice(0, separator);
  const rest = key.slice(separator + 1);
  return `${prefix}/${encodeURIComponent(rest)}.json`;
}

function folderFor(prefix: string): string {
  return `${prefix.replace(/:$/, '')}/`;
}

/**
 * Reads bypass the cache.
 *
 * Blobs are cached for up to a month by default and deletions take up to a
 * minute to propagate. Every read here either decides whether someone may see
 * an enquiry or confirms that one is gone, and a cached answer to either
 * question is worse than a slow one — erasure in particular is verified by
 * reading back, which proves nothing against a cache.
 */
export async function getValue<T = unknown>(key: string): Promise<T | null> {
  const result = await get(pathFor(key), { access: ACCESS, useCache: false });
  if (!result || result.statusCode !== 200) return null;
  return (await new Response(result.stream).json()) as T;
}

export async function setValue(key: string, value: unknown): Promise<void> {
  await put(pathFor(key), JSON.stringify(value), {
    access: ACCESS,
    contentType: 'application/json',
    // Statuses change in place, and the pathname is the identity of the record.
    allowOverwrite: true,
    // A random suffix would make the pathname unpredictable and so unreadable.
    addRandomSuffix: false,
  });
}

export async function delValue(key: string): Promise<void> {
  await del(pathFor(key));
}

/**
 * Every value whose key starts with `prefix`.
 *
 * `list` returns metadata only, so this is one listing plus a read per record.
 * That is acceptable for the daily retention sweep at MVP volume and would not
 * be at scale — if enquiry counts reach the thousands this wants replacing with
 * a real database rather than paginating harder.
 */
export async function getByPrefix<T = unknown>(prefix: string): Promise<T[]> {
  const folder = folderFor(prefix);
  const values: T[] = [];
  let cursor: string | undefined;

  do {
    const page = await list({ prefix: folder, cursor, limit: 1000 });
    for (const blob of page.blobs) {
      const result = await get(blob.pathname, { access: ACCESS, useCache: false });
      if (!result || result.statusCode !== 200) continue;
      values.push((await new Response(result.stream).json()) as T);
    }
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);

  return values;
}
