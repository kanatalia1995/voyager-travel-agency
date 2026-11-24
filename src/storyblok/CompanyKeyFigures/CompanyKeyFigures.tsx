import { storyblokEditable } from '@storyblok/react';
import { Section } from '../Section/Section';
import { asArray } from '../../helpers/helpers';
import type { KeyFiguresBlok } from '../types';
import './CompanyKeyFigures.css';

// FR-CO-04: key figures, each with label, value and unit.
export default function CompanyKeyFigures({ blok }: { blok: KeyFiguresBlok }) {
	const stats = asArray(blok.statistics).filter((s) => s.label && s.value);
	return (
		<Section blok={blok} hasData={stats.length > 0}>
			<ul className="co-grid">
				{stats.map((stat) => (
					<li key={stat._uid} {...storyblokEditable(stat)} className="co-card co-stat">
						<span className="co-stat__value">
							{stat.value}
							{stat.unit && <span className="co-stat__unit"> {stat.unit}</span>}
						</span>
						<div className="co-stat__label">{stat.label}</div>
					</li>
				))}
			</ul>
		</Section>
	);
}
