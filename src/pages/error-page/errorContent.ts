import { asArray, linkUrl } from '../../helpers/helpers';
import type { ErrorMessageBlok } from '../../storyblok/types';

export interface ErrorContent {
	title: string;
	message: string;
	actionLabel: string;
	actionTo: string;
}

/** Bundled English content, used whenever Storyblok can't provide a message. */
export const FALLBACK_NOT_FOUND: ErrorContent = {
	title: 'Lost in space',
	message: "We couldn't find the page you were looking for.",
	actionLabel: 'Back to home',
	actionTo: '/',
};

export const FALLBACK_GENERIC: ErrorContent = {
	title: 'Something went wrong',
	message: "We couldn't load this page. Please try again in a moment.",
	actionLabel: 'Back to home',
	actionTo: '/',
};

export const fallbackFor = (status?: number): ErrorContent =>
	status === 404 ? FALLBACK_NOT_FOUND : FALLBACK_GENERIC;

/**
 * Picks the Storyblok message for a status (exact code first, then the default one with an empty
 * code). Any field the editor left empty falls back to the bundled content.
 */
export function pickErrorContent(blocks: ErrorMessageBlok[] | undefined, status?: number): ErrorContent {
	const fallback = fallbackFor(status);
	const messages = asArray(blocks);
	const block =
		messages.find((m) => status !== undefined && m.status_code?.trim() === String(status)) ??
		messages.find((m) => !m.status_code?.trim());
	if (!block) return fallback;
	return {
		title: block.title || fallback.title,
		message: block.message || fallback.message,
		actionLabel: block.action_label || fallback.actionLabel,
		actionTo: linkUrl(block.action_link) || fallback.actionTo,
	};
}
