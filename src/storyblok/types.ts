import type { SbBlokData } from '@storyblok/react';

/** Storyblok asset field. */
export interface StoryblokAsset {
	filename?: string | null;
	alt?: string | null;
}

/** Storyblok link (multilink) field. */
export interface StoryblokLink {
	linktype?: 'story' | 'url' | 'email' | 'asset';
	url?: string;
	cached_url?: string;
	story?: { full_slug?: string };
}

/** Fields shared by every Company Overview section. */
export interface SectionBlok extends SbBlokData {
	title?: string;
	subtitle?: string;
	is_hidden?: boolean;
}

export interface HeroBlok extends SbBlokData {
	name?: string;
	tagline?: string;
	logo?: StoryblokAsset;
	hero_image?: StoryblokAsset;
	is_hidden?: boolean;
}

export interface CoreValueBlok extends SbBlokData {
	title?: string;
	description?: string;
	icon?: StoryblokAsset;
}

export interface MissionBlok extends SectionBlok {
	mission?: string;
	vision?: string;
	values?: CoreValueBlok[];
}

export interface StatisticBlok extends SbBlokData {
	label?: string;
	value?: string;
	unit?: string;
}

export interface KeyFiguresBlok extends SectionBlok {
	statistics?: StatisticBlok[];
}

export interface MilestoneBlok extends SbBlokData {
	date?: string;
	title?: string;
	description?: string;
	image?: StoryblokAsset;
}

export interface StoryBlok extends SectionBlok {
	milestones?: MilestoneBlok[];
}

export interface TeamMemberBlok extends SbBlokData {
	full_name?: string;
	role?: string;
	bio?: string;
	photo?: StoryblokAsset;
	profile_link?: StoryblokLink;
}

export interface TeamBlok extends SectionBlok {
	members?: TeamMemberBlok[];
}

export interface CertificationBlok extends SbBlokData {
	name?: string;
	issuing_authority?: string;
	issue_date?: string;
	expiration_date?: string;
	badge?: StoryblokAsset;
}

export interface SafetyBlok extends SectionBlok {
	certifications?: CertificationBlok[];
}

export interface SpaceportBlok extends SbBlokData {
	name?: string;
	planet?: string;
	city?: string;
	latitude?: string;
	longitude?: string;
	description?: string;
	is_active?: boolean;
}

export interface SpaceportsBlok extends SectionBlok {
	spaceports?: SpaceportBlok[];
}

export interface PartnerBlok extends SbBlokData {
	name?: string;
	logo?: StoryblokAsset;
	website?: StoryblokLink;
	partnership_type?: string;
}

export interface PartnersBlok extends SectionBlok {
	partners?: PartnerBlok[];
}

export interface TestimonialBlok extends SbBlokData {
	traveler_name?: string;
	destination?: string;
	rating?: string;
	comment?: string;
	trip_date?: string;
	is_approved?: boolean;
}

export interface TestimonialsBlok extends SectionBlok {
	testimonials?: TestimonialBlok[];
}

export interface SocialLinkBlok extends SbBlokData {
	platform?: string;
	url?: StoryblokLink;
}

export interface ContactBlok extends SectionBlok {
	email?: string;
	phone?: string;
	address?: string;
	support_hours?: string;
	social_links?: SocialLinkBlok[];
}

export interface CtaBlok extends SectionBlok {
	label?: string;
	target?: StoryblokLink;
	style?: 'primary' | 'secondary';
}

export interface NavTabBlok extends SbBlokData {
	label?: string;
	link?: StoryblokLink;
	icon?: StoryblokAsset;
	open_in_new_tab?: boolean;
}

export interface NavLanguageBlok extends SbBlokData {
	label?: string;
	/** Storyblok language code. Empty means the space's default language. */
	code?: string;
}

export interface NavigationHeaderBlok extends SbBlokData {
	company_name?: string;
	logo?: StoryblokAsset;
	brand_link?: StoryblokLink;
	tabs?: NavTabBlok[];
	languages?: NavLanguageBlok[];
}

export interface ErrorMessageBlok extends SbBlokData {
	/** e.g. "404". Empty marks the default message used for any other failure. */
	status_code?: string;
	title?: string;
	message?: string;
	action_label?: string;
	action_link?: StoryblokLink;
}

export interface ErrorPageBlok extends SbBlokData {
	messages?: ErrorMessageBlok[];
}

export interface AgencyCtaBlok extends SbBlokData {
	label?: string;
	type?: 'primary' | 'secondary';
	link?: StoryblokLink;
}

export interface PlanetHeroBannerBlok extends SbBlokData {
	/** Image or video. */
	planet_hero_image?: StoryblokAsset;
	planet_name?: string;
	planet_description?: string;
	cta?: AgencyCtaBlok[];
}

export interface PlanetBlok extends SbBlokData {
	hero?: PlanetHeroBannerBlok[];
}
