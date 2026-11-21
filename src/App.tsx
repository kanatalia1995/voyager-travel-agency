import { useParams } from 'react-router';
import { useLanguage } from './language';
import PageContent from './pages/PageContent';
import SiteNavigation from './pages/SiteNavigation';

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
