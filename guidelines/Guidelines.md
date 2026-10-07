# JourneyFertility — design system

A warm, calm, trustworthy system for a UK fertility comparison service. Tokens
live in `src/styles/globals.css` (`:root`); components reference them via the
hex values below or the CSS variables. When something isn't covered here, favour
quiet, legible, accessible choices over decoration.

## Colour

Six brand colours. The neutrals are warm (biased toward the peach), never a cold
grey.

| Token | Hex | Role |
|-------|-----|------|
| **Ink** | `#2F2C2A` | Text, primary/active surfaces (buttons, selected tabs), icons |
| **Stone** | `#F7F5F2` | Page background |
| **White** | `#FFFFFF` | Cards and raised surfaces |
| **Peach** | `#E0714A` | The motif, bright warm accent fills, focus ring |
| **Peach-deep** | `#C2542E` | Accent **text** and links (AA-legible on white/stone) |
| **Blush** | `#F4A28C` | Soft warm tints, friendly primary CTAs (with Ink text) |
| **Sky** | `#DCE6F0` | Cool soft fills, panels, avatars |

Supporting: **Muted ink** `#665F58` (secondary text), **Sky border** `#C3D3E2`,
**Blush tint** `#FBEAE4`, error `#E5484D`.

**Rules**
- Accent *text* and links use **Peach-deep** (`#C2542E`), never bright Peach — Peach fails contrast as small text.
- Bright **Peach** is for the motif, focus rings, and decorative fills only.
- Selected / active states (tabs, toggles) are **Ink** with white text.
- Cool (Sky) and warm (Blush/Peach) tints both exist; use Sky to calm, Blush to warm. Don't mix two warm oranges in one component.

## Type — Arimo

Self-hosted (`src/assets/fonts/arimo-{400,700}.woff2`), two weights only: **400**
regular and **700** bold. Emphasis is bold; there is no medium weight. Arial is
the system fallback (metric-compatible).

| Role | Size / weight |
|------|---------------|
| Screen title | 31 / 700 |
| Card title | 21 / 700 |
| List title | 17.5 / 700 |
| Body | 15.5 / 400 |
| Label | 13.5 / 400 |

Headings get `text-wrap: balance`. Keep running text near 65 characters wide.
Uppercase labels (eyebrows) carry light letter-spacing and use Peach-deep.

## Radius

Three steps, from the card: **12px** (`--radius-sm`, chips/inputs/small cards),
**22px** (`--radius-md`, cards/panels), and **full** (`--radius-full`, pills,
the search bar, avatars).

## Motif

Three overlapping circles in a Peach gradient on a Sky field — preserved
potential, overlapping journeys. Decorative only; never behind body text.

## Components

- **Buttons** — *Primary*: Blush fill, Ink text, full radius. *Secondary*: white with a hairline border. *On dark*: Ink fill, white text (used for toggles/selected tabs). One primary per section.
- **Pills / tabs** — selected = Ink + white; unselected = white/transparent + Ink. Counts sit inline (e.g. "At-home kits · 18").
- **Chips** (biomarkers, filters) — Blush or Sky tint, small radius, in sets of three or more.
- **Cards** — White, 22px radius, hairline border or soft warm shadow (never a blue shadow). Price in Ink bold.
- **Search** — full-radius bar, Ink round action button.

## General

- Responsive flex/grid with `gap`; avoid absolute positioning and per-element margins.
- Keep components small and in their own files; refactor as you go.
- Respect `prefers-reduced-motion`; give every interactive element a visible focus ring (Peach).
- Honesty first: never show an invented price or success rate for a real clinic (see the code's data doctrine).
