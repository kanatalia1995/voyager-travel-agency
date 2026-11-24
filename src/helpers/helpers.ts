import type { StoryblokLink } from '../storyblok/types';

/** Resolve a Storyblok link field (multilink) to a URL string, or '' when empty. */
export function linkUrl(link?: StoryblokLink | null): string {
	if (!link) return '';
	if (link.linktype === 'story') {
		const path = link.cached_url || link.story?.full_slug || '';
		return path ? `/${path.replace(/^\//, '')}` : '';
	}
	return link.url || link.cached_url || '';
}

/** Storyblok omits empty blok fields, so normalise to an array. */
export const asArray = <T>(value: T[] | undefined | null): T[] =>
	Array.isArray(value) ? value : [];
