import { storyblokEditable } from '@storyblok/react';
import { Section } from './utils';
import { asArray } from '../shared/helpers';
import type { MissionBlok } from '../types';

// FR-CO-03: mission, vision and core values.
export default function CompanyMission({ blok }: { blok: MissionBlok }) {
	const values = asArray(blok.values);
	return (
		<Section blok={blok} hasData={Boolean(blok.mission || blok.vision || values.length)}>
			<div className="co-mv">
				{blok.mission && (
					<article className="co-card">
						<span className="co-overline">Mission</span>
						<p>{blok.mission}</p>
					</article>
				)}
				{blok.vision && (
					<article className="co-card">
						<span className="co-overline">Vision</span>
						<p>{blok.vision}</p>
					</article>
				)}
			</div>
			{values.length > 0 && (
				<ul className="co-grid">
					{values.map((value) => (
						<li key={value._uid} {...storyblokEditable(value)} className="co-card">
							{value.icon?.filename && (
								<img src={value.icon.filename} alt="" width="40" height="40" />
							)}
							<h3>{value.title}</h3>
							{value.description && <p>{value.description}</p>}
						</li>
					))}
				</ul>
			)}
		</Section>
	);
}
