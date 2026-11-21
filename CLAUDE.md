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

There is no test runner configured.

## Environment

Copy `.env.example` to `.env`. Variables: `STORYBLOK_DELIVERY_API_TOKEN` (use the space's preview token) and `STORYBLOK_REGION` (defaults to `eu` in code). An optional `STORYBLOK_API_BASE_URL` overrides the endpoint.

`vite.config.ts` uses `define` to inject the `STORYBLOK_*` variables into `import.meta.env`. Vite would otherwise expose only `VITE_*` variables. Any new `STORYBLOK_*` variable you read in client code must also be added to that `define` block.

## Architecture

This is a client-rendered SPA. A single catch-all route renders every CMS page.

- [src/main.tsx](src/main.tsx) calls `storyblokInit` with the token and region and the `apiPlugin`. It also holds the **component registry** that maps Storyblok block names to React components (`page`, `teaser`, `grid`, `feature`). It mounts a React Router `createBrowserRouter` with one route, `/*`.
- [src/App.tsx](src/App.tsx) reads the splat param as the story slug (`home` for `/`). It fetches the story with `useStoryblok(slug, { version: getStoryblokVersion() })` and renders `<StoryblokComponent blok={story.content} />`. Nested blocks render the same way and resolve through the registry.
- The site header is the Storyblok story `navigation` (content type `navigation_header`, Block Library group **Navigation**). [src/App.tsx](src/App.tsx) fetches it and renders [NavigationHeader](src/storyblok/navigation/NavigationHeader.tsx) above every page. It is sticky at the top. The language switcher stores the chosen Storyblok language code in [src/language.tsx](src/language.tsx), and `App.tsx` remounts and refetches stories when it changes. Language codes configured in the header must exist in the space's Settings > Internationalization.
- Stories load through [useStory](src/storyblok/useStory.ts) (not `useStoryblok`, which swallows errors). While loading, [Loading](src/components/Loading.tsx) (animated planet) is shown. If the page story fails to load (404 or network), `App.tsx` redirects to the plain React route `/error` ([ErrorPage](src/pages/error-page/ErrorPage.tsx)), whose text comes from the Storyblok story `error-page` (content type `error_page`, Block Library group **Errors**; one `error_message` block per status code plus a default with an empty code; all text fields are translatable). It uses the current language and falls back to the bundled English text in [src/pages/error-page/errorContent.ts](src/pages/error-page/errorContent.ts) if Storyblok fails, returns no matching message, or takes over 4 seconds; render errors are redirected there too. A failed navigation story does not redirect, it just renders no header.
- [src/storyblok/](src/storyblok/) holds one React component per Storyblok block. Each receives its content as a `blok` prop.

To add a content type: create the block in Storyblok, add a component in `src/storyblok/`, and **register it in `src/main.tsx`**. An unregistered block silently fails to render.

Because routing is catch-all, new pages like planets, booking and company are Storyblok stories, not React Router routes. Add explicit routes only for non-CMS behavior such as a booking form.

The Storyblok content version comes from `STORYBLOK_VERSION` (`draft` or `published`, default `published`; see [src/storyblok/config.ts](src/storyblok/config.ts)). The Visual Editor is detected by its `_storyblok` query param and always gets drafts. Outside production, `?version=draft` or `?version=published` in the URL overrides it. When `VERCEL_ENV=production` the override is ignored and a `console.error` is logged. `VERCEL_ENV` reaches the client through `define` in `vite.config.ts`, so Vercel's "Automatically expose System Environment Variables" must be on. Stories must be published in Storyblok before they show with `published`. Use `draft` with the space's preview token. The Visual Editor needs the app served over HTTPS and the space's Visual Editor default environment set to `https://localhost:5173/`. The `home` story needs real path `/`.

## Deployment

Vercel is the target ([vercel.json](vercel.json)): Vite framework, output `dist`, and a rewrite of all paths to `/index.html` for SPA routing. A leftover [netlify.toml](netlify.toml) from the blueprint does the same and can be ignored. Set the `STORYBLOK_*` variables in the Vercel project settings.

## Conventions

- Prettier uses tabs ([.prettierrc](.prettierrc)). ESLint enforces react-hooks rules. Unused variables error unless the name starts with an uppercase letter or `_`.
- [AGENTS.md](AGENTS.md) points to the Storyblok agent skills (https://github.com/storyblok/agent-plugin) and docs. Check them before writing Storyblok code.
