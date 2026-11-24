import { StoryblokComponent } from '@storyblok/react';
import { Section } from '../Section';
import { asArray } from '../../shared/helpers';
import type { MissionBlok } from '../../types';
import './CompanyMission.css';

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
						<li key={value._uid}>
							<StoryblokComponent blok={value} />
						</li>
					))}
				</ul>
			)}
		</Section>
	);
}
