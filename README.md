# Voyager: Interplanetary Travel Agency

A website for an interplanetary travel agency. Visitors browse the planets they can travel to, read about each destination, learn about the company, and (soon) book a trip. Every page, label and image is content in [Storyblok](https://www.storyblok.com), so editors can change the site, in every language, without touching code.

## What is on the site

| Page | Path | Status |
| --- | --- | --- |
| Home: "Where will you go next?" with the planets | `/` | Built |
| Planet pages, e.g. Mars with a video hero | `/planets/mars` | Built |
| Company Overview: mission, story, team, safety, spaceports, partners, testimonials, contact | `/company-overview` | Built |
| Booking | `/booking` | Placeholder ("Working on it!") |
| Error page ("Lost in space") | `/error` | Built, shown for missing pages and failures |
| Sitemap and robots | `/sitemap.xml`, `/robots.txt` | Generated at build time |

Site-wide: a fixed navigation header (company name, logo, tabs and a language picker) managed in Storyblok, and a footer with a link to the sitemap. The default language has clean URLs and every other language has a prefix, for example `/es/planets/mars`.

## Tech stack

React 19, TypeScript (strict), Vite, React Router, Storyblok (headless CMS) through `@storyblok/react`, deployed on Vercel. Node 24 is required.

## Getting started

You need Node 24 (`nvm use 24`) and a Storyblok space with the content model described below.

```sh
git clone https://github.com/kanatalia1995/voyager-travel-agency.git
cd voyager-travel-agency
npm install
cp .env.example .env   # then fill in the values
npm run dev            # https://localhost:5173
```

The dev server runs over HTTPS (`vite-plugin-mkcert`) because the Storyblok Visual Editor requires it.

### Environment variables

| Variable | Purpose |
| --- | --- |
| `STORYBLOK_DELIVERY_API_TOKEN` | Storyblok access token. Use the preview token to see drafts, or a public token for published-only sites. |
| `STORYBLOK_REGION` | Space region: `eu` (default), `us`, `ca`, `ap` or `cn`. |
| `STORYBLOK_VERSION` | `draft` or `published` (default). Which content the site shows. The Visual Editor always gets drafts. |
| `SITE_URL` | Public site URL used in `sitemap.xml` and `robots.txt`. Defaults to Vercel's production domain. |
| `STORYBLOK_API_BASE_URL` | Optional API endpoint override. |

Outside production you can also add `?version=draft` or `?version=published` to any URL. On Vercel production (`VERCEL_ENV=production`) this is ignored and a console error is logged.

### Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Generates the sitemap, typechecks, then builds to `dist/` |
| `npm run preview` | Serves the built site |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run sitemap` | Writes `public/sitemap.xml` and `public/robots.txt` |
| `npm test` | Self-check for the sitemap and robots generator |

## How it works

- **One route for all content.** Every story in Storyblok is rendered by a catch-all route. The URL slug is the story slug (`/` is the `home` story). Adding a page means creating a story, not writing a route.
- **Blocks map to components.** Each Storyblok block has a React component, registered by name in [src/main.tsx](src/main.tsx). An unregistered block does not render, so register every new one.
- **Languages live in the URL.** The space's configured languages are read from Storyblok. If a non-default language is remembered, a plain URL redirects to its prefixed form. Internal links keep the prefix automatically.
- **Loading and errors.** A planet animation shows while content loads. A failed or missing page redirects to `/error`, whose text comes from the `error-page` story in the current language, with bundled English text as a fallback if Storyblok is unavailable.
- **SEO files.** `npm run build` writes `sitemap.xml` from Storyblok's published stories (configuration stories excluded) and a `robots.txt` that allows production and blocks Vercel preview deployments.

### Content model in Storyblok

| Story or type | Blocks |
| --- | --- |
| `navigation` story (type `navigation_header`) | `nav_tab`, `nav_language` |
| `error-page` story (type `error_page`) | `error_message` |
| Pages (type `page`) | `planets_hero` with `planet_cta`, `company_*` sections, `core_value`, `grid`, `teaser`, `feature` |
| Planet pages (type `planet`, under `planets/`) | `planet-hero-banner` with `agency_cta` |

Text fields are translatable. Schemas for the Company Overview blocks are in [storyblok/company-overview-components.json](storyblok/company-overview-components.json).

### Visual Editor setup

1. In Storyblok, go to Settings, then Visual Editor, and set the default environment to `https://localhost:5173/`.
2. Open the `home` story, click Config, and set its real path to `/`.
3. For a deployed preview, use its URL as the environment. Vercel must not require a login for it (see below).

## Project structure

```
src/
  app.tsx, main.tsx        entry point, block registry and routes
  components/              generic UI (Loading)
  pages/                   page-level pieces (PageContent, SiteNavigation, error-page/)
  storyblok/               one folder per Storyblok block component, plus types.ts
  context/language.tsx     language from the URL
  hooks/                   useStory
  helpers/                 helpers and Storyblok version config
  styles/tokens.css        Orbital design tokens
scripts/                   sitemap and robots generator
storyblok/                 block schemas
```

Every component lives in its own folder as `Name/Name.tsx` with `Name/Name.css` beside it. Styling uses the Orbital design tokens in [src/styles/tokens.css](src/styles/tokens.css) (dark theme, Space Grotesk, Inter and JetBrains Mono); use the tokens instead of raw values.

## Deployment

The site is deployed on Vercel from this repository ([vercel.json](vercel.json): Vite build, output `dist`, all paths rewritten to `index.html`). Branches: `main` for production and `develop` for previews.

- Set `STORYBLOK_DELIVERY_API_TOKEN`, `STORYBLOK_REGION` and `STORYBLOK_VERSION` for each Vercel environment. Previews need their own copy of the variables.
- Turn on "Automatically expose System Environment Variables" so `VERCEL_ENV` and the production domain reach the build. They decide the `robots.txt` rules and the production block on `?version`.
- Vercel protects preview deployments with a login by default, which also stops the Storyblok Visual Editor from showing them in a frame. To use a preview in the editor, disable Vercel Authentication for previews (Settings, Deployment Protection) or use an unprotected domain.
- Stories must be published in Storyblok to appear on a `published` site and in the sitemap.

## Working with Claude Code

[CLAUDE.md](CLAUDE.md) holds the architecture notes and conventions for Claude Code. [.mcp.json](.mcp.json) and [.claude/](.claude/) configure the Storyblok, GitHub, Playwright and Chrome DevTools servers, the plugins and the project skills.
