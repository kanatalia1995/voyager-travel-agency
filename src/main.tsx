import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';

import './index.css';
import App from './app';
import ErrorPage from './pages/error-page/ErrorPage/ErrorPage';
import RenderErrorRedirect from './pages/error-page/RenderErrorRedirect/RenderErrorRedirect';
import ErrorPageBlock from './pages/error-page/ErrorPageBlock/ErrorPageBlock';
import { storyblokInit, apiPlugin } from '@storyblok/react';

import Page from './storyblok/Page/Page';
import Teaser from './storyblok/Teaser/Teaser';
import Feature from './storyblok/Feature/Feature';
import Grid from './storyblok/Grid/Grid';
import NavigationHeader from './storyblok/NavigationHeader/NavigationHeader';
import { LanguageLayout } from './context/language';
import CompanyHero from './storyblok/CompanyHero/CompanyHero';
import CompanyMission from './storyblok/CompanyMission/CompanyMission';
import CompanyKeyFigures from './storyblok/CompanyKeyFigures/CompanyKeyFigures';
import CompanyStory from './storyblok/CompanyStory/CompanyStory';
import CompanyTeam from './storyblok/CompanyTeam/CompanyTeam';
import CompanySafety from './storyblok/CompanySafety/CompanySafety';
import CompanySpaceports from './storyblok/CompanySpaceports/CompanySpaceports';
import CompanyPartners from './storyblok/CompanyPartners/CompanyPartners';
import CompanyTestimonials from './storyblok/CompanyTestimonials/CompanyTestimonials';
import CompanyContact from './storyblok/CompanyContact/CompanyContact';
import CompanyCta from './storyblok/CompanyCta/CompanyCta';
import CoreValue from './storyblok/CoreValue/CoreValue';
import Planet from './storyblok/Planet/Planet';
import PlanetHeroBanner from './storyblok/PlanetHeroBanner/PlanetHeroBanner';
import AgencyCta from './storyblok/AgencyCta/AgencyCta';
import PlanetsHero from './storyblok/PlanetsHero/PlanetsHero';
import PlanetCta from './storyblok/PlanetCta/PlanetCta';

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
		core_value: CoreValue,
		planet: Planet,
		'planet-hero-banner': PlanetHeroBanner,
		agency_cta: AgencyCta,
		planets_hero: PlanetsHero,
		planet_cta: PlanetCta,
	},
});
const router = createBrowserRouter([
	{
		// Owns the language (from the URL) for every route below.
		Component: LanguageLayout,
		children: [
			{ path: '/error', Component: ErrorPage },
			{
				path: '/*',
				Component: App,
				// Anything that throws while rendering ends up on the error page too.
				ErrorBoundary: RenderErrorRedirect,
			},
		],
	},
]);
const root = document.getElementById('root')!;

createRoot(root).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>,
);
