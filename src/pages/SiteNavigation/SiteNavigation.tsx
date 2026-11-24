import NavigationHeader from '../../storyblok/NavigationHeader/NavigationHeader';
import { useStory } from '../../hooks/useStory';
import type { NavigationHeaderBlok } from '../../storyblok/types';

/** Fetches the shared navigation story and renders it above every page. */
export default function SiteNavigation({ language }: { language: string }) {
	const { story, error } = useStory('navigation', language);
	// A missing header must not take the whole page down: render nothing instead of redirecting.
	if (error) return null;
	if (!story?.content) {
		return <div className="site-nav site-nav--loading" aria-hidden="true" />;
	}
	return <NavigationHeader blok={story.content as NavigationHeaderBlok} />;
}
