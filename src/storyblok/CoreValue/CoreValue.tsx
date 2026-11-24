import { storyblokEditable } from '@storyblok/react';
import type { CoreValueBlok } from '../types';
import './CoreValue.css';

/** A card with an icon, a title and a short description. Used in the company section and anywhere else a story places it. */
export default function CoreValue({ blok }: { blok: CoreValueBlok }) {
	if (!blok.title) return null;
	return (
		<article {...storyblokEditable(blok)} className="core-value">
			{blok.icon?.filename && (
				<img className="core-value__icon" src={blok.icon.filename} alt={blok.icon.alt || ''} width="40" height="40" loading="lazy" />
			)}
			<h3>{blok.title}</h3>
			{blok.description && <p>{blok.description}</p>}
		</article>
	);
}
