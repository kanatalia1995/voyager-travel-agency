# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Interplanetary Travel Agency: users browse which planets are available to travel to, book a trip, and read a company overview. Stack: Node, React, Storyblok (headless CMS), deployed on Vercel. The repo started from the Storyblok React blueprint (`blueprint-core-react`). The Company Overview page is built: its 11 section blocks live in [src/storyblok/company/](src/storyblok/company/), and the Storyblok schemas are in [storyblok/company-overview-components.json](storyblok/company-overview-components.json). The planets and booking pages are not built yet.

The code is TypeScript (`strict`). Storyblok block types live in [src/storyblok/types.ts](src/storyblok/types.ts). Add a type there for any new block.

## Commands

```sh
npm install
npm run dev       # Vite dev server at https://localhost:5173 (HTTPS via vite-plugin-mkcert)
npm run build     # typechecks, then outputs dist/
npm run typecheck # tsc --noEmit
npm run preview   # serve the built dist/
npm run lint      # eslint .
```

`npm run build` first runs `npm run sitemap` ([scripts/generate-sitemap.mjs](scripts/generate-sitemap.mjs)), which writes `public/sitemap.xml` from Storyblok's Links API (published stories only; `navigation` and `error-page` are excluded; `home` maps to `/`). The same script writes `public/robots.txt`: crawlable with a `Sitemap:` line when `VERCEL_ENV` is `production` (or unset), `Disallow: /` on Vercel preview deployments. It uses `SITE_URL`, else Vercel's production domain, and only warns (never fails the build) if the API call fails. `npm test` runs the sitemap self-check with Node's built-in runner; there is no other test runner.

## Environment

Copy `.env.example` to `.env`. Variables: `STORYBLOK_DELIVERY_API_TOKEN` (use the space's preview token) and `STORYBLOK_REGION` (defaults to `eu` in code). An optional `STORYBLOK_API_BASE_URL` overrides the endpoint.

`vite.config.ts` uses `define` to inject the `STORYBLOK_*` variables into `import.meta.env`. Vite would otherwise expose only `VITE_*` variables. Any new `STORYBLOK_*` variable you read in client code must also be added to that `define` block.

## Architecture

This is a client-rendered SPA. A single catch-all route renders every CMS page.

- [src/main.tsx](src/main.tsx) calls `storyblokInit` with the token and region and the `apiPlugin`. It also holds the **component registry** that maps Storyblok block names to React components (`page`, `teaser`, `grid`, `feature`). It mounts a React Router `createBrowserRouter` with one route, `/*`.
- [src/app.tsx](src/app.tsx) reads the splat param as the story slug (`home` for `/`). It renders [SiteNavigation](src/pages/SiteNavigation/index.tsx) and [PageContent](src/pages/PageContent/index.tsx), which fetch the stories (see `useStory` below) and render `<StoryblokComponent blok={story.content} />`. Nested blocks render the same way and resolve through the registry.
- The site header is the Storyblok story `navigation` (content type `navigation_header`, Block Library group **Navigation**). [SiteNavigation](src/pages/SiteNavigation/index.tsx) fetches it and renders [NavigationHeader](src/storyblok/navigation/NavigationHeader/index.tsx) above every page. It is sticky at the top. Languages live in the URL: the default language has no prefix (`/company-overview`), every other configured language is a prefix (`/es/company-overview`). [LanguageLayout](src/context/language.tsx) (a layout route wrapping every route) loads the space's language codes from Storyblok (`cdn/spaces/me`), derives the current language from the URL, and remembers the last chosen one in `localStorage`. If a non-default language is remembered and the URL has no prefix, `app.tsx` redirects to the prefixed URL. The header's language picker navigates to the same page under the new prefix. Internal links rendered through `SmartLink` keep the current prefix automatically (use `useLanguage().localizePath` for anything else). An unknown prefix (e.g. `/fr/...`) is treated as a slug and ends on the error page. The picker only lists languages entered in the `navigation` story, and their codes must exist in the space's Settings > Internationalization.
- Stories load through [useStory](src/storyblok/useStory.ts) (not `useStoryblok`, which swallows errors). While loading, [Loading](src/components/Loading/index.tsx) (animated planet) is shown. If the page story fails to load (404 or network), `PageContent` redirects to the plain React route `/error` ([ErrorPage](src/pages/error-page/ErrorPage/index.tsx)), whose text comes from the Storyblok story `error-page` (content type `error_page`, Block Library group **Errors**; one `error_message` block per status code plus a default with an empty code; all text fields are translatable). It uses the current language and falls back to the bundled English text in [src/pages/error-page/errorContent.ts](src/pages/error-page/errorContent.ts) if Storyblok fails, returns no matching message, or takes over 4 seconds; render errors are redirected there too. A failed navigation story does not redirect, it just renders no header.
- [src/storyblok/](src/storyblok/) holds one React component per Storyblok block. Each receives its content as a `blok` prop.

Component convention: every React component lives in its own folder named after it, with the component in `index.tsx` and its styles in `<ComponentName>.css` next to it (e.g. `Loading/index.tsx` + `Loading/Loading.css`). Imports use the folder (`import Loading from './components/Loading'`). Shared Company Overview styles live in `company/Section/Section.css`.

`core_value` is a standalone block ([CoreValue](src/storyblok/company/CoreValue/index.tsx): icon, title, description) usable in any story (e.g. inside a `grid` on `booking`) and reused by the company mission section.

Planet pages: the `planet` content type (stories under the `planets` folder, e.g. `planets/mars` at `/planets/mars`) renders through [Planet](src/storyblok/planet/Planet/index.tsx), whose `hero` field holds a `planet-hero-banner` block ([PlanetHeroBanner](src/storyblok/planet/PlanetHeroBanner/index.tsx): image or looping video, name, description and `agency_cta` buttons rendered by [AgencyCta](src/storyblok/planet/AgencyCta/index.tsx)). Note the block name is hyphenated in Storyblok (`planet-hero-banner`). The home page hero is the `planets_hero` block ([PlanetsHero](src/storyblok/planet/PlanetsHero/index.tsx): eyebrow `subtitle`, `title`, `helper_cutline`, and a `planet_links` list of `planet_cta` blocks rendered by [PlanetCta](src/storyblok/planet/PlanetCta/index.tsx): image or video, name, description and a link to the planet story).

To add a content type: create the block in Storyblok, add a component in `src/storyblok/`, and **register it in `src/main.tsx`**. An unregistered block silently fails to render.

Because routing is catch-all, new pages like planets, booking and company are Storyblok stories, not React Router routes. Add explicit routes only for non-CMS behavior such as a booking form.

The Storyblok content version comes from `STORYBLOK_VERSION` (`draft` or `published`, default `published`; see [src/storyblok/config.ts](src/storyblok/config.ts)). The Visual Editor is detected by its `_storyblok` query param and always gets drafts. Outside production, `?version=draft` or `?version=published` in the URL overrides it. When `VERCEL_ENV=production` the override is ignored and a `console.error` is logged. `VERCEL_ENV` reaches the client through `define` in `vite.config.ts`, so Vercel's "Automatically expose System Environment Variables" must be on. Stories must be published in Storyblok before they show with `published`. Use `draft` with the space's preview token. The Visual Editor needs the app served over HTTPS and the space's Visual Editor default environment set to `https://localhost:5173/`. The `home` story needs real path `/`.

## Deployment

Vercel is the target ([vercel.json](vercel.json)): Vite framework, output `dist`, and a rewrite of all paths to `/index.html` for SPA routing. A leftover [netlify.toml](netlify.toml) from the blueprint does the same and can be ignored. Set the `STORYBLOK_*` variables in the Vercel project settings.

## Conventions

- Prettier uses tabs ([.prettierrc](.prettierrc)). ESLint enforces react-hooks rules. Unused variables error unless the name starts with an uppercase letter or `_`.
- [AGENTS.md](AGENTS.md) points to the Storyblok agent skills (https://github.com/storyblok/agent-plugin) and docs. Check them before writing Storyblok code.
