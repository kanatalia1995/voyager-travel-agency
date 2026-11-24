import { storyblokEditable } from '@storyblok/react';
import Media from '../Media/Media';
import SmartLink from '../SmartLink/SmartLink';
import { linkUrl } from '../../helpers/helpers';
import type { PlanetCtaBlok } from '../types';
import './PlanetCta.css';

/** One clickable planet: picture (image or looping video), name and a short description. */
export default function PlanetCta({ blok }: { blok: PlanetCtaBlok }) {
	if (!blok.planet_name) return null;
	const to = linkUrl(blok.planet_link);
	const content = (
		<>
			<Media asset={blok.planet_image} className="planet-cta__image" background />
			<span className="planet-cta__name">{blok.planet_name}</span>
			{blok.planet_description && <span className="planet-cta__description">{blok.planet_description}</span>}
		</>
	);
	return to ? (
		<SmartLink {...storyblokEditable(blok)} to={to} className="planet-cta">
			{content}
		</SmartLink>
	) : (
		<div {...storyblokEditable(blok)} className="planet-cta">
			{content}
		</div>
	);
}
