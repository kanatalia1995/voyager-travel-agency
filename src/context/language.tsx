import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { getStoryblokApi } from '@storyblok/react';
import Loading from '../components/Loading';

interface LanguageContextValue {
	/** Storyblok language code; '' is the space's default language. */
	language: string;
	/** Current path without its language prefix, e.g. `/es/company-overview` -> `/company-overview`. */
	pathWithoutLanguage: string;
	/** Adds the current language prefix to an internal path: `/company-overview` -> `/es/company-overview`. */
	localizePath: (path: string) => string;
	/** Switches language: remembers the choice and moves to the same page under the new prefix. */
	setLanguage: (code: string) => void;
}

const STORAGE_KEY = 'language';

const LanguageContext = createContext<LanguageContextValue>({
	language: '',
	pathWithoutLanguage: '/',
	localizePath: (path) => path,
	setLanguage: () => {},
});

function readStoredLanguage(): string {
	try {
		return localStorage.getItem(STORAGE_KEY) ?? '';
	} catch {
		return '';
	}
}

/** Non-default language codes configured in the Storyblok space, e.g. ['es']. Empty if the call fails. */
async function fetchLanguageCodes(): Promise<string[]> {
	try {
		const { data } = await getStoryblokApi().get('cdn/spaces/me');
		return (data.space?.language_codes as string[] | undefined) ?? [];
	} catch (error) {
		console.error('[storyblok] Could not load the space languages; language URLs are disabled.', error);
		return [];
	}
}

/**
 * Layout route that owns the language. The URL is the source of truth (`/es/company-overview`);
 * the default language has no prefix. Languages come from the Storyblok space settings.
 */
export function LanguageLayout() {
	const { pathname, search, hash } = useLocation();
	const navigate = useNavigate();
	const [codes, setCodes] = useState<string[] | null>(null);
	const [stored, setStored] = useState(readStoredLanguage);

	useEffect(() => {
		let cancelled = false;
		fetchLanguageCodes().then((result) => !cancelled && setCodes(result));
		return () => {
			cancelled = true;
		};
	}, []);

	const urlPrefix = codes?.find((code) => pathname === `/${code}` || pathname.startsWith(`/${code}/`)) ?? '';
	// A language in the URL wins; otherwise the visitor's remembered choice applies.
	const language = urlPrefix || (codes?.includes(stored) ? stored : '');
	const pathWithoutLanguage = urlPrefix ? pathname.slice(urlPrefix.length + 1) || '/' : pathname;

	// Remember a language chosen by opening a prefixed URL, so later visits redirect to it.
	useEffect(() => {
		if (!urlPrefix) return;
		try {
			localStorage.setItem(STORAGE_KEY, urlPrefix);
		} catch {
			// Storage can be blocked; the URL still carries the language.
		}
	}, [urlPrefix]);

	useEffect(() => {
		document.documentElement.lang = language || 'en';
	}, [language]);

	const value = useMemo<LanguageContextValue>(() => {
		const localizePath = (path: string) => {
			if (!language || !path.startsWith('/') || path.startsWith('//')) return path;
			if (path === `/${language}` || path.startsWith(`/${language}/`)) return path;
			return path === '/' ? `/${language}` : `/${language}${path}`;
		};
		return {
			language,
			pathWithoutLanguage,
			localizePath,
			setLanguage: (code) => {
				setStored(code);
				try {
					localStorage.setItem(STORAGE_KEY, code);
				} catch {
					// Storage can be blocked; the URL still carries the language.
				}
				// The error page has no language URL: it just re-renders in the new language.
				if (pathWithoutLanguage.startsWith('/error')) return;
				const target = code ? (pathWithoutLanguage === '/' ? `/${code}` : `/${code}${pathWithoutLanguage}`) : pathWithoutLanguage;
				navigate({ pathname: target, search, hash });
			},
		};
	}, [language, pathWithoutLanguage, navigate, search, hash]);

	// Wait for the space's language list so the first render already uses the right language.
	if (codes === null) return <Loading />;
	return (
		<LanguageContext.Provider value={value}>
			<Outlet />
		</LanguageContext.Provider>
	);
}

// eslint-disable-next-line react-refresh/only-export-components
export const useLanguage = () => useContext(LanguageContext);
