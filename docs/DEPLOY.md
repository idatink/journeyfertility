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

### 1.1 The site is set to `noindex`

`index.html` line 10:

```html
<meta name="robots" content="noindex, nofollow" />
```

While this is present, Google will not list the site. That is correct for a
staging URL and wrong for a launch. **Decide deliberately** — leaving it is a
legitimate choice for a soft launch, but it should be a choice.

To go public, delete that line. Nothing else depends on it.

### 1.2 CORS must name the real origin

The enquiry endpoint allow-lists origins; it does not accept a wildcard, because
a wildcard would let any site post health data from a visitor's browser.

Until the production origin is added, **the enquiry form will fail on the live
domain** while working perfectly in development. Set on the Supabase edge
function (not in the client bundle):

```
ALLOWED_ORIGINS=https://journeyfertility.com,https://www.journeyfertility.com
```

Include both. A visitor arriving on `www` posts from the `www` origin.

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
   VITE_ENQUIRY_ENDPOINT=https://<project>.supabase.co/functions/v1/make-server-bb5634ef/enquiries
   ```

   `VITE_`-prefixed variables are compiled into the client bundle and are public.
   That is fine for this URL. Never put `ADMIN_KEY` or any secret behind a
   `VITE_` prefix.
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
- [ ] Submit a real enquiry end to end — this is what §1.2 protects
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
