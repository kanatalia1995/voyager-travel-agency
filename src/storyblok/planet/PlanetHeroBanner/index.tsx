import { StoryblokComponent, storyblokEditable } from '@storyblok/react';
import Media from '../../company/Media';
import { asArray } from '../../shared/helpers';
import type { PlanetHeroBannerBlok } from '../../types';
import './PlanetHeroBanner.css';

/** Full-width planet hero: image or looping video behind the name, description and call-to-action buttons. */
export default function PlanetHeroBanner({ blok }: { blok: PlanetHeroBannerBlok }) {
	const ctas = asArray(blok.cta);
	return (
		<section {...storyblokEditable(blok)} className="planet-hero">
			<Media asset={blok.planet_hero_image} className="planet-hero__bg" background loading="eager" />
			<div className="planet-hero__content">
				{blok.planet_name && <h1>{blok.planet_name}</h1>}
				{blok.planet_description && <p className="planet-hero__description">{blok.planet_description}</p>}
				{ctas.length > 0 && (
					<div className="planet-hero__actions">
						{ctas.map((cta) => (
							<StoryblokComponent blok={cta} key={cta._uid} />
						))}
					</div>
				)}
			</div>
		</section>
	);
}
