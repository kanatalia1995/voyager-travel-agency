import { StoryblokComponent } from '@storyblok/react';
import { Navigate, useLocation } from 'react-router';
import Loading from '../../components/Loading/Loading';
import { useStory } from '../../hooks/useStory';

export default function PageContent({ slug, language }: { slug: string; language: string }) {
	const { story, error } = useStory(slug, language);
	const { search } = useLocation();
	if (error) {
		// Keep the query string so ?version=draft survives reloads of the error page.
		return <Navigate to={{ pathname: '/error', search }} replace state={{ status: error.status, from: slug }} />;
	}
	if (!story?.content) {
		return <Loading />;
	}
	return (
		<>
			<StoryblokComponent blok={story.content} />
			<footer>
				<span>All rights reserved © 2085 </span>
				{/* Plain link on purpose: sitemap.xml is a static file, not a route of the app. */}
				<a href="/sitemap.xml" target="_blank" rel="noopener noreferrer">
					Sitemap
				</a>
			</footer>
		</>
	);
}
