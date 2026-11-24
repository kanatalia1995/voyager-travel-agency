import { useEffect, useState } from 'react';
import { getStoryblokApi, useStoryblokState, type ISbStoryData } from '@storyblok/react';
import { getStoryblokVersion } from '../helpers/config';

export interface StoryError {
	/** HTTP status from Storyblok (404 = story not found); 0 for network failures. */
	status: number;
	message: string;
}

interface FetchState {
	story: ISbStoryData | null;
	error: StoryError | null;
}

// Stable reference: the bridge hook re-registers whenever this changes.
const BRIDGE_OPTIONS = {};

/**
 * Fetches a story and, unlike `useStoryblok`, reports failures so callers can react to them.
 * Keeps Visual Editor live updates working through `useStoryblokState`.
 */
export function useStory(slug: string, language: string) {
	const [{ story: fetched, error }, setState] = useState<FetchState>({ story: null, error: null });

	useEffect(() => {
		let cancelled = false;
		getStoryblokApi()
			.get(`cdn/stories/${slug}`, {
				version: getStoryblokVersion(),
				language: language || undefined,
			})
			.then(({ data }) => {
				if (!cancelled) setState({ story: data.story as ISbStoryData, error: null });
			})
			.catch((err: { status?: number; message?: string }) => {
				if (cancelled) return;
				const failure = { status: err?.status ?? 0, message: err?.message ?? 'Request failed' };
				console.error(`[storyblok] Failed to load "${slug}":`, failure);
				setState({ story: null, error: failure });
			});
		return () => {
			cancelled = true;
		};
	}, [slug, language]);

	const story = useStoryblokState(fetched, BRIDGE_OPTIONS);
	return { story, error, loading: !story && !error };
}
