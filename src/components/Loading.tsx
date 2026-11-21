import './loading.css';

// The same orbit ellipse is used for the ring and the moon's path (units are the SVG's own).
const ORBIT = 'M 28 80 a 92 22 0 1 0 184 0 a 92 22 0 1 0 -184 0';

/** Centered animated planet with rings. Respects prefers-reduced-motion (static when set). */
export default function Loading({ label = 'Loading' }: { label?: string }) {
	return (
		<div className="loading" role="status" aria-live="polite">
			<svg className="loading__svg" viewBox="0 0 240 160" aria-hidden="true">
				<defs>
					<linearGradient id="loading-planet" x1="0" y1="0" x2="1" y2="1">
						<stop offset="0" stopColor="var(--color-ion)" />
						<stop offset="1" stopColor="var(--color-nebula)" />
					</linearGradient>
					<clipPath id="loading-back">
						<rect x="0" y="0" width="240" height="80" />
					</clipPath>
					<clipPath id="loading-front">
						<rect x="0" y="80" width="240" height="80" />
					</clipPath>
				</defs>

				<g transform="rotate(-18 120 80)">
					{/* Back half of the rings, behind the planet. */}
					<g clipPath="url(#loading-back)" className="loading__rings">
						<ellipse cx="120" cy="80" rx="92" ry="22" />
						<ellipse cx="120" cy="80" rx="74" ry="17" />
					</g>

					<circle cx="120" cy="80" r="36" fill="url(#loading-planet)" />
					<path d="M86 70 Q120 82 154 68" className="loading__band" />
					<path d="M85 90 Q120 100 155 88" className="loading__band" />

					{/* Front half of the rings, in front of the planet. */}
					<g clipPath="url(#loading-front)" className="loading__rings">
						<ellipse cx="120" cy="80" rx="92" ry="22" />
						<ellipse cx="120" cy="80" rx="74" ry="17" />
					</g>

					<circle className="loading__moon" r="5" style={{ offsetPath: `path("${ORBIT}")` }} />
				</g>
			</svg>
			<span className="sr-only">{label}</span>
		</div>
	);
}
