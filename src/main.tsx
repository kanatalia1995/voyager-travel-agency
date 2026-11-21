import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';

import './index.css';
import App from './app';
import ErrorPage from './pages/error-page/ErrorPage';
import RenderErrorRedirect from './pages/error-page/RenderErrorRedirect';
import ErrorPageBlock from './pages/error-page/ErrorPageBlock';
import { storyblokInit, apiPlugin } from '@storyblok/react';

import Page from './storyblok/Page';
import Teaser from './storyblok/Teaser';
import Feature from './storyblok/Feature';
import Grid from './storyblok/Grid';
import NavigationHeader from './storyblok/navigation/NavigationHeader';
import { LanguageProvider } from './context/language';
import CompanyHero from './storyblok/company/CompanyHero';
import CompanyMission from './storyblok/company/CompanyMission';
import CompanyKeyFigures from './storyblok/company/CompanyKeyFigures';
import CompanyStory from './storyblok/company/CompanyStory';
import CompanyTeam from './storyblok/company/CompanyTeam';
import CompanySafety from './storyblok/company/CompanySafety';
import CompanySpaceports from './storyblok/company/CompanySpaceports';
import CompanyPartners from './storyblok/company/CompanyPartners';
import CompanyTestimonials from './storyblok/company/CompanyTestimonials';
import CompanyContact from './storyblok/company/CompanyContact';
import CompanyCta from './storyblok/company/CompanyCta';

storyblokInit({
	accessToken: import.meta.env.STORYBLOK_DELIVERY_API_TOKEN,
	apiOptions: {
		/** Set the correct region for your space. Learn more: https://www.storyblok.com/docs/packages/storyblok-js */
		region: import.meta.env.STORYBLOK_REGION || 'eu',
		/** The following code is only required when creating a Storyblok space directly via the Blueprints feature. */
		endpoint: import.meta.env.STORYBLOK_API_BASE_URL
			? `${new URL(import.meta.env.STORYBLOK_API_BASE_URL).origin}/v2`
			: undefined,
	},
	use: [apiPlugin],
	components: {
		page: Page,
		teaser: Teaser,
		feature: Feature,
		grid: Grid,
		navigation_header: NavigationHeader,
		error_page: ErrorPageBlock,
		company_hero: CompanyHero,
		company_mission: CompanyMission,
		company_key_figures: CompanyKeyFigures,
		company_story: CompanyStory,
		company_team: CompanyTeam,
		company_safety: CompanySafety,
		company_spaceports: CompanySpaceports,
		company_partners: CompanyPartners,
		company_testimonials: CompanyTestimonials,
		company_contact: CompanyContact,
		company_cta: CompanyCta,
	},
});
const router = createBrowserRouter([
	{ path: '/error', Component: ErrorPage },
	{
		path: '/*',
		Component: App,
		// Anything that throws while rendering ends up on the error page too.
		ErrorBoundary: RenderErrorRedirect,
	},
]);
const root = document.getElementById('root')!;

createRoot(root).render(
	<StrictMode>
		<LanguageProvider>
			<RouterProvider router={router} />
		</LanguageProvider>
	</StrictMode>,
);
