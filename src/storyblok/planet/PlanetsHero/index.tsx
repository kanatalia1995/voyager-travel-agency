import { StoryblokComponent, storyblokEditable } from '@storyblok/react';
import { asArray } from '../../shared/helpers';
import type { PlanetsHeroBlok } from '../../types';
import './PlanetsHero.css';

/** Home hero: headline over a starfield with a row of clickable planets (`planet_cta` blocks). */
export default function PlanetsHero({ blok }: { blok: PlanetsHeroBlok }) {
	const planets = asArray(blok.planet_links);
	return (
		<section {...storyblokEditable(blok)} className="planets-hero">
			<header className="planets-hero__head">
				{blok.subtitle && <p className="planets-hero__eyebrow">{blok.subtitle}</p>}
				{blok.title && <h1>{blok.title}</h1>}
				{blok.helper_cutline && <p className="planets-hero__cutline">{blok.helper_cutline}</p>}
			</header>
			{planets.length > 0 && (
				<ul className="planets-hero__list">
					{planets.map((planet) => (
						<li key={planet._uid}>
							<StoryblokComponent blok={planet} />
						</li>
					))}
				</ul>
			)}
		</section>
	);
}
