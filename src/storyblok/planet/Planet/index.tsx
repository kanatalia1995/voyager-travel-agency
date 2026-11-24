import { StoryblokComponent, storyblokEditable } from '@storyblok/react';
import { asArray } from '../../shared/helpers';
import type { PlanetBlok } from '../../types';

/** Page for the `planet` content type, e.g. the `planets/mars` story. */
export default function Planet({ blok }: { blok: PlanetBlok }) {
	return (
		<main {...storyblokEditable(blok)}>
			{asArray(blok.hero).map((nested) => (
				<StoryblokComponent blok={nested} key={nested._uid} />
			))}
		</main>
	);
}
