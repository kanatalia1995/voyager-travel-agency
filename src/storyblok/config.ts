export type StoryblokVersion = 'draft' | 'published';

/** Query parameter that switches the content version, e.g. `?version=draft`. */
export const VERSION_QUERY_PARAM = 'version';

/** From STORYBLOK_VERSION. Anything other than "draft" means published (the default). */
const configuredVersion: StoryblokVersion =
	import.meta.env.STORYBLOK_VERSION === 'draft' ? 'draft' : 'published';

/** Set by Vercel at build time (see vite.config.ts). */
const isProduction = import.meta.env.VERCEL_ENV === 'production';

/** The Visual Editor loads the app with a `_storyblok` query param and must see drafts. */
const inVisualEditor = (params: URLSearchParams) => params.has('_storyblok');

function resolveVersion(): StoryblokVersion {
	if (typeof window === 'undefined') return configuredVersion;
	const params = new URLSearchParams(window.location.search);
	if (inVisualEditor(params)) return 'draft';

	const requested = params.get(VERSION_QUERY_PARAM);
	if (requested === null) return configuredVersion;

	if (isProduction) {
		console.error(
			`[storyblok] Changing the content version from the URL is blocked when VERCEL_ENV=production ` +
				`(requested "${requested}"). Using "${configuredVersion}".`,
		);
		return configuredVersion;
	}
	if (requested !== 'draft' && requested !== 'published') {
		console.error(
			`[storyblok] Invalid "${VERSION_QUERY_PARAM}" query parameter "${requested}". ` +
				`Use "draft" or "published". Using "${configuredVersion}".`,
		);
		return configuredVersion;
	}
	return requested;
}

// Resolved once per page load, so the choice survives client-side navigation and errors are logged once.
const version = resolveVersion();

export const getStoryblokVersion = (): StoryblokVersion => version;
