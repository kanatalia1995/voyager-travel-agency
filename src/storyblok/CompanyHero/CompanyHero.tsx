import { storyblokEditable } from '@storyblok/react';
import Media from '../Media/Media';
import './CompanyHero.css';
import type { HeroBlok } from '../types';

// FR-CO-02: company name, tagline, logo and hero image.
export default function CompanyHero({ blok }: { blok: HeroBlok }) {
	if (blok.is_hidden || !blok.name) return null;
	return (
		<section {...storyblokEditable(blok)} className="co-hero">
			<Media asset={blok.hero_image} className="co-hero__bg" background loading="eager" />
			{blok.logo?.filename && (
				<img className="co-hero__logo" src={blok.logo.filename} alt={blok.logo.alt || ''} />
			)}
			<h1>{blok.name}</h1>
			{blok.tagline && <p className="co-hero__tagline">{blok.tagline}</p>}
		</section>
	);
}
