import { useState } from 'react';
import { storyblokEditable } from '@storyblok/react';
import { Section } from '../Section/Section';
import { asArray } from '../../helpers/helpers';
import type { SpaceportBlok, SpaceportsBlok } from '../types';
import './CompanySpaceports.css';

type MappedSpaceport = SpaceportBlok & { name: string; planet: string; lat: number; lng: number };

const toNumber = (value?: string): number | null => {
	const n = parseFloat(value ?? '');
	return Number.isFinite(n) ? n : null;
};

/** Keep active spaceports that have a name, a planet and valid coordinates. */
function mapSpaceports(items: SpaceportBlok[]): MappedSpaceport[] {
	return items.flatMap((p) => {
		const lat = toNumber(p.latitude);
		const lng = toNumber(p.longitude);
		if (!p.name || !p.planet || p.is_active === false || lat === null || lng === null) return [];
		return [{ ...p, name: p.name, planet: p.planet, lat, lng }];
	});
}

// FR-CO-10 / FR-CO-11: active spaceports on an interactive map; selecting a marker shows details.
// Spaceports sit on different planets, so there is one equirectangular map per planet.
export default function CompanySpaceports({ blok }: { blok: SpaceportsBlok }) {
	const ports = mapSpaceports(asArray(blok.spaceports));
	const planets = [...new Set(ports.map((p) => p.planet))];
	const [planet, setPlanet] = useState<string | null>(null);
	const [selectedId, setSelectedId] = useState<string | null>(null);

	const activePlanet = planet && planets.includes(planet) ? planet : planets[0];
	const visible = ports.filter((p) => p.planet === activePlanet);
	const selected = visible.find((p) => p._uid === selectedId);

	return (
		<Section blok={blok} hasData={ports.length > 0}>
			{planets.length > 1 && (
				<div className="co-tabs" role="group" aria-label="Planet">
					{planets.map((name) => (
						<button
							key={name}
							type="button"
							className="co-tab"
							aria-pressed={name === activePlanet}
							onClick={() => {
								setPlanet(name);
								setSelectedId(null);
							}}
						>
							{name}
						</button>
					))}
				</div>
			)}
			<div className="co-map" role="group" aria-label={`Spaceport map of ${activePlanet}`}>
				{visible.map((p) => (
					<button
						key={p._uid}
						type="button"
						className="co-marker"
						aria-pressed={p._uid === selectedId}
						aria-label={`${p.name}${p.city ? `, ${p.city}` : ''}`}
						style={{
							left: `${((p.lng + 180) / 360) * 100}%`,
							top: `${((90 - p.lat) / 180) * 100}%`,
						}}
						onClick={() => setSelectedId(p._uid ?? null)}
					/>
				))}
			</div>
			<div aria-live="polite">
				{selected ? (
					<article {...storyblokEditable(selected)} className="co-card">
						<span className="co-overline">
							{selected.planet}
							{selected.city && ` · ${selected.city}`}
						</span>
						<h3>{selected.name}</h3>
						<p className="co-coords">
							{selected.lat}°, {selected.lng}°
						</p>
						{selected.description && <p>{selected.description}</p>}
					</article>
				) : (
					<ul className="co-grid">
						{visible.map((p) => (
							<li key={p._uid} className="co-card">
								<h3>{p.name}</h3>
								<p>{[p.city, p.planet].filter(Boolean).join(', ')}</p>
							</li>
						))}
					</ul>
				)}
			</div>
		</Section>
	);
}
