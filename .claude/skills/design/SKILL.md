---
name: design
description: Design and build pages and UI sections for the Interplanetary Travel Agency site (planets listing, booking flow, company overview, home). Use when asked to design, style, redesign or add a page, section, or Storyblok block, or to improve the site's look and feel, layout, responsiveness or accessibility.
---

# Web page design for the Interplanetary Travel Agency

Pages here are Storyblok stories rendered by one catch-all route, and each visual section is a Storyblok block backed by a React component in `src/storyblok/`. Design at the block level so editors can recompose pages without code changes.

## Workflow

1. **Clarify the page's job.** Pick one primary action per page. Planets: compare destinations and pick one. Booking: complete a trip request. Company: build trust. Home: route visitors to planets or booking.
2. **Choose a design direction before writing CSS.** Use the `frontend-design` and `ui-ux-pro-max` skills for aesthetic direction, palette and type pairing. The brand is space travel, so aim for a distinctive look, not a generic template. Settle the direction once and record the tokens in step 3.
3. **Define design tokens once** as CSS custom properties in `src/index.css`: colors, type scale, spacing, radius. Replace the blueprint's remote `@import` stylesheet in that file rather than overriding it. Components use the tokens and never hardcode values.
4. **Break the page into blocks.** Reuse `page`, `grid`, `teaser` and `feature` before inventing a new block. For a new block, follow the steps in CLAUDE.md: create it in Storyblok, add the component in `src/storyblok/`, and register it in `src/main.tsx`.
5. **Build mobile-first**, then widen. Check at roughly 360, 768 and 1280px.
6. **Verify in a browser.** Run `npm run dev` and look at the page using the Playwright or Chrome DevTools MCP. Check the layout, the console for errors, and keyboard navigation. Do not report a design as done from code alone.

## Block component rules

- Spread `{...storyblokEditable(blok)}` on each block's root element so the Visual Editor can select it.
- Render nested content with `<StoryblokComponent blok={child} key={child._uid} />`.
- Take all copy and images from `blok` fields. Do not hardcode content that an editor should control.
- Guard optional fields. Storyblok omits empty fields, so `blok.image?.filename` can be undefined.
- Images are Storyblok assets. Set explicit `width`/`height` or `aspect-ratio` to avoid layout shift, use `loading="lazy"` below the fold, and always provide `alt` text (use the asset's alt field).

## Page-specific guidance

- **Planets:** each destination needs an image, a name, a short pitch and key facts such as distance, travel time and price. Present them as scannable cards in a responsive grid. Include a clear "Book" action per card, and handle the empty and unavailable states.
- **Booking:** keep fields to a minimum, validate inline, label every input, and show a clear confirmation. This is the one place a dedicated React route or form component may be justified, because it isn't pure CMS content.
- **Company overview:** a short story, a trust section (safety record, team, numbers) and one call to action.

## Quality bar

- Semantic landmarks (`header`, `main`, `nav`, `footer`) and one `h1` per page, with no skipped heading levels.
- Text contrast meets WCAG AA. Interactive elements have visible focus states and are at least 44px tall on touch.
- Respect `prefers-reduced-motion`. Space themes invite heavy animation, so keep motion purposeful.
- Respect `prefers-color-scheme` if a dark theme is used. A space theme is dark by default, so still verify contrast.
- No horizontal scroll at 360px.
- Run `npm run typecheck` and `npm run lint` before finishing.
