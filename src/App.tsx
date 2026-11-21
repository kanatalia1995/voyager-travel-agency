import { StoryblokComponent } from '@storyblok/react';
import { Navigate, useParams } from 'react-router';
import { useLanguage } from './language';
import Loading from './components/Loading';
import NavigationHeader from './storyblok/navigation/NavigationHeader';
import { useStory } from './storyblok/useStory';
import type { NavigationHeaderBlok } from './storyblok/types';

/** Fetches the shared navigation story and renders it above every page. */
function SiteNavigation({ language }: { language: string }) {
	const { story, error } = useStory('navigation', language);
	// A missing header must not take the whole page down: render nothing instead of redirecting.
	if (error) return null;
	if (!story?.content) {
		return <div className="site-nav site-nav--loading" aria-hidden="true" />;
	}
	return <NavigationHeader blok={story.content as NavigationHeaderBlok} />;
}

function PageContent({ slug, language }: { slug: string; language: string }) {
	const { story, error } = useStory(slug, language);
	if (error) {
		return <Navigate to="/error" replace state={{ status: error.status, from: slug }} />;
	}
	if (!story?.content) {
		return <Loading />;
	}
	return (
		<>
			<StoryblokComponent blok={story.content} />
			<footer>All rights reserved © {new Date().getFullYear()}</footer>
		</>
	);
}

export default function App() {
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
		</>
	);
}
