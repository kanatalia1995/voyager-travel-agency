import { StoryblokComponent, useStoryblok } from '@storyblok/react';
import { useParams } from 'react-router';
import { useLanguage } from './language';
import NavigationHeader from './storyblok/navigation/NavigationHeader';
import type { NavigationHeaderBlok } from './storyblok/types';

/** Fetches the shared navigation story and renders it above every page. */
function SiteNavigation({ language }: { language: string }) {
	const story = useStoryblok('navigation', { version: 'draft', language: language || undefined });
	if (!story?.content) {
		return <div className="site-nav site-nav--loading" aria-hidden="true" />;
	}
	return <NavigationHeader blok={story.content as NavigationHeaderBlok} />;
}

function PageContent({ slug, language }: { slug: string; language: string }) {
	const story = useStoryblok(slug, { version: 'draft', language: language || undefined });
	if (!story?.content) {
		return <div>Loading...</div>;
	}
	return <StoryblokComponent blok={story.content} />;
}

export default function App() {
	const currentYear = new Date().getFullYear();
	const { '*': splat } = useParams();
	const slug = splat || 'home';
	const { language } = useLanguage();
	// The navigation story renders its own header (so it can be edited in the Visual Editor).
	const showSiteNavigation = slug !== 'navigation';

	return (
		<>
			{/* `key` remounts on language change so Storyblok refetches the translated story. */}
			{showSiteNavigation && <SiteNavigation key={`nav:${language}`} language={language} />}
			<PageContent key={`${slug}:${language}`} slug={slug} language={language} />
			<footer>All rights reserved © {currentYear}</footer>
		</>
	);
}
