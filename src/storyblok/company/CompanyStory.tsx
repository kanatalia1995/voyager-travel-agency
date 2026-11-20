import { storyblokEditable } from '@storyblok/react';
import { Section } from './utils';
import Media from './Media';
import { asArray } from '../shared/helpers';
import type { StoryBlok } from '../types';

const formatDate = (value: string) => {
	const date = new Date(value);
	return Number.isNaN(date.getTime())
		? value
		: date.toLocaleDateString('en', { year: 'numeric', month: 'long' });
};

// FR-CO-05: milestones as a chronological timeline (date, title, description).
export default function CompanyStory({ blok }: { blok: StoryBlok }) {
	const milestones = asArray(blok.milestones)
		.filter((m) => m.title && m.date)
		.sort((a, b) => new Date(a.date ?? '').getTime() - new Date(b.date ?? '').getTime());
	return (
		<Section blok={blok} hasData={milestones.length > 0}>
			<ol className="co-timeline">
				{milestones.map((m) => (
					<li key={m._uid} {...storyblokEditable(m)}>
						<time className="co-timeline__date" dateTime={m.date}>
							{formatDate(m.date ?? '')}
						</time>
						<h3>{m.title}</h3>
						{m.description && <p>{m.description}</p>}
						<Media asset={m.image} className="co-timeline__media" />
					</li>
				))}
			</ol>
		</Section>
	);
}
