import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import Loading from '../../components/Loading';
import { useLanguage } from '../../language';
import { useStory } from '../../storyblok/useStory';
import type { ErrorPageBlok } from '../../storyblok/types';
import ErrorView from './ErrorView';
import { fallbackFor, pickErrorContent } from './errorContent';

/** How long to wait for Storyblok before showing the bundled fallback instead. */
const CMS_TIMEOUT_MS = 4000;

/**
 * Plain React route (not a CMS story). Content comes from the `error-page` story in the current
 * language, and falls back to bundled English content if Storyblok fails or is too slow.
 */
export default function ErrorPage() {
	const { state } = useLocation();
	const status = (state as { status?: number } | null)?.status;
	const { language } = useLanguage();
	const { story, error } = useStory('error-page', language);
	const [timedOut, setTimedOut] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => setTimedOut(true), CMS_TIMEOUT_MS);
		return () => clearTimeout(timer);
	}, []);

	if (!story && !error && !timedOut) return <Loading />;

	const content = story
		? pickErrorContent((story.content as ErrorPageBlok).messages, status)
		: fallbackFor(status);

	return (
		<main>
			<ErrorView code={status || 'Error'} {...content} />
		</main>
	);
}
