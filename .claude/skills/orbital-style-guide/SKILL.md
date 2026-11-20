---
name: orbital-style-guide
description: The visual style guide (colors, typography, spacing, components, voice) for the Interplanetary Travel Agency site. Use when writing or reviewing CSS, choosing colors or fonts, styling a block, or checking that a page matches the brand.
---

# Orbital style guide

Source of truth for the site's look. The `design` skill covers the process of designing pages. This file defines the values to use. Implement these as CSS custom properties in `src/index.css`, and reference tokens in components, never raw values.

> Status: proposed defaults. Edit this file when the brand direction changes, and update `src/index.css` to match.

## Color tokens

Dark, deep-space base with warm and cool accents.

| Token | Value | Use |
| --- | --- | --- |
| `--color-space` | `#0b1020` | Page background |
| `--color-surface` | `#141b34` | Cards, panels |
| `--color-surface-raised` | `#1d2747` | Hover, modals |
| `--color-text` | `#e8ecf8` | Body text |
| `--color-text-muted` | `#a3adc9` | Secondary text |
| `--color-accent` | `#ff8a4c` | Primary actions (booking CTA) |
| `--color-accent-cool` | `#5cc8ff` | Links, highlights |
| `--color-success` | `#4ade80` | Available, confirmed |
| `--color-danger` | `#ff6b6b` | Errors, unavailable |

Rules:
- Use `--color-accent` only for the single primary action on a view.
- Body text on `--color-space` and `--color-surface` must meet WCAG AA (4.5:1). Verify any new pairing.
- Never use color alone to convey status. Pair it with text or an icon.

## Typography

- Headings: a geometric or technical sans (for example Space Grotesk). Body: a highly legible sans (for example Inter). Self-host or load from Google Fonts with `font-display: swap`.
- Scale (fluid with `clamp`): `--text-sm` 0.875rem, `--text-base` 1rem, `--text-lg` 1.25rem, `--text-xl` 1.75rem, `--text-2xl` 2.5rem to 3.5rem.
- Body line-height 1.6, headings 1.15. Max line length about 65ch.

## Spacing, shape and motion

- 4px base spacing scale: `--space-1` 0.25rem through `--space-8` 4rem, in multiples.
- Radius: `--radius-sm` 6px for inputs, `--radius-md` 12px for cards, `--radius-pill` for tags and badges.
- Page content width: max 72rem with a 1rem gutter on mobile.
- Motion: 150 to 250ms ease-out for UI feedback. Slow ambient effects (such as drifting stars) must stop under `prefers-reduced-motion`.

## Components

- **Buttons:** primary is accent fill with dark text. Secondary is outlined. Minimum height 44px. Visible focus ring using `--color-accent-cool`.
- **Cards (planets):** `--color-surface` background, `--radius-md`, image on top with a fixed aspect ratio, name, one-line pitch, key facts, then the action.
- **Forms:** visible labels above inputs, inline error text in `--color-danger`, never placeholder-only labels.
- **Badges:** pill shaped, for availability states (available, limited, unavailable).

## Voice

Confident, curious, plain. Prefer concrete facts (distance, duration, price) over hype. Short sentences. Call travelers "you". No jargon without a one-line explanation.

## Imagery

Real or realistic renders of destinations, consistent color grading, with meaningful `alt` text. Avoid text baked into images.
