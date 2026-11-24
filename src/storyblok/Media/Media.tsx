import { useState } from 'react';
import type { StoryblokAsset } from '../types';

const VIDEO_PATTERN = /\.(mp4|webm|mov|m4v|ogv)(\?.*)?$/i;

const isVideo = (asset?: StoryblokAsset) => VIDEO_PATTERN.test(asset?.filename || '');

const prefersReducedMotion = () =>
	typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

interface MediaProps {
	asset?: StoryblokAsset;
	className?: string;
	background?: boolean;
	loading?: 'lazy' | 'eager';
}

/**
 * Renders a Storyblok asset field as an image or, when the file is a video, a <video>.
 * - `background`: decorative looping video (muted, no controls). It does not autoplay
 *   for visitors who prefer reduced motion.
 * - otherwise: a video with playback controls.
 */
export default function Media({ asset, className, background = false, loading = 'lazy' }: MediaProps) {
	// Read once on mount; background videos stay paused for reduced-motion visitors.
	const [reduceMotion] = useState(prefersReducedMotion);

	if (!asset?.filename) return null;

	if (!isVideo(asset)) {
		return <img className={className} src={asset.filename} alt={asset.alt || ''} loading={loading} />;
	}

	if (background) {
		return (
			<video
				className={className}
				src={asset.filename}
				autoPlay={!reduceMotion}
				loop
				muted
				playsInline
				preload="metadata"
				aria-hidden="true"
				tabIndex={-1}
			/>
		);
	}

	return (
		<video
			className={className}
			src={asset.filename}
			controls
			muted
			playsInline
			preload="metadata"
			aria-label={asset.alt || undefined}
		/>
	);
}
