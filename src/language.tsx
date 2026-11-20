import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

interface LanguageContextValue {
	/** Storyblok language code; '' is the space's default language. */
	language: string;
	setLanguage: (code: string) => void;
}

const STORAGE_KEY = 'language';

const LanguageContext = createContext<LanguageContextValue>({ language: '', setLanguage: () => {} });

function readStoredLanguage(): string {
	try {
		return localStorage.getItem(STORAGE_KEY) ?? '';
	} catch {
		return '';
	}
}

export function LanguageProvider({ children }: { children: ReactNode }) {
	const [language, setLanguageState] = useState(readStoredLanguage);

	useEffect(() => {
		document.documentElement.lang = language || 'en';
	}, [language]);

	const value = useMemo<LanguageContextValue>(
		() => ({
			language,
			setLanguage: (code) => {
				setLanguageState(code);
				try {
					localStorage.setItem(STORAGE_KEY, code);
				} catch {
					// Storage can be blocked; the choice then lasts for this visit only.
				}
			},
		}),
		[language],
	);

	return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useLanguage = () => useContext(LanguageContext);
