import { Navigate, useLocation } from 'react-router';
import { useLanguage } from './context/language';
import PageContent from './pages/PageContent/PageContent';
import SiteNavigation from './pages/SiteNavigation/SiteNavigation';

export default function App() {
	const { pathname, search, hash } = useLocation();
	const { language, pathWithoutLanguage, localizePath } = useLanguage();

	// A language is set (e.g. Spanish) but the URL has no prefix: send the visitor to /es/...
	if (language && pathWithoutLanguage === pathname) {
		return <Navigate to={{ pathname: localizePath(pathname), search, hash }} replace />;
	}

	const slug = pathWithoutLanguage.replace(/^\/+|\/+$/g, '') || 'home';
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
