import { StoryblokComponent } from '@storyblok/react';
import { Navigate, useLocation } from 'react-router';
import Loading from '../../components/Loading';
import { useStory } from '../../storyblok/useStory';

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
			<footer>All rights reserved © {new Date().getFullYear()}</footer>
		</>
	);
}
