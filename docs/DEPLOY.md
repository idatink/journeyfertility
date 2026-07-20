# Deploying to journeyfertility.com

**Status:** runbook · **Date:** 20 July 2026 · **Host:** Vercel · **Registrar/DNS:** GoDaddy

The steps that need account access are yours to do — they involve signing in and
changing DNS, which is not something to hand off. Everything in the repo is
already prepared.

---

## Before you start: what is live now

`www.journeyfertility.com` currently resolves to `sites.figma.net` — the
original Figma Make export. The apex points at a GoDaddy holding address.

**Changing DNS replaces a live site.** Deploy to the Vercel preview URL and check
it first (step 2), so the switch in step 4 is the only moment anything changes
for a visitor.

## 1. Blockers to clear first

### 1.1 The site is indexable — done

The `noindex, nofollow` meta tag has been removed from `index.html`, so search
engines may now list the site. Nothing else depends on it.

Worth knowing what that means alongside §1.3: whatever is published gets
indexed, placeholders included.

### 1.2 Create the Blob store — two settings are permanent

Storage is Vercel Blob. In the project: **Storage → Create Database → Blob**.

| Setting | Value | Why it cannot be fixed later |
|---|---|---|
| Access | **Private** | Public means anyone with the URL reads the blob. These are fertility enquiries |
| Region | **London (lhr1)** | This is what lets the privacy notice say the data stays in the UK |

Neither can be changed after the store is created. Getting either wrong means
migrating every enquiry to a new store.

Creating it adds `BLOB_READ_WRITE_TOKEN` to the project automatically.

Then set, in project settings:

```
ADMIN_KEY=<long random value>     # operator endpoints
CRON_SECRET=<long random value>   # authenticates the daily retention sweep
```

**CORS is no longer a concern.** The API is served from `/api` on the same
origin as the site, so the browser's same-origin policy does the work and there
is no allow-list to misconfigure. This replaced an `ALLOWED_ORIGINS` variable
that, if forgotten, broke every enquiry in production while working in
development.

### 1.3 Placeholders that become public claims

Going live publishes these as statements of fact. All are marked in the UI:

| Where | What is missing |
|---|---|
| Privacy notice | Registered company name and number, ICO registration, `privacy@` address, hosting region |
| About page | Founder names, biographies and portraits |
| `ATTRIBUTIONS.md` | Licence and source for the six supplied photographs |

The privacy notice is the pressing one. It is the document a visitor relies on
when consenting to health data processing, and `[to confirm]` in place of the
data controller undermines the consent it is there to support.

## 2. Deploy

1. Sign in to Vercel with GitHub and import `idatink/journeyfertility`.
2. Framework preset should auto-detect as **Vite**. `vercel.json` already sets
   the build command, output directory, SPA rewrite, cache and security headers,
   so leave the defaults alone.
3. Add the environment variable, for Production:

   ```
   VITE_ENQUIRY_ENDPOINT=/api/enquiries
   ```

   `VITE_`-prefixed variables are compiled into the client bundle and are
   public. That is fine for a relative path. Never put `ADMIN_KEY`,
   `CRON_SECRET` or `BLOB_READ_WRITE_TOKEN` behind a `VITE_` prefix.

   **Leave this unset for the first deploy.** The form then says plainly that
   nothing was sent, instead of showing a confirmation for an enquiry that
   failed. Set it once the Blob store exists and you have tested the endpoint.
4. Deploy, then open the `*.vercel.app` URL and check the site properly before
   touching DNS.

## 3. Add the domain in Vercel

In the project: **Settings → Domains → Add**, enter `journeyfertility.com` and
add `www.journeyfertility.com` too. Vercel will then display the exact DNS
records it wants.

**Use the values Vercel shows you, not the ones below.** They differ between
accounts and regions, and Vercel changes them. These are only for recognising
the shape of what you are entering:

| Type | Name | Typical value |
|---|---|---|
| A | `@` | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |

## 4. Change the DNS at GoDaddy

GoDaddy → **My Products → journeyfertility.com → DNS → Manage Zones**.

1. **Edit** the existing `A` record for `@` — currently the GoDaddy holding
   address — to the value Vercel gave you.
2. **Edit** the `CNAME` for `www` — currently `sites.figma.net` — to the value
   Vercel gave you.

Two cautions:

- **Edit, do not add.** Two `A` records on `@` will round-robin between the old
  and new site, and roughly half of visitors will see the wrong one.
- **Leave `MX` and `TXT` records alone.** If email is running on this domain,
  removing `MX` records silently stops mail delivery.

Propagation is usually minutes, occasionally up to 48 hours. Vercel issues the
TLS certificate automatically once it can see the records.

Check from outside your own network and browser cache:

```sh
dig +short A journeyfertility.com
dig +short CNAME www.journeyfertility.com
curl -sI https://journeyfertility.com | head -1
```

## 5. After the switch

- [ ] `https://journeyfertility.com` and the `www` form both load and redirect to one canonical host
- [ ] Certificate valid, no mixed-content warnings
- [ ] Submit a real enquiry end to end, then delete it via the erasure endpoint and confirm it is gone
- [ ] Trigger the retention sweep by hand with `ADMIN_KEY` and check it reports `ok: true`
- [ ] Confirm in the deployment which region the Functions actually ran in — see DPIA §6
- [ ] Network tab shows **no third-party requests**. The font and all photography are self-hosted, and that promise is made explicitly in the privacy notice
- [ ] Check on a phone; the hero and founder cards are the layouts most likely to shift

## Rolling back

Keep a note of the old values before editing:

```
A     @     204.69.207.1
CNAME www   sites.figma.net
```

Restoring those returns the domain to the Figma site. Do this at GoDaddy rather
than by deleting the Vercel project, so the rollback takes effect at the same
speed the change did.
